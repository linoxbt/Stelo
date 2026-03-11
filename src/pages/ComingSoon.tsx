import { useParams, useNavigate } from "react-router-dom";
import { Clock, Users, Shield, Gavel, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";

const features: Record<string, { icon: React.ReactNode; title: string; description: string; details: string[] }> = {
  community: {
    icon: <Users className="h-8 w-8" />,
    title: "Community Hub",
    description: "A dedicated space for the Stelo community to connect, discuss, and shape the protocol's future.",
    details: [
      "Discussion forums and proposal threads",
      "Community-driven analytics",
      "Ambassador programs",
      "Discord and Telegram integration",
    ],
  },
  liquidation: {
    icon: <Shield className="h-8 w-8" />,
    title: "Liquidation",
    description: "A public liquidation engine ensuring protocol solvency with incentivized position management.",
    details: [
      "Public dashboard with at-risk positions",
      "Bot-friendly liquidation API",
      "5% liquidation bonus",
      "Partial and full liquidation support",
    ],
  },
  governance: {
    icon: <Gavel className="h-8 w-8" />,
    title: "Governance",
    description: "On-chain governance powered by STL token holders to shape the future of Stelo.",
    details: [
      "On-chain proposal creation and voting",
      "Token-weighted governance",
      "Parameter adjustment proposals",
      "Treasury management",
    ],
  },
};

export default function ComingSoon() {
  const { feature } = useParams<{ feature: string }>();
  const navigate = useNavigate();
  const data = features[feature || ""] || features.community;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-lg">
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              {data.icon}
            </div>
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary">Coming Soon</span>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">{data.title}</h1>
            <p className="mb-6 text-sm text-muted-foreground">{data.description}</p>
            <div className="mb-6 w-full rounded-lg border border-border bg-secondary/30 p-4 text-left">
              <p className="mb-2 text-xs font-semibold text-foreground">Planned Features</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {data.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}