import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import { useVirtualState } from "@/hooks/use-virtual-state";
import { TokenIcon } from "@/components/TokenIcon";

interface Pool {
  tokenA: string;
  tokenB: string;
  tvl: string;
  volume24h: string;
  apr: string;
}

const pools: Pool[] = [
  { tokenA: "RLO", tokenB: "USDT", tvl: "$245,000", volume24h: "$12,500", apr: "24.5%" },
  { tokenA: "RLO", tokenB: "STL", tvl: "$120,000", volume24h: "$6,300", apr: "19.8%" },
  { tokenA: "STL", tokenB: "USDT", tvl: "$95,000", volume24h: "$4,200", apr: "22.1%" },
  { tokenA: "RIA", tokenB: "USDT", tvl: "$78,000", volume24h: "$3,800", apr: "18.5%" },
];

export default function Liquidity() {
  const { connected } = useWalletState();
  const { address } = useAccount();
  const { toast } = useToast();
  const vs = useVirtualState(address);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [loading, setLoading] = useState(false);
  const [approvalStep, setApprovalStep] = useState<"idle" | "approving" | "approved">("idle");

  const handleAdd = async () => {
    if (!selectedPool) return;
    const a = parseFloat(amountA);
    const b = parseFloat(amountB);
    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) return;
    
    setApprovalStep("approving");
    await new Promise((r) => setTimeout(r, 1000));
    setApprovalStep("approved");
    await new Promise((r) => setTimeout(r, 400));
    
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const ok = vs.addLiquidity(selectedPool.tokenA, selectedPool.tokenB, a, b);
    if (ok) {
      toast({ title: "Liquidity Added", description: `Added ${a} ${selectedPool.tokenA} + ${b} ${selectedPool.tokenB}` });
    } else {
      toast({ title: "Insufficient Balance", variant: "destructive" });
    }
    setLoading(false);
    setApprovalStep("idle");
    setAddOpen(false);
  };

  const handleRemove = async (index: number) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const ok = vs.removeLiquidity(index);
    if (ok) toast({ title: "Liquidity Removed", description: "Tokens returned to wallet" });
    setLoading(false);
  };

  if (!connected) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-bold text-foreground">Connect Your Wallet</h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">Connect your wallet to provide liquidity.</p>
          <WalletButton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Liquidity Pools</h1>
        <p className="mt-1 text-sm text-muted-foreground">Provide liquidity to earn swap fees on Rialo Network</p>
      </div>

      <div className="mb-6 grid gap-4 grid-cols-3">
        {[
          { label: "Total TVL", value: "$538,000" },
          { label: "24h Volume", value: "$26,800" },
          { label: "Your Positions", value: vs.state.lpPositions.length.toString() },
        ].map((s, i) => (
          <Card key={i} className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-bold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-3 mb-6">
        {pools.map((pool, i) => (
          <Card key={i} className="border-border bg-card hover:border-primary/30 transition-all">
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <TokenIcon symbol={pool.tokenA} size="sm" />
                <TokenIcon symbol={pool.tokenB} size="sm" />
                <span className="ml-1 text-sm font-bold text-foreground">{pool.tokenA}/{pool.tokenB}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-xs">
                <div><p className="text-muted-foreground">TVL</p><p className="font-medium text-foreground">{pool.tvl}</p></div>
                <div><p className="text-muted-foreground">24h Vol</p><p className="font-medium text-foreground">{pool.volume24h}</p></div>
                <div><p className="text-muted-foreground">APR</p><p className="font-bold text-green-500">{pool.apr}</p></div>
              </div>
              <Button size="sm" onClick={() => { setSelectedPool(pool); setAmountA(""); setAmountB(""); setApprovalStep("idle"); setAddOpen(true); }}>Add Liquidity</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {vs.state.lpPositions.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="text-sm text-foreground">Your LP Positions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {vs.state.lpPositions.map((pos, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
                <div className="flex items-center gap-2">
                  <TokenIcon symbol={pos.tokenA} size="sm" />
                  <TokenIcon symbol={pos.tokenB} size="sm" />
                  <div className="ml-2">
                    <p className="text-sm font-bold text-foreground">{pos.tokenA}/{pos.tokenB}</p>
                    <p className="text-xs text-muted-foreground">{pos.amountA.toFixed(2)} + {pos.amountB.toFixed(2)}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" disabled={loading} onClick={() => handleRemove(i)}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remove"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add Liquidity: {selectedPool?.tokenA}/{selectedPool?.tokenB}</DialogTitle>
            <DialogDescription className="text-muted-foreground">Provide tokens to earn trading fees</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <div className="mb-1.5 flex justify-between">
                <label className="text-xs text-muted-foreground">{selectedPool?.tokenA} Amount</label>
                <span className="text-xs text-muted-foreground">Balance: {(vs.state.balances[selectedPool?.tokenA || ""] || 0).toFixed(2)}</span>
              </div>
              <Input placeholder="0.00" value={amountA} onChange={(e) => setAmountA(e.target.value)} className="border-border bg-secondary" />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between">
                <label className="text-xs text-muted-foreground">{selectedPool?.tokenB} Amount</label>
                <span className="text-xs text-muted-foreground">Balance: {(vs.state.balances[selectedPool?.tokenB || ""] || 0).toFixed(2)}</span>
              </div>
              <Input placeholder="0.00" value={amountB} onChange={(e) => setAmountB(e.target.value)} className="border-border bg-secondary" />
            </div>
            
            {approvalStep !== "idle" && (
              <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  {approvalStep === "approving" ? (
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  ) : (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                  <span className={approvalStep === "approving" ? "text-primary" : "text-green-500"}>
                    {approvalStep === "approving" ? "Approving token spending..." : "Tokens approved ✓"}
                  </span>
                </div>
              </div>
            )}
            
            <Button className="w-full glow-purple" disabled={!amountA || !amountB || loading || approvalStep === "approving"} onClick={handleAdd}>
              {approvalStep === "approving" ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Approving...</>
              ) : loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
              ) : "Add Liquidity"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
