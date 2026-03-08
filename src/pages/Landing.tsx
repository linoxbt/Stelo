import { motion } from "framer-motion";
import { ArrowRight, Layers, ArrowLeftRight, Droplets, Coins, Shield, Zap, BarChart3 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WalletButton } from "@/components/WalletButton";
import { useWalletState } from "@/components/WalletButton";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";

const features = [
  { icon: BarChart3, title: "Lending & Borrowing", desc: "Supply assets to earn yield or borrow against your collateral with dynamic interest rates." },
  { icon: ArrowLeftRight, title: "Token Swap", desc: "Swap tokens instantly with minimal slippage powered by AMM liquidity pools." },
  { icon: Droplets, title: "Liquidity Pools", desc: "Provide liquidity to earn 0.3% trading fees on every swap." },
  { icon: Coins, title: "Staking", desc: "Stake ALND to earn rewards with flexible or locked staking periods." },
  { icon: Shield, title: "Health Monitoring", desc: "Track your health factor and set up alerts to stay ahead of liquidation." },
  { icon: Zap, title: "Testnet Faucet", desc: "Claim free testnet tokens to start exploring the protocol." },
];

export default function Landing() {
  const navigate = useNavigate();
  const { connected } = useWalletState();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <nav className="border-b border-border/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="ArcLend" className="h-8 w-8" />
            <span className="text-lg font-bold text-foreground">ArcLend</span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <button onClick={() => navigate("/markets")} className="text-sm text-muted-foreground hover:text-foreground">Markets</button>
            <button onClick={() => navigate("/swap")} className="text-sm text-muted-foreground hover:text-foreground">Swap</button>
            <button onClick={() => navigate("/docs")} className="text-sm text-muted-foreground hover:text-foreground">Docs</button>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <WalletButton />
          </div>
        </div>
      </nav>

      <main className="flex flex-1 flex-col">
        <section className="dot-grid flex flex-1 flex-col items-center justify-center px-4 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Live on Rialo Testnet
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Your Complete
              <br />
              <span className="text-gradient-purple">DeFi Protocol</span>
            </h1>

            <p className="mx-auto mb-10 max-w-xl text-base text-muted-foreground sm:text-lg">
              Lend, borrow, swap, stake, and provide liquidity. All from one unified protocol on Rialo Network.
            </p>

            <div className="mb-16 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {connected ? (
                <Button size="lg" className="glow-purple bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => navigate("/dashboard")}>
                  Launch App <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <WalletButton />
              )}
              <Button variant="outline" size="lg" onClick={() => navigate("/docs")} className="border-border text-foreground hover:bg-secondary">
                Read the Docs
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto grid w-full max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((f, i) => (
              <div key={i} className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">{f.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </section>

        <section className="border-t border-border bg-card/50 px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">Get Started in Minutes</h2>
            <p className="mb-12 text-muted-foreground">No sign-ups. No KYC. Just connect and go.</p>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { step: "01", title: "Connect Wallet", desc: "Use MetaMask or any WalletConnect-compatible wallet." },
                { step: "02", title: "Claim Tokens", desc: "Visit the faucet to get free testnet tokens." },
                { step: "03", title: "Start Earning", desc: "Supply, borrow, swap, stake, and earn yield." },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center">
                  <span className="mb-3 inline-block text-3xl font-bold text-primary/30">{item.step}</span>
                  <h3 className="mb-2 text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
