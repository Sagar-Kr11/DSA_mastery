import type { ReactNode } from "react";

export function GlassCard({ children, className = "", glow = false }: { children: ReactNode; className?: string; glow?: boolean }) {
  return (
    <div
      className={`glass rounded-2xl ${glow ? "glow-ring" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
