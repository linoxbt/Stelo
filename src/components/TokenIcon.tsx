import { cn } from "@/lib/utils";

const TOKEN_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  RIA: { bg: "bg-purple-500/20", text: "text-purple-400", label: "💎" },
  WETH: { bg: "bg-blue-500/20", text: "text-blue-400", label: "⟠" },
  USDT: { bg: "bg-green-500/20", text: "text-green-400", label: "₮" },
  ALND: { bg: "bg-indigo-500/20", text: "text-indigo-300", label: "A" },
};

export function TokenIcon({ symbol, size = "md" }: { symbol: string; size?: "sm" | "md" | "lg" }) {
  const style = TOKEN_STYLES[symbol] || { bg: "bg-muted", text: "text-muted-foreground", label: "?" };
  const sizeClass = size === "sm" ? "h-6 w-6 text-xs" : size === "lg" ? "h-10 w-10 text-lg" : "h-8 w-8 text-sm";

  if (symbol === "RIA" || symbol === "WETH" || symbol === "USDT") {
    return <span className={cn("flex items-center justify-center rounded-full", sizeClass)}>{style.label}</span>;
  }

  // ALND: navy circle with A
  return (
    <span className={cn("flex items-center justify-center rounded-full bg-indigo-900 font-bold text-white", sizeClass)}>
      {style.label}
    </span>
  );
}
