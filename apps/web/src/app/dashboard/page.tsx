import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl p-8">
        <h1 className="text-4xl font-bold">Welcome, {session.user.name} 👋</h1>

        <p className="mt-2 text-muted-foreground">{session.user.email}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border p-6">
            <h2 className="font-semibold">Repositories</h2>

            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-xl border p-6">
            <h2 className="font-semibold">Analyses</h2>

            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-xl border p-6">
            <h2 className="font-semibold">Queue</h2>

            <p className="mt-2 text-3xl font-bold">0</p>
          </div>
        </div>
      </main>
    </>
  );
}
