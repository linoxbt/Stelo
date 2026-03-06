import { useState, useEffect } from "react";
import { Bell, ShieldCheck, Wallet, Mail, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NetworkBadge } from "@/components/NetworkBadge";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import { useVirtualState } from "@/hooks/use-virtual-state";

export default function HealthMonitor() {
  const { connected } = useWalletState();
  const { address } = useAccount();
  const { toast } = useToast();
  const vs = useVirtualState(address);
  const [saving, setSaving] = useState(false);
  const [, setTick] = useState(0);

  // Re-render for dynamic HF
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const hf = vs.calculateHealthFactor();
  const hfDisplay = hf === Infinity ? "∞" : hf.toFixed(2);
  const hfColor = hf === Infinity ? "text-muted-foreground" : hf >= 2 ? "text-green-500" : hf >= 1.5 ? "text-yellow-500" : hf >= 1.2 ? "text-orange-500" : "text-red-500";
  const hfBorder = hf === Infinity ? "border-muted/30" : hf >= 2 ? "border-green-500/30" : hf >= 1.5 ? "border-yellow-500/30" : hf >= 1.2 ? "border-orange-500/30" : "border-red-500/30";
  const hfLabel = hf === Infinity ? "No borrows" : hf >= 2 ? "Safe" : hf >= 1.5 ? "Early Warning" : hf >= 1.2 ? "Caution" : hf >= 1 ? "High Risk" : "Liquidation!";

  const alerts = vs.state.alertSettings;

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast({ title: "Settings saved", description: "Alert preferences saved to your wallet" });
    setSaving(false);
  };

  if (!connected) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-bold text-foreground">Connect Your Wallet</h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">Connect your wallet to monitor health factors.</p>
          <WalletButton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Health & Liquidation Monitor</h1>
        <NetworkBadge />
      </div>

      <Card className="mb-6 glow-purple border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-3 p-4">
          <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm text-primary">Monitor your health factors and set up alerts across your positions.</p>
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="text-sm text-foreground">Overall Health</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <div className={`flex h-36 w-36 items-center justify-center rounded-full border-4 ${hfBorder} bg-muted/5`}>
              <span className={`text-4xl font-bold ${hfColor}`}>{hfDisplay}</span>
            </div>
            <p className={`text-sm font-medium ${hfColor}`}>{hfLabel}</p>

            {/* Positions breakdown */}
            {vs.state.supplies.length > 0 && (
              <div className="w-full mt-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Collateral</p>
                {vs.state.supplies.map((s, i) => (
                  <div key={i} className="flex justify-between text-xs rounded bg-secondary/30 p-2">
                    <span className="text-foreground">{s.amount.toFixed(2)} {s.asset}</span>
                    <span className="text-muted-foreground">${(s.amount * (vs.prices[s.asset] || 0)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
            {vs.state.borrows.length > 0 && (
              <div className="w-full mt-2 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Debt</p>
                {vs.state.borrows.map((b, i) => (
                  <div key={i} className="flex justify-between text-xs rounded bg-secondary/30 p-2">
                    <span className="text-foreground">{b.amount.toFixed(2)} {b.asset}</span>
                    <span className="text-muted-foreground">${(b.amount * (vs.prices[b.asset] || 0)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-foreground">
              <Bell className="h-4 w-4" /> Alert Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "at15" as const, label: "Alert at HF ≤ 1.5", desc: "Early warning" },
              { key: "at12" as const, label: "Alert at HF ≤ 1.2", desc: "Caution zone" },
              { key: "at10" as const, label: "Alert at HF ≤ 1.0", desc: "Liquidation risk" },
            ].map((a) => (
              <div key={a.key} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
                <Switch
                  checked={alerts[a.key]}
                  onCheckedChange={(v) => vs.updateAlertSettings({ [a.key]: v })}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Notification Channels */}
      <Card className="mb-6 border-border bg-card">
        <CardHeader><CardTitle className="text-sm text-foreground">Notification Channels</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-muted-foreground">Email Address</label>
              <Input
                placeholder="your@email.com"
                value={alerts.email}
                onChange={(e) => vs.updateAlertSettings({ email: e.target.value })}
                className="border-border bg-secondary"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Send className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-muted-foreground">Telegram Username</label>
              <Input
                placeholder="@username"
                value={alerts.telegram}
                onChange={(e) => vs.updateAlertSettings({ telegram: e.target.value })}
                className="border-border bg-secondary"
              />
            </div>
          </div>
          <Button onClick={handleSave} className="w-full" disabled={saving}>
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Notification Settings"}
          </Button>
        </CardContent>
      </Card>

      {/* Positions Health */}
      <Card className="mb-6 border-border bg-card">
        <CardHeader><CardTitle className="text-sm text-foreground">Positions Health</CardTitle></CardHeader>
        <CardContent>
          {vs.state.supplies.length === 0 && vs.state.borrows.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-center">
              <p className="text-sm text-muted-foreground">No positions to display</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground border-b border-border pb-2">
                <span>Total Collateral</span>
                <span className="text-foreground">${vs.state.supplies.reduce((s, p) => s + p.amount * (vs.prices[p.asset] || 0), 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground border-b border-border pb-2">
                <span>Total Debt</span>
                <span className="text-foreground">${vs.state.borrows.reduce((s, p) => s + p.amount * (vs.prices[p.asset] || 0), 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Borrowing Power Used</span>
                <span className="text-foreground">
                  {vs.state.supplies.length > 0
                    ? ((vs.state.borrows.reduce((s, p) => s + p.amount * (vs.prices[p.asset] || 0), 0) /
                        (vs.state.supplies.reduce((s, p) => s + p.amount * (vs.prices[p.asset] || 0) * 0.75, 0) || 1)) * 100).toFixed(1) + "%"
                    : "0%"
                  }
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
