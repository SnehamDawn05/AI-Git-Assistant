import "dotenv/config";

import { Worker } from "bullmq";

import { ANALYSIS_QUEUE_NAME, type AnalysisJobData } from "@repo/queue";

const worker = new Worker<AnalysisJobData>(
  ANALYSIS_QUEUE_NAME,
  async (job) => {
    console.log();
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🚀 New Job Received");
    console.log();

    console.log("Job ID:", job.id);
    console.log("Job Name:", job.name);

    console.log("Analysis Type:", job.data.type);
    console.log("Repository:", job.data.repositoryUrl);

    if (job.data.pullRequestUrl) {
      console.log("Pull Request:", job.data.pullRequestUrl);
    }

    console.log();
    console.log("Processing...");
    console.log();

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Done ✅");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log();
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
