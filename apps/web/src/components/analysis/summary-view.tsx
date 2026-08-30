"use client";

import {
  Blocks,
  CheckCircle2,
  FileText,
  Folder,
  Lightbulb,
  Wrench,
} from "lucide-react";

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
    <div className="space-y-4">
      <SectionCard
        title="Overview"
        icon={<FileText className="h-4 w-4 text-indigo-400" />}
        accentColor="from-indigo-500 to-blue-500"
      >
        <p className="leading-7 text-muted-foreground">{data.overview}</p>
      </SectionCard>

      <SectionCard
        title="Architecture"
        icon={<Blocks className="h-4 w-4 text-violet-400" />}
        accentColor="from-violet-500 to-purple-500"
      >
        <p className="leading-7 text-muted-foreground">{data.architecture}</p>
      </SectionCard>

      <SectionCard
        title="Tech Stack"
        icon={<Wrench className="h-4 w-4 text-cyan-400" />}
        accentColor="from-cyan-500 to-teal-500"
      >
        <div className="flex flex-wrap gap-2">
          {data.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Main Modules"
        icon={<Folder className="h-4 w-4 text-amber-400" />}
        accentColor="from-amber-500 to-orange-500"
      >
        <div className="space-y-3">
          {data.modules.map((module) => {
            const [name, ...rest] = module.split(":");
            return (
              <div
                key={module}
                className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-4"
              >
                <h4 className="text-sm font-semibold capitalize text-foreground">
                  {name}
                </h4>
                {rest.length > 0 && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {rest.join(":").trim()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard
        title="Strengths"
        icon={<CheckCircle2 className="h-4 w-4 text-emerald-400" />}
        accentColor="from-emerald-500 to-green-500"
      >
        <ul className="space-y-2.5">
          {data.strengths.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span className="text-sm text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        title="Suggested Improvements"
        icon={<Lightbulb className="h-4 w-4 text-yellow-400" />}
        accentColor="from-yellow-500 to-amber-500"
      >
        <ul className="space-y-2.5">
          {data.improvements.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
              <span className="text-sm text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
