import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="orb orb-primary opacity-20"
          style={{
            width: "500px",
            height: "500px",
            top: "-100px",
            right: "-100px",
          }}
        />
        <div
          className="orb orb-cyan opacity-10"
          style={{
            width: "400px",
            height: "400px",
            bottom: "0",
            left: "-100px",
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl p-8">{children}</main>
    </div>
  );
}
