"use client";

import { useEffect, useRef, useState } from "react";

export type StackItem = {
  src: string;
  title: string;
  caption?: string;
  href: string;
};

type GsapLike = {
  registerPlugin: (p: unknown) => void;
  context: (fn: () => void, scope?: Element | null) => { revert: () => void };
  set: (t: unknown, v: object) => void;
  to: (t: unknown, v: object) => unknown;
  getProperty?: (t: unknown, p: string) => string | number;
};

type HorizontalFolioProps = {
  items: StackItem[];
  eyebrow?: string;
  body?: string;
  onActiveChange?: (active: boolean) => void;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function prefersReduce() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function isMobile() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 860px)").matches;
}

export default function HorizontalFolio({
  items,
  eyebrow = "Our Projects",
  body = "Every development we have delivered in Lahore — plus Madina Mall & Residency, now live.",
  onActiveChange,
}: HorizontalFolioProps) {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reduce] = useState(prefersReduce);
  const [index, setIndex] = useState(0);
  const total = items.length + 2;
  const bookingCount = items.filter((item) =>
    /80%|reserv|live/i.test(item.caption || "")
  ).length;
  const soonCount = items.filter((item) => /coming/i.test(item.caption || "")).length;

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !onActiveChange) return;
    const io = new IntersectionObserver(
      ([entry]) => onActiveChange(entry.isIntersecting),
      { rootMargin: "-8% 0px -12% 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onActiveChange]);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || reduce) return;

    const gsap = (window as Window & { gsap?: GsapLike }).gsap;
    const ScrollTrigger = (window as Window & { ScrollTrigger?: unknown }).ScrollTrigger;
    if (!gsap || !ScrollTrigger || isMobile()) {
      root.classList.add("is-hf-native");
      const scroller = root.querySelector(".hf-scroller");
      if (!scroller) return;
      const onScroll = () => {
        const i = Math.round(scroller.scrollLeft / Math.max(window.innerWidth, 1));
        setIndex((prev) => (prev === i ? prev : i));
      };
      scroller.addEventListener("scroll", onScroll, { passive: true });
      return () => scroller.removeEventListener("scroll", onScroll);
    }

    /* The pin MUST be created after main.js has inserted its own pin
       spacers above this section. Creating it earlier bakes a stale
       start position that no refresh can repair (blank gap where the
       pin releases early). We wait for main.js's rt:pins-ready signal,
       with load/timeout fallbacks so the section never stays unpinned. */
    let ctx: { revert: () => void } | null = null;
    let started = false;

    const setup = () => {
      if (started || !rootRef.current || !trackRef.current) return;
      started = true;
      const rootEl = rootRef.current;
      const trackEl = trackRef.current;
      rootEl.classList.remove("is-hf-native");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const slides = Array.from(rootEl.querySelectorAll(".hf-slide")) as HTMLElement[];
        const scrollerEl = rootEl.querySelector(".hf-scroller") as HTMLElement | null;
        const measureWidth = () =>
          Math.max(1, Math.round(scrollerEl?.clientWidth || window.innerWidth));

        const setSlideWidths = () => {
          const w = measureWidth();
          slides.forEach((slide) => {
            slide.style.width = w + "px";
            slide.style.minWidth = w + "px";
            slide.style.maxWidth = w + "px";
            slide.style.flex = "0 0 " + w + "px";
          });
          // Keep pin target clipped — GSAP pin often forces overflow:visible
          rootEl.style.overflow = "hidden";
          if (scrollerEl) scrollerEl.style.overflow = "hidden";
        };
        setSlideWidths();

        const getX = () => -Math.max(0, (total - 1) * measureWidth());
        const getEnd = () => "+=" + Math.max(0, (total - 1) * measureWidth());

        gsap.set(trackEl, { x: 0, force3D: true });
        gsap.to(trackEl, {
          x: getX,
          ease: "none",
          scrollTrigger: {
            trigger: rootEl,
            start: "top top",
            end: getEnd,
            pin: true,
            scrub: 0.45,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: setSlideWidths,
            onUpdate: (self: { progress: number }) => {
              const i = Math.min(
                total - 1,
                Math.max(0, Math.round(self.progress * (total - 1)))
              );
              setIndex((prev) => (prev === i ? prev : i));
            },
          },
        });

        // Single authoritative refresh after layout settles
        requestAnimationFrame(() => {
          const ST = (window as Window & { ScrollTrigger?: { refresh: () => void } }).ScrollTrigger;
          setSlideWidths();
          ST?.refresh();
        });
      }, rootEl);

      const onResize = () => {
        const ST = (window as Window & { ScrollTrigger?: { refresh: () => void } }).ScrollTrigger;
        ST?.refresh();
      };
      window.addEventListener("resize", onResize);
      (setup as unknown as { __onResize?: () => void }).__onResize = onResize;
    };

    const onPinsReady = () => setup();
    window.addEventListener("rt:pins-ready", onPinsReady, { once: true });
    // Fallbacks: never leave the section unpinned if the signal is missed
    const fallbackTimer = window.setTimeout(setup, 7000);
    const onLoadFallback = () => window.setTimeout(setup, 4000);
    if (document.readyState === "complete") onLoadFallback();
    else window.addEventListener("load", onLoadFallback, { once: true });

    return () => {
      window.removeEventListener("rt:pins-ready", onPinsReady);
      window.removeEventListener("load", onLoadFallback);
      window.clearTimeout(fallbackTimer);
      const onResize = (setup as unknown as { __onResize?: () => void }).__onResize;
      if (onResize) window.removeEventListener("resize", onResize);
      ctx?.revert();
    };
  }, [reduce, total]);

  if (reduce) {
    return (
      <section ref={rootRef} className="hf hf-static" aria-label="Projects">
        <p className="hf-kicker">{eyebrow}</p>
        <h2 className="hf-title">
          The full <em>collection.</em>
        </h2>
        <p className="hf-lede">{body}</p>
        <div className="hf-grid">
          {items.map((item) => (
            <a key={item.href} href={item.href} className="hf-grid-card">
              <img src={item.src} alt={item.title} />
              <span>
                {item.title}
                {item.caption ? ` · ${item.caption}` : ""}
              </span>
            </a>
          ))}
        </div>
        <a className="btn" href="#contact">
          Get in Touch
        </a>
      </section>
    );
  }

  return (
    <section ref={rootRef} className="hf" aria-label="Projects">
      <div className="hf-progress" aria-hidden="true">
        <i style={{ transform: `scaleX(${total > 1 ? index / (total - 1) : 0})` }} />
      </div>
      <p className="hf-fraction" aria-hidden="true">
        {pad(Math.min(index + 1, total))}
        <span> / {pad(total)}</span>
      </p>

      <div className="hf-scroller">
        <div className="hf-track" ref={trackRef}>
          <article className="hf-slide hf-slide-intro">
            <div className="hf-end-copy">
              <div>
                <p className="hf-kicker">{eyebrow}</p>
                <h2 className="hf-title">
                  The full <em>collection.</em>
                </h2>
                <p className="hf-lede">{body}</p>
              </div>
              <ul className="hf-end-stats">
                <li>
                  <b>{pad(items.length)}</b>
                  <span>developments</span>
                </li>
                <li>
                  <b>{pad(bookingCount)}</b>
                  <span>still booking</span>
                </li>
                <li>
                  <b>{pad(soonCount)}</b>
                  <span>coming soon</span>
                </li>
              </ul>
              <p className="hf-hint">Scroll to move through each development</p>
            </div>
            <aside className="hf-end-aside">
              <img
                className="hf-end-hero"
                src="/images/mmr-pool.jpg"
                alt="Indoor pool at Madina Mall & Residency, Bahria Town Lahore"
                loading="eager"
                decoding="async"
              />
              <img
                className="hf-end-inset"
                src="/images/madina-heights-5/commercial-view.jpeg"
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
              />
              <div className="hf-end-card">
                <p className="hf-kicker">In this reel</p>
                <h3>
                  {items.length} developments
                </h3>
                <dl>
                  <div>
                    <dt>Open</dt>
                    <dd>Madina Heights 4 &amp; 5</dd>
                  </div>
                  <div>
                    <dt>Soon</dt>
                    <dd>Madina Mall &amp; Residency</dd>
                  </div>
                  <div>
                    <dt>City</dt>
                    <dd>Lahore</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </article>

          {items.map((item, i) => (
            <article key={item.href} className="hf-slide hf-slide-project">
              <div className="hf-visual">
                <img
                  className="hf-visual-fill"
                  src={item.src}
                  alt=""
                  aria-hidden="true"
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                />
                <img
                  src={item.src}
                  alt={`${item.title}${item.caption ? `, ${item.caption}` : ""}`}
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
              <div className="hf-meta">
                <p className="hf-index">{pad(i + 1)}</p>
                <div className="hf-meta-copy">
                  <h3>{item.title}</h3>
                  {item.caption ? (
                    <p
                      className={
                        "hf-status" +
                        (/coming/i.test(item.caption)
                          ? " is-soon"
                          : /80%|reserv/i.test(item.caption)
                            ? " is-reserved"
                            : "")
                      }
                    >
                      {item.caption}
                    </p>
                  ) : null}
                </div>
                <a className="hf-more" href={item.href}>
                  View details <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}

          <article className="hf-slide hf-slide-end">
            <div className="hf-end-copy">
              <div>
                <p className="hf-kicker">Next</p>
                <h2 className="hf-title">
                  Start the <em>conversation.</em>
                </h2>
                <p className="hf-lede">
                  Booking, site visits, and payment plans — WhatsApp or call. The office is in Bahria Town.
                </p>
              </div>
              <ul className="hf-end-stats">
                <li>
                  <b>PKR 3 Bn</b>
                  <span>delivered in Lahore</span>
                </li>
                <li>
                  <b>255</b>
                  <span>apartments</span>
                </li>
                <li>
                  <b>85+</b>
                  <span>commercial plots</span>
                </li>
              </ul>
              <div className="hf-actions">
                <a className="btn" href="#contact">
                  Get in Touch
                </a>
                <a className="btn btn-outline" href="projects.html">
                  All projects
                </a>
              </div>
            </div>
            <aside className="hf-end-aside">
              <img
                className="hf-end-hero"
                src="/images/mmr-lounge.jpg"
                alt="Rooftop lounge at Madina Mall & Residency, Bahria Town Lahore"
                loading="lazy"
                decoding="async"
              />
              <img
                className="hf-end-inset"
                src="/images/madina-mall-featured.jpg"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
              <div className="hf-end-card">
                <p className="hf-kicker">Live</p>
                <h3>Madina Mall &amp; Residency</h3>
                <dl>
                  <div>
                    <dt>Phone</dt>
                    <dd>
                      <a href="tel:03124455477">0312 4455477</a>
                    </dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>
                      <a href="mailto:info@realtek.pk">info@realtek.pk</a>
                    </dd>
                  </div>
                  <div>
                    <dt>Office</dt>
                    <dd>Bahria Town, Lahore</dd>
                  </div>
                </dl>
                <a
                  className="hf-end-wa"
                  href="https://wa.me/923124455477?text=Hi%2C%20I%27m%20interested%20in%20a%20RealTek%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp the office <span aria-hidden="true">→</span>
                </a>
              </div>
            </aside>
          </article>
        </div>
      </div>
    </section>
  );
}
