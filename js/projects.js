/**
 * RealTek Developers — project data
 * Sourced from the live site (realtekdevelopers.com/js/app.js) and provided brief.
 * Do not invent additional stats.
 */
(function (global) {
  function unitPhotos(folder, label) {
    const out = [];
    for (let i = 1; i <= 8; i++) {
      const n = String(i).padStart(2, "0");
      out.push({
        src: "images/units/" + folder + "/photo-" + n + ".jpg",
        alt: label + " interior " + i
      });
    }
    return out;
  }

  function unitTour(folder, label, hotspots) {
    return {
      plan: "images/units/" + folder + "/floorplan.jpg",
      photos: unitPhotos(folder, label),
      hotspots: hotspots
    };
  }

  const PROJECTS = [
    {
      id: "1",
      name: "La Monte Vista",
      location: "Bahria Town, Lahore",
      address: "166-B Commercial, Bahria Town.",
      status: "SOLD OUT",
      filter: "sold",
      image: "images/project-1.jpg",
      shot: "Exterior",
      type: "Commercial + Apartments",
      area: "08 Marla",
      floors: "B+G+5",
      completion: "2021",
      timeline: "Jun 2019 – Jan 2021",
      overview:
        "Delivered 2021 in 166-B Commercial — 20 apartments and three commercial halls, now fully sold.",
      facts: [
        { label: "Status", value: "SOLD OUT" },
        { label: "ROI", value: "200% increase on investment" },
        { label: "Plan", value: "18 months instalments & possession" },
        { label: "Units", value: "20 apartments, 03 commercial halls" },
        { label: "Area", value: "13,600 sq. ft." }
      ],
      gallery: [{ src: "images/project-1.jpg", alt: "La Monte Vista, Bahria Town Lahore" }]
    },
    {
      id: "2",
      name: "Madina Heights 1",
      location: "Canal Bank Road",
      address: "Sector D, Main Canal Bank Road.",
      status: "SOLD OUT",
      filter: "sold",
      image: "images/project-2.jpg",
      shot: "Exterior",
      type: "Commercial + Apartments",
      area: "08 Marla",
      floors: "B+G+5",
      completion: "2021",
      timeline: "Feb 2020 – March 2021",
      overview:
        "Main Canal Bank Road — 22 apartments and two commercial halls, handed over in 2021.",
      facts: [
        { label: "Status", value: "SOLD OUT" },
        { label: "ROI", value: "200% increase on investment" },
        { label: "Plan", value: "18 months instalments & possession" },
        { label: "Units", value: "22 apartments, 02 commercial halls" },
        { label: "Area", value: "13,000 sq. ft." }
      ],
      gallery: [{ src: "images/project-2.jpg", alt: "Madina Heights 1 on Canal Bank Road" }]
    },
    {
      id: "3",
      name: "Madina Heights 2",
      location: "Sector C, Bahria Town",
      address: "189 A Side Commercial, Sector-C.",
      status: "SOLD OUT",
      filter: "sold",
      image: "images/project-3.jpg",
      shot: "Exterior",
      type: "Commercial + Apartments",
      area: "05 Marla",
      floors: "B+C+5",
      completion: "2023",
      timeline: "Jun 2022 – Jun 2023",
      overview:
        "Sector-C side commercial — 18 apartments and six halls, completed 2023.",
      facts: [
        { label: "Status", value: "SOLD OUT" },
        { label: "ROI", value: "150% increase on investment" },
        { label: "Plan", value: "18 months instalments & possession" },
        { label: "Units", value: "18 apartments, 06 commercial halls" },
        { label: "Area", value: "9,000 sq. ft." }
      ],
      gallery: [{ src: "images/project-3.jpg", alt: "Madina Heights 2 in Sector C, Bahria Town" }]
    },
    {
      id: "4",
      name: "Madina Heights 3",
      location: "Safari Villas",
      address: "42, Umer block Commercial.",
      status: "SOLD OUT",
      filter: "sold",
      image: "images/project-4.jpg",
      shot: "Exterior",
      type: "Commercial + Residential",
      area: "08 Marla",
      floors: "B+G+5",
      completion: "2025",
      timeline: "Aug 2023 – Aug 2025",
      overview:
        "Umer block, next to Safari Villas — 22 apartments and two commercial halls, sold out.",
      facts: [
        { label: "Status", value: "SOLD OUT" },
        { label: "ROI", value: "100% increase on investment" },
        { label: "Plan", value: "24 months instalments & possession" },
        { label: "Units", value: "22 apartments, 02 commercial halls" },
        { label: "Area", value: "13,000 sq. ft." }
      ],
      gallery: [{ src: "images/project-4.jpg", alt: "Madina Heights 3 at Safari Villas" }]
    },
    {
      id: "5",
      name: "Madina Heights 4",
      location: "Safari Villas",
      address: "11,12 Umer block Commercial.",
      status: "80% SOLD OUT",
      filter: "available",
      image: "images/project-5.jpg",
      shot: "Exterior",
      type: "Commercial + Residential",
      area: "16 Marla",
      floors: "B+C+5",
      completion: "2026",
      timeline: "Dec 2023 – June 2026",
      overview:
        "Two plots at Umer block — 54 apartments and 27 shops, still booking on a 30-month plan.",
      facts: [
        { label: "Status", value: "80% SOLD OUT" },
        { label: "ROI", value: "200% increase on investment" },
        { label: "Plan", value: "30 months instalments & possession" },
        { label: "Units", value: "54 apartments, 27 shops" },
        { label: "Area", value: "30,000 sq. ft." }
      ],
      gallery: [{ src: "images/project-5.jpg", alt: "Madina Heights 4 at Safari Villas" }]
    },
    {
      id: "6",
      name: "Madina Heights 5",
      location: "Bahria Town, Lahore",
      address: "166B Commercial, Bahria Town.",
      status: "80% SOLD OUT",
      filter: "available",
      image: "images/project-6.jpg",
      shot: "Exterior",
      type: "Commercial + Residential",
      area: "16 Marla",
      floors: "B+C+6",
      completion: "2026",
      timeline: "March 2024 – Dec 2026",
      overview:
        "Our largest Heights building — 84 apartments and 43 shops, still booking through 2026.",
      facts: [
        { label: "Status", value: "80% SOLD OUT" },
        { label: "ROI", value: "200% increase on investment" },
        { label: "Plan", value: "30 months instalments & possession" },
        { label: "Units", value: "84 apartments, 43 shops" },
        { label: "Area", value: "45,000 sq. ft." }
      ],
      gallery: [{ src: "images/project-6.jpg", alt: "Madina Heights 5 in Bahria Town Lahore" }]
    },
    {
      id: "7",
      name: "Madina Silver Heights",
      location: "Bahria Town, Lahore",
      address: "166B Commercial, Bahria Town.",
      status: "SOLD OUT",
      filter: "sold",
      image: "images/project-7.jpg",
      shot: "Exterior",
      type: "Mixed Use",
      area: "16 Marla",
      floors: "B+G+6",
      completion: "2025",
      timeline: "March 2024 – March 2025",
      overview:
        "Twelve-month plan, 35 apartments — handed over 2025 in 166B Commercial.",
      facts: [
        { label: "Status", value: "SOLD OUT" },
        { label: "ROI", value: "200% increase on investment" },
        { label: "Plan", value: "12 months instalments & possession" },
        { label: "Units", value: "35 apartments, 03 commercial halls" },
        { label: "Area", value: "30,000 sq. ft." }
      ],
      gallery: [{ src: "images/project-7.jpg", alt: "Madina Silver Heights in Bahria Town Lahore" }]
    },
    {
      id: "8",
      name: "Madina Homes",
      location: "Mariam Town",
      address: "Mariam Town (Gated Community).",
      status: "SOLD OUT",
      filter: "sold",
      image: "images/project-8.jpg",
      shot: "Exterior",
      type: "Double-story villas",
      area: "3 Marla",
      floors: "G+1",
      completion: "Ongoing",
      timeline: "Dec 2024 – Ongoing",
      overview:
        "Fifty three-bedroom villas in a gated community — sold out, possession ongoing.",
      facts: [
        { label: "Status", value: "SOLD OUT" },
        { label: "ROI", value: "200% increase on investment" },
        { label: "Plan", value: "36 months instalments & possession" },
        { label: "Units", value: "50 three-bedroom units, 03 commercial halls" },
        { label: "Type", value: "Double-story villas built on 3 marlas" }
      ],
      gallery: [{ src: "images/project-8.jpg", alt: "Madina Homes in Mariam Town" }]
    },
    {
      id: "upcoming",
      name: "Madina Mall & Residency",
      location: "Bahria Town, Lahore",
      address: "Bahria Town, Lahore",
      status: "LIVE",
      filter: "available",
      image: "images/madina-mall-featured.jpg",
      shot: "Evening elevation",
      type: "Luxury Mixed Use",
      area: null,
      floors: null,
      completion: null,
      timeline: "Now live",
      overview:
        "A mixed-use mall and residences in Bahria Town — studio to three-bed, premium retail, owned on a 36-month plan.",
      facts: [
        { label: "Status", value: "Live" },
        { label: "Installment", value: "36 months" },
        { label: "Residences", value: "Studio, 1 bed, 2 bed, 3 bed" }
      ],
      tags: ["Luxury Suites", "Premium Retail", "Limitless ROI"],
      gallery: [
        { src: "images/madina-mall-featured.jpg", alt: "Madina Mall & Residency exterior" },
        { src: "images/madina-mall-exterior-2.jpg", alt: "Madina Mall exterior view" },
        { src: "images/mmr-retail.jpg", alt: "Premium retail interiors" },
        { src: "images/mmr-foodcourt.jpg", alt: "Luxury food court" },
        { src: "images/mmr-pool.jpg", alt: "Swimming pool" },
        { src: "images/mmr-gym.jpg", alt: "Fitness centre" },
        { src: "images/mmr-spa.jpg", alt: "Sauna and spa" },
        { src: "images/mmr-lounge.jpg", alt: "Roof lounge" },
        { src: "images/mmr-jacuzzi.jpg", alt: "Sky jacuzzi" },
        { src: "images/mmr-studio.jpg", alt: "Studio apartment render" },
        { src: "images/mmr-1bed.jpg", alt: "One-bed apartment render" },
        { src: "images/mmr-2bed.jpg", alt: "Two-bed apartment render" }
      ],
      amenityGroups: [
        {
          id: "lifestyle",
          label: "Lifestyle",
          items: [
            "Roof Lounge",
            "Food Court",
            "Sky Jacuzzi",
            "Rooftop BBQ",
            "Cafeteria",
            "Snooker Area",
            "Paddle Tennis",
            "Shopping Mall"
          ]
        },
        {
          id: "wellness",
          label: "Wellness",
          items: [
            "Swimming Pool",
            "Gym",
            "Sauna & Spa",
            "Yoga Platform",
            "Kids Day Care",
            "Fitness Center"
          ]
        },
        {
          id: "convenience",
          label: "Convenience",
          items: [
            "Smart Entry",
            "Grocery Mart",
            "Valet Parking",
            "Laundry",
            "Pharmacy",
            "24/7 Security",
            "Passenger Lifts",
            "Room Service",
            "House Keeping",
            "WiFi Access",
            "CCTV",
            "E-Monitoring"
          ]
        }
      ],
      floorProgram: [
        { name: "Basement", use: "Parking & Services" },
        { name: "Ground Floor", use: "Premium Retail" },
        { name: "1st Floor", use: "Brands & Commercial" },
        { name: "2nd Floor", use: "Fashion & Lifestyle" },
        { name: "Food Court", use: "Culinary Hub" },
        { name: "Typical Floors", use: "Luxury Residences" }
      ],
      paymentPlans: [
        {
          title: "Commercial 1% Payment Plan",
          note: "36 months installment",
          rows: [
            ["Basement", "16,000", "17.5%", "17.5%", "1%", "4%", "5%"],
            ["Ground Floor", "35,000", "17.5%", "17.5%", "1%", "4%", "5%"],
            ["1st Floor", "24,000", "17.5%", "17.5%", "1%", "4%", "5%"],
            ["2nd Floor", "18,000", "17.5%", "17.5%", "1%", "4%", "5%"]
          ]
        },
        {
          title: "Residential 1% Payment Plan",
          note: "36 months installment",
          rows: [["Apartment", "13,500", "17.5%", "17.5%", "1%", "4%", "5%"]]
        }
      ],
      paymentNotes: [
        "Front facing category charges will be 15%.",
        "All areas are approx and gross.",
        "All category charges that may apply will be applicable."
      ],
      floorPlanImages: [
        { src: "images/madina-mall-floor-basement.jpg", alt: "Basement floor plan" },
        { src: "images/madina-mall-floor-ground.jpg", alt: "Ground floor plan" },
        { src: "images/madina-mall-floor-1-2.jpg", alt: "1st and 2nd floor plan" },
        { src: "images/madina-mall-floor-amenities.jpg", alt: "Amenities floor plan" },
        { src: "images/madina-mall-apt-studio.jpg", alt: "Studio apartment visual" },
        { src: "images/madina-mall-apt-1bed.jpg", alt: "One-bed apartment visual" },
        { src: "images/madina-mall-apt-2bed.jpg", alt: "Two-bed apartment visual" }
      ],
      dossier: {
        copy:
          "A mixed-use corner in Bahria Town: premium retail at street level, residences above, and a full amenity deck. Studios, one-beds, two-beds, and three-beds on a 36-month, 1% plan — construction-linked, issued in writing at booking.",
        hero: "images/hero-1920.jpg",
        locImage: "images/madina-mall-exterior-2.jpg",
        caption: "Madina Mall & Residency — evening elevation",
        imageKind: "Render",
        stats: [
          { label: "Installment", value: "36 months" },
          { label: "Unit types", value: "Studio / 1 Bed / 2 Bed / 3 Bed" },
          { label: "Residential rate", value: "Rs 13,500 / sq. ft." }
        ],
        rate: 13500,
        months: 36,
        units: [
          {
            id: "studio",
            name: "Studio",
            area: 400,
            blurb: "A compact first home — living, kitchenette, and bath on one plate. The fastest plan to complete.",
            hero: "images/mmr-studio.jpg",
            plan: "images/units/studio/floorplan.jpg",
            gallery: unitPhotos("studio", "Studio apartment"),
            tour: unitTour("studio", "Studio", [
              { id: "living", label: "Living", top: "58%", left: "38%", start: 0 },
              { id: "kitchen", label: "Kitchen", top: "34%", left: "46%", start: 1 },
              { id: "bath", label: "Bathroom", top: "52%", left: "18%", start: 4 }
            ])
          },
          {
            id: "1bed",
            name: "1 Bed",
            area: 550,
            blurb: "A private bedroom plus an open living kitchen — the most requested residential plate.",
            hero: "images/mmr-1bed.jpg",
            plan: "images/units/1-bed/floorplan.jpg",
            gallery: unitPhotos("1-bed", "One-bed apartment"),
            tour: unitTour("1-bed", "1 Bed", [
              { id: "living", label: "Living", top: "48%", left: "58%", start: 0 },
              { id: "kitchen", label: "Kitchen", top: "36%", left: "28%", start: 2 },
              { id: "bedroom", label: "Bedroom", top: "62%", left: "72%", start: 4 },
              { id: "bath", label: "Bathroom", top: "30%", left: "72%", start: 6 }
            ])
          },
          {
            id: "2bed",
            name: "2 Bed",
            area: 850,
            blurb: "Two bedrooms, a family living room, and a terrace line. Built for Bahria Town living.",
            hero: "images/mmr-2bed.jpg",
            plan: "images/units/2-bed/floorplan.jpg",
            gallery: unitPhotos("2-bed", "Two-bed apartment"),
            tour: unitTour("2-bed", "2 Bed", [
              { id: "living", label: "Living", top: "52%", left: "42%", start: 0 },
              { id: "kitchen", label: "Kitchen", top: "34%", left: "68%", start: 1 },
              { id: "bed-1", label: "Bedroom 1", top: "68%", left: "22%", start: 3 },
              { id: "bed-2", label: "Bedroom 2", top: "68%", left: "78%", start: 5 },
              { id: "bath", label: "Bathroom", top: "28%", left: "22%", start: 7 }
            ])
          }
        ],
        floors: [
          {
            id: "basement",
            name: "Basement",
            desc: "Parking, tanks, and 27 numbered shop units on wide passages.",
            units: "27 shops",
            sizes: "See blueprint",
            rate: 16000,
            use: "Parking & services",
            image: "images/madina-mall-floor-basement.jpg"
          },
          {
            id: "ground",
            name: "Ground",
            desc: "Eighteen shopfronts around the central escalators — the main retail plate.",
            units: "18 shops",
            sizes: "See blueprint",
            rate: 35000,
            use: "Premium retail",
            image: "images/madina-mall-floor-ground.jpg"
          },
          {
            id: "first",
            name: "1st Floor",
            desc: "Brands and commercial suites on the upper mall plate.",
            units: "25 shops",
            sizes: "See blueprint",
            rate: 24000,
            use: "Brands & commercial",
            image: "images/madina-mall-floor-1-2.jpg"
          },
          {
            id: "second",
            name: "2nd Floor",
            desc: "Fashion and lifestyle shopfronts — same plate, lower rate.",
            units: "25 shops",
            sizes: "See blueprint",
            rate: 18000,
            use: "Fashion & lifestyle",
            image: "images/madina-mall-floor-1-2.jpg"
          },
          {
            id: "amenities",
            name: "Amenities",
            desc: "Pool, paddle, gym, and lounge on the amenity deck — for residents, not bolted on later.",
            units: "Deck",
            sizes: "Pool · paddle · gym",
            rate: null,
            use: "Residents’ amenities",
            image: "images/madina-mall-floor-amenities.jpg"
          }
        ],
        amenityShots: [
          { src: "images/mmr-pool.jpg", alt: "Swimming pool" },
          { src: "images/mmr-gym.jpg", alt: "Fitness centre" },
          { src: "images/mmr-spa.jpg", alt: "Sauna and spa" },
          { src: "images/mmr-lounge.jpg", alt: "Roof lounge" },
          { src: "images/mmr-jacuzzi.jpg", alt: "Sky jacuzzi" },
          { src: "images/mmr-foodcourt.jpg", alt: "Food court" },
          { src: "images/mmr-retail.jpg", alt: "Premium retail" },
          { src: "images/mmr-paddle.jpg", alt: "Paddle tennis" }
        ],
        updates: [
          {
            title: "Now live",
            note: "Booking open",
            body: "Madina Mall & Residency is live. WhatsApp for the current schedule, unit list, and a site visit."
          }
        ],
        faqs: [
          {
            q: "How long is the payment plan?",
            a: "36 months. Booking 17.5%, confirmation 17.5%, 1% monthly, 4% half-yearly (six times), 5% on possession."
          },
          {
            q: "What residences are offered?",
            a: "Studio, 1 bed, 2 bed, and 3 bed. Floor plates and interiors are published for studio, 1 bed, and 2 bed. Three-bed drawings are shared at booking."
          },
          {
            q: "Is the schedule rate-linked?",
            a: "No. It is construction-linked and issued in writing at booking. Front-facing category charges are 15%. Areas are approximate and gross."
          },
          {
            q: "How do I book?",
            a: "WhatsApp 0312 4455477 or call the same number. RealTek will send availability and the written schedule."
          }
        ],
        mapsQuery: "Madina Mall and Residency Bahria Town Lahore"
      }
    }
  ];

  function getProject(id) {
    const key = String(id == null ? "" : id);
    return PROJECTS.find((p) => p.id === key) || null;
  }

  function projectHref(id) {
    return "project.html?id=" + encodeURIComponent(id);
  }

  function whatsappHref(message) {
    const text =
      message || "Hi, I'm interested in a RealTek Developers project in Lahore.";
    return "https://wa.me/923124455477?text=" + encodeURIComponent(text);
  }

  global.RT = global.RT || {};
  global.RT.PROJECTS = PROJECTS;
  global.RT.getProject = getProject;
  global.RT.projectHref = projectHref;
  global.RT.whatsappHref = whatsappHref;
})(window);
