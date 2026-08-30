import { AnalysisList } from "@/components/dashboard/analysis-list";
import { Clock } from "lucide-react";

export default function AnalysisPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 pb-2">
        <div className="flex items-center gap-2 text-sm font-medium text-indigo-400">
          <Clock className="h-4 w-4" />
          <span>Analysis History</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight md:text-5xl">
          <span className="gradient-text">All Analyses</span>
        </h1>
        <p className="text-muted-foreground">
          A complete record of your AI-powered repository analyses.
        </p>
      </div>

      <AnalysisList />
    </div>
  );
}
