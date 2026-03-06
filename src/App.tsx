import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "@/components/Web3Provider";
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
import NotFound from "./pages/NotFound";
import { AIChatBot } from "./components/AIChatBot";

const App = () => (
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </Web3Provider>
);

export default App;
