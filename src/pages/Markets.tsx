import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useAccount } from "wagmi";
import { useVirtualState } from "@/hooks/use-virtual-state";
import { TokenIcon } from "@/components/TokenIcon";

interface Asset {
  symbol: string;
  name: string;
  supplyAPY: number;
  borrowAPY: number;
  collateralFactor: number;
  liquidationThreshold: number;
  totalLiquidity: string;
  utilization: number;
}

const assets: Asset[] = [
  { symbol: "RLO", name: "Rialo", supplyAPY: 3.5, borrowAPY: 5.2, collateralFactor: 75, liquidationThreshold: 80, totalLiquidity: "$85,000", utilization: 35 },
  { symbol: "USDT", name: "Tether USD", supplyAPY: 4.5, borrowAPY: 6.5, collateralFactor: 75, liquidationThreshold: 80, totalLiquidity: "$195,000", utilization: 52 },
  { symbol: "STL", name: "Stelo Token", supplyAPY: 5.2, borrowAPY: 7.8, collateralFactor: 60, liquidationThreshold: 70, totalLiquidity: "$45,000", utilization: 28 },
  { symbol: "RIA", name: "Rialo Asset", supplyAPY: 3.8, borrowAPY: 5.5, collateralFactor: 70, liquidationThreshold: 75, totalLiquidity: "$62,000", utilization: 32 },
];

export default function Markets() {
  const { connected } = useWalletState();
  const { address } = useAccount();
  const { toast } = useToast();
  const vs = useVirtualState(address);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"supply" | "borrow">("supply");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [approvalStep, setApprovalStep] = useState<"idle" | "approving" | "approved" | "confirming">("idle");

  const handleConfirm = async () => {
    if (!selectedAsset || !amount) return;
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    // Step 1: Token approval
    setApprovalStep("approving");
    await new Promise((r) => setTimeout(r, 1200));
    setApprovalStep("approved");
    await new Promise((r) => setTimeout(r, 500));

    // Step 2: Confirm transaction
    setApprovalStep("confirming");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));

    if (modalType === "supply") {
      const ok = vs.supply(selectedAsset.symbol, num, selectedAsset.supplyAPY);
      if (ok) {
        toast({ title: "Supply Successful", description: `Supplied ${num} ${selectedAsset.symbol}` });
      } else {
        toast({ title: "Insufficient Balance", description: `Not enough ${selectedAsset.symbol}`, variant: "destructive" });
      }
    } else {
      const ok = vs.borrow(selectedAsset.symbol, num, selectedAsset.borrowAPY);
      if (ok) {
        toast({ title: "Borrow Successful", description: `Borrowed ${num} ${selectedAsset.symbol}` });
      } else {
        toast({ title: "Insufficient Collateral", description: "Supply more assets first", variant: "destructive" });
      }
    }
    setLoading(false);
    setApprovalStep("idle");
    setModalOpen(false);
  };

  const balance = selectedAsset ? (vs.state.balances[selectedAsset.symbol] || 0) : 0;
  const borrowLimit = vs.calculateBorrowLimit();
  const borrowUsed = vs.calculateBorrowUsed();
  const borrowAvailable = Math.max(0, borrowLimit - borrowUsed);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Lending Markets</h1>
        {connected && borrowLimit > 0 && (
          <div className="mt-2 rounded-lg border border-border bg-secondary/30 p-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Borrow Limit</span>
              <span className="text-foreground">${borrowLimit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Used</span>
              <span className="text-foreground">${borrowUsed.toFixed(2)} ({borrowLimit > 0 ? ((borrowUsed / borrowLimit) * 100).toFixed(1) : 0}%)</span>
            </div>
            <Progress value={borrowLimit > 0 ? (borrowUsed / borrowLimit) * 100 : 0} className="h-1.5" />
            <p className="text-[10px] text-muted-foreground mt-1">Available to borrow: ${borrowAvailable.toFixed(2)}</p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {assets.map((asset, i) => (
          <motion.div key={asset.symbol} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="glow-purple border-border bg-card transition-all hover:border-primary/30">
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 min-w-[140px]">
                  <TokenIcon symbol={asset.symbol} />
                  <div>
                    <p className="text-sm font-bold text-foreground">{asset.symbol}</p>
                    <p className="text-xs text-muted-foreground">{asset.name}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-wrap gap-4 text-xs sm:gap-6">
                  <div>
                    <p className="text-muted-foreground">Supply APY</p>
                    <p className="text-sm font-bold text-green-500">{asset.supplyAPY}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Borrow APY</p>
                    <p className="text-sm font-bold text-orange-500">{asset.borrowAPY}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Liquidity</p>
                    <p className="text-sm font-medium text-foreground">{asset.totalLiquidity}</p>
                  </div>
                  <div className="min-w-[80px]">
                    <p className="text-muted-foreground">Utilization</p>
                    <div className="flex items-center gap-2">
                      <Progress value={asset.utilization} className="h-1.5 flex-1" />
                      <span className="text-foreground">{asset.utilization}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Your Balance</p>
                    <p className="text-sm font-medium text-foreground">{(vs.state.balances[asset.symbol] || 0).toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <Button size="sm" onClick={() => { setModalType("supply"); setSelectedAsset(asset); setAmount(""); setApprovalStep("idle"); setModalOpen(true); }}>Supply</Button>
                  <Button size="sm" variant="outline" className="border-primary/30 text-primary" onClick={() => { setModalType("borrow"); setSelectedAsset(asset); setAmount(""); setApprovalStep("idle"); setModalOpen(true); }}>Borrow</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {modalType === "supply" ? "Supply" : "Borrow"} {selectedAsset?.symbol || "Assets"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {modalType === "supply" ? "Deposit assets to earn interest" : "Borrow against your collateral"}
            </DialogDescription>
          </DialogHeader>

          {modalType === "borrow" && (
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                <div className="text-xs text-muted-foreground">
                  <p>Supply assets as collateral before borrowing. Monitor your health factor.</p>
                  {borrowAvailable > 0 && (
                    <p className="mt-1 text-foreground">Available to borrow: ${borrowAvailable.toFixed(2)}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 py-2">
            {selectedAsset && (
              <>
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs text-muted-foreground">Amount</label>
                    <span className="text-xs text-muted-foreground">
                      Balance: {balance.toFixed(4)} {selectedAsset.symbol}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="border-border bg-secondary" />
                    <Button variant="outline" size="sm" className="shrink-0 text-xs" onClick={() => setAmount(balance.toString())}>MAX</Button>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{modalType === "supply" ? "Supply APY" : "Borrow APY"}</span>
                    <span className="text-foreground">{modalType === "supply" ? selectedAsset.supplyAPY : selectedAsset.borrowAPY}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Collateral Factor</span>
                    <span className="text-foreground">{selectedAsset.collateralFactor}%</span>
                  </div>
                </div>

                {/* Approval Steps */}
                {approvalStep !== "idle" && (
                  <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      {approvalStep === "approving" ? (
                        <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      ) : (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      )}
                      <span className={approvalStep === "approving" ? "text-primary" : "text-green-500"}>
                        {approvalStep === "approving" ? "Approving token spending..." : "Token spending approved ✓"}
                      </span>
                    </div>
                    {(approvalStep === "approved" || approvalStep === "confirming") && (
                      <div className="flex items-center gap-2 text-xs">
                        {approvalStep === "confirming" ? (
                          <Loader2 className="h-3 w-3 animate-spin text-primary" />
                        ) : (
                          <div className="h-3 w-3 rounded-full border border-muted-foreground/30" />
                        )}
                        <span className={approvalStep === "confirming" ? "text-primary" : "text-muted-foreground"}>
                          {approvalStep === "confirming" ? "Confirming transaction..." : "Confirm transaction"}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <Button className="w-full glow-purple" disabled={!amount || loading || approvalStep === "approving"} onClick={handleConfirm}>
                  {approvalStep === "approving" ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Approving...</>
                  ) : loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                  ) : (
                    `Confirm ${modalType === "supply" ? "Supply" : "Borrow"}`
                  )}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
