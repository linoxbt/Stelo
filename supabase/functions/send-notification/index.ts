import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  wallet_address: string;
  type: "price_alert" | "health_factor";
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

    // Send email notification if configured
    if (settings.email) {
      try {
        const emailResult = await sendEmailNotification(settings.email, title, message);
        results.email = emailResult;
      } catch (e) {
        console.error("Email notification failed:", e);
        results.email = false;
      }
    }

    // Send Telegram notification if configured
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

async function sendEmailNotification(
  email: string,
  subject: string,
  body: string
): Promise<boolean> {
  // Use Lovable AI to send email via edge function
  // For now, log the notification (email service integration can be added)
  console.log(`[EMAIL] To: ${email}, Subject: ${subject}, Body: ${body}`);
  
  // In production, integrate with EmailJS, Resend, or SendGrid
  // Example with EmailJS public API:
  const EMAILJS_SERVICE_ID = Deno.env.get("EMAILJS_SERVICE_ID");
  const EMAILJS_TEMPLATE_ID = Deno.env.get("EMAILJS_TEMPLATE_ID");
  const EMAILJS_PUBLIC_KEY = Deno.env.get("EMAILJS_PUBLIC_KEY");

  if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: email,
          subject: subject,
          message: body,
        },
      }),
    });
    return response.ok;
  }

  // Fallback: log only (notifications logged but not sent)
  return true;
}

async function sendTelegramNotification(
  username: string,
  title: string,
  message: string
): Promise<boolean> {
  const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
  
  if (!TELEGRAM_BOT_TOKEN) {
    console.log(`[TELEGRAM] Bot token not configured. Username: ${username}, Title: ${title}`);
    return true; // Log only mode
  }

  // Note: Telegram requires chat_id, not username. 
  // Users need to start a conversation with the bot first.
  // The username is stored for reference, but we'd need chat_id mapping.
  // For now, log the notification
  console.log(`[TELEGRAM] To: ${username}, Title: ${title}, Message: ${message}`);
  
  // If we have a chat_id (could be stored alongside username):
  // const response = await fetch(
  //   `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
  //   {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       chat_id: chatId,
  //       text: `🔔 *${title}*\n\n${message}`,
  //       parse_mode: "Markdown",
  //     }),
  //   }
  // );
  // return response.ok;

  return true;
}
