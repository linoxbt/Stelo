import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp, Settings, RefreshCw, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWalletState, WalletButton } from "@/components/WalletButton";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import { useVirtualState } from "@/hooks/use-virtual-state";
import { TokenIcon } from "@/components/TokenIcon";

const tokens = [
  { symbol: "RIA", name: "Rialo" },
  { symbol: "WETH", name: "Wrapped Ether" },
  { symbol: "USDT", name: "Tether USD" },
  { symbol: "ALND", name: "ArcLend Token" },
];

export default function Swap() {
  const { connected } = useWalletState();
  const { address } = useAccount();
  const { toast } = useToast();
  const vs = useVirtualState(address);
  const [fromToken, setFromToken] = useState("RIA");
  const [toToken, setToToken] = useState("USDT");
  const [fromAmount, setFromAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [swapping, setSwapping] = useState(false);

  const handleSwap = async () => {
    const num = parseFloat(fromAmount);
    if (isNaN(num) || num <= 0) return;
    setSwapping(true);
    await new Promise((r) => setTimeout(r, 1500));
    const result = vs.swap(fromToken, toToken, num);
    if (result !== false) {
      toast({ title: "Swap Successful", description: `Swapped ${num} ${fromToken} for ${(result as number).toFixed(4)} ${toToken}` });
      setFromAmount("");
    } else {
      toast({ title: "Swap Failed", description: "Insufficient balance", variant: "destructive" });
    }
    setSwapping(false);
  };

  const flipTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const fromPrice = vs.prices[fromToken] || 0;
  const toPrice = vs.prices[toToken] || 0;
  const estimatedOutput = fromAmount && fromPrice && toPrice
    ? ((parseFloat(fromAmount) * fromPrice) / toPrice * 0.997).toFixed(4)
    : "";
  const rate = fromPrice && toPrice ? (fromPrice / toPrice).toFixed(4) : "--";
  const fromBalance = vs.state.balances[fromToken] || 0;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-lg">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glow-purple border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-foreground">
                <span>Swap</span>
                <div className="flex items-center gap-1.5">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSettingsOpen(true)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <p className="text-xs text-muted-foreground">Exchange tokens instantly on Rialo Testnet</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* From */}
              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">From</span>
                  <span className="text-xs text-muted-foreground">Balance: {fromBalance.toFixed(4)} {fromToken}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={fromToken} onValueChange={setFromToken}>
                    <SelectTrigger className="h-10 w-36 border-border bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.filter(t => t.symbol !== toToken).map(t => (
                        <SelectItem key={t.symbol} value={t.symbol}>
                          <span className="flex items-center gap-2"><TokenIcon symbol={t.symbol} size="sm" /> {t.symbol}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="0.0"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="border-0 bg-transparent text-right text-xl font-bold text-foreground shadow-none focus-visible:ring-0"
                  />
                  <Button variant="ghost" size="sm" className="shrink-0 text-xs text-primary" onClick={() => setFromAmount(fromBalance.toString())}>MAX</Button>
                </div>
              </div>

              <div className="flex justify-center">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-border" onClick={flipTokens}>
                  <ArrowDownUp className="h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">To</span>
                  <span className="text-xs text-muted-foreground">Balance: {(vs.state.balances[toToken] || 0).toFixed(4)} {toToken}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={toToken} onValueChange={setToToken}>
                    <SelectTrigger className="h-10 w-36 border-border bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.filter(t => t.symbol !== fromToken).map(t => (
                        <SelectItem key={t.symbol} value={t.symbol}>
                          <span className="flex items-center gap-2"><TokenIcon symbol={t.symbol} size="sm" /> {t.symbol}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="0.0"
                    value={estimatedOutput}
                    disabled
                    className="border-0 bg-transparent text-right text-xl font-bold text-foreground shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex justify-between"><span>Rate</span><span className="text-foreground">1 {fromToken} = {rate} {toToken}</span></div>
                <div className="flex justify-between"><span>Slippage</span><span className="text-foreground">{slippage}%</span></div>
                <div className="flex justify-between"><span>Fee</span><span className="text-foreground">0.3%</span></div>
              </div>

              {connected ? (
                <Button className="w-full glow-purple" disabled={!fromAmount || swapping} onClick={handleSwap}>
                  {swapping ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Swapping...</> : "Swap"}
                </Button>
              ) : (
                <div className="flex justify-center"><WalletButton /></div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-4 border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-foreground">Token Prices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tokens.map((t) => (
                <div key={t.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TokenIcon symbol={t.symbol} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.symbol}</p>
                      <p className="text-xs text-muted-foreground">{t.name}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-foreground">${(vs.prices[t.symbol] || 0).toFixed(2)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="border-border bg-card sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Swap Settings</DialogTitle>
            <DialogDescription className="text-muted-foreground">Configure slippage tolerance</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="mb-2 block text-xs text-muted-foreground">Slippage Tolerance</label>
              <div className="flex gap-2">
                {["0.1", "0.5", "1.0"].map(v => (
                  <Button key={v} variant={slippage === v ? "default" : "outline"} size="sm" onClick={() => setSlippage(v)}>
                    {v}%
                  </Button>
                ))}
                <Input value={slippage} onChange={(e) => setSlippage(e.target.value)} className="w-20 border-border bg-secondary text-center text-sm" placeholder="%" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
