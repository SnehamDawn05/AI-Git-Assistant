"use client";

import { FileText, GitPullRequest, Sparkles } from "lucide-react";

interface Props {
  value: string;
  onValueChange: (value: string) => void;
}

const types = [
  {
    value: "REVIEW",
    label: "PR Review",
    description: "Analyze a pull request",
    icon: GitPullRequest,
    color: "text-violet-400",
    activeBg: "bg-violet-500/15 border-violet-500/40",
    activeGlow: "shadow-violet-500/20",
    inactiveBg: "bg-white/[0.02] border-white/[0.08]",
  },
  {
    value: "SUMMARY",
    label: "Code Summary",
    description: "Deep-dive into a repo",
    icon: Sparkles,
    color: "text-indigo-400",
    activeBg: "bg-indigo-500/15 border-indigo-500/40",
    activeGlow: "shadow-indigo-500/20",
    inactiveBg: "bg-white/[0.02] border-white/[0.08]",
  },
  {
    value: "README",
    label: "README Gen",
    description: "Auto-generate docs",
    icon: FileText,
    color: "text-cyan-400",
    activeBg: "bg-cyan-500/15 border-cyan-500/40",
    activeGlow: "shadow-cyan-500/20",
    inactiveBg: "bg-white/[0.02] border-white/[0.08]",
  },
];

export function AnalysisTypeSelector({ value, onValueChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {types.map((type) => {
        const isActive = value === type.value;
        return (
          <button
            key={type.value}
            type="button"
            onClick={() => onValueChange(type.value)}
            className={`group flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-200 ${
              isActive
                ? `${type.activeBg} shadow-lg ${type.activeGlow}`
                : `${type.inactiveBg} hover:border-white/[0.15] hover:bg-white/[0.04]`
            }`}
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                isActive
                  ? "bg-white/10"
                  : "bg-white/[0.04] group-hover:bg-white/[0.07]"
              }`}
            >
              <type.icon
                className={`h-4.5 w-4.5 ${isActive ? type.color : "text-muted-foreground"}`}
              />
            </div>
            <div>
              <p
                className={`text-xs font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}
              >
                {type.label}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground leading-tight">
                {type.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
