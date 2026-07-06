"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { useSession } from "@/hooks/use-session";

import { Button } from "@/components/ui/button";

export function Navbar() {
  const router = useRouter();
  const { user } = useSession();

  async function handleLogout() {
    await authClient.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/dashboard" className="text-xl font-bold">
          AI Git Assistant
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/dashboard">Dashboard</Link>

          <Link href="/repositories">Repositories</Link>

          <Link href="/analysis">Analysis</Link>

          <span className="text-muted-foreground">{user?.name}</span>

          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
}
