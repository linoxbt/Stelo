export function NetworkBadge({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] text-primary">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
        Rialo Testnet
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
      Rialo Testnet
    </div>
  );
}
