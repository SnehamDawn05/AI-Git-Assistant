import "dotenv/config";

import { chunkRepository } from "@repo/ai";
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

      // --------------------------------------------------
      // Chunk Repository
      // --------------------------------------------------

      console.log();
      console.log("🧠 Building AI chunks...");

      const chunkResult = chunkRepository(context);

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
