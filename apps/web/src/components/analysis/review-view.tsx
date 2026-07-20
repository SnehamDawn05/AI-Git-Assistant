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
    <div className="space-y-6">
      <SectionCard title="Summary" icon={<Shield className="h-5 w-5" />}>
        <p className="leading-7 text-muted-foreground">{data.summary}</p>
      </SectionCard>

      <SectionCard
        title="Issues Found"
        icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
      >
        <ul className="space-y-3">
          {data.issues.map((issue) => (
            <li key={issue} className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-red-500" />
              <span>{issue}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        title="Suggestions"
        icon={<Lightbulb className="h-5 w-5 text-yellow-500" />}
      >
        <ul className="space-y-3">
          {data.suggestions.map((suggestion) => (
            <li key={suggestion} className="flex items-start gap-2">
              <Lightbulb className="mt-0.5 h-4 w-4 text-yellow-500" />
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        title="Good Practices"
        icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
      >
        <ul className="space-y-3">
          {data.positives.map((positive) => (
            <li key={positive} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
              <span>{positive}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
