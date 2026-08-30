"use client";

import { useState } from "react";

import { ArrowRight, Link2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { JobType } from "@repo/queue/client";

import { Input } from "@/components/ui/input";

import { AnalysisTypeSelector } from "./analysis-type-selector";

export function AnalysisForm() {
  const router = useRouter();

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
        headers: { "Content-Type": "application/json" },
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
        throw new Error(data.message || "Failed to start analysis.");
      }

      toast.success("Analysis queued successfully!");
      setRepositoryUrl("");
      setPullRequestUrl("");
      router.push(`/analysis/${data.analysisId}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const placeholder =
    type === JobType.REVIEW
      ? "https://github.com/owner/repository/pull/123"
      : "https://github.com/owner/repository";

  const currentValue = type === JobType.REVIEW ? pullRequestUrl : repositoryUrl;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === JobType.REVIEW) {
      setPullRequestUrl(e.target.value);
    } else {
      setRepositoryUrl(e.target.value);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <AnalysisTypeSelector
        value={type}
        onValueChange={(value) => setType(value as JobType)}
      />

      <div className="relative">
        <Link2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={currentValue}
          onChange={handleChange}
          className="border-white/[0.1] bg-white/[0.04] pl-10 placeholder:text-muted-foreground/60 focus:border-indigo-500/50 focus:bg-white/[0.06]"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-glow group flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Queuing Analysis...
          </>
        ) : (
          <>
            Run Analysis
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}
