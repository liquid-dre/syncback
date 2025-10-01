import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type PageBackgroundProps = {
  children?: ReactNode;
  className?: string;
  gridClassName?: string;
  noiseClassName?: string;
};

export function PageBackground({
  children,
  className,
  gridClassName = "opacity-40",
  noiseClassName = "opacity-40 mix-blend-soft-light",
}: PageBackgroundProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 -z-10", className)}>
      {children}
      <div className={cn("absolute inset-0 bg-grid-soft", gridClassName)} />
      <div className={cn("absolute inset-0 bg-noise", noiseClassName)} />
    </div>
  );
}
