import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Wallet, Loader2, Code, Image, Coins, Shield, Settings, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useToast } from "@/hooks/use-toast";

interface ContractTemplate {
  id: string;
  icon: React.ReactNode;
  category: string;
  name: string;
  description: string;
  params: string[];
}

const templates: ContractTemplate[] = [
  { id: "erc20", icon: <Coins className="h-5 w-5" />, category: "Token", name: "ERC-20 Token", description: "Standard fungible token with customizable name, symbol, and supply.", params: ["Token Name", "Symbol", "Initial Supply", "Decimals"] },
  { id: "erc721", icon: <Image className="h-5 w-5" />, category: "NFT", name: "ERC-721 NFT", description: "Non-fungible token for unique digital assets and collectibles.", params: ["Collection Name", "Symbol", "Base URI"] },
  { id: "erc1155", icon: <Coins className="h-5 w-5" />, category: "Token", name: "ERC-1155 Multi Token", description: "Multi-token standard for fungible and non-fungible items in one contract.", params: ["URI"] },
  { id: "staking", icon: <Settings className="h-5 w-5" />, category: "DeFi", name: "Staking Contract", description: "Allow users to stake tokens and earn rewards over time.", params: ["Staking Token", "Reward Token", "Reward Rate"] },
  { id: "multisig", icon: <Shield className="h-5 w-5" />, category: "Security", name: "Multi-Sig Wallet", description: "Multi-signature wallet requiring multiple approvals for transactions.", params: ["Owners (comma-separated)", "Required Confirmations"] },
  { id: "vesting", icon: <Lock className="h-5 w-5" />, category: "DeFi", name: "Token Vesting", description: "Time-locked token release schedule for team, investors, or community.", params: ["Token Address", "Beneficiary", "Duration (days)", "Cliff (days)"] },
  { id: "custom", icon: <Code className="h-5 w-5" />, category: "Custom", name: "Custom Contract", description: "Deploy any compiled smart contract with your own bytecode and constructor args.", params: [] },
];

const categories = ["All", "Token", "NFT", "DeFi", "Security", "Custom"];

export default function DeployGuide() {
  const { connected } = useWalletState();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("All");
  const [deployOpen, setDeployOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [customBytecode, setCustomBytecode] = useState("");
  const [deploying, setDeploying] = useState(false);

  const filtered = activeCategory === "All" ? templates : templates.filter(t => t.category === activeCategory);

  const openDeploy = (template: ContractTemplate) => {
    if (!connected) {
      toast({ title: "Connect wallet first", description: "Connect your wallet to Rialo Network to deploy contracts.", variant: "destructive" });
      return;
    }
    setSelectedTemplate(template);
    setParamValues({});
    setCustomBytecode("");
    setDeployOpen(true);
  };

  const handleDeploy = async () => {
    setDeploying(true);
    await new Promise(r => setTimeout(r, 2000));
    toast({
      title: "Deployment Not Available",
      description: "Connect to Rialo Network and ensure you have RLO for gas fees. Contract deployment coming soon.",
    });
    setDeploying(false);
    setDeployOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Deploy Contracts</h1>
        <p className="mt-1 text-sm text-muted-foreground">Deploy smart contracts to Rialo Network. Choose a template or deploy your own custom contract.</p>
      </div>

      {!connected && (
        <Card className="mb-6 border-border bg-card">
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <Wallet className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Connect your wallet to deploy contracts</p>
            <WalletButton />
          </CardContent>
        </Card>
      )}

      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map(c => (
          <Button key={c} variant={activeCategory === c ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(c)}>
            {c}
          </Button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template, i) => (
          <motion.div key={template.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-border bg-card transition-all hover:border-primary/30 cursor-pointer" onClick={() => openDeploy(template)}>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {template.icon}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{template.category}</p>
                    <p className="text-sm font-bold text-foreground">{template.name}</p>
                  </div>
                </div>
                <p className="mb-3 text-xs text-muted-foreground">{template.description}</p>
                <p className="text-[10px] text-muted-foreground">
                  {template.params.length > 0 ? `${template.params.length} parameters` : "Custom bytecode"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Deploy Dialog */}
      <Dialog open={deployOpen} onOpenChange={setDeployOpen}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Rocket className="h-5 w-5 text-primary" />
              Deploy {selectedTemplate?.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Deploying to Rialo Network
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {selectedTemplate?.id === "custom" ? (
              <>
                <div>
                  <label className="mb-1.5 block text-xs text-muted-foreground">Contract Bytecode</label>
                  <Textarea
                    placeholder="0x..."
                    value={customBytecode}
                    onChange={(e) => setCustomBytecode(e.target.value)}
                    className="min-h-[100px] border-border bg-secondary font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-muted-foreground">Constructor Arguments (ABI-encoded, optional)</label>
                  <Input placeholder="0x..." className="border-border bg-secondary font-mono text-xs" />
                </div>
              </>
            ) : (
              selectedTemplate?.params.map((param) => (
                <div key={param}>
                  <label className="mb-1.5 block text-xs text-muted-foreground">{param}</label>
                  <Input
                    placeholder={param}
                    value={paramValues[param] || ""}
                    onChange={(e) => setParamValues({ ...paramValues, [param]: e.target.value })}
                    className="border-border bg-secondary"
                  />
                </div>
              ))
            )}

            <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Network</span><span className="text-foreground">Rialo Testnet</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Gas</span><span className="text-foreground">~0.01 RIA</span>
              </div>
            </div>

            <Button className="w-full glow-purple" disabled={deploying} onClick={handleDeploy}>
              {deploying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deploying...</> : <><Rocket className="mr-2 h-4 w-4" /> Deploy Contract</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
