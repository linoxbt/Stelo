import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Wallet, Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useAccount } from "wagmi";
import { useVirtualState } from "@/hooks/use-virtual-state";
import { TokenIcon } from "@/components/TokenIcon";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/use-notifications";
import { supabase } from "@/integrations/supabase/client";
import { Slider } from "@/components/ui/slider";

interface AtRiskPosition {
  wallet: string;
  collateral: string;
  collateralAsset: string;
  debt: string;
  debtAsset: string;
  hf: number;
  bonus: string;
  collateralValue: number;
  debtValue: number;
}

const simulatedAtRisk: AtRiskPosition[] = [
  { wallet: "0x3f4a...8c21", collateral: "500 RLO", collateralAsset: "RLO", debt: "200 USDT", debtAsset: "USDT", hf: 1.12, bonus: "5%", collateralValue: 250, debtValue: 200 },
  { wallet: "0x7b2e...d4f9", collateral: "1200 STL", collateralAsset: "STL", debt: "650 USDT", debtAsset: "USDT", hf: 0.98, bonus: "5%", collateralValue: 12000, debtValue: 650 },
  { wallet: "0x1c9d...a3e7", collateral: "800 RIA", collateralAsset: "RIA", debt: "4500 USDT", debtAsset: "USDT", hf: 1.05, bonus: "5%", collateralValue: 600, debtValue: 4500 },
];

export default function Liquidation() {
  const { connected } = useWalletState();
  const { address } = useAccount();
  const vs = useVirtualState(address);
  const { toast } = useToast();
  const { notifyLiquidation } = useNotifications();
  const [liquidating, setLiquidating] = useState<string | null>(null);
  const [selectedPos, setSelectedPos] = useState<AtRiskPosition | null>(null);
  const [repayPercentage, setRepayPercentage] = useState(50);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const openLiquidateDialog = (pos: AtRiskPosition) => {
    setSelectedPos(pos);
    setRepayPercentage(50);
    setConfirmOpen(true);
  };

  const handleLiquidate = async () => {
    if (!address || !selectedPos) return;
    
    setConfirmOpen(false);
    setLiquidating(selectedPos.wallet);
    
    await new Promise(r => setTimeout(r, 2000));

    const debtRepaid = selectedPos.debtValue * (repayPercentage / 100);
    const collateralSeized = debtRepaid * 1.05;
    const bonusEarned = debtRepaid * 0.05;

    // New health factor after partial liquidation
    const remainingDebt = selectedPos.debtValue - debtRepaid;
    const remainingCollateral = selectedPos.collateralValue - collateralSeized;
    const newHf = remainingDebt > 0 ? (remainingCollateral * 0.8) / remainingDebt : Infinity;

    try {
      await supabase.from("liquidation_log").insert({
        liquidator_address: address.toLowerCase(),
        borrower_address: selectedPos.wallet,
        collateral_asset: selectedPos.collateralAsset,
        debt_asset: selectedPos.debtAsset,
        debt_repaid: debtRepaid,
        collateral_seized: collateralSeized,
        bonus_earned: bonusEarned,
      });
    } catch (e) {
      console.error("Failed to log liquidation:", e);
    }

    // Notify borrower
    try {
      await notifyLiquidation(
        selectedPos.wallet,
        `${collateralSeized.toFixed(2)} ${selectedPos.collateralAsset}`,
        `${debtRepaid.toFixed(2)} ${selectedPos.debtAsset}`,
        selectedPos.hf
      );
    } catch (e) {
      console.error("Failed to send liquidation notification:", e);
    }

    toast({
      title: "✅ Liquidation Successful",
      description: `Repaid $${debtRepaid.toFixed(2)} debt, received $${collateralSeized.toFixed(2)} collateral (including $${bonusEarned.toFixed(2)} bonus). New HF: ${newHf === Infinity ? "∞" : newHf.toFixed(2)}`,
    });

    setLiquidating(null);
    setSelectedPos(null);
  };

  if (!connected) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-bold text-foreground">Connect Your Wallet</h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">Connect to view liquidation opportunities.</p>
          <WalletButton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Liquidation Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">View at-risk positions and earn a 5% liquidation bonus.</p>
      </div>

      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-3 p-4">
          <Shield className="h-5 w-5 text-primary" />
          <p className="text-sm text-primary">Liquidate undercollateralized positions to earn bonus rewards and help maintain protocol solvency. Borrowers with alerts enabled will be notified.</p>
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-4 grid-cols-3">
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">At-Risk Positions</p>
            <p className="text-lg font-bold text-foreground">{simulatedAtRisk.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Liquidation Bonus</p>
            <p className="text-lg font-bold text-green-500">5%</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Total at Risk</p>
            <p className="text-lg font-bold text-foreground">$5,350</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader><CardTitle className="text-sm text-foreground">At-Risk Positions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {simulatedAtRisk.map((pos, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-lg border border-border bg-secondary/30 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground font-mono">{pos.wallet}</p>
                <p className="text-xs text-muted-foreground">Collateral: {pos.collateral} • Debt: {pos.debt}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Health Factor</p>
                  <p className={`text-sm font-bold ${pos.hf < 1 ? "text-red-500" : pos.hf < 1.2 ? "text-orange-500" : "text-yellow-500"}`}>
                    {pos.hf < 1 && <AlertTriangle className="inline h-3 w-3 mr-1" />}
                    {pos.hf.toFixed(2)}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant={pos.hf < 1 ? "default" : "outline"}
                  disabled={liquidating === pos.wallet}
                  onClick={() => openLiquidateDialog(pos)}
                >
                  {liquidating === pos.wallet ? (
                    <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Liquidating...</>
                  ) : (
                    "Liquidate"
                  )}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Liquidation Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Confirm Liquidation</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Choose how much of the borrower's debt to repay
            </DialogDescription>
          </DialogHeader>
          {selectedPos && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Borrower</span><span className="text-foreground font-mono">{selectedPos.wallet}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Health Factor</span><span className={`font-bold ${selectedPos.hf < 1 ? "text-red-500" : "text-orange-500"}`}>{selectedPos.hf.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Collateral</span><span className="text-foreground">{selectedPos.collateral}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Debt</span><span className="text-foreground">{selectedPos.debt}</span></div>
              </div>

              <div>
                <label className="mb-2 block text-xs text-muted-foreground">Repay Percentage: {repayPercentage}%</label>
                <Slider
                  value={[repayPercentage]}
                  onValueChange={([v]) => setRepayPercentage(v)}
                  min={10}
                  max={50}
                  step={5}
                  className="mb-2"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>10%</span>
                  <span>50% (max)</span>
                </div>
              </div>

              <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3 space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Debt to Repay</span><span className="text-foreground">${(selectedPos.debtValue * repayPercentage / 100).toFixed(2)} {selectedPos.debtAsset}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Collateral to Receive</span><span className="text-foreground">${(selectedPos.debtValue * repayPercentage / 100 * 1.05).toFixed(2)} {selectedPos.collateralAsset}</span></div>
                <div className="flex justify-between"><span className="text-green-500">Bonus Earned</span><span className="text-green-500 font-bold">${(selectedPos.debtValue * repayPercentage / 100 * 0.05).toFixed(2)}</span></div>
              </div>

              <Button className="w-full glow-purple" onClick={handleLiquidate}>
                Confirm Liquidation
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
