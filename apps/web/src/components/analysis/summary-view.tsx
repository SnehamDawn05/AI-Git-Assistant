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

export interface SummaryModuleObject {
  name?: string;
  module?: string;
  title?: string;
  path?: string;
  description?: string;
  summary?: string;
  purpose?: string;
  details?: string;
}

export interface SummaryData {
  overview: string;
  architecture: string;
  techStack: unknown[];
  modules: Array<string | SummaryModuleObject>;
  strengths: unknown[];
  improvements: unknown[];
}

function toDisplayText(item: unknown): string {
  if (typeof item === "string") return item;
  if (item && typeof item === "object") {
    const obj = item as Record<string, unknown>;
    const text = obj.name ?? obj.title ?? obj.label ?? obj.description;
    if (typeof text === "string") return text;
    return JSON.stringify(item);
  }
  return String(item ?? "");
}

function parseModuleEntry(entry: unknown): {
  name: string;
  description?: string;
} {
  if (typeof entry === "string") {
    const [name, ...rest] = entry.split(":");
    const description = rest.join(":").trim();
    return {
      name: name?.trim() || entry,
      description: description || undefined,
    };
  }
  if (entry && typeof entry === "object") {
    const obj = entry as SummaryModuleObject;
    const name = obj.name ?? obj.module ?? obj.title ?? obj.path ?? "Module";
    const description =
      obj.description ?? obj.summary ?? obj.purpose ?? obj.details;
    return {
      name: String(name),
      description: description ? String(description) : undefined,
    };
  }
  return { name: String(entry ?? "Module") };
}

export function SummaryView({ data }: { data: SummaryData }) {
  const techStack = Array.isArray(data?.techStack) ? data.techStack : [];
  const modules = Array.isArray(data?.modules) ? data.modules : [];
  const strengths = Array.isArray(data?.strengths) ? data.strengths : [];
  const improvements = Array.isArray(data?.improvements)
    ? data.improvements
    : [];

  return (
    <div className="space-y-4">
      <SectionCard
        title="Overview"
        icon={<FileText className="h-4 w-4 text-indigo-400" />}
        accentColor="from-indigo-500 to-blue-500"
      >
        <p className="leading-7 text-muted-foreground">
          {data?.overview ?? "No overview available."}
        </p>
      </SectionCard>

      <SectionCard
        title="Architecture"
        icon={<Blocks className="h-4 w-4 text-violet-400" />}
        accentColor="from-violet-500 to-purple-500"
      >
        <p className="leading-7 text-muted-foreground">
          {data?.architecture ?? "No architecture details available."}
        </p>
      </SectionCard>

      <SectionCard
        title="Tech Stack"
        icon={<Wrench className="h-4 w-4 text-cyan-400" />}
        accentColor="from-cyan-500 to-teal-500"
      >
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, index) => {
            const label = toDisplayText(tech);
            return (
              <span
                key={`${label}-${index}`}
                className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300"
              >
                {label}
              </span>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard
        title="Main Modules"
        icon={<Folder className="h-4 w-4 text-amber-400" />}
        accentColor="from-amber-500 to-orange-500"
      >
        <div className="space-y-3">
          {modules.map((module, index) => {
            const { name, description } = parseModuleEntry(module);
            return (
              <div
                key={`${name}-${index}`}
                className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-4"
              >
                <h4 className="text-sm font-semibold capitalize text-foreground">
                  {name}
                </h4>
                {description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {description}
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
          {strengths.map((item, index) => {
            const label = toDisplayText(item);
            return (
              <li key={`${label}-${index}`} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span className="text-sm text-muted-foreground">{label}</span>
              </li>
            );
          })}
        </ul>
      </SectionCard>

      <SectionCard
        title="Suggested Improvements"
        icon={<Lightbulb className="h-4 w-4 text-yellow-400" />}
        accentColor="from-yellow-500 to-amber-500"
      >
        <ul className="space-y-2.5">
          {improvements.map((item, index) => {
            const label = toDisplayText(item);
            return (
              <li key={`${label}-${index}`} className="flex items-start gap-3">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                <span className="text-sm text-muted-foreground">{label}</span>
              </li>
            );
          })}
        </ul>
      </SectionCard>
    </div>
  );
}
