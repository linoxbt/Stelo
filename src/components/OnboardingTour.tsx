import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Wallet, BarChart3, Coins, Shield, Droplets, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TOUR_KEY = "arclend_onboarding_done";

const steps = [
  {
    icon: Wallet,
    title: "Welcome to ArcLend",
    description: "Your all-in-one DeFi protocol on Rialo Network. Let's take a quick tour of the key features.",
  },
  {
    icon: BarChart3,
    title: "Dashboard & Analytics",
    description: "Track your portfolio value, health factor, and protocol stats in real-time from the dashboard.",
    route: "/dashboard",
  },
  {
    icon: Coins,
    title: "Lending & Borrowing",
    description: "Supply assets to earn yield or borrow against your collateral. Visit Markets to see available assets.",
    route: "/markets",
  },
  {
    icon: Droplets,
    title: "Swap & Liquidity",
    description: "Swap tokens instantly or provide liquidity to earn trading fees from every swap.",
    route: "/swap",
  },
  {
    icon: Shield,
    title: "Health Monitoring & Alerts",
    description: "Set up email and Telegram alerts for price changes and health factor warnings to stay safe.",
    route: "/health",
  },
  {
    icon: Zap,
    title: "Get Started!",
    description: "Claim free testnet tokens from the Faucet and start exploring. Happy DeFi-ing!",
    route: "/faucet",
  },
];

export function OnboardingTour() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const done = localStorage.getItem(TOUR_KEY);
    if (!done) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(TOUR_KEY, "true");
  };

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
      navigate("/faucet");
    }
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const current = steps[step];

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[90] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          key={step}
          className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={dismiss}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <current.icon className="h-7 w-7 text-primary" />
            </div>

            <h2 className="mb-2 text-lg font-bold text-foreground">{current.title}</h2>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{current.description}</p>

            {/* Progress dots */}
            <div className="mb-5 flex gap-1.5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            <div className="flex w-full gap-3">
              {step > 0 && (
                <Button variant="outline" onClick={prev} className="flex-1">
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back
                </Button>
              )}
              <Button onClick={next} className="flex-1">
                {step === steps.length - 1 ? "Get Started" : "Next"}
                {step < steps.length - 1 && <ArrowRight className="ml-1 h-4 w-4" />}
              </Button>
            </div>

            <button onClick={dismiss} className="mt-3 text-xs text-muted-foreground hover:text-foreground">
              Skip tour
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
