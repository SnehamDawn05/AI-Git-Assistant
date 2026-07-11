import "dotenv/config";

import { Worker } from "bullmq";

import {
  cleanupRepository,
  cloneRepository,
  loadRepositoryContext,
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
    console.log(`📂 Repository: ${job.data.repositoryUrl}`);

    if (job.data.pullRequestUrl) {
      console.log(`🔀 Pull Request: ${job.data.pullRequestUrl}`);
    }

    console.log();

    let repositoryPath: string | undefined;

    try {
      console.log("📥 Cloning repository...");

      repositoryPath = await cloneRepository(job.data.repositoryUrl);

      console.log("📦 Building repository context...");

      const context = await loadRepositoryContext(repositoryPath);

      console.log();
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📦 Repository Context");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log();

      console.log(`📁 Repository: ${context.repositoryName}`);
      console.log(`📄 Files Loaded: ${context.totalFiles}`);
      console.log(`📂 Folders: ${context.folders.length}`);
      console.log(
        `💾 Context Size: ${(context.totalSize / 1024).toFixed(2)} KB`,
      );

      console.log(`📘 README: ${context.readme ? "✅ Found" : "❌ Not Found"}`);

      console.log(
        `📦 package.json: ${context.packageJson ? "✅ Found" : "❌ Not Found"}`,
      );

      console.log();

      console.log("📋 First 10 Files:");

      context.files.slice(0, 10).forEach((file) => {
        console.log(
          ` • ${file.path} (${file.language}) - ${(file.size / 1024).toFixed(
            1,
          )} KB`,
        );
      });

      if (context.files.length > 10) {
        console.log(`...and ${context.files.length - 10} more`);
      }

      console.log();

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
