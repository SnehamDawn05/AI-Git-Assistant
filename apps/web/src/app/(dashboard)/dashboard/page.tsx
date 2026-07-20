import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { RecentAnalyses } from "@/components/dashboard/recent-analyses";
import { NewAnalysisCard } from "@/components/dashboard/new-analysis-card";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader />

      <div className="grid gap-8 lg:grid-cols-2">
        <RecentAnalyses />

        <NewAnalysisCard />
      </div>
    </div>
  );
}
