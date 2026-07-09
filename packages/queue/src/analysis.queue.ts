import { Queue } from "bullmq";

import { redis } from "./redis";

export const ANALYSIS_QUEUE_NAME = "analysis";

export const analysisQueue = new Queue(ANALYSIS_QUEUE_NAME, {
  connection: redis,

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
