import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Bell, BellRing, Plus, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { TokenIcon } from "@/components/TokenIcon";
import { usePriceAlertsDb } from "@/hooks/use-price-alerts-db";

const TOKENS = ["RLO", "WETH", "USDT", "STL"];

interface PriceAlertsProps {
  prices: Record<string, number>;
  walletAddress?: string;
}

export function PriceAlerts({ prices, walletAddress }: PriceAlertsProps) {
  const { t } = useTranslation();
  const { alerts, loading, createAlert, deleteAlert } = usePriceAlertsDb(
    walletAddress,
    prices
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newAlert, setNewAlert] = useState({
    token: "WETH",
    condition: "above" as "above" | "below",
    targetPrice: "",
  });

  const handleCreateAlert = async () => {
    const targetPrice = parseFloat(newAlert.targetPrice);
    if (isNaN(targetPrice) || targetPrice <= 0) return;

    setCreating(true);
    const result = await createAlert(newAlert.token, newAlert.condition, targetPrice);
    setCreating(false);

    if (result) {
      setDialogOpen(false);
      setNewAlert({ token: "WETH", condition: "above", targetPrice: "" });
      toast.success(t("alertCreated"), {
        description: `${newAlert.token} ${newAlert.condition === "above" ? t("priceAbove") : t("priceBelow")} $${targetPrice}`,
      });
    } else {
      toast.error("Failed to create alert");
    }
  };

  const handleDeleteAlert = async (id: string) => {
    await deleteAlert(id);
  };

  const activeAlerts = alerts.filter((a) => !a.triggered);
  const triggeredAlerts = alerts.filter((a) => a.triggered);

  if (loading) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-foreground flex items-center gap-2">
          <Bell className="h-4 w-4" />
          {t("priceAlerts")}
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="h-7 text-xs">
              <Plus className="h-3 w-3 mr-1" />
              {t("setAlert")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("setAlert")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Token</Label>
                <Select
                  value={newAlert.token}
                  onValueChange={(v) => setNewAlert((p) => ({ ...p, token: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TOKENS.map((token) => (
                      <SelectItem key={token} value={token}>
                        <div className="flex items-center gap-2">
                          <TokenIcon symbol={token} size="sm" />
                          {token}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("alertWhen")}</Label>
                <Select
                  value={newAlert.condition}
                  onValueChange={(v) =>
                    setNewAlert((p) => ({ ...p, condition: v as "above" | "below" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">{t("priceAbove")}</SelectItem>
                    <SelectItem value="below">{t("priceBelow")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("targetPrice")} ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newAlert.targetPrice}
                  onChange={(e) =>
                    setNewAlert((p) => ({ ...p, targetPrice: e.target.value }))
                  }
                  placeholder={`${t("currentPrice")}: $${(prices[newAlert.token] || 0).toFixed(2)}`}
                />
              </div>
              <Button onClick={handleCreateAlert} className="w-full" disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  t("setAlert")
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-2">
        <AnimatePresence>
          {activeAlerts.length === 0 && triggeredAlerts.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground text-center py-4"
            >
              No active alerts
            </motion.p>
          )}
          {activeAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between rounded-lg bg-secondary/50 p-3"
            >
              <div className="flex items-center gap-2">
                <TokenIcon symbol={alert.token} size="sm" />
                <div>
                  <p className="text-xs font-medium text-foreground">
                    {alert.token} {alert.condition === "above" ? "↑" : "↓"} $
                    {Number(alert.target_price).toFixed(2)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {t("currentPrice")}: ${(prices[alert.token] || 0).toFixed(2)}
                  </p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => handleDeleteAlert(alert.id)}
              >
                <Trash2 className="h-3 w-3 text-muted-foreground" />
              </Button>
            </motion.div>
          ))}
          {triggeredAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between rounded-lg bg-primary/10 border border-primary/20 p-3"
            >
              <div className="flex items-center gap-2">
                <BellRing className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs font-medium text-foreground">
                    {alert.token} {alert.condition === "above" ? "↑" : "↓"} $
                    {Number(alert.target_price).toFixed(2)}
                  </p>
                  <p className="text-[10px] text-primary">
                    {t("alertTriggered")} {alert.notified && "• Notified ✓"}
                  </p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => handleDeleteAlert(alert.id)}
              >
                <Trash2 className="h-3 w-3 text-muted-foreground" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}