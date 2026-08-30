import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  accentColor?: string;
}

export function SectionCard({
  title,
  icon,
  children,
  accentColor = "from-indigo-500 to-violet-500",
}: SectionCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.02] px-5 py-4">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${accentColor} bg-opacity-20 p-0.5`}
        >
          <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-background/80">
            {icon}
          </div>
        </div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>

      {/* Content */}
      <div className="p-5">{children}</div>
    </div>
  );
}
