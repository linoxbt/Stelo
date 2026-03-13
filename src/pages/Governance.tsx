import { useState } from "react";
import { motion } from "framer-motion";
import { Gavel, Wallet, Loader2, Vote, Clock, ArrowLeft, CheckCircle, XCircle, Users, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import { useVirtualState } from "@/hooks/use-virtual-state";

interface Proposal {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  status: "active" | "passed" | "failed";
  forVotes: number;
  againstVotes: number;
  endDate: string;
  author: string;
  createdAt: string;
  quorum: number;
  discussionDays: number;
  votingDays: number;
  category: string;
  changes: string[];
}

const proposals: Proposal[] = [
  {
    id: 1,
    title: "Increase RLO collateral factor to 80%",
    description: "Adjust the RLO collateral factor from 75% to 80% to improve capital efficiency.",
    fullDescription: "This proposal seeks to increase the RLO collateral factor from the current 75% to 80%. RLO has consistently maintained strong liquidity and low volatility relative to other collateral types on Stelo Finance. Increasing the collateral factor will allow borrowers to access more capital against their RLO deposits, improving capital efficiency without significantly increasing liquidation risk.\n\nThe risk analysis shows that even during the most volatile 24-hour period in the past 6 months, RLO's price movement would not have triggered additional liquidations at the proposed 80% threshold. The liquidation engine's 5% bonus remains sufficient to incentivize timely liquidations.\n\nThis change aligns with industry standards — major lending protocols use 75-85% collateral factors for native tokens.",
    status: "active",
    forVotes: 1250000,
    againstVotes: 320000,
    endDate: "3 days",
    author: "0x3f4a...8c21",
    createdAt: "Mar 8, 2026",
    quorum: 500000,
    discussionDays: 3,
    votingDays: 4,
    category: "Parameters",
    changes: [
      "RLO collateral factor: 75% → 80%",
      "No change to liquidation threshold (remains 80%)",
      "No change to liquidation penalty (remains 5%)",
    ],
  },
  {
    id: 2,
    title: "Add STL/RLO liquidity pool",
    description: "Create a new STL/RLO liquidity pool with 0.3% swap fee and 28% APR incentive.",
    fullDescription: "This proposal creates a new STL/RLO liquidity pool to deepen on-chain liquidity for the protocol's governance token. Currently, STL can only be swapped via the STL/USDT pair, requiring two hops to convert between STL and RLO.\n\nA direct STL/RLO pair would reduce slippage for governance token trades, lower gas costs by eliminating multi-hop routing, and provide a new yield opportunity for community members who hold both tokens.\n\nThe proposed 20% APR incentive (funded from treasury) would run for 90 days to bootstrap initial liquidity. After the incentive period, the pool would sustain itself through organic trading fees. Treasury allocation requested: 25,000 STL over 90 days.\n\nRisk consideration: Adding a new pool splits liquidity across more pairs. However, the STL/RLO pair is expected to attract significant volume given RLO's role as the network's native token.",
    status: "active",
    forVotes: 890000,
    againstVotes: 150000,
    endDate: "5 days",
    author: "0x7b2e...d4f9",
    createdAt: "Mar 6, 2026",
    quorum: 500000,
    discussionDays: 3,
    votingDays: 4,
    category: "New Feature",
    changes: [
      "Create STL/RLO liquidity pool with 0.3% swap fee",
      "Allocate 25,000 STL from treasury for 90-day incentive program",
      "Enable multi-hop routing through new pair",
    ],
  },
  {
    id: 3,
    title: "Reduce liquidation penalty to 4%",
    description: "Lower the liquidation penalty from 5% to 4% to reduce cascading liquidations.",
    fullDescription: "This proposal reduces the liquidation bonus from 5% to 4%. Analysis of historical liquidation events on Stelo Finance testnet shows that the current 5% bonus, while effective at incentivizing liquidators, contributes to cascading liquidations during high-volatility periods.\n\nWhen a large position is liquidated at 5%, the resulting market impact can push other positions below their liquidation thresholds, creating a chain reaction. Reducing the bonus to 4% maintains sufficient incentive for liquidators while reducing the severity of cascading events.\n\nComparative analysis: Aave V3 uses 4-6.5% depending on the asset. A uniform 4% on Stelo Finance is conservative and appropriate for the current market depth.\n\nThe change would apply to all collateral types simultaneously. No per-asset differentiation is proposed at this time.",
    status: "passed",
    forVotes: 2100000,
    againstVotes: 450000,
    endDate: "Ended",
    author: "0x1c9d...a3e7",
    createdAt: "Feb 28, 2026",
    quorum: 500000,
    discussionDays: 3,
    votingDays: 4,
    category: "Parameters",
    changes: [
      "Liquidation penalty: 5% → 4% (all assets)",
      "Effective immediately after timelock period",
    ],
  },
  {
    id: 4,
    title: "Treasury grant for security audit",
    description: "Allocate 50,000 STL from treasury for a comprehensive smart contract audit.",
    fullDescription: "This proposal allocates 50,000 STL from the protocol treasury to fund a comprehensive security audit of all Stelo Finance smart contracts before mainnet deployment.\n\nThe audit would cover: Lending Pool, AMM, Staking Module, Liquidation Engine, Price Oracle integration, and all token contracts (nTokens, vDebt tokens).\n\nThree audit firms have been contacted for quotes:\n- Trail of Bits: ~45,000 STL equivalent\n- OpenZeppelin: ~55,000 STL equivalent  \n- Cyfrin: ~40,000 STL equivalent\n\nThe 50,000 STL budget provides a buffer for any additional reviews needed. The remaining funds after audit completion would be returned to the treasury.\n\nTimeline: Audit engagement would begin within 2 weeks of proposal passing, with estimated completion in 6-8 weeks. Mainnet deployment would proceed only after all critical and high-severity findings are resolved.\n\nThis is a critical prerequisite for mainnet launch and community trust.",
    status: "passed",
    forVotes: 3200000,
    againstVotes: 100000,
    endDate: "Ended",
    author: "0x9e5b...f2d8",
    createdAt: "Feb 20, 2026",
    quorum: 500000,
    discussionDays: 3,
    votingDays: 4,
    category: "Treasury",
    changes: [
      "Allocate 50,000 STL from treasury",
      "Engage audit firm within 2 weeks",
      "Block mainnet deployment until audit completion",
    ],
  },
];

export default function Governance() {
  const { connected } = useWalletState();
  const { address } = useAccount();
  const { toast } = useToast();
  const vs = useVirtualState(address);
  const [voting, setVoting] = useState<number | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [confirmVote, setConfirmVote] = useState<{ id: number; support: boolean } | null>(null);

  const totalStaked = vs.state.staking.reduce((s, p) => s + p.amount, 0);
  const votingPower = totalStaked;

  const handleVote = async (proposalId: number, support: boolean) => {
    setVoting(proposalId);
    setConfirmVote(null);
    await new Promise((r) => setTimeout(r, 1500));
    toast({
      title: support ? "✅ Voted For" : "❌ Voted Against",
      description: `Cast ${votingPower.toFixed(0)} STL votes on proposal #${proposalId}`,
    });
    setVoting(null);
  };

  if (!connected) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-bold text-foreground">Connect Your Wallet</h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">Connect to participate in governance.</p>
          <WalletButton />
        </div>
      </DashboardLayout>
    );
  }

  // Proposal Detail View
  if (selectedProposal) {
    const p = selectedProposal;
    const total = p.forVotes + p.againstVotes;
    const forPct = total > 0 ? (p.forVotes / total) * 100 : 0;
    const quorumReached = total >= p.quorum;

    return (
      <DashboardLayout>
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => { setSelectedProposal(null); setConfirmVote(null); }} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Proposals
          </Button>

          <div className="flex items-start gap-3 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-muted-foreground">#{p.id}</span>
                <Badge variant={p.status === "active" ? "default" : "secondary"} className={
                  p.status === "active" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                  p.status === "passed" ? "bg-primary/10 text-primary border-primary/20" :
                  "bg-red-500/10 text-red-500 border-red-500/20"
                }>
                  {p.status}
                </Badge>
                <Badge variant="outline" className="text-xs">{p.category}</Badge>
              </div>
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">{p.title}</h1>
            </div>
          </div>

          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 mb-6">
            <Card className="border-border bg-card">
              <CardContent className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Author</p>
                <p className="text-xs font-mono font-bold text-foreground">{p.author}</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Created</p>
                <p className="text-xs font-bold text-foreground">{p.createdAt}</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Voting Ends</p>
                <p className="text-xs font-bold text-foreground">{p.endDate}</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Quorum</p>
                <p className={`text-xs font-bold ${quorumReached ? "text-green-500" : "text-orange-500"}`}>
                  {quorumReached ? "Reached" : `${((total / p.quorum) * 100).toFixed(0)}%`}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" /> Full Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {p.fullDescription}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm">Proposed Changes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {p.changes.map((change, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{change}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm">Voting Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-green-500 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> For</span>
                    <span className="text-green-500">{(p.forVotes / 1e6).toFixed(2)}M STL ({forPct.toFixed(1)}%)</span>
                  </div>
                  <Progress value={forPct} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-red-500 flex items-center gap-1"><XCircle className="h-3 w-3" /> Against</span>
                    <span className="text-red-500">{(p.againstVotes / 1e6).toFixed(2)}M STL ({(100 - forPct).toFixed(1)}%)</span>
                  </div>
                  <Progress value={100 - forPct} className="h-2" />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                  <span>Total Votes</span>
                  <span className="text-foreground">{(total / 1e6).toFixed(2)}M STL</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Quorum Required</span>
                  <span className="text-foreground">{(p.quorum / 1e6).toFixed(2)}M STL</span>
                </div>
              </CardContent>
            </Card>

            {p.status === "active" && (
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm">Cast Your Vote</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-lg bg-secondary/30 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Your Voting Power</p>
                    <p className="text-lg font-bold text-foreground">{votingPower.toFixed(0)} STL</p>
                  </div>

                  {votingPower <= 0 && (
                    <p className="text-xs text-orange-500 text-center">Stake STL tokens to gain voting power</p>
                  )}

                  {confirmVote ? (
                    <div className="space-y-3">
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                        <p className="text-xs text-muted-foreground mb-1">Confirm your vote:</p>
                        <p className="text-sm font-bold text-foreground">
                          {confirmVote.support ? "✅ Vote FOR" : "❌ Vote AGAINST"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {votingPower.toFixed(0)} STL on Proposal #{confirmVote.id}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" disabled={voting === confirmVote.id} onClick={() => handleVote(confirmVote.id, confirmVote.support)}>
                          {voting === confirmVote.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => setConfirmVote(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" disabled={votingPower <= 0} onClick={() => setConfirmVote({ id: p.id, support: true })}>
                        Vote For
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" disabled={votingPower <= 0} onClick={() => setConfirmVote({ id: p.id, support: false })}>
                        Vote Against
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm">Proposal Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Discussion Period", value: `${p.discussionDays} days`, done: true },
                  { label: "Voting Period", value: `${p.votingDays} days`, done: p.status !== "active" },
                  { label: "Timelock", value: "2 days", done: p.status === "passed" },
                  { label: "Execution", value: p.status === "passed" ? "Completed" : "Pending", done: p.status === "passed" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <div className={`h-2 w-2 rounded-full ${item.done ? "bg-green-500" : "bg-muted-foreground/30"}`} />
                    <span className="flex-1 text-muted-foreground">{item.label}</span>
                    <span className="text-foreground">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Proposals List View
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Governance</h1>
        <p className="mt-1 text-sm text-muted-foreground">Vote on proposals using your staked STL tokens.</p>
      </div>

      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Gavel className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-primary">Your Voting Power</p>
              <p className="text-xs text-primary/70">Based on staked STL</p>
            </div>
          </div>
          <p className="text-lg font-bold text-primary">{votingPower.toFixed(0)} STL</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {proposals.map((p) => {
          const total = p.forVotes + p.againstVotes;
          const forPct = total > 0 ? (p.forVotes / total) * 100 : 0;
          return (
            <Card key={p.id} className="border-border bg-card hover:border-primary/20 transition-colors cursor-pointer" onClick={() => setSelectedProposal(p)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">#{p.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        p.status === "active" ? "bg-green-500/10 text-green-500" :
                        p.status === "passed" ? "bg-primary/10 text-primary" :
                        "bg-red-500/10 text-red-500"
                      }`}>
                        {p.status}
                      </span>
                      <Badge variant="outline" className="text-[10px]">{p.category}</Badge>
                    </div>
                    <h3 className="text-sm font-bold text-foreground">{p.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 ml-4">
                    <Clock className="h-3 w-3" />
                    <span>{p.endDate}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-green-500">For: {(p.forVotes / 1e6).toFixed(2)}M</span>
                    <span className="text-red-500">Against: {(p.againstVotes / 1e6).toFixed(2)}M</span>
                  </div>
                  <Progress value={forPct} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">by {p.author} • {p.createdAt}</span>
                  <Button size="sm" variant="ghost" className="text-xs text-primary" onClick={(e) => { e.stopPropagation(); setSelectedProposal(p); }}>
                    View Details →
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
