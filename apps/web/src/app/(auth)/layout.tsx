export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-6">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="orb orb-primary opacity-30"
          style={{
            width: "500px",
            height: "500px",
            top: "-150px",
            left: "-100px",
          }}
        />
        <div
          className="orb orb-violet opacity-25"
          style={{
            width: "400px",
            height: "400px",
            bottom: "-100px",
            right: "-100px",
          }}
        />
        <div
          className="orb orb-cyan opacity-15"
          style={{
            width: "300px",
            height: "300px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div className="absolute inset-0 dot-pattern opacity-40" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
