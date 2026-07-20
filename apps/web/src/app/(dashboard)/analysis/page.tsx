import { AnalysisList } from "@/components/dashboard/analysis-list";

export default function AnalysisPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analysis History</h1>

        <p className="text-muted-foreground">
          View all of your previous AI analyses.
        </p>
      </div>

      <AnalysisList />
    </div>
  );
}
