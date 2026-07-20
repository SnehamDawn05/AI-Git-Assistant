"use client";

import {
  Blocks,
  CheckCircle2,
  FileText,
  Folder,
  Lightbulb,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SectionCard } from "./section-card";

export interface SummaryData {
  overview: string;
  architecture: string;
  techStack: string[];
  modules: string[];
  strengths: string[];
  improvements: string[];
}

export function SummaryView({ data }: { data: SummaryData }) {
  return (
    <div className="space-y-6">
      <SectionCard title="Overview" icon={<FileText className="h-5 w-5" />}>
        <p className="leading-7 text-muted-foreground">{data.overview}</p>
      </SectionCard>

      <SectionCard title="Architecture" icon={<Blocks className="h-5 w-5" />}>
        <p className="leading-7 text-muted-foreground">{data.architecture}</p>
      </SectionCard>

      <SectionCard title="Tech Stack" icon={<Wrench className="h-5 w-5" />}>
        <div className="flex flex-wrap gap-2">
          {data.techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Main Modules" icon={<Folder className="h-5 w-5" />}>
        <div className="space-y-4">
          {data.modules.map((module) => {
            const [name, ...rest] = module.split(":");

            return (
              <div key={module} className="rounded-lg border p-4">
                <h4 className="font-semibold capitalize">{name}</h4>

                <p className="mt-1 text-sm text-muted-foreground">
                  {rest.join(":").trim()}
                </p>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard
        title="Strengths"
        icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
      >
        <ul className="space-y-3">
          {data.strengths.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />

              <span>{item}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        title="Suggested Improvements"
        icon={<Lightbulb className="h-5 w-5 text-yellow-500" />}
      >
        <ul className="space-y-3">
          {data.improvements.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Lightbulb className="mt-0.5 h-4 w-4 text-yellow-500" />

              <span>{item}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
