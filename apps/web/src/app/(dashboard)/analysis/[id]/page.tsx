import { AnalysisViewer } from "@/components/dashboard/analysis viewer";

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  return <AnalysisViewer id={id} />;
}
