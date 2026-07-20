"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  ArrowRight,
  FileText,
  GitPullRequest,
  Loader2,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

  function getIcon(type: Analysis["type"]) {
    switch (type) {
      case "SUMMARY":
        return <Sparkles className="h-4 w-4 text-blue-500" />;

      case "README":
        return <FileText className="h-4 w-4 text-green-500" />;

      case "REVIEW":
        return <GitPullRequest className="h-4 w-4 text-orange-500" />;
    }
  }

  function getBadge(status: Analysis["status"]) {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;

      case "PROCESSING":
        return <Badge>Processing</Badge>;

      case "COMPLETED":
        return <Badge className="bg-green-600">Completed</Badge>;

      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading analyses...
      </div>
    );
  }

  if (!analyses.length) {
    return (
      <div className="flex h-56 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
        No analyses yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {analyses.map((analysis) => (
        <div
          key={analysis.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div>
            <div className="font-medium">
              {analysis.repository.owner}/{analysis.repository.name}
            </div>

            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
              {getIcon(analysis.type)}

              <span>{analysis.type}</span>

              {getBadge(analysis.status)}
            </div>
          </div>

          <Link href={`/analysis/${analysis.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ))}

      <div className="pt-2">
        <Link href="/analysis">
          <Button variant="outline" className="w-full">
            View All Analyses
          </Button>
        </Link>
      </div>
    </div>
  );
}
