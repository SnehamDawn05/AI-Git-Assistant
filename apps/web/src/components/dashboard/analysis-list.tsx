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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  function getStatusBadge(status: Analysis["status"]) {
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

  function getTypeIcon(type: Analysis["type"]) {
    switch (type) {
      case "SUMMARY":
        return <Sparkles className="h-4 w-4" />;

      case "README":
        return <FileText className="h-4 w-4" />;

      case "REVIEW":
        return <GitPullRequest className="h-4 w-4" />;
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading analyses...
        </CardContent>
      </Card>
    );
  }

  if (!analyses.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Clock className="mb-4 h-10 w-10 text-muted-foreground" />

          <h3 className="text-lg font-semibold">No analyses yet</h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Run your first AI analysis from the dashboard.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Analyses</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {analyses.map((analysis) => (
          <div
            key={analysis.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="space-y-2">
              <div className="font-medium">
                {analysis.repository.owner}/{analysis.repository.name}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  {getTypeIcon(analysis.type)}

                  {analysis.type}
                </span>

                {getStatusBadge(analysis.status)}

                <span>{new Date(analysis.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <Link href={`/analysis/${analysis.id}`}>
              <Button variant="outline">
                Open
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
