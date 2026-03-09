import { useState, useEffect, useCallback } from "react";

interface TokenPrices {
  ETH: number;
  WETH: number;
  USDT: number;
  RLO: number;
}

const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price";
const IDS = "ethereum,tether";
const VS = "usd";

const FALLBACK: TokenPrices = { ETH: 2253.74, WETH: 2253.74, USDT: 0.99, RLO: 12.40 };

export function useTokenPrices() {
  const [prices, setPrices] = useState<TokenPrices>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${COINGECKO_API}?ids=${IDS}&vs_currencies=${VS}`);
      if (!res.ok) throw new Error("CoinGecko API error");
      const data = await res.json();
      setPrices({
        ETH: data.ethereum?.usd ?? FALLBACK.ETH,
        WETH: data.ethereum?.usd ?? FALLBACK.WETH,
        USDT: data.tether?.usd ?? FALLBACK.USDT,
        RLO: FALLBACK.RLO, // RLO not on CoinGecko, use static
      });
      setLastUpdated(new Date());
    } catch {
      // Keep fallback/last known prices on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60_000); // refresh every 60s
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { prices, loading, lastUpdated, refresh: fetchPrices };
}
