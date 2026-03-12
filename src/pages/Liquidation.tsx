import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Wallet, Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useAccount } from "wagmi";
import { useVirtualState } from "@/hooks/use-virtual-state";
import { TokenIcon } from "@/components/TokenIcon";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/use-notifications";
import { supabase } from "@/integrations/supabase/client";

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
  { wallet: "0x7b2e...d4f9", collateral: "0.8 WETH", collateralAsset: "WETH", debt: "650 USDT", debtAsset: "USDT", hf: 0.98, bonus: "5%", collateralValue: 1600, debtValue: 650 },
  { wallet: "0x1c9d...a3e7", collateral: "1200 STL", collateralAsset: "STL", debt: "4500 USDT", debtAsset: "USDT", hf: 1.05, bonus: "5%", collateralValue: 12000, debtValue: 4500 },
];

export default function Liquidation() {
  const { connected } = useWalletState();
  const { address } = useAccount();
  const vs = useVirtualState(address);
  const { toast } = useToast();
  const { sendNotification } = useNotifications();
  const [liquidating, setLiquidating] = useState<string | null>(null);

  const handleLiquidate = async (pos: AtRiskPosition) => {
    if (!address) return;
    
    setLiquidating(pos.wallet);
    
    // Simulate liquidation delay
    await new Promise(r => setTimeout(r, 2000));

    const debtRepaid = pos.debtValue * 0.5; // Liquidate 50% of debt
    const collateralSeized = debtRepaid * 1.05; // 5% bonus
    const bonusEarned = debtRepaid * 0.05;

    // Log to database
    try {
      await supabase.from("liquidation_log").insert({
        liquidator_address: address.toLowerCase(),
        borrower_address: pos.wallet,
        collateral_asset: pos.collateralAsset,
        debt_asset: pos.debtAsset,
        debt_repaid: debtRepaid,
        collateral_seized: collateralSeized,
        bonus_earned: bonusEarned,
      });
    } catch (e) {
      console.error("Failed to log liquidation:", e);
    }

    // Send notification to the borrower about their liquidation
    try {
      await sendNotification({
        wallet_address: pos.wallet.includes("...") ? pos.wallet : pos.wallet,
        type: "health_factor",
        title: "🚨 Position Liquidated",
        message: `Your position (${pos.collateral} collateral, ${pos.debt} debt) has been partially liquidated. ${debtRepaid.toFixed(2)} ${pos.debtAsset} debt was repaid and ${collateralSeized.toFixed(2)} worth of ${pos.collateralAsset} collateral was seized. Health Factor was ${pos.hf.toFixed(2)}. Consider adding more collateral to protect remaining positions.`,
      });
    } catch (e) {
      console.error("Failed to send liquidation notification:", e);
    }

    toast({
      title: "✅ Liquidation Successful",
      description: `Repaid $${debtRepaid.toFixed(2)} debt and received $${collateralSeized.toFixed(2)} collateral (including $${bonusEarned.toFixed(2)} bonus).`,
    });

    setLiquidating(null);
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
          <p className="text-sm text-primary">Liquidate undercollateralized positions to earn bonus rewards and help maintain protocol solvency. Borrowers with email/Telegram alerts enabled will be notified of liquidation.</p>
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
                  onClick={() => handleLiquidate(pos)}
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
    </DashboardLayout>
  );
}
