import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Percent, Wallet, Clock, BarChart3, Users, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NetworkBadge } from "@/components/NetworkBadge";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useVirtualState } from "@/hooks/use-virtual-state";
import { TokenIcon } from "@/components/TokenIcon";
import { useState, useEffect } from "react";

// Simulated protocol-wide stats that increment slowly
function useProtocolStats() {
  const [stats, setStats] = useState({
    tvl: 4_218_340,
    totalBorrowed: 1_892_100,
    totalLiquidity: 2_654_900,
    activeUsers: 1_847,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        tvl: prev.tvl + Math.random() * 500 - 100,
        totalBorrowed: prev.totalBorrowed + Math.random() * 200 - 50,
        totalLiquidity: prev.totalLiquidity + Math.random() * 300 - 80,
        activeUsers: prev.activeUsers + (Math.random() > 0.7 ? 1 : 0),
      }));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return stats;
}

function formatUSD(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

export default function Dashboard() {
  const { connected } = useWalletState();
  const { address } = useAccount();
  const navigate = useNavigate();
  const { state, prices, calculateHealthFactor } = useVirtualState(address);
  const protocolStats = useProtocolStats();

  const totalBalance = Object.entries(state.balances).reduce(
    (sum, [token, amount]) => sum + amount * (prices[token] || 0), 0
  );

  const totalSupplied = state.supplies.reduce(
    (sum, s) => sum + s.amount * (prices[s.asset] || 0), 0
  );

  const totalBorrowed = state.borrows.reduce(
    (sum, b) => sum + b.amount * (prices[b.asset] || 0), 0
  );

  const hf = calculateHealthFactor();
  const hfDisplay = hf === Infinity ? "—" : hf.toFixed(2);
  const hfColor = hf === Infinity ? "text-muted-foreground" : hf >= 2 ? "text-green-500" : hf >= 1.5 ? "text-yellow-500" : hf >= 1.2 ? "text-orange-500" : "text-red-500";

  if (!connected) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-bold text-foreground">Connect Your Wallet</h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">
            Connect your EVM wallet to view your portfolio, positions, and earnings.
          </p>
          <WalletButton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Portfolio Dashboard</h1>
        <NetworkBadge />
      </div>

      {/* Protocol Stats */}
      <div className="mb-6 grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Protocol TVL", icon: Layers, value: formatUSD(protocolStats.tvl) },
          { label: "Total Borrowed", icon: BarChart3, value: formatUSD(protocolStats.totalBorrowed) },
          { label: "Total Liquidity", icon: DollarSign, value: formatUSD(protocolStats.totalLiquidity) },
          { label: "Active Users", icon: Users, value: protocolStats.activeUsers.toLocaleString() },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-border bg-card">
              <CardContent className="p-3 sm:p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs text-muted-foreground">{s.label}</span>
                  <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <p className="text-sm sm:text-lg font-bold text-foreground">{s.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* User Stats */}
      <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Wallet Value", icon: DollarSign, value: `$${totalBalance.toFixed(2)}` },
          { label: "Total Supplied", icon: TrendingUp, value: `$${totalSupplied.toFixed(2)}` },
          { label: "Total Borrowed", icon: DollarSign, value: `$${totalBorrowed.toFixed(2)}` },
          { label: "Net APY", icon: Percent, value: state.supplies.length > 0 ? `${(state.supplies.reduce((s, p) => s + p.apy, 0) / state.supplies.length).toFixed(1)}%` : "0.0%" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glow-purple border-border bg-card">
              <CardContent className="p-4 sm:p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <s.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-lg font-bold text-foreground sm:text-2xl">{s.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Wallet Balances */}
      <Card className="mb-6 border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm text-foreground">Wallet Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(state.balances).map(([token, amount]) => (
              <div key={token} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-3">
                  <TokenIcon symbol={token} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{token}</p>
                    <p className="text-xs text-muted-foreground">{amount.toFixed(4)}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-foreground">${(amount * (prices[token] || 0)).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {state.transactions.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-center">
                <div>
                  <p className="text-sm text-muted-foreground">No recent transactions</p>
                  <p className="mt-1 text-xs text-muted-foreground">Claim tokens from the faucet to get started</p>
                  <Button size="sm" className="mt-4" onClick={() => navigate("/faucet")}>
                    Go to Faucet
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {state.transactions.slice(0, 15).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between rounded-lg bg-secondary/30 p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium text-foreground capitalize">{tx.type.replace("_", " ")}</span>
                      <span className="text-muted-foreground">{tx.asset}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground">{tx.amount.toFixed(4)}</p>
                      <p className="text-muted-foreground font-mono text-[10px]">{tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}</p>
                      <p className="text-muted-foreground text-[10px]">{new Date(tx.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm text-foreground">
              Health Factor
              <NetworkBadge compact />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className={`flex h-32 w-32 items-center justify-center rounded-full border-4 ${hf >= 2 ? "border-green-500/30" : hf >= 1.5 ? "border-yellow-500/30" : hf >= 1.2 ? "border-orange-500/30" : hf < Infinity ? "border-red-500/30" : "border-muted/30"} bg-muted/5`}>
              <span className={`text-3xl font-bold ${hfColor}`}>{hfDisplay}</span>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              {hf === Infinity ? "No active borrows" : hf >= 2 ? "Safe" : hf >= 1.5 ? "Early warning" : hf >= 1.2 ? "Caution" : "Liquidation risk"}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
