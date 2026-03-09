import { useState } from "react";
import { motion } from "framer-motion";
import { Gavel, Wallet, Loader2, Vote, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import { useVirtualState } from "@/hooks/use-virtual-state";

interface Proposal {
  id: number;
  title: string;
  description: string;
  status: "active" | "passed" | "failed";
  forVotes: number;
  againstVotes: number;
  endDate: string;
}

const proposals: Proposal[] = [
  { id: 1, title: "Increase WETH collateral factor to 82%", description: "Adjust the WETH collateral factor from 78% to 82% to improve capital efficiency.", status: "active", forVotes: 1250000, againstVotes: 320000, endDate: "3 days" },
  { id: 2, title: "Add ALND/RLO liquidity pool", description: "Create a new ALND/RLO liquidity pool with 0.3% swap fee and 28% APR incentive.", status: "active", forVotes: 890000, againstVotes: 150000, endDate: "5 days" },
  { id: 3, title: "Reduce liquidation penalty to 4%", description: "Lower the liquidation penalty from 5% to 4% to reduce cascading liquidations.", status: "passed", forVotes: 2100000, againstVotes: 450000, endDate: "Ended" },
  { id: 4, title: "Treasury grant for security audit", description: "Allocate 50,000 ALND from treasury for a comprehensive smart contract audit.", status: "passed", forVotes: 3200000, againstVotes: 100000, endDate: "Ended" },
];

export default function Governance() {
  const { connected } = useWalletState();
  const { address } = useAccount();
  const { toast } = useToast();
  const vs = useVirtualState(address);
  const [voting, setVoting] = useState<number | null>(null);

  const totalStaked = vs.state.staking.reduce((s, p) => s + p.amount, 0);
  const votingPower = totalStaked;

  const handleVote = async (proposalId: number, support: boolean) => {
    setVoting(proposalId);
    await new Promise((r) => setTimeout(r, 1500));
    toast({
      title: support ? "Voted For" : "Voted Against",
      description: `Cast ${votingPower.toFixed(0)} ALND votes on proposal #${proposalId}`,
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

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Governance</h1>
        <p className="mt-1 text-sm text-muted-foreground">Vote on proposals using your staked ALND tokens.</p>
      </div>

      {/* Voting power */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Gavel className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-primary">Your Voting Power</p>
              <p className="text-xs text-primary/70">Based on staked ALND</p>
            </div>
          </div>
          <p className="text-lg font-bold text-primary">{votingPower.toFixed(0)} ALND</p>
        </CardContent>
      </Card>

      {/* Proposals */}
      <div className="space-y-4">
        {proposals.map((p) => {
          const total = p.forVotes + p.againstVotes;
          const forPct = total > 0 ? (p.forVotes / total) * 100 : 0;
          return (
            <Card key={p.id} className="border-border bg-card">
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

                {p.status === "active" && (
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" disabled={votingPower <= 0 || voting === p.id} onClick={() => handleVote(p.id, true)}>
                      {voting === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Vote For"}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" disabled={votingPower <= 0 || voting === p.id} onClick={() => handleVote(p.id, false)}>
                      Vote Against
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
