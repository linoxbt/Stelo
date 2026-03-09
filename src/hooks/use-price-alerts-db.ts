import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications } from "./use-notifications";
import { toast } from "sonner";

interface PriceAlert {
  id: string;
  wallet_address: string;
  token: string;
  condition: "above" | "below";
  target_price: number;
  triggered: boolean;
  notified: boolean;
  created_at: string;
}

export function usePriceAlertsDb(walletAddress?: string, prices?: Record<string, number>) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { notifyPriceAlert } = useNotifications();

  // Fetch alerts from database
  const fetchAlerts = useCallback(async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("price_alerts")
      .select("*")
      .eq("wallet_address", walletAddress.toLowerCase())
      .order("created_at", { ascending: false });

    if (!error && data) {
      setAlerts(data as PriceAlert[]);
    }
    setLoading(false);
  }, [walletAddress]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Check and trigger alerts
  useEffect(() => {
    if (!prices || !walletAddress) return;

    alerts.forEach(async (alert) => {
      if (alert.triggered) return;
      
      const currentPrice = prices[alert.token] || 0;
      const shouldTrigger =
        (alert.condition === "above" && currentPrice >= alert.target_price) ||
        (alert.condition === "below" && currentPrice <= alert.target_price);

      if (shouldTrigger) {
        // Update alert as triggered
        await supabase
          .from("price_alerts")
          .update({ triggered: true, notified: true })
          .eq("id", alert.id);

        // Send notification
        await notifyPriceAlert(
          walletAddress,
          alert.token,
          alert.condition,
          alert.target_price,
          currentPrice
        );

        // Show toast
        toast.success(`🔔 ${alert.token} Alert Triggered!`, {
          description: `Price ${alert.condition === "above" ? "rose above" : "dropped below"} $${alert.target_price.toFixed(2)}. Current: $${currentPrice.toFixed(2)}`,
        });

        // Refresh alerts
        fetchAlerts();
      }
    });
  }, [prices, alerts, walletAddress, notifyPriceAlert, fetchAlerts]);

  // Create new alert
  const createAlert = useCallback(
    async (token: string, condition: "above" | "below", targetPrice: number) => {
      if (!walletAddress) return null;

      const { data, error } = await supabase
        .from("price_alerts")
        .insert({
          wallet_address: walletAddress.toLowerCase(),
          token,
          condition,
          target_price: targetPrice,
        })
        .select()
        .single();

      if (!error && data) {
        setAlerts((prev) => [data as PriceAlert, ...prev]);
        return data;
      }
      return null;
    },
    [walletAddress]
  );

  // Delete alert
  const deleteAlert = useCallback(async (id: string) => {
    const { error } = await supabase.from("price_alerts").delete().eq("id", id);
    if (!error) {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }
  }, []);

  return {
    alerts,
    loading,
    createAlert,
    deleteAlert,
    refetch: fetchAlerts,
  };
}
