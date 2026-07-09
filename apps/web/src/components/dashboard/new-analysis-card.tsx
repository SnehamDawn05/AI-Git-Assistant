import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AnalysisForm } from "./analysis-form";

export function NewAnalysisCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Analysis</CardTitle>

        <CardDescription>
          Choose an analysis type and provide a GitHub repository.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <AnalysisForm />
      </CardContent>
    </Card>
  );
}
