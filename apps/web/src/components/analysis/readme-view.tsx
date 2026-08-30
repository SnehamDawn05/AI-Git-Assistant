"use client";

import { Check, Copy, Download, FileText } from "lucide-react";
import { useState } from "react";

import { SectionCard } from "./section-card";

export interface ReadmeData {
  markdown: string;
}

export function ReadmeView({ markdown }: ReadmeData) {
  const [copied, setCopied] = useState(false);

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <SectionCard
        title="Generated README"
        icon={<FileText className="h-4 w-4 text-cyan-400" />}
        accentColor="from-cyan-500 to-teal-500"
      >
        {/* Action buttons */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={copyMarkdown}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
              copied
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-white/10 bg-white/5 text-muted-foreground hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-400"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Markdown
              </>
            )}
          </button>

          <button
            onClick={downloadMarkdown}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400"
          >
            <Download className="h-3.5 w-3.5" />
            Download README
          </button>
        </div>

        {/* Code block */}
        <div className="relative overflow-hidden rounded-xl border border-white/[0.08]">
          {/* Filename bar */}
          <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.03] px-4 py-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="ml-2 text-xs font-medium text-muted-foreground">
              README.md
            </span>
          </div>

          <pre className="max-h-[600px] overflow-auto whitespace-pre-wrap bg-[oklch(0.08_0.02_264)] p-6 text-sm leading-7 text-muted-foreground">
            {markdown}
          </pre>
        </div>
      </SectionCard>
    </div>
  );
}
