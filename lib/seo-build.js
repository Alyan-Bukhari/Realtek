/**
 * Build-time SEO — canonical URLs, social tags, sitemap, robots.
 * Primary domain: realtekdevelopers.com
 */

export const SITE = (process.env.SITE_URL || "https://realtekdevelopers.com").replace(/\/$/, "");

export const DOMAINS = {
  main: "realtekdevelopers.com",
  heights: "madinaheights.com",
  mall: "madinamallandresidency.com"
};

/**
 * Single source of truth: project id -> clean URL slug.
 * Clean URL: /projects/<slug>/
 */
export const PROJECT_SLUGS = {
  1: "la-monte-vista",
  2: "madina-heights-1",
  3: "madina-heights-2",
  4: "madina-heights-3",
  5: "madina-heights-4",
  6: "madina-heights-5",
  7: "madina-silver-heights",
  8: "madina-homes",
  upcoming: "madina-mall-residency"
};

export function projectSlug(id) {
  return PROJECT_SLUGS[String(id)] || String(id);
}

export function projectPath(id) {
  return "/projects/" + projectSlug(id) + "/";
}

export const STATIC_PAGES = [
  {
    file: "index.html",
    path: "/",
    title: "RealTek Developers | Elevating Real Estate in Pakistan",
    description:
      "RealTek Developers — Sharia-compliant residential and commercial projects in Lahore. Madina Heights, Madina Mall & Residency, and eight delivered developments across Bahria Town.",
    image: "images/hero-1920.jpg",
    type: "website"
  },
  {
    file: "about-us/index.html",
    path: "/about-us/",
    title: "About Us | RealTek Developers",
    description:
      "About RealTek Developers — Hamza Ilyas Sheikh, CEO, 13+ years in Pakistani real estate, eight delivered projects, and a 100% Riba-free, customer-centric practice.",
    image: "images/ceo.jpg",
    type: "profile"
  },
  {
    file: "projects/index.html",
    path: "/projects/",
    title: "Projects | RealTek Developers",
    description:
      "Every RealTek development in one place — delivered buildings, available units, and Madina Mall & Residency. Status, locations, and project pages across Lahore.",
    image: "images/madina-mall-featured.jpg",
    type: "website"
  },
  {
    file: "blogs/index.html",
    path: "/blogs/",
    title: "Realtek Insights & Property Guides | RealTek Developers Blog",
    description:
      "Realtek Insights & Property Guides — practical advice on buying, investing and living in RealTek Developers communities across Lahore, Pakistan.",
    image: "/images/hero-1920.jpg",
    type: "website",
    jsonLd: "blog"
  },
  {
    file: "contact-us/index.html",
    path: "/contact-us/",
    title: "Contact Us | RealTek Developers — Lahore, Pakistan",
    description:
      "Contact RealTek Developers to learn more about our projects, available units and investment opportunities in Lahore, Pakistan. Call 0312 4455477 or email info@realtek.pk.",
    image: "/images/hero-1920.jpg",
    type: "website",
    jsonLd: "contact"
  },
  {
    file: "virtual-tour/index.html",
    path: "/virtual-tour/",
    title: "Take a Virtual Tour | RealTek Developers",
    description:
      "Walk through RealTek Developers residences in 360° — explore Madina Heights 4 studio, 1-bed and 2-bed apartments with interactive virtual tours.",
    image: "/images/madina-heights-4/elevation/elevation-01.jpg",
    type: "website",
    jsonLd: "webpage",
    jsonLdName: "Take a Virtual Tour | RealTek Developers",
    jsonLdDescription:
      "Walk through RealTek Developers residences in 360° — explore Madina Heights 4 studio, 1-bed and 2-bed apartments with interactive virtual tours."
  },
  {
    file: "3d-models/index.html",
    path: "/3d-models/",
    title: "View 3D Models | RealTek Developers",
    description:
      "Explore RealTek Developers apartments in interactive 3D — rotate, zoom and walk around studio, 1-bed and 2-bed residences right in your browser.",
    image: "/images/madina-heights-4/elevation/elevation-01.jpg",
    type: "website",
    jsonLd: "webpage",
    jsonLdName: "View 3D Models | RealTek Developers",
    jsonLdDescription:
      "Explore RealTek Developers apartments in interactive 3D — rotate, zoom and walk around studio, 1-bed and 2-bed residences right in your browser."
  }
];

export const SERIES_PAGES = [
  {
    file: "projects/madina-heights/index.html",
    source: "projects/index.html",
    path: "/projects/madina-heights/",
    title: "Madina Heights | Real Estate in Lahore",
    description:
      "Madina Heights by RealTek Developers — commercial and residential towers across Bahria Town and Lahore. View every phase, location, and booking status.",
    image: "images/madina-heights-4/elevation/elevation-01.jpg",
    series: "madina-heights",
    domain: DOMAINS.heights
  }
];

export function absUrl(path) {
  return SITE + (path.startsWith("/") ? path : "/" + path);
}

export function absImage(image) {
  if (!image) return absUrl("images/hero-1920.jpg");
  if (/^https?:\/\//i.test(image)) return image;
  return absUrl(image);
}

export function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function seoHeadBlock(page) {
  const url = absUrl(page.path);
  const image = absImage(page.image);
  const canonical = page.canonical ? absUrl(page.canonical) : url;

  return (
    `<link rel="canonical" href="${esc(canonical)}">\n` +
    `  <meta name="robots" content="index, follow, max-image-preview:large">\n` +
    `  <meta name="author" content="RealTek Developers">\n` +
    `  <meta property="og:site_name" content="RealTek Developers">\n` +
    `  <meta property="og:locale" content="en_PK">\n` +
    `  <meta property="og:url" content="${esc(url)}">\n` +
    `  <meta property="og:image" content="${esc(image)}">\n` +
    `  <meta property="og:image:alt" content="${esc(page.title)}">\n` +
    `  <meta name="twitter:card" content="summary_large_image">\n` +
    `  <meta name="twitter:title" content="${esc(page.title)}">\n` +
    `  <meta name="twitter:description" content="${esc(page.description)}">\n` +
    `  <meta name="twitter:image" content="${esc(image)}">`
  );
}

export function orgJsonLd() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "RealTek Developers",
    url: absUrl("/"),
    logo: absImage("images/favicon.svg"),
    image: absImage("images/hero-1920.jpg"),
    telephone: "+923124455477",
    email: "info@realtek.pk",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      addressCountry: "PK"
    },
    areaServed: "Lahore, Pakistan",
    sameAs: [
      "https://www.facebook.com/realtekdevelopers",
      "https://www.instagram.com/realtekdevelopers",
      "https://www.youtube.com/@realtekdevelopers"
    ]
  });
}

export function projectJsonLd(project) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: project.name,
    description: project.overview,
    url: absUrl(projectPath(project.id)),
    image: absImage(project.image),
    address: {
      "@type": "PostalAddress",
      streetAddress: project.address || project.location,
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      addressCountry: "PK"
    }
  });
}

export function blogJsonLd() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Realtek Insights & Property Guides",
    url: absUrl("/blogs/"),
    description:
      "Buying tips, investment analysis, and project updates from RealTek Developers, Lahore.",
    publisher: {
      "@type": "Organization",
      name: "RealTek Developers",
      url: absUrl("/"),
      logo: absImage("images/favicon.svg")
    }
  });
}

const CONTACT_FAQS = [
  {
    q: "Which RealTek Developers projects are currently available?",
    a: "RealTek Developers offers residential and commercial real estate opportunities. Contact our team to learn about currently available projects, units, and the latest inventory."
  },
  {
    q: "How can I get the latest price list?",
    a: "You can request the latest price list by submitting an inquiry through our Contact Us form. Our sales team will provide the available pricing details and help you explore suitable options."
  },
  {
    q: "What payment plans are available?",
    a: "Payment plans may vary depending on the project and unit type. Contact our sales team for details about available instalment plans, down payments, and payment schedules."
  },
  {
    q: "How can I book an apartment or commercial unit?",
    a: "To book an apartment or commercial unit, contact our sales team to check availability, review pricing, and understand the booking requirements. Our representatives will guide you through the next steps."
  },
  {
    q: "Can I schedule a site visit?",
    a: "Yes, you can contact our team to arrange a site visit. Our representatives can help coordinate a convenient date and time so you can explore the project and its facilities."
  },
  {
    q: "Where are RealTek Developers' projects located?",
    a: "For project locations, addresses, and directions, please contact our sales team or submit an inquiry through our Contact Us page. Our team will provide the relevant location details."
  },
  {
    q: "How can I speak to a sales representative?",
    a: "You can reach out through the Contact Us page on our website. Share your name, contact information, and inquiry, and our team will assist you with project details, pricing, availability, and booking information."
  }
];

export function faqJsonLd() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CONTACT_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  });
}

export function contactJsonLd() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        name: "Contact Us | RealTek Developers — Lahore, Pakistan",
        url: absUrl("/contact-us/"),
        description:
          "Contact RealTek Developers to learn more about our projects, available units and investment opportunities in Lahore, Pakistan."
      },
      JSON.parse(faqJsonLd())
    ]
  });
}

export function webPageJsonLd(page) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.jsonLdName || page.title,
    description: page.jsonLdDescription || page.description,
    url: absUrl(page.path),
    publisher: {
      "@type": "Organization",
      name: "RealTek Developers",
      url: absUrl("/"),
      logo: absImage("images/favicon.svg")
    }
  });
}

export function pageJsonLd(kind, page) {
  if (kind === "blog") return blogJsonLd();
  if (kind === "faq") return faqJsonLd();
  if (kind === "contact") return contactJsonLd();
  if (kind === "webpage") return webPageJsonLd(page || {});
  return null;
}

export function injectSeo(html, page, extraJsonLd) {
  let out = html;

  out = out.replace(/<meta property="og:image" content="[^"]*">/, "");
  if (out.includes('rel="canonical"')) {
    out = out.replace(/<link rel="canonical" href="[^"]*">\s*/g, "");
  }
  if (out.includes('name="twitter:card"')) {
    out = out.replace(/<meta name="twitter:[^"]+" content="[^"]*">\s*/g, "");
  }
  if (out.includes('property="og:url"')) {
    out = out.replace(/<meta property="og:url" content="[^"]*">\s*/g, "");
  }
  if (out.includes('property="og:site_name"')) {
    out = out.replace(/<meta property="og:site_name" content="[^"]*">\s*/g, "");
  }

  const block = seoHeadBlock(page);
  out = out.replace(
    /<meta property="og:type" content="[^"]*">/,
    `<meta property="og:type" content="${page.type || "website"}">\n  ${block}`
  );

  if (extraJsonLd) {
    const script =
      `\n  <script type="application/ld+json">${extraJsonLd}</script>`;
    if (!out.includes("application/ld+json")) {
      out = out.replace("</head>", script + "\n</head>");
    }
  }

  if (page.dataSeries) {
    out = out.replace("<body>", `<body data-seo-series="${esc(page.dataSeries)}">`);
  }
  if (page.dataProject) {
    out = out.replace("<body>", `<body data-seo-project="${esc(page.dataProject)}">`);
  }

  return out;
}

export function sitemapXml(urls) {
  const body = urls
    .map(
      (u) =>
        "  <url>\n    <loc>" +
        esc(u.loc) +
        "</loc>\n    <changefreq>" +
        (u.changefreq || "monthly") +
        "</changefreq>\n    <priority>" +
        (u.priority || "0.7") +
        "</priority>\n  </url>"
    )
    .join("\n");
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    body +
    "\n</urlset>\n"
  );
}

export function robotsTxt() {
  return (
    "User-agent: *\nAllow: /\n\nSitemap: " +
    absUrl("/sitemap.xml") +
    "\n"
  );
}
