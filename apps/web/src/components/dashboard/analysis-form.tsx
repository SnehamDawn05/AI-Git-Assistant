"use client";

import { useState } from "react";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { JobType } from "@repo/queue/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AnalysisTypeSelector } from "./analysis-type-selector";

export function AnalysisForm() {
  const [type, setType] = useState<JobType>(JobType.REVIEW);

  const [repositoryUrl, setRepositoryUrl] = useState("");

  const [pullRequestUrl, setPullRequestUrl] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (type !== JobType.REVIEW && !repositoryUrl.trim()) {
      toast.error("Please enter a repository URL.");
      return;
    }

    if (type === JobType.REVIEW && !pullRequestUrl.trim()) {
      toast.error("Please enter a Pull Request URL.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/analyze", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          repositoryUrl:
            type === JobType.REVIEW ? undefined : repositoryUrl.trim(),

          pullRequestUrl:
            type === JobType.REVIEW ? pullRequestUrl.trim() : undefined,

          type,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message);
      }

      toast.success("Analysis queued successfully!");

      setRepositoryUrl("");
      setPullRequestUrl("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <AnalysisTypeSelector
        value={type}
        onValueChange={(value) => setType(value as JobType)}
      />

      {type !== JobType.REVIEW && (
        <Input
          placeholder="https://github.com/owner/repository"
          value={repositoryUrl}
          onChange={(e) => setRepositoryUrl(e.target.value)}
        />
      )}

      {type === JobType.REVIEW && (
        <Input
          placeholder="https://github.com/owner/repository/pull/123"
          value={pullRequestUrl}
          onChange={(e) => setPullRequestUrl(e.target.value)}
        />
      )}

      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Queuing Analysis...
          </>
        ) : (
          "Analyze"
        )}
      </Button>
    </form>
  );
}
