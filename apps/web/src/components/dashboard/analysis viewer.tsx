"use client";

import { useEffect, useState } from "react";

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  GitPullRequest,
  Loader2,
  Sparkles,
} from "lucide-react";

import { ReadmeView, type ReadmeData } from "@/components/analysis/readme-view";
import { ReviewView, type ReviewData } from "@/components/analysis/review-view";
import {
  SummaryView,
  type SummaryData,
} from "@/components/analysis/summary-view";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

        if (!data.success) {
          return;
        }

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
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-16">
          <AlertCircle className="mb-4 h-10 w-10 text-destructive" />

          <h2 className="text-xl font-semibold">Analysis not found</h2>
        </CardContent>
      </Card>
    );
  }

  function getIcon(type: Analysis["type"]) {
    switch (type) {
      case "SUMMARY":
        return <Sparkles className="h-5 w-5" />;

      case "README":
        return <FileText className="h-5 w-5" />;

      case "REVIEW":
        return <GitPullRequest className="h-5 w-5" />;
    }
  }

  function getStatusBadge(status: Analysis["status"]) {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );

      case "PROCESSING":
        return (
          <Badge>
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Processing
          </Badge>
        );

      case "COMPLETED":
        return (
          <Badge className="bg-green-600 hover:bg-green-600">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );

      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>;
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getIcon(analysis.type)}

              <span>
                {analysis.repository.owner}/{analysis.repository.name}
              </span>
            </div>

            {refreshing &&
              analysis.status !== "COMPLETED" &&
              analysis.status !== "FAILED" && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            {getStatusBadge(analysis.status)}

            <Badge variant="outline">{analysis.type}</Badge>
          </div>

          <div className="text-sm text-muted-foreground">
            Created {new Date(analysis.createdAt).toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Result</CardTitle>
        </CardHeader>

        <CardContent>
          {analysis.status === "PENDING" && (
            <div className="flex flex-col items-center py-16 text-center">
              <Clock className="mb-4 h-12 w-12 text-muted-foreground" />

              <h3 className="text-xl font-semibold">Waiting in Queue</h3>

              <p className="mt-2 text-muted-foreground">
                Your analysis has been queued and will start shortly.
              </p>
            </div>
          )}

          {analysis.status === "PROCESSING" && (
            <div className="flex flex-col items-center py-16 text-center">
              <Loader2 className="mb-4 h-12 w-12 animate-spin" />

              <h3 className="text-xl font-semibold">
                AI is analyzing your repository...
              </h3>

              <p className="mt-2 text-muted-foreground">
                This page updates automatically. Please keep it open.
              </p>
            </div>
          )}

          {analysis.status === "FAILED" && (
            <div className="flex flex-col items-center py-16 text-center">
              <AlertCircle className="mb-4 h-12 w-12 text-destructive" />

              <h3 className="text-xl font-semibold">Analysis Failed</h3>

              <p className="mt-2 text-muted-foreground">
                Something went wrong while processing this repository.
              </p>
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
        </CardContent>
      </Card>
    </div>
  );
}
