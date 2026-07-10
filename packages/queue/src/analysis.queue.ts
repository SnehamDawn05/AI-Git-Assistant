import { Queue } from "bullmq";

export const ANALYSIS_QUEUE_NAME = "analysis";

export const analysisQueue = new Queue(ANALYSIS_QUEUE_NAME, {
  connection: {
    url: process.env.REDIS_URL!,
  },

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 5000,
    },

    removeOnComplete: 100,
    removeOnFail: 100,
  },
});
