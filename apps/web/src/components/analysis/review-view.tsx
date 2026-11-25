"use client";

import { AlertTriangle, CheckCircle2, Lightbulb, Shield } from "lucide-react";

import { SectionCard } from "./section-card";

export interface ReviewIssueObject {
  severity?: string;
  file?: string;
  title?: string;
  explanation?: string;
  suggestion?: string;
}

export interface ReviewData {
  summary: string;
  issues?: Array<string | ReviewIssueObject>;
  suggestions?: unknown[];
  positives?: unknown[];
}

function toDisplayText(item: unknown): string {
  if (typeof item === "string") return item;
  if (item && typeof item === "object") {
    const obj = item as Record<string, unknown>;
    const text = obj.title ?? obj.description ?? obj.suggestion ?? obj.message;
    if (typeof text === "string") return text;
    return JSON.stringify(item);
  }
  return String(item ?? "");
}

export function ReviewView({ data }: { data: ReviewData }) {
  const issues = Array.isArray(data?.issues) ? data.issues : [];
  const suggestions = Array.isArray(data?.suggestions) ? data.suggestions : [];
  const positives = Array.isArray(data?.positives) ? data.positives : [];

  return (
    <div className="space-y-4">
      <SectionCard
        title="Summary"
        icon={<Shield className="h-4 w-4 text-indigo-400" />}
        accentColor="from-indigo-500 to-blue-500"
      >
        <p className="leading-7 text-muted-foreground">
          {data?.summary ?? "No summary available."}
        </p>
      </SectionCard>

      <SectionCard
        title="Issues Found"
        icon={<AlertTriangle className="h-4 w-4 text-red-400" />}
        accentColor="from-red-500 to-rose-500"
      >
        {issues.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No issues found — great work!
          </p>
        ) : (
          <ul className="space-y-3">
            {issues.map((issue, index) => {
              if (typeof issue === "string") {
                return (
                  <li
                    key={`${issue}-${index}`}
                    className="flex items-start gap-3 rounded-lg border border-red-500/15 bg-red-500/5 p-3"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <span className="text-sm text-muted-foreground">
                      {issue}
                    </span>
                  </li>
                );
              }
              const obj = (issue ?? {}) as ReviewIssueObject;
              return (
                <li
                  key={`${obj.title ?? "issue"}-${index}`}
                  className="space-y-1.5 rounded-lg border border-red-500/15 bg-red-500/5 p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                    {obj.severity && (
                      <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-300">
                        {obj.severity}
                      </span>
                    )}
                    {obj.title && (
                      <span className="text-sm font-semibold text-foreground">
                        {obj.title}
                      </span>
                    )}
                    {obj.file && (
                      <span className="text-xs text-muted-foreground">
                        ({obj.file})
                      </span>
                    )}
                  </div>
                  {obj.explanation && (
                    <p className="text-sm text-muted-foreground">
                      {obj.explanation}
                    </p>
                  )}
                  {obj.suggestion && (
                    <p className="text-xs text-emerald-300/90">
                      Suggestion: {obj.suggestion}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      <SectionCard
        title="Suggestions"
        icon={<Lightbulb className="h-4 w-4 text-yellow-400" />}
        accentColor="from-yellow-500 to-amber-500"
      >
        {suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No additional suggestions.
          </p>
        ) : (
          <ul className="space-y-3">
            {suggestions.map((suggestion, index) => {
              const label = toDisplayText(suggestion);
              return (
                <li
                  key={`${label}-${index}`}
                  className="flex items-start gap-3 rounded-lg border border-yellow-500/15 bg-yellow-500/5 p-3"
                >
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">{label}</span>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      <SectionCard
        title="Good Practices"
        icon={<CheckCircle2 className="h-4 w-4 text-emerald-400" />}
        accentColor="from-emerald-500 to-green-500"
      >
        {positives.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No positives identified.
          </p>
        ) : (
          <ul className="space-y-3">
            {positives.map((positive, index) => {
              const label = toDisplayText(positive);
              return (
                <li
                  key={`${label}-${index}`}
                  className="flex items-start gap-3 rounded-lg border border-emerald-500/15 bg-emerald-500/5 p-3"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span className="text-sm text-muted-foreground">{label}</span>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
