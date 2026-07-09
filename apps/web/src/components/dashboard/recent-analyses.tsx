import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentAnalyses() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Analyses</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground">No analyses yet.</p>
        </div>
      </CardContent>
    </Card>
  );
}
