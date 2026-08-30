"use client";

import { AlertTriangle, CheckCircle2, Lightbulb, Shield } from "lucide-react";

import { SectionCard } from "./section-card";

export interface ReviewData {
  summary: string;
  issues: string[];
  suggestions: string[];
  positives: string[];
}

export function ReviewView({ data }: { data: ReviewData }) {
  return (
    <div className="space-y-4">
      <SectionCard
        title="Summary"
        icon={<Shield className="h-4 w-4 text-indigo-400" />}
        accentColor="from-indigo-500 to-blue-500"
      >
        <p className="leading-7 text-muted-foreground">{data.summary}</p>
      </SectionCard>

      <SectionCard
        title="Issues Found"
        icon={<AlertTriangle className="h-4 w-4 text-red-400" />}
        accentColor="from-red-500 to-rose-500"
      >
        {data.issues.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No issues found — great work!
          </p>
        ) : (
          <ul className="space-y-3">
            {data.issues.map((issue) => (
              <li
                key={issue}
                className="flex items-start gap-3 rounded-lg border border-red-500/15 bg-red-500/5 p-3"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <span className="text-sm text-muted-foreground">{issue}</span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard
        title="Suggestions"
        icon={<Lightbulb className="h-4 w-4 text-yellow-400" />}
        accentColor="from-yellow-500 to-amber-500"
      >
        {data.suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No additional suggestions.
          </p>
        ) : (
          <ul className="space-y-3">
            {data.suggestions.map((suggestion) => (
              <li
                key={suggestion}
                className="flex items-start gap-3 rounded-lg border border-yellow-500/15 bg-yellow-500/5 p-3"
              >
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
                <span className="text-sm text-muted-foreground">
                  {suggestion}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard
        title="Good Practices"
        icon={<CheckCircle2 className="h-4 w-4 text-emerald-400" />}
        accentColor="from-emerald-500 to-green-500"
      >
        {data.positives.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No positives identified.
          </p>
        ) : (
          <ul className="space-y-3">
            {data.positives.map((positive) => (
              <li
                key={positive}
                className="flex items-start gap-3 rounded-lg border border-emerald-500/15 bg-emerald-500/5 p-3"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span className="text-sm text-muted-foreground">
                  {positive}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
