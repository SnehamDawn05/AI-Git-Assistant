import { AnalysisStatus, AnalysisType, Prisma } from "@prisma/client";

import { prisma } from "./client";

/**
 * Any AI result that can be stored in the Result.content JSON column.
 */
export type AnalysisContent = unknown;

/**
 * Creates a new analysis.
 */
export async function createAnalysis(data: {
  userId: string;
  repositoryId: string;
  type: AnalysisType;
  branch?: string;
  commitSha?: string;
  prNumber?: number;
}) {
  return prisma.analysis.create({
    data: {
      userId: data.userId,
      repositoryId: data.repositoryId,
      type: data.type,
      status: AnalysisStatus.PENDING,

      ...(data.branch !== undefined && {
        branch: data.branch,
      }),

      ...(data.commitSha !== undefined && {
        commitSha: data.commitSha,
      }),

      ...(data.prNumber !== undefined && {
        prNumber: data.prNumber,
      }),
    },
  });
}

/**
 * Updates the status of an analysis.
 */
export async function updateAnalysisStatus(
  analysisId: string,
  status: AnalysisStatus,
) {
  return prisma.analysis.update({
    where: {
      id: analysisId,
    },
    data: {
      status,
    },
  });
}

/**
 * Saves (or updates) the AI result.
 */
export async function saveAnalysisResult(
  analysisId: string,
  content: AnalysisContent,
  metadata?: {
    model?: string;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    processingTimeMs?: number;
  },
) {
  return prisma.result.upsert({
    where: {
      analysisId,
    },

    update: {
      content: content as Prisma.InputJsonValue,

      model: metadata?.model,

      promptTokens: metadata?.promptTokens,

      completionTokens: metadata?.completionTokens,

      totalTokens: metadata?.totalTokens,

      processingTimeMs: metadata?.processingTimeMs,
    },

    create: {
      analysisId,

      content: content as Prisma.InputJsonValue,

      model: metadata?.model,

      promptTokens: metadata?.promptTokens,

      completionTokens: metadata?.completionTokens,

      totalTokens: metadata?.totalTokens,

      processingTimeMs: metadata?.processingTimeMs,
    },
  });
}

/**
 * Returns one analysis.
 */
export async function getAnalysisById(analysisId: string) {
  return prisma.analysis.findUnique({
    where: {
      id: analysisId,
    },
    include: {
      repository: true,
      result: true,
    },
  });
}

/**
 * Returns only the AI result.
 */
export async function getAnalysisResult(analysisId: string) {
  return prisma.result.findUnique({
    where: {
      analysisId,
    },
  });
}

/**
 * Lists all analyses for a user.
 */
export async function listUserAnalyses(userId: string) {
  return prisma.analysis.findMany({
    where: {
      userId,
    },
    include: {
      repository: true,
      result: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Finds an existing repository or creates a new one.
 */
export async function upsertRepository(data: {
  userId: string;
  githubUrl: string;
  owner: string;
  name: string;
  defaultBranch?: string;
}) {
  return prisma.repository.upsert({
    where: {
      userId_githubUrl: {
        userId: data.userId,
        githubUrl: data.githubUrl,
      },
    },

    update: {
      owner: data.owner,
      name: data.name,

      ...(data.defaultBranch !== undefined && {
        defaultBranch: data.defaultBranch,
      }),
    },

    create: {
      userId: data.userId,
      githubUrl: data.githubUrl,
      owner: data.owner,
      name: data.name,

      ...(data.defaultBranch !== undefined && {
        defaultBranch: data.defaultBranch,
      }),
    },
  });
}

/**
 * Returns a user's analysis by id.
 */
export async function getUserAnalysis(userId: string, analysisId: string) {
  return prisma.analysis.findFirst({
    where: {
      id: analysisId,
      userId,
    },
    include: {
      repository: true,
      result: true,
    },
  });
}
