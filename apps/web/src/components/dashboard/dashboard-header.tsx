"use client";

import { useSession } from "@/hooks/use-session";
import { Sparkles } from "lucide-react";

export function DashboardHeader() {
  const { user } = useSession();

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="flex flex-col gap-2 pb-2">
      <div className="flex items-center gap-2 text-sm font-medium text-indigo-400">
        <Sparkles className="h-4 w-4" />
        <span>AI Analysis Platform</span>
      </div>

      <h1 className="text-4xl font-black tracking-tight md:text-5xl">
        <span className="text-muted-foreground">Hey, </span>
        <span className="gradient-text">{firstName}</span>
        <span className="text-foreground"> 👋</span>
      </h1>

      <p className="mt-1 text-muted-foreground">
        Ready to analyze another repository? Drop a GitHub URL below to get
        started.
      </p>
    </div>
  );
}
