import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, Lock, Unlock, Gift, Loader2, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import { useVirtualState } from "@/hooks/use-virtual-state";
import { TokenIcon } from "@/components/TokenIcon";

const LOCK_OPTIONS = [
  { days: 0, label: "Flexible", multiplier: 1 },
  { days: 30, label: "30 Days", multiplier: 1.25 },
  { days: 90, label: "90 Days", multiplier: 1.5 },
  { days: 180, label: "180 Days", multiplier: 2 },
  { days: 365, label: "365 Days", multiplier: 3 },
];

const PROTOCOL_TOTAL_STAKED = 24_500_000;

function formatTime(ms: number): string {
  if (ms <= 0) return "Unlocked";
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  return d > 0 ? `${d}d ${h}h` : `${h}h`;
}

export default function Staking() {
  const { connected } = useWalletState();
  const { address } = useAccount();
  const { toast } = useToast();
  const vs = useVirtualState(address);
  const [stakeAmount, setStakeAmount] = useState("");
  const [lockDays, setLockDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const [approvalStep, setApprovalStep] = useState<"idle" | "approving" | "approved">("idle");
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const stlBalance = vs.state.balances.STL || 0;
  const totalStaked = vs.state.staking.reduce((s, p) => s + p.amount, 0);
  const poolShare = PROTOCOL_TOTAL_STAKED > 0 ? (totalStaked / (PROTOCOL_TOTAL_STAKED + totalStaked)) * 100 : 0;
  const BASE_APY = vs.baseStakingApy;

  const handleStake = async () => {
    const num = parseFloat(stakeAmount);
    if (isNaN(num) || num <= 0) return;
    
    // Approval step
    setApprovalStep("approving");
    await new Promise((r) => setTimeout(r, 1000));
    setApprovalStep("approved");
    await new Promise((r) => setTimeout(r, 400));
    
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const ok = vs.stake(num, lockDays);
    if (ok) {
      toast({ title: "Staked Successfully", description: `Staked ${num} STL${lockDays > 0 ? ` for ${lockDays} days` : " (flexible)"}` });
      setStakeAmount("");
    } else {
      toast({ title: "Insufficient STL", description: "Claim tokens from the faucet first", variant: "destructive" });
    }
    setLoading(false);
    setApprovalStep("idle");
  };

  const handleUnstake = async (index: number) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const ok = vs.unstake(index);
    if (ok) {
      toast({ title: "Unstake Initiated", description: "Tokens will be available after 3-day warmup period" });
    } else {
      toast({ title: "Cannot Unstake", description: "Lock period has not expired", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleClaimRewards = async (index: number) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    const rewards = vs.claimStakingRewards(index);
    if (rewards > 0) {
      toast({ title: "Rewards Claimed!", description: `+${rewards.toFixed(6)} STL` });
    } else {
      toast({ title: "No rewards", description: "Rewards are still accumulating", variant: "destructive" });
    }
    setLoading(false);
  };

  const selectedLock = LOCK_OPTIONS.find((l) => l.days === lockDays)!;
  const effectiveAPY = BASE_APY * selectedLock.multiplier;

  if (!connected) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-bold text-foreground">Connect Your Wallet</h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">Connect your wallet to stake STL and earn rewards.</p>
          <WalletButton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">STL Staking</h1>
        <p className="mt-1 text-sm text-muted-foreground">Stake STL to earn rewards and participate in governance.</p>
      </div>

      <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Your Staked", value: `${totalStaked.toFixed(2)} STL` },
          { label: "STL Balance", value: `${stlBalance.toFixed(2)} STL` },
          { label: "Pool Share", value: `${poolShare.toFixed(4)}%` },
          { label: "Protocol Staked", value: `${(PROTOCOL_TOTAL_STAKED / 1e6).toFixed(1)}M STL` },
        ].map((s, i) => (
          <Card key={i} className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-bold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-6 border-border bg-card">
        <CardHeader><CardTitle className="text-sm text-foreground">APY by Lock Period</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-5">
            {LOCK_OPTIONS.map((opt) => (
              <div key={opt.days} className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
                <p className="text-xs text-muted-foreground">{opt.label}</p>
                <p className="text-lg font-bold text-green-500">{(BASE_APY * opt.multiplier).toFixed(0)}%</p>
                <p className="text-[10px] text-muted-foreground">{opt.multiplier}x multiplier</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="stake">
        <TabsList className="mb-4 bg-secondary">
          <TabsTrigger value="stake"><Lock className="mr-1.5 h-3.5 w-3.5" /> Stake</TabsTrigger>
          <TabsTrigger value="unstake"><Unlock className="mr-1.5 h-3.5 w-3.5" /> Unstake</TabsTrigger>
          <TabsTrigger value="rewards"><Gift className="mr-1.5 h-3.5 w-3.5" /> Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="stake">
          <Card className="border-border bg-card">
            <CardContent className="space-y-4 p-6">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs text-muted-foreground">Amount to Stake</label>
                  <span className="text-xs text-muted-foreground">Balance: {stlBalance.toFixed(2)} STL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input placeholder="0.00" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} className="border-border bg-secondary" />
                  <Button variant="outline" size="sm" onClick={() => setStakeAmount(stlBalance.toString())}>MAX</Button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs text-muted-foreground">Lock Period</label>
                <div className="flex flex-wrap gap-2">
                  {LOCK_OPTIONS.map((opt) => (
                    <Button
                      key={opt.days}
                      variant={lockDays === opt.days ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLockDays(opt.days)}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Estimated APY</span><span className="text-green-500 font-bold">{effectiveAPY}%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Lock Period</span><span className="text-foreground">{lockDays === 0 ? "Flexible (no lock)" : `${lockDays} days`}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Estimated Daily</span><span className="text-foreground">{stakeAmount ? ((parseFloat(stakeAmount) || 0) * effectiveAPY / 100 / 365).toFixed(4) : "0.0000"} STL</span></div>
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
                      {approvalStep === "approving" ? "Approving STL spending..." : "STL spending approved ✓"}
                    </span>
                  </div>
                </div>
              )}

              <Button className="w-full glow-purple" disabled={!stakeAmount || loading || approvalStep === "approving"} onClick={handleStake}>
                {approvalStep === "approving" ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Approving...</>
                ) : loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Staking...</>
                ) : "Stake STL"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unstake">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              {vs.state.staking.length === 0 && vs.state.stakingPendingWithdrawals.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center text-center">
                  <p className="text-sm text-muted-foreground">No staked positions</p>
                  <p className="mt-1 text-xs text-muted-foreground">Stake STL to see your positions here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vs.state.staking.map((pos, i) => {
                    const isLocked = pos.lockDays > 0 && Date.now() < pos.unlockTime;
                    const remaining = isLocked ? pos.unlockTime - Date.now() : 0;
                    return (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
                        <div>
                          <p className="text-sm font-bold text-foreground">{pos.amount.toFixed(2)} STL</p>
                          <p className="text-xs text-muted-foreground">{pos.lockDays === 0 ? "Flexible" : `${pos.lockDays}-day lock`}</p>
                          {isLocked && (
                            <p className="text-xs text-orange-500 flex items-center gap-1 mt-1">
                              <Lock className="h-3 w-3" /> Locked: {formatTime(remaining)}
                            </p>
                          )}
                        </div>
                        <Button size="sm" variant="outline" disabled={isLocked || loading} onClick={() => handleUnstake(i)}>
                          {isLocked ? "Locked" : "Unstake"}
                        </Button>
                      </div>
                    );
                  })}

                  {vs.state.stakingPendingWithdrawals.length > 0 && (
                    <>
                      <p className="text-xs font-semibold text-muted-foreground pt-2">Pending Withdrawals (3-day warmup)</p>
                      {vs.state.stakingPendingWithdrawals.map((w, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
                          <div>
                            <p className="text-sm font-bold text-foreground">{w.amount.toFixed(2)} STL</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {Date.now() >= w.availableAt ? "Ready to withdraw" : `Available in ${formatTime(w.availableAt - Date.now())}`}
                            </p>
                          </div>
                        </div>
                      ))}
                      {vs.state.stakingPendingWithdrawals.some((w) => Date.now() >= w.availableAt) && (
                        <Button className="w-full" onClick={() => { vs.claimPendingWithdrawals(); toast({ title: "Withdrawn", description: "STL returned to wallet" }); }}>
                          Claim Available Withdrawals
                        </Button>
                      )}
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              {vs.state.staking.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center text-center">
                  <p className="text-sm text-muted-foreground">No staking rewards</p>
                  <p className="mt-1 text-xs text-muted-foreground">Stake STL to start earning</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vs.state.staking.map((pos, i) => {
                    const rewards = vs.getStakingRewards(pos);
                    const multiplier = vs.apyMultipliers[pos.lockDays] || 1;
                    return (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
                        <div>
                          <p className="text-sm font-bold text-foreground">{pos.amount.toFixed(2)} STL staked</p>
                          <p className="text-xs text-muted-foreground">{pos.lockDays === 0 ? "Flexible" : `${pos.lockDays}-day lock`} • {(BASE_APY * multiplier).toFixed(0)}% APY</p>
                          <p className="text-xs text-green-500 mt-1">
                            Pending: {rewards.toFixed(6)} STL
                          </p>
                        </div>
                        <Button size="sm" disabled={rewards <= 0 || loading} onClick={() => handleClaimRewards(i)}>
                          Claim
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
