import { useState, useEffect, useCallback, useRef } from "react";

// Token prices (simulated with plus/minus 1% fluctuation)
export const BASE_PRICES: Record<string, number> = {
  RLO: 0.50,
  USDT: 1.0,
  STL: 10,
  RIA: 0.75,
};

export const INITIAL_BALANCES: Record<string, number> = {
  RLO: 100,
  USDT: 0,
  STL: 0,
  RIA: 0,
};

export const FAUCET_AMOUNTS: Record<string, number> = {
  RLO: 100,
  USDT: 1000,
  STL: 100,
  RIA: 200,
};

export const FAUCET_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24h

export interface SupplyPosition {
  asset: string;
  amount: number;
  apy: number;
  timestamp: number;
}

export interface BorrowPosition {
  asset: string;
  amount: number;
  apy: number;
  timestamp: number;
}

export interface LPPosition {
  tokenA: string;
  tokenB: string;
  amountA: number;
  amountB: number;
  lpTokens: number;
  timestamp: number;
}

export interface StakingPosition {
  amount: number;
  lockDays: number; // 0 = flexible
  startTime: number;
  unlockTime: number;
  claimedRewards: number;
  lastClaimTime: number;
}

export interface VirtualTx {
  id: string;
  type: "supply" | "withdraw" | "borrow" | "repay" | "swap" | "faucet" | "add_lp" | "remove_lp" | "stake" | "unstake" | "claim_rewards";
  asset: string;
  amount: number;
  timestamp: number;
  txHash: string;
}

export interface VirtualState {
  balances: Record<string, number>;
  supplies: SupplyPosition[];
  borrows: BorrowPosition[];
  lpPositions: LPPosition[];
  staking: StakingPosition[];
  stakingPendingWithdrawals: { amount: number; availableAt: number }[];
  faucetCooldowns: Record<string, number>;
  transactions: VirtualTx[];
  alertSettings: {
    at15: boolean;
    at12: boolean;
    at10: boolean;
    customThreshold: number | null;
    email: string;
    telegram: string;
  };
}

const DEFAULT_STATE: VirtualState = {
  balances: { ...INITIAL_BALANCES },
  supplies: [],
  borrows: [],
  lpPositions: [],
  staking: [],
  stakingPendingWithdrawals: [],
  faucetCooldowns: {},
  transactions: [],
  alertSettings: {
    at15: true,
    at12: true,
    at10: false,
    customThreshold: null,
    email: "",
    telegram: "",
  },
};

function getKey(address: string) {
  return `stelo_virtual_${address.toLowerCase()}`;
}

function loadState(address: string): VirtualState {
  try {
    let raw = localStorage.getItem(getKey(address));
    if (!raw) {
      raw = localStorage.getItem(`arclend_virtual_${address.toLowerCase()}`);
    }
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate: remove WETH balances if present
      if (parsed.balances && 'WETH' in parsed.balances) {
        delete parsed.balances.WETH;
      }
      return parsed;
    }
  } catch {}
  return { ...DEFAULT_STATE, balances: { ...INITIAL_BALANCES } };
}

function saveState(address: string, state: VirtualState) {
  localStorage.setItem(getKey(address), JSON.stringify(state));
}

function randomTxHash(): string {
  const hex = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 64; i++) hash += hex[Math.floor(Math.random() * 16)];
  return hash;
}

export function useVirtualState(address: string | undefined) {
  const [state, setState] = useState<VirtualState>(DEFAULT_STATE);
  const [prices, setPrices] = useState<Record<string, number>>({ ...BASE_PRICES });
  const addressRef = useRef(address);

  useEffect(() => {
    addressRef.current = address;
    if (address) {
      setState(loadState(address));
    } else {
      setState(DEFAULT_STATE);
    }
  }, [address]);

  useEffect(() => {
    if (addressRef.current) saveState(addressRef.current, state);
  }, [state]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) => {
        const next = { ...prev };
        for (const key of Object.keys(BASE_PRICES)) {
          const fluctuation = 1 + (Math.random() - 0.5) * 0.02;
          next[key] = BASE_PRICES[key] * fluctuation;
        }
        return next;
      });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const addTx = useCallback(
    (type: VirtualTx["type"], asset: string, amount: number) => {
      const tx: VirtualTx = {
        id: crypto.randomUUID(),
        type,
        asset,
        amount,
        timestamp: Date.now(),
        txHash: randomTxHash(),
      };
      setState((prev) => ({
        ...prev,
        transactions: [tx, ...prev.transactions].slice(0, 100),
      }));
      return tx;
    },
    []
  );

  const canClaim = useCallback(
    (token: string) => {
      const last = state.faucetCooldowns[token] || 0;
      return Date.now() - last >= FAUCET_COOLDOWN_MS;
    },
    [state.faucetCooldowns]
  );

  const getClaimCooldown = useCallback(
    (token: string) => {
      const last = state.faucetCooldowns[token] || 0;
      const remaining = FAUCET_COOLDOWN_MS - (Date.now() - last);
      return remaining > 0 ? remaining : 0;
    },
    [state.faucetCooldowns]
  );

  const claimFaucet = useCallback(
    (token: string) => {
      if (!canClaim(token)) return false;
      const amount = FAUCET_AMOUNTS[token] || 0;
      setState((prev) => ({
        ...prev,
        balances: {
          ...prev.balances,
          [token]: (prev.balances[token] || 0) + amount,
        },
        faucetCooldowns: {
          ...prev.faucetCooldowns,
          [token]: Date.now(),
        },
      }));
      addTx("faucet", token, amount);
      return true;
    },
    [canClaim, addTx]
  );

  const supply = useCallback(
    (asset: string, amount: number, apy: number) => {
      if (amount <= 0 || (state.balances[asset] || 0) < amount) return false;
      setState((prev) => ({
        ...prev,
        balances: { ...prev.balances, [asset]: (prev.balances[asset] || 0) - amount },
        supplies: [...prev.supplies, { asset, amount, apy, timestamp: Date.now() }],
      }));
      addTx("supply", asset, amount);
      return true;
    },
    [state.balances, addTx]
  );

  const withdraw = useCallback(
    (index: number) => {
      const pos = state.supplies[index];
      if (!pos) return false;
      const elapsed = (Date.now() - pos.timestamp) / (365.25 * 24 * 60 * 60 * 1000);
      const interest = pos.amount * (pos.apy / 100) * elapsed;
      const total = pos.amount + interest;
      setState((prev) => ({
        ...prev,
        balances: { ...prev.balances, [pos.asset]: (prev.balances[pos.asset] || 0) + total },
        supplies: prev.supplies.filter((_, i) => i !== index),
      }));
      addTx("withdraw", pos.asset, total);
      return true;
    },
    [state.supplies, addTx]
  );

  const borrow = useCallback(
    (asset: string, amount: number, apy: number) => {
      if (amount <= 0) return false;
      const collateralValue = state.supplies.reduce(
        (sum, s) => sum + s.amount * (prices[s.asset] || 0) * 0.75,
        0
      );
      const currentDebt = state.borrows.reduce(
        (sum, b) => sum + b.amount * (prices[b.asset] || 0),
        0
      );
      const newDebtValue = amount * (prices[asset] || 0);
      if (currentDebt + newDebtValue > collateralValue) return false;

      setState((prev) => ({
        ...prev,
        balances: { ...prev.balances, [asset]: (prev.balances[asset] || 0) + amount },
        borrows: [...prev.borrows, { asset, amount, apy, timestamp: Date.now() }],
      }));
      addTx("borrow", asset, amount);
      return true;
    },
    [state.supplies, state.borrows, prices, addTx]
  );

  const repay = useCallback(
    (index: number) => {
      const pos = state.borrows[index];
      if (!pos) return false;
      const elapsed = (Date.now() - pos.timestamp) / (365.25 * 24 * 60 * 60 * 1000);
      const interest = pos.amount * (pos.apy / 100) * elapsed;
      const total = pos.amount + interest;
      if ((state.balances[pos.asset] || 0) < total) return false;
      setState((prev) => ({
        ...prev,
        balances: { ...prev.balances, [pos.asset]: (prev.balances[pos.asset] || 0) - total },
        borrows: prev.borrows.filter((_, i) => i !== index),
      }));
      addTx("repay", pos.asset, total);
      return true;
    },
    [state.borrows, state.balances, addTx]
  );

  const swap = useCallback(
    (fromToken: string, toToken: string, fromAmount: number) => {
      if (fromAmount <= 0 || (state.balances[fromToken] || 0) < fromAmount) return false;
      const fromPrice = prices[fromToken] || 0;
      const toPrice = prices[toToken] || 0;
      if (toPrice === 0) return false;
      const toAmount = (fromAmount * fromPrice) / toPrice * 0.997;
      setState((prev) => ({
        ...prev,
        balances: {
          ...prev.balances,
          [fromToken]: (prev.balances[fromToken] || 0) - fromAmount,
          [toToken]: (prev.balances[toToken] || 0) + toAmount,
        },
      }));
      addTx("swap", `${fromToken}>${toToken}`, fromAmount);
      return toAmount;
    },
    [state.balances, prices, addTx]
  );

  // Staking - Max 24% APY for 365-day lock
  const APY_MULTIPLIERS: Record<number, number> = { 0: 1, 30: 1.25, 90: 1.5, 180: 2, 365: 3 };
  const BASE_STAKING_APY = 8; // 8% base => 8*3 = 24% max

  const stake = useCallback(
    (amount: number, lockDays: number) => {
      if (amount <= 0 || (state.balances.STL || 0) < amount) return false;
      const now = Date.now();
      setState((prev) => ({
        ...prev,
        balances: { ...prev.balances, STL: (prev.balances.STL || 0) - amount },
        staking: [
          ...prev.staking,
          {
            amount,
            lockDays,
            startTime: now,
            unlockTime: lockDays > 0 ? now + lockDays * 24 * 60 * 60 * 1000 : 0,
            claimedRewards: 0,
            lastClaimTime: now,
          },
        ],
      }));
      addTx("stake", "STL", amount);
      return true;
    },
    [state.balances, addTx]
  );

  const unstake = useCallback(
    (index: number) => {
      const pos = state.staking[index];
      if (!pos) return false;
      if (pos.lockDays > 0 && Date.now() < pos.unlockTime) return false;
      const availableAt = Date.now() + 3 * 24 * 60 * 60 * 1000;
      setState((prev) => ({
        ...prev,
        staking: prev.staking.filter((_, i) => i !== index),
        stakingPendingWithdrawals: [
          ...prev.stakingPendingWithdrawals,
          { amount: pos.amount, availableAt },
        ],
      }));
      addTx("unstake", "STL", pos.amount);
      return true;
    },
    [state.staking, addTx]
  );

  const claimPendingWithdrawals = useCallback(() => {
    const now = Date.now();
    const ready = state.stakingPendingWithdrawals.filter((w) => w.availableAt <= now);
    const notReady = state.stakingPendingWithdrawals.filter((w) => w.availableAt > now);
    if (ready.length === 0) return false;
    const total = ready.reduce((s, w) => s + w.amount, 0);
    setState((prev) => ({
      ...prev,
      balances: { ...prev.balances, STL: (prev.balances.STL || 0) + total },
      stakingPendingWithdrawals: notReady,
    }));
    return true;
  }, [state.stakingPendingWithdrawals]);

  const getStakingRewards = useCallback(
    (pos: StakingPosition) => {
      const multiplier = APY_MULTIPLIERS[pos.lockDays] || 1;
      const apy = BASE_STAKING_APY * multiplier;
      const elapsed = (Date.now() - pos.lastClaimTime) / (365.25 * 24 * 60 * 60 * 1000);
      return pos.amount * (apy / 100) * elapsed;
    },
    []
  );

  const claimStakingRewards = useCallback(
    (index: number) => {
      const pos = state.staking[index];
      if (!pos) return 0;
      const rewards = getStakingRewards(pos);
      if (rewards <= 0) return 0;
      setState((prev) => ({
        ...prev,
        balances: { ...prev.balances, STL: (prev.balances.STL || 0) + rewards },
        staking: prev.staking.map((p, i) =>
          i === index
            ? { ...p, claimedRewards: p.claimedRewards + rewards, lastClaimTime: Date.now() }
            : p
        ),
      }));
      addTx("claim_rewards", "STL", rewards);
      return rewards;
    },
    [state.staking, getStakingRewards, addTx]
  );

  const calculateHealthFactor = useCallback(() => {
    const collateralValue = state.supplies.reduce(
      (sum, s) => sum + s.amount * (prices[s.asset] || 0) * 0.80,
      0
    );
    const debtValue = state.borrows.reduce(
      (sum, b) => sum + b.amount * (prices[b.asset] || 0),
      0
    );
    if (debtValue === 0) return Infinity;
    return collateralValue / debtValue;
  }, [state.supplies, state.borrows, prices]);

  // Borrow limit calculation
  const calculateBorrowLimit = useCallback(() => {
    return state.supplies.reduce(
      (sum, s) => sum + s.amount * (prices[s.asset] || 0) * 0.75,
      0
    );
  }, [state.supplies, prices]);

  const calculateBorrowUsed = useCallback(() => {
    return state.borrows.reduce(
      (sum, b) => sum + b.amount * (prices[b.asset] || 0),
      0
    );
  }, [state.borrows, prices]);

  const addLiquidity = useCallback(
    (tokenA: string, tokenB: string, amountA: number, amountB: number) => {
      if (
        amountA <= 0 || amountB <= 0 ||
        (state.balances[tokenA] || 0) < amountA ||
        (state.balances[tokenB] || 0) < amountB
      ) return false;
      const lpTokens = Math.sqrt(amountA * amountB);
      setState((prev) => ({
        ...prev,
        balances: {
          ...prev.balances,
          [tokenA]: (prev.balances[tokenA] || 0) - amountA,
          [tokenB]: (prev.balances[tokenB] || 0) - amountB,
        },
        lpPositions: [
          ...prev.lpPositions,
          { tokenA, tokenB, amountA, amountB, lpTokens, timestamp: Date.now() },
        ],
      }));
      addTx("add_lp", `${tokenA}/${tokenB}`, amountA);
      return true;
    },
    [state.balances, addTx]
  );

  const removeLiquidity = useCallback(
    (index: number) => {
      const pos = state.lpPositions[index];
      if (!pos) return false;
      setState((prev) => ({
        ...prev,
        balances: {
          ...prev.balances,
          [pos.tokenA]: (prev.balances[pos.tokenA] || 0) + pos.amountA * 1.005,
          [pos.tokenB]: (prev.balances[pos.tokenB] || 0) + pos.amountB * 1.005,
        },
        lpPositions: prev.lpPositions.filter((_, i) => i !== index),
      }));
      addTx("remove_lp", `${pos.tokenA}/${pos.tokenB}`, pos.amountA);
      return true;
    },
    [state.lpPositions, addTx]
  );

  const updateAlertSettings = useCallback(
    (settings: Partial<VirtualState["alertSettings"]>) => {
      setState((prev) => ({
        ...prev,
        alertSettings: { ...prev.alertSettings, ...settings },
      }));
    },
    []
  );

  return {
    state,
    prices,
    canClaim,
    getClaimCooldown,
    claimFaucet,
    supply,
    withdraw,
    borrow,
    repay,
    swap,
    stake,
    unstake,
    claimPendingWithdrawals,
    getStakingRewards,
    claimStakingRewards,
    calculateHealthFactor,
    calculateBorrowLimit,
    calculateBorrowUsed,
    addLiquidity,
    removeLiquidity,
    updateAlertSettings,
    apyMultipliers: APY_MULTIPLIERS,
    baseStakingApy: BASE_STAKING_APY,
  };
}
