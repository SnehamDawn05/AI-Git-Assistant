"use client";

import { useEffect, useState } from "react";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  GitPullRequest,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { ReadmeView, type ReadmeData } from "@/components/analysis/readme-view";
import { ReviewView, type ReviewData } from "@/components/analysis/review-view";
import {
  SummaryView,
  type SummaryData,
} from "@/components/analysis/summary-view";

interface Analysis {
  id: string;
  type: "SUMMARY" | "README" | "REVIEW";
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: string;
  repository: {
    owner: string;
    name: string;
  };
  result: {
    content: unknown;
  } | null;
}

const typeConfig = {
  SUMMARY: {
    icon: Sparkles,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
    label: "Code Summary",
  },
  README: {
    icon: FileText,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    label: "README Generator",
  },
  REVIEW: {
    icon: GitPullRequest,
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
    label: "PR Review",
  },
};

export function AnalysisViewer({ id }: { id: string }) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let stopped = false;

    const load = async () => {
      try {
        setRefreshing(true);
        const response = await fetch(`/api/analysis/${id}`, {
          cache: "no-store",
        });
        const data = await response.json();
        if (!data.success) return;
        setAnalysis(data.analysis);
        if (
          !stopped &&
          (data.analysis.status === "COMPLETED" ||
            data.analysis.status === "FAILED")
        ) {
          stopped = true;
          clearInterval(interval);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setRefreshing(false);
        setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 2000);
    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        </div>
        <p className="text-sm text-muted-foreground">Loading analysis...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="glass-card flex flex-col items-center gap-4 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
          <AlertCircle className="h-7 w-7 text-red-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Analysis not found
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This analysis may have been deleted or the ID is invalid.
          </p>
        </div>
        <Link
          href="/analysis"
          className="mt-2 flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Analyses
        </Link>
      </div>
    );
  }

  const tc = typeConfig[analysis.type];
  const TypeIcon = tc.icon;

  const statusDisplay = {
    PENDING: {
      className: "badge-pending",
      label: "Pending",
      icon: <Clock className="h-3 w-3" />,
    },
    PROCESSING: {
      className: "badge-processing",
      label: "Processing",
      icon: <Loader2 className="h-3 w-3 animate-spin" />,
    },
    COMPLETED: {
      className: "badge-completed",
      label: "Completed",
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    FAILED: {
      className: "badge-failed",
      label: "Failed",
      icon: <AlertCircle className="h-3 w-3" />,
    },
  }[analysis.status];

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/analysis"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All Analyses
      </Link>

      {/* Header card */}
      <div className="glass-card gradient-border overflow-hidden p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${tc.bg}`}
            >
              <TypeIcon className={`h-6 w-6 ${tc.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">
                  {analysis.repository.owner}/
                  <span className="gradient-text-subtle">
                    {analysis.repository.name}
                  </span>
                </h1>
                {refreshing &&
                  analysis.status !== "COMPLETED" &&
                  analysis.status !== "FAILED" && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                  )}
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{tc.label}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusDisplay.className}`}
            >
              {statusDisplay.icon}
              {statusDisplay.label}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground">
              {new Date(analysis.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Result card */}
      <div className="glass-card overflow-hidden">
        <div className="border-b border-white/[0.06] px-6 py-4">
          <h2 className="font-bold text-foreground">AI Result</h2>
        </div>

        <div className="p-6">
          {analysis.status === "PENDING" && (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-yellow-500/10">
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Waiting in Queue
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your analysis has been queued and will start shortly.
                </p>
              </div>
            </div>
          )}

          {analysis.status === "PROCESSING" && (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
                <div className="absolute inset-0 animate-pulse-glow rounded-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  AI is Analyzing...
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This page updates automatically. Please keep it open.
                </p>
              </div>
            </div>
          )}

          {analysis.status === "FAILED" && (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Analysis Failed
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Something went wrong while processing this repository.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="btn-glow rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
              >
                Try Again
              </Link>
            </div>
          )}

          {analysis.status === "COMPLETED" && (
            <>
              {analysis.type === "SUMMARY" && (
                <SummaryView data={analysis.result?.content as SummaryData} />
              )}
              {analysis.type === "README" && (
                <ReadmeView
                  markdown={(analysis.result?.content as ReadmeData).markdown}
                />
              )}
              {analysis.type === "REVIEW" && (
                <ReviewView data={analysis.result?.content as ReviewData} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
