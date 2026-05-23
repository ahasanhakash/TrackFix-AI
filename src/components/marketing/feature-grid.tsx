import {
  BarChart3,
  Globe,
  Megaphone,
  Tags,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Tags,
    title: "GTM Automation",
    description:
      "Create containers, install GA4, and enable conversion, call, form, ecommerce, and server-side tagging in minutes.",
  },
  {
    icon: BarChart3,
    title: "GA4 Automation",
    description:
      "Provision properties, events, conversions, audiences, and live report dashboards.",
  },
  {
    icon: Megaphone,
    title: "Google Ads",
    description:
      "Connect MCC, audit campaigns, analyze search terms, manage negatives, AI ad copy, and approval workflows.",
  },
  {
    icon: Globe,
    title: "Search Console",
    description:
      "Connect sites, SEO reports, and keyword performance in one workspace.",
  },
];

export function FeatureGrid() {
  return (
    <section className="mx-auto grid max-w-5xl gap-6 px-6 py-16 sm:grid-cols-2">
      {features.map((feature) => (
        <Card key={feature.title}>
          <CardHeader>
            <feature.icon className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
