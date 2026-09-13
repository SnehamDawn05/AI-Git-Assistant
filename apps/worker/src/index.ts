import "dotenv/config";

import { generateReadme, generateSummary, reviewPullRequest } from "@repo/ai";

import {
  AnalysisStatus,
  saveAnalysisResult,
  updateAnalysisStatus,
} from "@repo/db";

import { Worker } from "bullmq";

import {
  cleanupRepository,
  cloneRepository,
  getLocalCommitSha,
  getPullRequestHeadSha,
  getRemoteHeadCommitSha,
  loadPullRequestContext,
  loadRepositoryContext,
  parsePullRequestUrl,
  type PRContext,
} from "@repo/github";

import {
  ANALYSIS_QUEUE_NAME,
  JobType,
  type AnalysisJobData,
  type CacheKeyOptions,
  getCache,
  setCache,
} from "@repo/queue/server";

const worker = new Worker<AnalysisJobData>(
  ANALYSIS_QUEUE_NAME,
  async (job) => {
    console.log();
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🚀 New Analysis Job");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log();

    console.log(`🆔 Job ID: ${job.id}`);
    console.log(`📌 Analysis Type: ${job.data.type}`);

    if (job.data.type === JobType.REVIEW) {
      console.log(`🔀 Pull Request: ${job.data.pullRequestUrl}`);
    } else {
      console.log(`📂 Repository: ${job.data.repositoryUrl}`);
    }

    console.log();

    let repositoryPath: string | undefined;
    let prContext: PRContext | undefined;
    const cacheOptions: CacheKeyOptions = {};

    try {
      // --------------------------------------------------
      // Update Status
      // --------------------------------------------------

      await updateAnalysisStatus(
        job.data.analysisId,
        AnalysisStatus.PROCESSING,
      );

      // --------------------------------------------------
      // Determine Repository URL & Cache Options
      // --------------------------------------------------

      let repositoryUrl = job.data.repositoryUrl;

      if (job.data.type === JobType.REVIEW && job.data.pullRequestUrl) {
        try {
          const parsed = parsePullRequestUrl(job.data.pullRequestUrl);
          repositoryUrl = `https://github.com/${parsed.owner}/${parsed.repository}`;
          console.log(`📂 Derived Repository: ${repositoryUrl}`);

          cacheOptions.pullNumber = parsed.pullNumber;

          const headSha = await getPullRequestHeadSha(parsed);
          if (headSha) {
            cacheOptions.commitSha = headSha;
            console.log(`📌 PR #${parsed.pullNumber} Head SHA: ${headSha}`);
          }
        } catch (err) {
          console.warn("⚠️ Failed to resolve PR metadata for cache:", err);
        }
      } else {
        try {
          const commitSha = await getRemoteHeadCommitSha(repositoryUrl);
          if (commitSha) {
            cacheOptions.commitSha = commitSha;
            console.log(`📌 Remote HEAD SHA: ${commitSha}`);
          }
        } catch (err) {
          console.warn("⚠️ Failed to resolve remote HEAD SHA for cache:", err);
        }
      }

      // --------------------------------------------------
      // Check Redis Cache
      // --------------------------------------------------

      console.log();
      console.log("⚡ Checking Redis cache...");

      const cachedResult = await getCache(
        job.data.owner,
        job.data.repository,
        job.data.type,
        cacheOptions,
      );

      if (cachedResult) {
        console.log("✅ Cache hit");

        await saveAnalysisResult(job.data.analysisId, cachedResult);

        await updateAnalysisStatus(
          job.data.analysisId,
          AnalysisStatus.COMPLETED,
        );

        console.log("💾 Cached result saved to database");

        console.log();
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("✅ Analysis Complete (CACHE)");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log();

        return;
      }

      console.log("❌ Cache miss");

      // --------------------------------------------------
      // Clone Repository
      // --------------------------------------------------

      console.log();
      console.log("📥 Cloning repository...");

      repositoryPath = await cloneRepository(repositoryUrl);

      // Fallback: Obtain commit SHA locally if remote lookup didn't succeed
      if (!cacheOptions.commitSha && job.data.type !== JobType.REVIEW) {
        const localSha = await getLocalCommitSha(repositoryPath);
        if (localSha) {
          cacheOptions.commitSha = localSha;
        }
      }

      // --------------------------------------------------
      // Repository Context
      // --------------------------------------------------

      console.log();
      console.log("📦 Building repository context...");

      const repositoryContext = await loadRepositoryContext(repositoryPath);

      console.log();
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📦 Repository Context");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log();

      console.log(`📁 Repository: ${repositoryContext.repositoryName}`);

      console.log(`📄 Files Loaded: ${repositoryContext.totalFiles}`);

      console.log(`📂 Folders: ${repositoryContext.folders.length}`);

      console.log(
        `💾 Context Size: ${(repositoryContext.totalSize / 1024).toFixed(
          2,
        )} KB`,
      );

      console.log(
        `📘 README: ${repositoryContext.readme ? "✅ Found" : "❌ Not Found"}`,
      );

      console.log(
        `📦 package.json: ${
          repositoryContext.packageJson ? "✅ Found" : "❌ Not Found"
        }`,
      );

      // --------------------------------------------------
      // Pull Request Context
      // --------------------------------------------------

      if (job.data.type === JobType.REVIEW && job.data.pullRequestUrl) {
        console.log();
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🔀 Pull Request Context");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log();

        prContext = await loadPullRequestContext(job.data.pullRequestUrl);

        console.log(`🔢 PR #${prContext.metadata.number}`);
        console.log(`📝 Title: ${prContext.metadata.title}`);
        console.log(`👤 Author: ${prContext.metadata.author}`);

        console.log(
          `🌿 ${prContext.metadata.headBranch} → ${prContext.metadata.baseBranch}`,
        );

        console.log(`📄 Changed Files: ${prContext.files.length}`);
        console.log(`➕ Additions: ${prContext.metadata.additions}`);
        console.log(`➖ Deletions: ${prContext.metadata.deletions}`);
        console.log(`🧩 Commits: ${prContext.metadata.commits}`);
      }

      // --------------------------------------------------
      // AI Analysis
      // --------------------------------------------------
      console.log();
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🤖 AI Analysis");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log();

      switch (job.data.type) {
        case JobType.SUMMARY: {
          console.log("📝 Generating repository summary...");

          const summary = await generateSummary(repositoryContext);

          await saveAnalysisResult(job.data.analysisId, summary);

          await setCache(
            job.data.owner,
            job.data.repository,
            job.data.type,
            summary,
            cacheOptions,
          );

          console.log();
          console.log("✅ Summary Generated");
          console.log("💾 Summary saved to database");
          console.log("⚡ Summary cached in Redis");

          break;
        }

        case JobType.README: {
          console.log("📘 Generating README...");

          const readme = await generateReadme(repositoryContext);

          await saveAnalysisResult(job.data.analysisId, {
            markdown: readme.markdown,
          });

          await setCache(
            job.data.owner,
            job.data.repository,
            job.data.type,
            {
              markdown: readme.markdown,
            },
            cacheOptions,
          );

          console.log();
          console.log("✅ README Generated");
          console.log("💾 README saved to database");
          console.log("⚡ README cached in Redis");

          break;
        }

        case JobType.REVIEW: {
          if (!prContext) {
            throw new Error("Pull Request context not found.");
          }

          if (!cacheOptions.commitSha && prContext.metadata.headSha) {
            cacheOptions.commitSha = prContext.metadata.headSha;
          }

          console.log("🔍 Reviewing Pull Request...");

          const review = await reviewPullRequest(repositoryContext, prContext);

          await saveAnalysisResult(job.data.analysisId, review);

          await setCache(
            job.data.owner,
            job.data.repository,
            job.data.type,
            review,
            cacheOptions,
          );

          console.log();
          console.log("✅ Review Generated");
          console.log("💾 Review saved to database");
          console.log("⚡ Review cached in Redis");

          break;
        }

        default:
          throw new Error(`Unsupported analysis type: ${job.data.type}`);
      }

      // --------------------------------------------------
      // Mark Analysis Completed
      // --------------------------------------------------

      await updateAnalysisStatus(job.data.analysisId, AnalysisStatus.COMPLETED);

      console.log();
      console.log("✅ Analysis marked as COMPLETED");

      // --------------------------------------------------
      // Cleanup
      // --------------------------------------------------

      if (repositoryPath) {
        console.log();
        console.log("🗑️ Cleaning temporary repository...");

        await cleanupRepository(repositoryPath);

        console.log("✅ Temporary repository deleted");
      }

      console.log();
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("✅ Analysis Complete");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log();
    } catch (error) {
      await updateAnalysisStatus(
        job.data.analysisId,
        AnalysisStatus.FAILED,
      ).catch(() => {});

      console.error();
      console.error("❌ Analysis failed");
      console.error(error);

      if (repositoryPath) {
        console.log();
        console.log("🗑️ Cleaning temporary repository...");

        await cleanupRepository(repositoryPath).catch(() => {});

        console.log("✅ Temporary repository deleted");
      }

      throw error;
    }
  },
  {
    connection: {
      url: process.env.REDIS_URL!,
    },
  },
);

worker.on("ready", () => {
  console.log("✅ Worker is listening...");
});

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`❌ Job ${job?.id} failed`);
  console.error(error);
});

console.log("🚀 Worker started");

// --------------------------------------------------
// Health Check Server (for Render / Koyeb / Cloud free web services)
// --------------------------------------------------
import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok", message: "Worker is running" });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.listen(PORT, () => {
  console.log(`🌐 Health check server listening on port ${PORT}`);
});
