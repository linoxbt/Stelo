import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, BarChart3, ArrowLeftRight, Droplets, Coins, Shield, Rocket,
  Activity, Users, Gavel, Lock, ExternalLink
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";

interface DocSection {
  id: string;
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

const sections: DocSection[] = [
  {
    id: "overview",
    icon: <BookOpen className="h-4 w-4" />,
    title: "Overview",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">ArcLend</strong> is a full-featured decentralized finance protocol built for EVM-compatible chains.
          It enables users to lend, borrow, swap tokens, provide liquidity, stake governance tokens, and monitor portfolio health — all from one unified interface.
        </p>
        <p>ArcLend is currently running in <strong className="text-foreground">simulation mode</strong> on <strong className="text-foreground">Rialo Testnet</strong>. All transactions are virtual — only wallet connection is real.</p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <p className="mb-2 font-semibold text-foreground">Supported Assets</p>
          <div className="space-y-1.5">
            <p>💎 <strong className="text-foreground">RIA</strong> — Native gas & utility token on Rialo Network</p>
            <p>⟠ <strong className="text-foreground">WETH</strong> — Wrapped Ether (protocol token)</p>
            <p>₮ <strong className="text-foreground">USDT</strong> — Tether USD stablecoin</p>
            <p>🔮 <strong className="text-foreground">ALND</strong> — ArcLend governance & staking token</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "lending",
    icon: <BarChart3 className="h-4 w-4" />,
    title: "Lending & Borrowing",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>Supply assets to earn interest and borrow against your collateral, inspired by Aave's proven model.</p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">Supplying</p>
            <p>Deposit supported assets into the protocol to earn variable interest. Supplied assets serve as collateral for borrowing.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Borrowing</p>
            <p>Borrow assets against your collateral. Monitor your Health Factor — below 1.0 triggers liquidation.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Key Parameters</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Supply APY — Interest earned on deposits</li>
              <li>Borrow APY — Interest paid on loans</li>
              <li>Collateral Factor (LTV) — Max borrow ratio</li>
              <li>Liquidation Threshold / Penalty (5%)</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "swap",
    icon: <ArrowLeftRight className="h-4 w-4" />,
    title: "Token Swap",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>Instant token exchanges using an AMM model with 0.3% fee, configurable slippage, and real-time price estimation.</p>
      </div>
    ),
  },
  {
    id: "liquidity",
    icon: <Droplets className="h-4 w-4" />,
    title: "Liquidity Pools",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>Provide liquidity to earn 0.3% trading fees. Available pools: RIA/USDT, RIA/WETH, USDT/WETH, ALND/USDT.</p>
      </div>
    ),
  },
  {
    id: "staking",
    icon: <Lock className="h-4 w-4" />,
    title: "ALND Staking",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>Stake ALND tokens to earn rewards. Choose from flexible or locked staking periods with higher APY multipliers.</p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-2">
          <p className="font-semibold text-foreground">Lock Tiers</p>
          <ul className="list-inside list-disc space-y-1">
            <li>Flexible — 12% APY (1x)</li>
            <li>30 days — 15% APY (1.25x)</li>
            <li>90 days — 18% APY (1.5x)</li>
            <li>180 days — 24% APY (2x)</li>
            <li>365 days — 36% APY (3x)</li>
          </ul>
          <p>Unstaking has a 3-day warmup period. Rewards accrue in real-time.</p>
        </div>
      </div>
    ),
  },
  {
    id: "faucet",
    icon: <Coins className="h-4 w-4" />,
    title: "Testnet Faucet",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>Claim free testnet tokens: 100 RIA, 1 WETH, 1000 USDT, 100 ALND. Each token has a 24-hour cooldown.</p>
      </div>
    ),
  },
  {
    id: "health",
    icon: <Activity className="h-4 w-4" />,
    title: "Health Monitor",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>Monitor your health factor in real-time. Configure alert thresholds at HF ≤ 1.5, 1.2, and 1.0. Save email and Telegram for notifications.</p>
      </div>
    ),
  },
  {
    id: "liquidation",
    icon: <Shield className="h-4 w-4" />,
    title: "Liquidation",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>View at-risk positions and earn a 5% liquidation bonus by repaying undercollateralized debt.</p>
      </div>
    ),
  },
  {
    id: "governance",
    icon: <Gavel className="h-4 w-4" />,
    title: "Governance",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>Vote on protocol proposals using staked ALND. 1 staked ALND = 1 vote. Create and vote on parameter changes, treasury grants, and more.</p>
      </div>
    ),
  },
  {
    id: "deploy",
    icon: <Rocket className="h-4 w-4" />,
    title: "Contract Deployment",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>Deploy ERC-20, ERC-721, ERC-1155, staking, multi-sig, vesting, or custom contracts to Rialo Network.</p>
      </div>
    ),
  },
];

const resources = [
  { label: "Rialo Network", url: "https://rialo.network", desc: "Official website" },
  { label: "Aave V3 Protocol", url: "https://docs.aave.com", desc: "Lending protocol reference" },
  { label: "wagmi Documentation", url: "https://wagmi.sh", desc: "React hooks for Ethereum" },
  { label: "RainbowKit", url: "https://www.rainbowkit.com/docs", desc: "Wallet connection UI" },
];

export default function Docs() {
  const [activeSection, setActiveSection] = useState("overview");
  const current = sections.find((s) => s.id === activeSection) || sections[0];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Documentation</h1>
        <p className="mt-1 text-sm text-muted-foreground">Everything you need to know about ArcLend.</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <nav className="shrink-0 lg:w-56">
          <div className="sticky top-4 space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  activeSection === s.id ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span className="text-primary">{s.icon}</span>
                <span className="flex-1">{s.title}</span>
              </button>
            ))}

            <div className="mt-6 border-t border-border pt-4">
              <p className="mb-2 px-3 text-xs font-semibold text-muted-foreground">Resources</p>
              {resources.map((r) => (
                <a key={r.label} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <ExternalLink className="h-3 w-3" />
                  <span>{r.label}</span>
                </a>
              ))}
            </div>
          </div>
        </nav>

        <div className="min-w-0 flex-1">
          <motion.div key={current.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">{current.icon}</div>
                  <h2 className="text-lg font-bold text-foreground">{current.title}</h2>
                </div>
                {current.content}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
