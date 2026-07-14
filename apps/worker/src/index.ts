import "dotenv/config";

import { chunkRepository } from "@repo/ai";
import { Worker } from "bullmq";

import {
  cleanupRepository,
  cloneRepository,
  loadPullRequestContext,
  loadRepositoryContext,
  parsePullRequestUrl,
} from "@repo/github";

import { ANALYSIS_QUEUE_NAME, type AnalysisJobData } from "@repo/queue/server";

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

    if (job.data.type === "REVIEW") {
      console.log(`🔀 Pull Request: ${job.data.pullRequestUrl}`);
    } else {
      console.log(`📂 Repository: ${job.data.repositoryUrl}`);
    }

    console.log();

    let repositoryPath: string | undefined;

    try {
      // --------------------------------------------------
      // Determine Repository URL
      // --------------------------------------------------

      let repositoryUrl = job.data.repositoryUrl;

      if (job.data.type === "REVIEW" && job.data.pullRequestUrl) {
        const parsed = parsePullRequestUrl(job.data.pullRequestUrl);

        repositoryUrl = `https://github.com/${parsed.owner}/${parsed.repository}`;

        console.log(`📂 Derived Repository: ${repositoryUrl}`);
      }

      // --------------------------------------------------
      // Clone Repository
      // --------------------------------------------------

      console.log();
      console.log("📥 Cloning repository...");

      repositoryPath = await cloneRepository(repositoryUrl);

      // --------------------------------------------------
      // Repository Context
      // --------------------------------------------------

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

      if (job.data.type === "REVIEW" && job.data.pullRequestUrl) {
        console.log();
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🔀 Pull Request Context");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log();

        const prContext = await loadPullRequestContext(job.data.pullRequestUrl);

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
      // Chunk Repository
      // --------------------------------------------------

      console.log();
      console.log("🧠 Building AI chunks...");

      const chunkResult = chunkRepository(repositoryContext);

      console.log();
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🧠 Chunk Summary");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log();

      console.log(`📦 Total Chunks: ${chunkResult.metadata.totalChunks}`);

      console.log(
        `🔢 Estimated Tokens: ${chunkResult.metadata.totalEstimatedTokens}`,
      );

      console.log(
        `📝 Total Characters: ${chunkResult.metadata.totalCharacters}`,
      );

      console.log();

      for (const chunk of chunkResult.chunks) {
        console.log(`📦 Chunk ${chunk.id}`);
        console.log(`   Files      : ${chunk.files.length}`);
        console.log(`   Tokens     : ${chunk.estimatedTokens}`);
        console.log(`   Characters : ${chunk.estimatedCharacters}`);
        console.log();
      }

      // --------------------------------------------------
      // Cleanup
      // --------------------------------------------------

      console.log("🗑️ Cleaning temporary repository...");

      await cleanupRepository(repositoryPath);

      console.log("✅ Temporary repository deleted");

      console.log();
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("✅ Analysis Complete");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log();
    } catch (error) {
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
