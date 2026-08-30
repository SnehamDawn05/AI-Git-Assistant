"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bot, LogOut } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useSession } from "@/hooks/use-session";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useSession();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "History", href: "/analysis" },
  ];

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 transition-shadow hover:shadow-indigo-500/50">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <span className="gradient-text">AI Git Assistant</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-lg bg-white/[0.06]" />
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="flex items-center gap-3">
          {/* Avatar + name */}
          <div className="hidden items-center gap-2.5 md:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/80 to-violet-600/80 text-xs font-bold text-white shadow-md ring-2 ring-white/10">
              {initials}
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-foreground leading-tight">
                {user?.name}
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-6 w-px bg-white/10 md:block" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
