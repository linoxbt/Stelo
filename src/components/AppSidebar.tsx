import { LayoutDashboard, Store, Layers, Activity, BookOpen, ArrowLeftRight, Droplets, Coins, Rocket, X, Users, Shield, Gavel, Lock, BarChart3 } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "@/assets/logo.png";
import { WalletButton } from "./WalletButton";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";

const items = [
  { titleKey: "dashboard", url: "/dashboard", icon: LayoutDashboard },
  { titleKey: "markets", url: "/markets", icon: Store },
  { titleKey: "analytics", url: "/analytics", icon: BarChart3 },
  { titleKey: "swap", url: "/swap", icon: ArrowLeftRight },
  { titleKey: "liquidity", url: "/liquidity", icon: Droplets },
  { titleKey: "positions", url: "/positions", icon: Layers },
  { titleKey: "staking", url: "/staking", icon: Lock },
  { titleKey: "faucet", url: "/faucet", icon: Coins },
  { titleKey: "healthMonitor", url: "/health", icon: Activity },
  { titleKey: "liquidation", url: "/liquidation", icon: Shield },
  { titleKey: "governance", url: "/governance", icon: Gavel },
  { titleKey: "community", url: "/community", icon: Users },
  { titleKey: "deploy", url: "/deploy", icon: Rocket },
  { titleKey: "docs", url: "/docs", icon: BookOpen },
];

export function AppSidebar({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      <div className="flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="ArcLend" className="h-8 w-8" />
          <span className="text-lg font-bold text-foreground">ArcLend</span>
        </Link>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <button onClick={onClose} className="text-muted-foreground md:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {items.map((item) => (
          <NavLink
            key={item.titleKey}
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
            <span>{t(item.titleKey)}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <WalletButton />
      </div>
    </div>
  );
}
