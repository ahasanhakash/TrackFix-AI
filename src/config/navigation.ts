import {
  BarChart3,
  Building2,
  Globe,
  LayoutDashboard,
  Megaphone,
  Tags,
} from "lucide-react";

export const dashboardNav = [
  {
    title: "Overview",
    href: "",
    icon: LayoutDashboard,
  },
  {
    title: "GTM Automation",
    href: "/gtm",
    icon: Tags,
  },
  {
    title: "GA4 Automation",
    href: "/ga4",
    icon: BarChart3,
  },
  {
    title: "Google Ads",
    href: "/google-ads",
    icon: Megaphone,
  },
  {
    title: "Search Console",
    href: "/search-console",
    icon: Globe,
  },
  {
    title: "Agency",
    href: "/agency",
    icon: Building2,
  },
] as const;
