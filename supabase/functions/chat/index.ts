import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the Stelo Finance Assistant, a knowledgeable, friendly DeFi guide built into the Stelo Finance interface.

ABOUT STELO FINANCE:
Stelo Finance is the Unified Liquidity Layer for Rialo Network. It combines lending and borrowing, token swaps, liquidity pools, staking, and governance into a single unified protocol. It draws inspiration from Aave's proven lending model but is purpose-built for the Rialo Network ecosystem. Stelo Finance is built and developed by Lino.

1. LENDING & BORROWING
- Supply supported assets (RLO, USDT, STL, RIA) into lending pools to earn variable interest (Supply APY).
- Borrow against supplied collateral. Each asset has a Loan-to-Value (LTV) ratio (currently 75%) that determines how much you can borrow relative to your collateral value.
- A Health Factor (HF) tracks position safety: HF = (Collateral x Price x Liquidation Threshold) / (Debt x Price). If HF drops below 1.0, your position may be liquidated.
- Liquidation carries a 5% penalty. Liquidators repay the debt and receive the collateral plus the bonus.
- Interest rates are variable and determined by pool utilization.

2. TOKEN SWAP
- Stelo includes a built-in AMM (Automated Market Maker) for instant token swaps.
- A 0.3% swap fee is charged on every trade. Users can configure slippage tolerance.

3. LIQUIDITY POOLS
- Users can provide liquidity to pairs like RLO/USDT, RLO/STL, STL/USDT, RIA/USDT.
- Liquidity providers earn a share of the 0.3% trading fees proportional to their share of the pool.

4. STAKING
- Stake STL tokens to earn staking rewards. Rewards come from protocol revenue.
- Lock tiers: Flexible (8% APY, 1x), 30 days (10% APY, 1.25x), 90 days (12% APY, 1.5x), 180 days (16% APY, 2x), 365 days (24% APY, 3x).
- Unstaking has a 3-day warmup period. Staked STL grants governance voting power (1 staked STL = 1 vote).

5. HEALTH FACTOR & ALERTS
- HF >= 2.0 = Safe, 1.5-2.0 = Early Warning, 1.2-1.5 = Caution, 1.0-1.2 = High Risk, < 1.0 = Liquidation.
- Users can configure alert thresholds and receive notifications via email or Telegram.

6. FAUCET
- Testnet faucet: 100 RLO, 1,000 USDT, 100 STL, 200 RIA. 24-hour cooldown.

7. GOVERNANCE
- STL holders who have staked can vote on protocol proposals.

8. SUPPORTED ASSETS
- RLO: Rialo Network's native gas and utility token.
- USDT: Tether USD stablecoin.
- STL: Stelo Finance's governance and staking token.
- RIA: Rialo ecosystem token.

ABOUT RIALO NETWORK:
- Rialo Network is an EVM-compatible Layer 1 blockchain focused on scalable, low-cost dApps.
- Native token is RLO. Currently in testnet phase. Stelo is one of the first protocols building on Rialo.
- Official website: https://rialo.network | Twitter/X: https://x.com/riaboreal
- Chain ID 9876, RPC: https://testnet-rpc.rialo.network

BEHAVIOR:
- Be concise, helpful, and friendly.
- Never provide financial advice. Always remind users that DeFi carries risks.
- The current deployment is on Rialo Testnet. All balances and transactions are simulated.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
