export const NAV_LINKS = [
  { title: "Home", href: "/" },
  {
    title: "Shop",
    href: "/shop",
    megamenu: [
      {
        title: "Seeds",
        items: [
          { title: "Crop Seeds", href: "/shop/seeds/crop" },
          { title: "Vegetable Seeds", href: "/shop/seeds/vegetable" },
          { title: "Flower Seeds", href: "/shop/seeds/flower" },
        ],
      },
      {
        title: "Bio Remediation",
        items: [
          { title: "Water Treatment", href: "/shop/bio/water" },
          { title: "Soil Health", href: "/shop/bio/soil" },
          { title: "STP Solutions", href: "/shop/bio/stp" },
        ],
      },
      {
        title: "Probiotics",
        items: [
          { title: "Aquaculture", href: "/shop/probiotics/aqua" },
          { title: "Poultry", href: "/shop/probiotics/poultry" },
        ],
      },
    ],
  },
  {
    title: "By Farm Segment",
    href: "/segments",
    megamenu: [
      {
        title: "For Professionals",
        items: [
          { title: "Crop Farmers", href: "/segments/crop-farmers" },
          { title: "Pond Champions", href: "/segments/pond-champions" },
          { title: "Poultry Pro", href: "/segments/poultry-pro" },
        ],
      },
      {
        title: "For Enthusiasts",
        items: [
          { title: "Organic Newbees", href: "/segments/organic-newbees" },
          { title: "Home Gardeners", href: "/segments/home-gardeners" },
        ],
      },
    ],
  },
  { title: "Organic Farming", href: "/organic-farming" },
  { title: "Farm Equipments", href: "/equipments" },
  { title: "Services", href: "/services" },
  { title: "About", href: "/about" },
];

export const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600",
    title: "Innovating Agriculture Since 1997",
    description: "Empowering farmers with bio-science solutions for a sustainable future.",
    cta: "Get Quote",
    href: "/quote",
  },
  {
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1600",
    title: "Premium Quality Seeds",
    description: "High-yield varieties tailored for Indian climatic conditions.",
    cta: "Shop Seeds",
    href: "/shop/seeds",
  },
  {
    image: "https://images.unsplash.com/photo-1530836361253-ee1502760c2a?w=1600",
    title: "Expert Consultancy",
    description: "Professional field visits and online support for your farm.",
    cta: "Book Visit",
    href: "/services",
  },
];

export const SPECIALIZATIONS = [
  {
    title: "Aquaculture",
    description: "Advanced probiotics and water conditioners for high-yield shrimp and fish farming.",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800",
    href: "/segments/pond-champions",
  },
  {
    title: "Poultry",
    description: "Bio-science based feed supplements and health solutions for thriving poultry farms.",
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800",
    href: "/segments/poultry-pro",
  },
  {
    title: "STP Solutions",
    description: "Eco-friendly bacterial cultures for efficient Sewage Treatment Plant management.",
    image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800",
    href: "/shop/bio/stp",
  },
];

export const FEATURED_PRODUCTS = [
  {
    id: "1",
    title: "Bio-Fertilizer Pro",
    price: 1200,
    image: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=400",
    category: "Bio-Fertilizer",
    href: "/products/bio-fertilizer-pro",
  },
  {
    id: "2",
    title: "Aquaculture Booster",
    price: 850,
    image: "https://images.unsplash.com/photo-1533038590840-1cde6e6e40df?w=400",
    category: "Aquaculture",
    href: "/products/aquaculture-booster",
  },
  {
    id: "3",
    title: "Premium Paddy Seeds",
    price: 450,
    image: "https://images.unsplash.com/photo-1536633340742-19f8755f4d47?w=400",
    category: "Seeds",
    href: "/products/premium-paddy-seeds",
  },
  {
    id: "4",
    title: "Organic Pest Control",
    price: 600,
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400",
    category: "Organic",
    href: "/products/organic-pest-control",
  },
];

export const LATEST_NEWS = [
  {
    id: "1",
    title: "Maximizing Yield in Monsoon",
    excerpt: "Learn the best practices for soil management during the rainy season.",
    date: "2026-01-05",
    image: "https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?w=400",
    href: "/news/monsoon-tips",
  },
  {
    id: "2",
    title: "K N Bio Sciences Factory Tour",
    excerpt: "Take a peek inside our state-of-the-art tissue culture lab.",
    date: "2025-12-20",
    image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=400",
    href: "/news/factory-tour",
  },
];
