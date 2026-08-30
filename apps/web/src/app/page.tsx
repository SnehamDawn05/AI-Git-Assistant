import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  FileText,
  GitPullRequest,
  Sparkles,
  Zap,
  Shield,
  Code2,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: GitPullRequest,
      color: "text-violet-400",
      bg: "bg-violet-500/10 border-violet-500/20",
      glow: "rgba(139, 92, 246, 0.3)",
      title: "PR Review",
      description:
        "Get instant AI-powered code reviews on any GitHub pull request. Identify issues, suggestions, and best practices automatically.",
      badge: "Most Popular",
      badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    },
    {
      icon: Sparkles,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20",
      glow: "rgba(99, 102, 241, 0.3)",
      title: "Code Summary",
      description:
        "Deep-dive into any repository. Understand its architecture, tech stack, strengths, and areas for improvement in one click.",
      badge: null,
      badgeColor: "",
    },
    {
      icon: FileText,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
      glow: "rgba(34, 211, 238, 0.3)",
      title: "README Generator",
      description:
        "Auto-generate professional, comprehensive README files for any repository. Save hours of documentation work.",
      badge: null,
      badgeColor: "",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Paste your GitHub URL",
      description:
        "Drop in a repository URL or a pull request link — that's all we need.",
    },
    {
      number: "02",
      title: "Choose your analysis type",
      description:
        "Select from PR Review, Code Summary, or README Generator based on your needs.",
    },
    {
      number: "03",
      title: "Get AI-powered insights",
      description:
        "Our AI analyzes your code in seconds and delivers structured, actionable results.",
    },
  ];

  const stats = [
    { value: "3", label: "Analysis Types" },
    { value: "< 60s", label: "Avg. Analysis Time" },
    { value: "AI", label: "Powered Engine" },
    { value: "100%", label: "Private & Secure" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* ─── Background effects ──────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="orb orb-primary"
          style={{
            width: "600px",
            height: "600px",
            top: "-200px",
            left: "-150px",
          }}
        />
        <div
          className="orb orb-violet"
          style={{
            width: "500px",
            height: "500px",
            top: "10%",
            right: "-100px",
          }}
        />
        <div
          className="orb orb-cyan"
          style={{
            width: "400px",
            height: "400px",
            bottom: "10%",
            left: "20%",
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-60" />
      </div>

      {/* ─── Navbar ─────────────────────────────────────────── */}
      <header className="relative z-50">
        <div className="glass border-b border-white/[0.06]">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-xl font-bold tracking-tight"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <span className="gradient-text">AI Git Assistant</span>
            </Link>

            <nav className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="btn-glow rounded-lg px-4 py-2 text-sm font-semibold text-white"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* ─── Hero ───────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 pb-24 pt-28 text-center">
        <div className="animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
            <Zap className="h-3.5 w-3.5" />
            AI-Powered GitHub Analysis
          </div>
        </div>

        <h1 className="animate-fade-in-up delay-100 mx-auto max-w-4xl text-5xl font-black leading-[1.08] tracking-tight md:text-7xl">
          <span className="text-foreground">Understand any</span>
          <br />
          <span className="gradient-text">GitHub repo</span>
          <br />
          <span className="text-foreground">in seconds.</span>
        </h1>

        <p className="animate-fade-in-up delay-200 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          AI Git Assistant analyzes pull requests, summarizes codebases, and
          generates professional README files — all powered by AI, all in one
          place.
        </p>

        <div className="animate-fade-in-up delay-300 mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="btn-glow group flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white"
          >
            Start Analyzing Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-base font-semibold text-foreground backdrop-blur transition-all hover:border-white/20 hover:bg-white/10"
          >
            Sign In
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="animate-fade-in-up delay-400 mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          {[
            "No credit card required",
            "Works with any public repo",
            "Results in under 60 seconds",
          ].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ─── Stats ──────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="glass-card grid grid-cols-2 gap-8 p-10 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="gradient-text text-4xl font-black">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ───────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">
              <span className="text-foreground">Three powerful</span>{" "}
              <span className="gradient-text">analysis modes</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Whether you&apos;re reviewing a PR, exploring a new codebase, or
              documenting your project — we have you covered.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass-card group relative flex flex-col gap-5 p-8 transition-all duration-300"
                style={
                  {
                    "--glow-color": f.glow,
                  } as React.CSSProperties
                }
              >
                {f.badge && (
                  <span
                    className={`absolute right-6 top-6 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${f.badgeColor}`}
                  >
                    {f.badge}
                  </span>
                )}

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border ${f.bg}`}
                >
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                </div>

                <Link
                  href="/register"
                  className="mt-auto flex items-center gap-1 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                >
                  Try it free
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ───────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">
              <span className="gradient-text">How it works</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Three simple steps from zero to insights.
            </p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-3">
            {/* Connector line */}
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent md:block" />

            {steps.map((step) => (
              <div key={step.number} className="relative flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-black text-white shadow-lg shadow-indigo-500/30">
                    {step.number}
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/40 to-transparent md:hidden" />
                </div>

                <h3 className="text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-32">
        <div className="mx-auto max-w-4xl">
          <div className="gradient-border glass-card relative overflow-hidden rounded-3xl p-16 text-center">
            {/* Inner glow */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className="h-64 w-64 rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
                }}
              />
            </div>

            <div className="relative">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-2xl shadow-indigo-500/40">
                  <Bot className="h-8 w-8 text-white" />
                </div>
              </div>

              <h2 className="text-4xl font-black tracking-tight md:text-5xl">
                <span className="gradient-text">Ready to analyze?</span>
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                Join developers who use AI Git Assistant to ship better code,
                faster. No setup required.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="btn-glow group flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white"
                >
                  Create Free Account
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Bot className="h-4 w-4 text-indigo-400" />
            AI Git Assistant
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
              Privacy-first
            </span>
            <span className="flex items-center gap-1.5">
              <Code2 className="h-3.5 w-3.5 text-indigo-400" />
              Built for developers
            </span>
          </div>

          <p>
            © {new Date().getFullYear()} AI Git Assistant. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
