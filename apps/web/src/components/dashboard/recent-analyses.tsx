"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  ArrowRight,
  Clock,
  FileText,
  GitPullRequest,
  Loader2,
  Sparkles,
} from "lucide-react";

interface Analysis {
  id: string;
  type: "SUMMARY" | "README" | "REVIEW";
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: string;
  repository: {
    owner: string;
    name: string;
  };
}

const typeConfig = {
  SUMMARY: {
    icon: Sparkles,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    label: "Summary",
  },
  README: {
    icon: FileText,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    label: "README",
  },
  REVIEW: {
    icon: GitPullRequest,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    label: "PR Review",
  },
};

const statusConfig = {
  PENDING: { className: "badge-pending", label: "Pending" },
  PROCESSING: { className: "badge-processing", label: "Processing" },
  COMPLETED: { className: "badge-completed", label: "Completed" },
  FAILED: { className: "badge-failed", label: "Failed" },
};

export function RecentAnalyses() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/analysis");
        const data = await response.json();
        if (data.success) {
          setAnalyses(data.analyses.slice(0, 5));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="glass-card flex h-64 items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
        <span className="text-sm">Loading analyses...</span>
      </div>
    );
  }

  if (!analyses.length) {
    return (
      <div className="glass-card flex h-64 flex-col items-center justify-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
          <Clock className="h-6 w-6 text-indigo-400" />
        </div>
        <div>
          <p className="font-semibold text-foreground">No analyses yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your recent analyses will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card flex flex-col p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-bold text-foreground">Recent Analyses</h2>
        <Link
          href="/analysis"
          className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300"
        >
          View all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {analyses.map((analysis) => {
          const tc = typeConfig[analysis.type];
          const sc = statusConfig[analysis.status];

          return (
            <Link
              key={analysis.id}
              href={`/analysis/${analysis.id}`}
              className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:border-indigo-500/30 hover:bg-white/[0.05]"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tc.bg}`}
                >
                  <tc.icon className={`h-4 w-4 ${tc.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {analysis.repository.owner}/{analysis.repository.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {tc.label} ·{" "}
                    {new Date(analysis.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${sc.className}`}
                >
                  {sc.label}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-400" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
