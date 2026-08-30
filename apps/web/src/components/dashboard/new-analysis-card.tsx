import { Bot } from "lucide-react";
import { AnalysisForm } from "./analysis-form";

export function NewAnalysisCard() {
  return (
    <div className="glass-card gradient-border p-6 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">New Analysis</h2>
          <p className="text-xs text-muted-foreground">
            Choose a type and paste a GitHub URL
          </p>
        </div>
      </div>

      <AnalysisForm />
    </div>
  );
}
