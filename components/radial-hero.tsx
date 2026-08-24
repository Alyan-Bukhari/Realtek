"use client";

import { useCallback, useEffect } from "react";
import HorizontalFolio, { type StackItem } from "@/components/ui/horizontal-folio";

const projects: StackItem[] = [
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
    caption: "Live",
    href: "project.html?id=upcoming",
  },
];

export function RadialHero() {
  useEffect(() => {
    return () => document.body.classList.remove("is-radial-pinned");
  }, []);

  const onActiveChange = useCallback((active: boolean) => {
    document.body.classList.toggle("is-radial-pinned", active);
  }, []);

  return (
    <HorizontalFolio
      items={projects}
      eyebrow="Our Projects"
      body="Every development we have delivered in Lahore — plus Madina Mall & Residency, now live."
      onActiveChange={onActiveChange}
    />
  );
}
