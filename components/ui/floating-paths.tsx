"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export function FloatingPathsBackground({
  position,
  children,
  className,
}: {
  position: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className={cn("relative w-full", className)}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="h-full w-full text-[#452d2a]"
          viewBox="0 0 696 316"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {paths.map((path) =>
            reduce ? (
              <path
                key={path.id}
                d={path.d}
                stroke="currentColor"
                strokeWidth={path.width}
                strokeOpacity={0.04 + path.id * 0.008}
              />
            ) : (
              <motion.path
                key={path.id}
                d={path.d}
                stroke="currentColor"
                strokeWidth={path.width}
                strokeOpacity={0.05 + path.id * 0.01}
                initial={{ pathLength: 0.3, opacity: 0.45 }}
                animate={{
                  pathLength: 1,
                  opacity: [0.22, 0.48, 0.22],
                  pathOffset: [0, 1, 0],
                }}
                transition={{
                  duration: 22 + (path.id % 7) * 1.4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            )
          )}
        </svg>
      </div>
      {children}
    </div>
  );
}
