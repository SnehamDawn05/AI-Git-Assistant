import { Bot } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="mx-auto w-full max-w-md">
      {/* Brand header */}
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/30">
            <Bot className="h-6 w-6 text-white" />
          </div>
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      {/* Card */}
      <div className="glass-card gradient-border p-8">{children}</div>

      {/* Footer */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        By continuing, you agree to our{" "}
        <span className="text-indigo-400">Terms of Service</span> and{" "}
        <span className="text-indigo-400">Privacy Policy</span>.
      </p>
    </div>
  );
}
