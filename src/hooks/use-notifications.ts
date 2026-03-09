import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface NotificationPayload {
  wallet_address: string;
  type: "price_alert" | "health_factor";
  title: string;
  message: string;
}

export function useNotifications() {
  const sendNotification = useCallback(async (payload: NotificationPayload) => {
    try {
      const { data, error } = await supabase.functions.invoke("send-notification", {
        body: payload,
      });

      if (error) {
        console.error("Failed to send notification:", error);
        return false;
      }

      return data?.success ?? false;
    } catch (e) {
      console.error("Notification error:", e);
      return false;
    }
  }, []);

  const notifyPriceAlert = useCallback(
    async (
      walletAddress: string,
      token: string,
      condition: "above" | "below",
      targetPrice: number,
      currentPrice: number
    ) => {
      return sendNotification({
        wallet_address: walletAddress,
        type: "price_alert",
        title: `🔔 Price Alert: ${token}`,
        message: `${token} is now ${condition === "above" ? "above" : "below"} your target of $${targetPrice.toFixed(2)}. Current price: $${currentPrice.toFixed(2)}`,
      });
    },
    [sendNotification]
  );

  const notifyHealthFactor = useCallback(
    async (walletAddress: string, healthFactor: number, threshold: number) => {
      const severity =
        threshold <= 1 ? "🚨 CRITICAL" : threshold <= 1.2 ? "⚠️ WARNING" : "ℹ️ NOTICE";
      
      return sendNotification({
        wallet_address: walletAddress,
        type: "health_factor",
        title: `${severity}: Health Factor Alert`,
        message: `Your health factor has dropped to ${healthFactor.toFixed(2)}, which is ${threshold <= 1 ? "at liquidation risk" : threshold <= 1.2 ? "in the caution zone" : "below the early warning threshold"}. Consider adding collateral or repaying debt to improve your position.`,
      });
    },
    [sendNotification]
  );

  return { sendNotification, notifyPriceAlert, notifyHealthFactor };
}
