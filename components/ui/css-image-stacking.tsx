"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { FloatingPathsBackground } from "@/components/ui/floating-paths";

export type StackItem = {
  src: string;
  title: string;
  caption?: string;
  href: string;
};

const DEFAULT_ITEMS: StackItem[] = [
  { src: "/images/project-1.jpg", title: "La Monte Vista", caption: "Sold Out", href: "project.html?id=1" },
  { src: "/images/project-2.jpg", title: "Madina Heights 1", caption: "Sold Out", href: "project.html?id=2" },
  { src: "/images/project-3.jpg", title: "Madina Heights 2", caption: "Sold Out", href: "project.html?id=3" },
  { src: "/images/project-4.jpg", title: "Madina Heights 3", caption: "Sold Out", href: "project.html?id=4" },
  { src: "/images/project-5.jpg", title: "Madina Heights 4", caption: "80% Sold", href: "project.html?id=5" },
  { src: "/images/project-6.jpg", title: "Madina Heights 5", caption: "80% Sold", href: "project.html?id=6" },
  { src: "/images/project-7.jpg", title: "Madina Silver Heights", caption: "Sold Out", href: "project.html?id=7" },
  { src: "/images/project-8.jpg", title: "Madina Homes", caption: "Sold Out", href: "project.html?id=8" },
  {
    src: "/images/madina-mall-featured.jpg",
    title: "Madina Mall & Residency",
    caption: "Coming Soon",
    href: "project.html?id=upcoming",
  },
];

type CssImageStackingProps = {
  items?: StackItem[];
  eyebrow?: string;
  body?: string;
  onActiveChange?: (active: boolean) => void;
};

export default function CssImageStacking({
  items = DEFAULT_ITEMS,
  eyebrow = "Our Projects",
  body = "Every development we have delivered in Lahore — plus the upcoming mall.",
  onActiveChange,
}: CssImageStackingProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !onActiveChange) return;
    const io = new IntersectionObserver(
      ([entry]) => onActiveChange(entry.isIntersecting),
      { rootMargin: "-12% 0px -18% 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onActiveChange]);

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const heading = (
    <>
      The full{" "}
      <em
        className="font-medium"
        style={{
          fontFamily: "Fraunces, Iowan Old Style, Palatino, serif",
          fontStyle: "italic",
          fontWeight: 300,
          textTransform: "none",
        }}
      >
        collection.
      </em>
    </>
  );

  if (reduce) {
    return (
      <section ref={rootRef} className="bg-background px-[var(--gutter,1.5rem)] py-20 text-foreground">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8c6239]">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-center font-serif text-[clamp(2rem,5vw,3.5rem)] font-light uppercase tracking-tight">
          {heading}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-center text-sm text-muted-foreground">{body}</p>
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <a key={item.href} href={item.href} className="overflow-hidden rounded-md bg-[#1c1512]">
              <img src={item.src} alt={item.title} className="aspect-3/4 w-full object-contain bg-[#1c1512]" />
              <span className="block px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#fbf6ee]">
                {item.title}
              </span>
            </a>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={rootRef} className="relative bg-background text-foreground">
      <div className="pointer-events-none sticky top-0 z-0 h-screen w-full overflow-hidden">
        <FloatingPathsBackground position={-1} className="h-full w-full bg-background" />
      </div>

      <div className="relative z-10 -mt-[100vh]">
        <div className="wrapper">
          <section className="sticky top-0 grid h-screen w-full place-content-center bg-transparent">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,246,238,0.78)_0%,rgba(242,230,214,0.18)_55%,transparent_72%)]" />
            <p className="relative z-10 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8c6239]">
              {eyebrow}
            </p>
            <h2 className="relative z-10 mt-4 max-w-5xl px-8 text-center font-serif text-5xl font-light uppercase leading-[0.95] tracking-tight 2xl:text-7xl">
              {heading}
            </h2>
            <p className="relative z-10 mt-5 max-w-lg px-8 text-center text-sm tracking-wide text-muted-foreground">
              {body}
            </p>
          </section>
        </div>

        <section className="w-full bg-transparent">
          {items.map((item, i) => {
            const width = Math.min(55 + i * 3.5, 86);
            return (
              <div
                key={item.href}
                className="sticky w-full"
                style={{ top: i * 8, zIndex: i + 1 }}
              >
                <figure className="flex h-screen w-full items-center justify-center">
                  <a
                    href={item.href}
                    aria-label={`${item.title}${item.caption ? ` — ${item.caption}` : ""}`}
                    className="rt-stack-frame relative flex flex-col overflow-hidden rounded-md bg-[#1c1512] transition-all duration-300"
                    style={
                      {
                        "--stack-w": `${width}%`,
                        boxShadow:
                          i === 0
                            ? "none"
                            : "0 -5px 16px 4px rgba(28, 21, 18, 0.45), 0 2px 4px -1px rgba(28, 21, 18, 0.06)",
                      } as CSSProperties
                    }
                  >
                    <img
                      src={item.src}
                      alt={`${item.title}${item.caption ? `, ${item.caption}` : ""}`}
                      className="min-h-0 w-full flex-1 object-contain object-center"
                      loading={i < 2 ? "eager" : "lazy"}
                      decoding="async"
                    />
                    <span className="flex shrink-0 items-center justify-between gap-3 bg-[#1c1512] px-5 py-3.5 text-[#fbf6ee]">
                      <span
                        className="text-xs font-medium uppercase tracking-[0.12em] sm:text-sm"
                        style={{ fontFamily: "General Sans, ui-sans-serif, system-ui, sans-serif" }}
                      >
                        {item.title}
                      </span>
                      {item.caption ? (
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8c6239]">
                          {item.caption}
                        </span>
                      ) : null}
                    </span>
                  </a>
                </figure>
              </div>
            );
          })}
        </section>
      </div>
    </section>
  );
}
