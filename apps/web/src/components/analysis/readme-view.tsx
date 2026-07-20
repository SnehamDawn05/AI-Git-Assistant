"use client";

import { Copy, Download, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionCard } from "./section-card";

export interface ReadmeData {
  markdown: string;
}

export function ReadmeView({ markdown }: ReadmeData) {
  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], {
      type: "text/markdown",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Generated README"
        icon={<FileText className="h-5 w-5" />}
      >
        <div className="mb-4 flex gap-2">
          <Button size="sm" onClick={copyMarkdown}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Markdown
          </Button>

          <Button variant="outline" size="sm" onClick={downloadMarkdown}>
            <Download className="mr-2 h-4 w-4" />
            Download README
          </Button>
        </div>

        <pre className="overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-6 text-sm leading-7">
          {markdown}
        </pre>
      </SectionCard>
    </div>
  );
}
