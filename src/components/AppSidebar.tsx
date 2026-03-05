import { LayoutDashboard, Store, Layers, Activity, BookOpen, ArrowLeftRight, Droplets, Coins, Rocket, X, Users, Shield, Gavel, Lock } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { WalletButton } from "./WalletButton";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Markets", url: "/markets", icon: Store },
  { title: "Swap", url: "/swap", icon: ArrowLeftRight },
  { title: "Liquidity", url: "/liquidity", icon: Droplets },
  { title: "Positions", url: "/positions", icon: Layers },
  { title: "Staking", url: "/staking", icon: Lock },
  { title: "Faucet", url: "/faucet", icon: Coins },
  { title: "Health Monitor", url: "/health", icon: Activity },
  { title: "Liquidation", url: "/liquidation", icon: Shield },
  { title: "Governance", url: "/governance", icon: Gavel },
  { title: "Community", url: "/community", icon: Users },
  { title: "Deploy", url: "/deploy", icon: Rocket },
  { title: "Docs", url: "/docs", icon: BookOpen },
];

export function AppSidebar({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      <div className="flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="ArcLend" className="h-8 w-8" />
          <span className="text-lg font-bold text-foreground">ArcLend</span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button onClick={onClose} className="text-muted-foreground md:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {items.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <WalletButton />
      </div>
    </div>
  );
}
