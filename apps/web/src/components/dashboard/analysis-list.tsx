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

interface Repository {
  owner: string;
  name: string;
}

interface Analysis {
  id: string;
  type: "SUMMARY" | "README" | "REVIEW";
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: string;
  repository: Repository;
}

const typeConfig = {
  SUMMARY: {
    icon: Sparkles,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    label: "Code Summary",
  },
  README: {
    icon: FileText,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    label: "README Generator",
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

export function AnalysisList() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/analysis");
        const data = await response.json();
        if (data.success) {
          setAnalyses(data.analyses);
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
      <div className="glass-card flex items-center justify-center gap-3 py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
        <span className="text-sm">Loading analyses...</span>
      </div>
    );
  }

  if (!analyses.length) {
    return (
      <div className="glass-card flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10">
          <Clock className="h-7 w-7 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            No analyses yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Run your first AI analysis from the dashboard.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="btn-glow mt-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
        <h2 className="font-bold text-foreground">All Analyses</h2>
        <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {analyses.length} total
        </span>
      </div>

      {/* List */}
      <div className="divide-y divide-white/[0.04]">
        {analyses.map((analysis) => {
          const tc = typeConfig[analysis.type];
          const sc = statusConfig[analysis.status];

          return (
            <Link
              key={analysis.id}
              href={`/analysis/${analysis.id}`}
              className="group flex items-center justify-between px-6 py-4 transition-all duration-200 hover:bg-white/[0.03]"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tc.bg}`}
                >
                  <tc.icon className={`h-5 w-5 ${tc.color}`} />
                </div>

                <div>
                  <p className="font-medium text-foreground">
                    {analysis.repository.owner}/{analysis.repository.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {tc.label}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="hidden text-xs text-muted-foreground sm:block">
                  {new Date(analysis.createdAt).toLocaleString()}
                </span>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${sc.className}`}
                >
                  {sc.label}
                </span>

                <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-indigo-400" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
