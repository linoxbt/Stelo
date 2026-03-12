import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  wallet_address: string;
  type: "price_alert" | "health_factor" | "liquidation";
  title: string;
  message: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { wallet_address, type, title, message }: NotificationRequest = await req.json();

    if (!wallet_address || !type || !title || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user's alert settings
    const { data: settings, error: settingsError } = await supabase
      .from("alert_settings")
      .select("*")
      .eq("wallet_address", wallet_address.toLowerCase())
      .single();

    if (settingsError || !settings) {
      return new Response(
        JSON.stringify({ success: false, message: "No alert settings found" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: { email?: boolean; telegram?: boolean } = {};

    // Send email notification via Resend
    if (settings.email) {
      try {
        const emailResult = await sendEmailViaResend(settings.email, title, message);
        results.email = emailResult;
      } catch (e) {
        console.error("Email notification failed:", e);
        results.email = false;
      }
    }

    // Send Telegram notification
    if (settings.telegram) {
      try {
        const telegramResult = await sendTelegramNotification(settings.telegram, title, message);
        results.telegram = telegramResult;
      } catch (e) {
        console.error("Telegram notification failed:", e);
        results.telegram = false;
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function sendEmailViaResend(
  email: string,
  subject: string,
  body: string
): Promise<boolean> {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

  if (!RESEND_API_KEY) {
    console.error("[EMAIL] RESEND_API_KEY not configured");
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Stelo Protocol <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #7c3aed; font-size: 24px; margin: 0;">Stelo Protocol</h1>
            <p style="color: #6b7280; font-size: 12px; margin-top: 4px;">DeFi on Rialo Network</p>
          </div>
          <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 16px;">
            <h2 style="color: #1f2937; font-size: 18px; margin: 0 0 12px 0;">${subject}</h2>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0;">${body}</p>
          </div>
          <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 11px;">This is an automated alert from Stelo Protocol. You configured this alert in your Health Monitor settings.</p>
          </div>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("[EMAIL] Resend error:", err);
    return false;
  }

  console.log(`[EMAIL] Sent to ${email}: ${subject}`);
  return true;
}

async function sendTelegramNotification(
  chatIdOrUsername: string,
  title: string,
  message: string
): Promise<boolean> {
  const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");

  if (!TELEGRAM_BOT_TOKEN) {
    console.error("[TELEGRAM] TELEGRAM_BOT_TOKEN not configured");
    return false;
  }

  // Use chat_id directly (users should provide their chat ID, or we try username)
  const chatId = chatIdOrUsername.startsWith("@") ? chatIdOrUsername : chatIdOrUsername;

  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `🔔 *${title}*\n\n${message}\n\n_Stelo Protocol on Rialo Network_`,
        parse_mode: "Markdown",
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error("[TELEGRAM] Error:", err);
    return false;
  }

  console.log(`[TELEGRAM] Sent to ${chatId}: ${title}`);
  return true;
}
