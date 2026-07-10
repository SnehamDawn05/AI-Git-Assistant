import "dotenv/config";

import { Worker } from "bullmq";

import {
  cloneRepository,
  cleanupRepository,
  getRepositoryFiles,
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
    console.log(`📌 Job Name: ${job.name}`);
    console.log(`📂 Repository: ${job.data.repositoryUrl}`);
    console.log();

    let repositoryPath: string | undefined;

    try {
      repositoryPath = await cloneRepository(job.data.repositoryUrl);

      const files = await getRepositoryFiles(repositoryPath);

      console.log();
      console.log("📋 First 20 files:");

      files.slice(0, 20).forEach((file) => {
        console.log(` • ${file}`);
      });

      if (files.length > 20) {
        console.log(`...and ${files.length - 20} more`);
      }

      await cleanupRepository(repositoryPath);

      console.log();
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("✅ Analysis Complete");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log();
    } catch (error) {
      console.error("❌ Analysis failed");
      console.error(error);

      if (repositoryPath) {
        await cleanupRepository(repositoryPath).catch(() => {});
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
