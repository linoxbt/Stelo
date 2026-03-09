import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "@/components/Web3Provider";
import { LoadingSplash } from "@/components/LoadingSplash";
import { OnboardingTour } from "@/components/OnboardingTour";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Markets from "./pages/Markets";
import Positions from "./pages/Positions";
import HealthMonitor from "./pages/HealthMonitor";
import Swap from "./pages/Swap";
import Liquidity from "./pages/Liquidity";
import Faucet from "./pages/Faucet";
import Staking from "./pages/Staking";
import Governance from "./pages/Governance";
import Liquidation from "./pages/Liquidation";
import Community from "./pages/Community";
import DeployGuide from "./pages/DeployGuide";
import Docs from "./pages/Docs";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import { AIChatBot } from "./components/AIChatBot";
import "@/lib/i18n";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSplash />;
  }

  return (
    <Web3Provider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AIChatBot />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/health" element={<HealthMonitor />} />
            <Route path="/swap" element={<Swap />} />
            <Route path="/liquidity" element={<Liquidity />} />
            <Route path="/faucet" element={<Faucet />} />
            <Route path="/staking" element={<Staking />} />
            <Route path="/governance" element={<Governance />} />
            <Route path="/liquidation" element={<Liquidation />} />
            <Route path="/community" element={<Community />} />
            <Route path="/deploy" element={<DeployGuide />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <OnboardingTour />
        </BrowserRouter>
      </TooltipProvider>
    </Web3Provider>
  );
};

export default App;
