import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentAnalyses } from "@/components/dashboard/recent-analyses";
import { NewAnalysisCard } from "@/components/dashboard/new-analysis-card";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader />

      <DashboardStats />

      <div className="grid gap-8 lg:grid-cols-2">
        <RecentAnalyses />

        <NewAnalysisCard />
      </div>
    </div>
  );
}
