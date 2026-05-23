export const siteConfig = {
  name: "TrackFix AI",
  description:
    "Automate GTM, GA4, Google Ads, and Search Console — built for agencies and growth teams.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  links: {
    docs: "/docs",
    pricing: "/pricing",
  },
} as const;
