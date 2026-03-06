import { Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NetworkBadge } from "@/components/NetworkBadge";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { useVirtualState } from "@/hooks/use-virtual-state";
import { TokenIcon } from "@/components/TokenIcon";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Positions() {
  const { connected } = useWalletState();
  const { address } = useAccount();
  const navigate = useNavigate();
  const vs = useVirtualState(address);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async (index: number) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const ok = vs.withdraw(index);
    if (ok) toast({ title: "Withdrawn", description: "Assets + interest returned to wallet" });
    else toast({ title: "Error", variant: "destructive" });
    setLoading(false);
  };

  const handleRepay = async (index: number) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const ok = vs.repay(index);
    if (ok) toast({ title: "Repaid", description: "Debt position closed" });
    else toast({ title: "Insufficient balance", variant: "destructive" });
    setLoading(false);
  };

  if (!connected) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-bold text-foreground">Connect Your Wallet</h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">Connect your wallet to view and manage your positions.</p>
          <WalletButton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">My Positions</h1>
        <NetworkBadge />
      </div>

      <Tabs defaultValue="supplies">
        <TabsList className="mb-4 bg-secondary">
          <TabsTrigger value="supplies">Supplies ({vs.state.supplies.length})</TabsTrigger>
          <TabsTrigger value="borrows">Borrows ({vs.state.borrows.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="supplies">
          {vs.state.supplies.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="flex h-40 flex-col items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">No supplied assets</p>
                <Button size="sm" className="mt-4" onClick={() => navigate("/markets")}>Supply Assets</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {vs.state.supplies.map((pos, i) => {
                const elapsed = (Date.now() - pos.timestamp) / (365.25 * 24 * 60 * 60 * 1000);
                const interest = pos.amount * (pos.apy / 100) * elapsed;
                return (
                  <Card key={i} className="border-border bg-card">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <TokenIcon symbol={pos.asset} />
                        <div>
                          <p className="text-sm font-bold text-foreground">{pos.amount.toFixed(4)} {pos.asset}</p>
                          <p className="text-xs text-green-500">+{interest.toFixed(6)} interest • {pos.apy}% APY</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" disabled={loading} onClick={() => handleWithdraw(i)}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Withdraw"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="borrows">
          {vs.state.borrows.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="flex h-40 flex-col items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">No borrowed assets</p>
                <p className="mt-1 text-xs text-muted-foreground">Supply collateral first, then borrow in Markets</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {vs.state.borrows.map((pos, i) => {
                const elapsed = (Date.now() - pos.timestamp) / (365.25 * 24 * 60 * 60 * 1000);
                const interest = pos.amount * (pos.apy / 100) * elapsed;
                return (
                  <Card key={i} className="border-border bg-card">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <TokenIcon symbol={pos.asset} />
                        <div>
                          <p className="text-sm font-bold text-foreground">{pos.amount.toFixed(4)} {pos.asset}</p>
                          <p className="text-xs text-red-500">+{interest.toFixed(6)} debt • {pos.apy}% APY</p>
                        </div>
                      </div>
                      <Button size="sm" disabled={loading} onClick={() => handleRepay(i)}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Repay"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
