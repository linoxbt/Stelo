import { Users, MessageSquare, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";

const links = [
  { label: "Discord", url: "#", icon: "💬", desc: "Join the Stelo community" },
  { label: "Telegram", url: "#", icon: "📱", desc: "Real-time updates & support" },
  { label: "Twitter / X", url: "#", icon: "🐦", desc: "Follow for announcements" },
  { label: "GitHub", url: "#", icon: "💻", desc: "Open-source contributions" },
];

const stats = [
  { label: "Community Members", value: "12,400+" },
  { label: "Active Governors", value: "845" },
  { label: "Proposals Created", value: "23" },
  { label: "Total Votes Cast", value: "8.2M STL" },
];

export default function Community() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Community Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">Connect with the Stelo community, join discussions, and shape the protocol's future.</p>
      </div>

      <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Card key={i} className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-bold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        {links.map((link) => (
          <Card key={link.label} className="border-border bg-card hover:border-primary/30 transition-all cursor-pointer">
            <CardContent className="flex items-center gap-4 p-4">
              <span className="text-2xl">{link.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{link.label}</p>
                <p className="text-xs text-muted-foreground">{link.desc}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm text-foreground">
            <MessageSquare className="h-4 w-4" /> Recent Discussions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { title: "Proposal: Add support for more collateral types", author: "0x3f4a...8c21", replies: 12 },
            { title: "Stelo Testnet Launch - Feedback Thread", author: "0x7b2e...d4f9", replies: 34 },
            { title: "Feature request: Multi-chain deployment", author: "0x1c9d...a3e7", replies: 8 },
          ].map((thread, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
              <div>
                <p className="text-sm font-medium text-foreground">{thread.title}</p>
                <p className="text-xs text-muted-foreground">by {thread.author} • {thread.replies} replies</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}