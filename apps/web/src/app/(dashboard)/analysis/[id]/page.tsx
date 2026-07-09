interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function AnalysisDetailsPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analysis Details</h1>

      <div className="rounded-lg border p-6 space-y-4">
        <p>
          <strong>ID:</strong> {id}
        </p>

        <p>
          <strong>Status:</strong> Pending
        </p>

        <p>
          <strong>Repository:</strong> —
        </p>

        <p>
          <strong>Analysis Type:</strong> —
        </p>
      </div>
    </div>
  );
}
