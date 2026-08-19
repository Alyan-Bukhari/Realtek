"use client";

import React, { useCallback, useEffect } from "react";
import IntroAnimation, { type MorphHeroItem } from "@/components/ui/scroll-morph-hero";

const projects: MorphHeroItem[] = [
  {
    src: "/images/madina-mall-featured.jpg",
    title: "Madina Mall & Residency",
    caption: "Coming Soon",
    href: "project.html?id=upcoming",
  },
  { src: "/images/project-1.jpg", title: "La Monte Vista", caption: "Sold Out", href: "project.html?id=1" },
  { src: "/images/project-2.jpg", title: "Madina Heights 1", caption: "Sold Out", href: "project.html?id=2" },
  { src: "/images/project-3.jpg", title: "Madina Heights 2", caption: "Sold Out", href: "project.html?id=3" },
  { src: "/images/project-4.jpg", title: "Madina Heights 3", caption: "Sold Out", href: "project.html?id=4" },
  { src: "/images/project-5.jpg", title: "Madina Heights 4", caption: "80% Sold", href: "project.html?id=5" },
  { src: "/images/project-6.jpg", title: "Madina Heights 5", caption: "80% Sold", href: "project.html?id=6" },
  { src: "/images/project-7.jpg", title: "Madina Silver Heights", caption: "Sold Out", href: "project.html?id=7" },
  { src: "/images/project-8.jpg", title: "Madina Homes", caption: "Sold Out", href: "project.html?id=8" },
];

export function RadialHero() {
  useEffect(() => {
    return () => document.body.classList.remove("is-radial-pinned");
  }, []);

  const onActiveChange = useCallback((active: boolean) => {
    document.body.classList.toggle("is-radial-pinned", active);
  }, []);

  return (
    <IntroAnimation
      items={projects}
      onActiveChange={onActiveChange}
      introTitle="Lahore, built by RealTek."
      introEyebrow="Scroll to explore"
      eyebrow="Our Projects"
      activeBody="Every development we have delivered in Lahore — plus the upcoming mall."
    />
  );
}
