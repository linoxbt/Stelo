import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coins, Wallet, Loader2, Timer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import { useVirtualState, FAUCET_AMOUNTS, FAUCET_COOLDOWN_MS } from "@/hooks/use-virtual-state";
import { TokenIcon } from "@/components/TokenIcon";

const faucetTokens = [
  { symbol: "RIA", name: "Rialo", description: "Native gas & utility token" },
  { symbol: "WETH", name: "Wrapped Ether", description: "Wrapped version of Ethereum" },
  { symbol: "USDT", name: "Tether USD", description: "Stablecoin pegged to USD" },
  { symbol: "ALND", name: "ArcLend Token", description: "Governance & staking token" },
];

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Ready";
  const hours = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${hours}h ${mins}m ${secs}s`;
}

export default function Faucet() {
  const { connected } = useWalletState();
  const { address } = useAccount();
  const { toast } = useToast();
  const vs = useVirtualState(address);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [claimingAll, setClaimingAll] = useState(false);
  const [, setTick] = useState(0);

  // Update cooldown timers every second
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = async (symbol: string) => {
    setClaiming(symbol);
    await new Promise((r) => setTimeout(r, 1500));
    const ok = vs.claimFaucet(symbol);
    if (ok) {
      toast({ title: "Tokens Claimed!", description: `+${FAUCET_AMOUNTS[symbol]} ${symbol} added to your wallet` });
    } else {
      toast({ title: "Cooldown Active", description: `Wait ${formatCountdown(vs.getClaimCooldown(symbol))} before claiming again`, variant: "destructive" });
    }
    setClaiming(null);
  };

  const handleClaimAll = async () => {
    setClaimingAll(true);
    await new Promise((r) => setTimeout(r, 2000));
    let claimed = 0;
    for (const t of faucetTokens) {
      if (vs.canClaim(t.symbol)) {
        vs.claimFaucet(t.symbol);
        claimed++;
      }
    }
    if (claimed > 0) {
      toast({ title: "Tokens Claimed!", description: `Claimed ${claimed} token${claimed > 1 ? "s" : ""} successfully` });
    } else {
      toast({ title: "All on Cooldown", description: "No tokens available to claim right now", variant: "destructive" });
    }
    setClaimingAll(false);
  };

  const anyClaimable = faucetTokens.some((t) => vs.canClaim(t.symbol));

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6">
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">Testnet Faucet</h1>
            <p className="mt-1 text-sm text-muted-foreground">Claim free testnet tokens to try out ArcLend. Each token can be claimed once every 24 hours.</p>
          </div>

          {!connected && (
            <Card className="mb-6 border-border bg-card">
              <CardContent className="flex flex-col items-center gap-4 p-6">
                <Wallet className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Connect your wallet to claim testnet tokens</p>
                <WalletButton />
              </CardContent>
            </Card>
          )}

          {/* Claim All */}
          {connected && (
            <Button className="mb-6 w-full glow-purple" disabled={claimingAll || !anyClaimable} onClick={handleClaimAll}>
              {claimingAll ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Claiming All...</> : <><Coins className="mr-2 h-4 w-4" /> Claim All Tokens</>}
            </Button>
          )}

          {/* Vertical token list */}
          <div className="space-y-3">
            {faucetTokens.map((token) => {
              const claimable = vs.canClaim(token.symbol);
              const cooldown = vs.getClaimCooldown(token.symbol);

              return (
                <Card key={token.symbol} className="border-border bg-card">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <TokenIcon symbol={token.symbol} />
                      <div>
                        <p className="text-sm font-bold text-foreground">{token.symbol}</p>
                        <p className="text-xs text-muted-foreground">{token.name}</p>
                        <p className="text-xs text-muted-foreground">{token.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="text-sm font-bold text-foreground">{FAUCET_AMOUNTS[token.symbol]} {token.symbol}</p>
                        {!claimable && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Timer className="h-3 w-3" />
                            <span>{formatCountdown(cooldown)}</span>
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        disabled={!connected || !claimable || claiming === token.symbol}
                        onClick={() => handleClaim(token.symbol)}
                      >
                        {claiming === token.symbol ? <Loader2 className="h-4 w-4 animate-spin" /> : "Claim"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* How to use */}
          <Card className="mt-6 border-border bg-card">
            <CardContent className="p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">How to use the faucet</p>
              <div className="space-y-2">
                {[
                  "Connect your wallet to Rialo Testnet",
                  "Click \"Claim\" on each token or use \"Claim All Tokens\"",
                  "Tokens are added to your virtual balance instantly",
                  "Start using ArcLend to supply, borrow, swap, and stake!",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-muted-foreground">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
