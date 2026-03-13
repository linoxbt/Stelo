import { cn } from "@/lib/utils";

const TOKEN_IMAGES: Record<string, string> = {
  RLO: "/assets/tokens/rlo.png",
  USDT: "/assets/tokens/usdt.png",
  STL: "/assets/tokens/stl.png",
  RIA: "/assets/tokens/ria.png",
};

export function TokenIcon({ symbol, size = "md" }: { symbol: string; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "h-6 w-6" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const src = TOKEN_IMAGES[symbol];

  if (src) {
    return (
      <img
        src={src}
        alt={symbol}
        className={cn("rounded-full object-cover", sizeClass)}
      />
    );
  }

  return (
    <span className={cn("flex items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground", sizeClass)}>
      {symbol?.slice(0, 3) || "?"}
    </span>
  );
}
