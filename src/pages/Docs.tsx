import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, BarChart3, ArrowLeftRight, Droplets, Coins, Shield, Rocket,
  Activity, Users, Gavel, Lock, ExternalLink, Target, Eye, Lightbulb,
  Layers, HelpCircle, Wallet, Globe
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";

interface DocSection {
  id: string;
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

const sections: DocSection[] = [
  {
    id: "overview",
    icon: <BookOpen className="h-4 w-4" />,
    title: "What is ArcLend",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          ArcLend is a decentralized financial protocol built for the Rialo Network. It provides a unified platform where users can lend and borrow assets, swap tokens, supply liquidity to trading pools, stake governance tokens, and monitor their portfolio health,stodians.
        </p>
        <p>
          The protocol combines six core financial primitives into a single application: a lending market with variable interest rates, a constant-product automated market maker for token swaps, dual-sided liquidity pools with fee sharing, a multi-tier staking system tied to protocol revenue, a real-time health factor monitor with configurable alerts, and a testnet faucet for onboarding new users.
        </p>
        <p>
          ArcLend borrows its lending mechanics from the well-established patterns of Aave �: u: u: u: u: u: u: u: u: u: u: utilization-driven interest rates, over-collateralized borrowing, and a transparent liquidation framework. It extends    The protocol currently runs on <strong className="text-foreground">Rialo Testnet</strong>. Wallet connection is real, but all subsequent transactions — supply, borrow, swap, stake, claim — execute in a virtual simulation. This allows the Rialo community to experience the full protocol before mainnet deployment, without risking real funds.
        </p>

        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-2">
          <p className="font-semibold text-foreground">Supported Assets</p>
          <div className="space-y-1.5">
            <p><strong className="text-foreground">RIA</strong> — Rialo's native gas and utility token. Accepted as collateral, used for swap pairs, and distributed through the testnet faucet.</p>
            <p><strong className="text-foreground">WETH</strong> — Wrapped Ether. A tokenized version of ETH conforming to the ERC-20 standard. Widely used as a trading pair and high-value collateral asset.</p>
            <p><strong className="text-foreground">USDT</strong> — Tether USD. A fiat-backed stablecoin pegged to the US dollar. Provides a stable unit of account for lending, borrowing, swaps, and liquidity provision.</p>
            <p><strong className="text-foreground">ALND</strong> — ArcLend's governance and staking token. Holders stake ALND to earn a share of protocol revenue and vote on proposals that shape the protocol's direction.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "problem",
    icon: <Target className="h-4 w-4" />,
    title: "The Problem",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          New Layer 1 blockchains face a fundamental bootstrapping challenge. Without financial infrastructure — lending markets, swap venues, staking mechanisms — users have no productive way to use their tokens. Capital sits idle in wallets. Developers building applications on the chain have no liquidity layer to plug into. The result is a chain with potential but no financial activity.
        </p>
        <p>
          The common workaround is forking an existing protocol and deploying it on the new chain. This rarely works well. Forked protocols arrive with assumptions about oracle infrastructure, governance participation, and liquidity depth that simply do not exist on a young network. The fork launches, attracts minimal liquidity, and stagnates because it was never designed to grow with the ecosystem it landed on.
        </p>
        <p>
          Rialo Network faces this exact situation. It is a high-throughput, low-fee chain with a growing developer community, but it lacks a native DeFi layer that can serve as the foundation for financial applications. Users who hold RIA have no way to earn yield on it. Builders who want to integrate lending or swaps into their applications have no on-chain primitives to call.
        </p>
        <p>
          ArcLend exists to fill that gap — not as a fork dropped onto Rialo, but as a purpose-built protocol designed for the chain's fee structure, community, and roadmap. The goal is to be the first financial layer that makes Rialo a chain where capital is productive from day one.
        </p>
      </div>
    ),
  },
  {
    id: "vision",
    icon: <Eye className="h-4 w-4" />,
    title: "Mission & Vision",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          <strong className="text-foreground">Mission:</strong> To build reliable, transparent, and community-governed financial infrastructure on Rialo Network — enabling anyone to lend, borrow, swap, provide liquidity, and stake without intermediaries.
        </p>
        <p>
          <strong className="text-foreground">Vision:</strong> ArcLend will become the primary liquidity layer on Rialo. When users want to put capital to work, when builders need on-chain financial primitives, when institutions evaluate the chain's DeFi maturity — ArcLend is where they go.
        </p>
        <p>
          The protocol is designed to grow alongside Rialo. As the network attracts more users, applications, and capital, ArcLend deepens the liquidity that makes those applications viable. More activity generates more protocol revenue, which flows to stakers, which attracts more ALND holders, which strengthens governance — a compounding cycle.
        </p>
        <p>
          Long-term, the roadmap extends beyond the current feature set. Fixed-rate lending, under-collateralized institutional credit with on-chain scoring, cross-chain liquidity bridges, and structured yield products are all on the horizon. But the foundation comes first: a multi-feature protocol that works reliably, is governed transparently, and earns trust through consistent operation.
        </p>
      </div>
    ),
  },
  {
    id: "sustainability",
    icon: <Lightbulb className="h-4 w-4" />,
    title: "Long-Term Sustainability",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          A protocol survives long-term only if its revenue model is tied to real usage, not token emissions or hype cycles. ArcLend generates revenue from three sources:
        </p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">1. Borrowing Interest Spread</p>
            <p>When users borrow assets, they pay variable interest. A portion of that interest — the reserve factor, initially set at 10% — is retained by the protocol treasury rather than passed to suppliers. This funds development, audits, and ecosystem grants.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">2. Swap Fees</p>
            <p>Every token swap incurs a 0.3% fee. Of that, 0.25% goes to liquidity providers and 0.05% flows to the protocol treasury. At meaningful swap volume, even a small treasury share creates steady, recurring revenue.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">3. Liquidation Fees</p>
            <p>When undercollateralized positions are liquidated, the protocol retains a small portion of the liquidation penalty. This contributes to the treasury and helps fund the staking rewards pool.</p>
          </div>
        </div>
        <p>
          These three revenue streams fund protocol development (engineering, security audits, infrastructure), staking rewards for ALND holders, and a community grants program for builders creating tools on Rialo.
        </p>
        <p>
          Because revenue is tied to actual protocol usage — borrowing, swapping, and liquidations — the model remains sustainable regardless of market sentiment. There is no reliance on inflationary token emissions. Governance controls how treasury funds are allocated: ALND stakers vote on reserve factors, fee structures, and spending priorities.
        </p>
      </div>
    ),
  },
  {
    id: "architecture",
    icon: <Layers className="h-4 w-4" />,
    title: "Protocol Architecture",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          ArcLend is structured as a set of modular smart contracts deployed on Rialo Network. Each module handles a distinct function and can be upgraded independently through governance.
        </p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">Lending Pool</p>
            <p>The central contract managing supply and borrow operations. When a user deposits an asset, the pool mints nTokens (interest-bearing receipt tokens) proportional to the deposit. Borrowing issues vDebt tokens that track the growing debt. Interest rates are calculated algorithmically based on utilization — higher utilization pushes rates up, rebalancing supply and demand.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">AMM (Automated Market Maker)</p>
            <p>A constant-product market maker (x × y = k) that enables instant token swaps. Liquidity providers deposit equal-value token pairs and earn a share of trading fees. The AMM operates as an independent module but is integrated directly into the ArcLend interface.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Staking Module</p>
            <p>Manages ALND staking positions, lock periods, reward distribution, and governance voting weight. Rewards are drawn from protocol revenue, not emissions. The module enforces lock tiers and a 3-day unstaking warmup to prevent flash-staking attacks.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">nTokens (Deposit Receipts)</p>
            <p>When you supply 100 USDT, you receive nUSDT. These tokens accrue value over time as borrowers pay interest. When you withdraw, you burn nUSDT and receive your original deposit plus earned interest. nTokens are standard ERC-20 tokens — they can be transferred, composed with other protocols, or held in multi-sig wallets.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">vDebt Tokens (Debt Tracking)</p>
            <p>Borrowing creates non-transferable vDebt tokens that represent outstanding debt. Their value increases over time as interest accrues. To close a position, you repay the debt (original amount plus accrued interest) and the vDebt tokens are burned.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Price Oracle</p>
            <p>Feeds asset prices into collateral valuation, health factor calculations, and liquidation triggers. On mainnet, ArcLend will integrate with Rialo's native oracle infrastructure. On testnet, prices are simulated with minor fluctuations to demonstrate dynamic behavior.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Liquidation Engine</p>
            <p>Monitors all borrow positions continuously. When a position's health factor drops below 1.0, it becomes eligible for liquidation. Any user can act as a liquidator: repay part of the borrower's debt and receive the equivalent collateral plus a 5% bonus. This keeps the protocol solvent by clearing risky positions before bad debt accumulates.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "lending",
    icon: <BarChart3 className="h-4 w-4" />,
    title: "Lending & Borrowing",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          The lending market is one of ArcLend's core modules. Users deposit assets to earn variable yield, or borrow against their collateral to access capital without selling their holdings.
        </p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">Supplying Assets</p>
            <p>
              Depositing assets into the lending pool adds them to shared liquidity that borrowers draw from. You receive nTokens that appreciate as borrowers pay interest. Your deposit also serves as collateral — its value determines how much you can borrow.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Borrowing Against Collateral</p>
            <p>
              Each asset has a 75% Loan-to-Value ratio. Supply $1,000 of RIA, and you can borrow up to $750 of any supported token. Borrowing creates vDebt tokens that track your growing obligation. Interest accrues continuously based on pool utilization.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Interest Rate Model</p>
            <p>
              ArcLend uses a two-slope interest rate curve. Below 80% utilization, rates climb gradually. Above 80%, rates increase steeply to discourage excessive borrowing and protect supplier withdrawals.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Key Parameters</p>
            <ul className="list-inside list-disc space-y-1 mt-1">
              <li>LTV (Loan-to-Value) — 75% for all assets</li>
              <li>Liquidation Threshold — 80%</li>
              <li>Liquidation Penalty — 5% bonus to liquidators</li>
              <li>Reserve Factor — 10% of borrower interest to treasury</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "swap",
    icon: <ArrowLeftRight className="h-4 w-4" />,
    title: "Token Swap",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          The swap module lets users exchange any supported token for another directly within ArcLend. It runs on an automated market maker — no order books, no counterparty matching, no waiting.
        </p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">How Swaps Work</p>
            <p>
              The AMM uses the constant product formula (x × y = k). When you swap RIA for USDT, you add RIA to the pool and remove USDT. The exchange rate is determined by the pool's current reserves. Larger trades relative to pool size result in more slippage — the price moves against you because you are changing the reserve ratio more dramatically.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Fees</p>
            <p>Each swap incurs a 0.3% fee. 0.25% goes to liquidity providers for the trading pair. 0.05% flows to the protocol treasury. Slippage tolerance is configurable — default is 0.5%.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Available Pairs</p>
            <p>RIA/USDT, RIA/WETH, USDT/WETH, ALND/USDT. Multi-hop routing is available when a direct pair does not exist.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Why Swap Inside ArcLend?</p>
            <p>
              Having swaps within the protocol means users do not need to leave the platform to rebalance their portfolio. Need more USDT to repay a borrow position? Swap RIA for USDT and repay — all in one session. This composability between swap, lending, and staking reduces friction and keeps capital circulating within the ecosystem.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "liquidity",
    icon: <Droplets className="h-4 w-4" />,
    title: "Liquidity Pools",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          Liquidity pools are the backbone of the swap module. Without liquidity providers, there are no tokens in the pool for traders to swap against. By depositing tokens, you enable trading — and earn fees for that service.
        </p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">Adding Liquidity</p>
            <p>
              You deposit two tokens in equal dollar value — for example, $500 of RIA and $500 of USDT into the RIA/USDT pool. In return, you receive LP tokens representing your proportional share of the pool. As trades flow through the pool, fees accumulate and increase the value of your LP tokens.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Earning Fees</p>
            <p>Every swap through your pool pays 0.25% to all liquidity providers, distributed pro-rata based on pool share. More volume means more fees. You can track your accumulated fees in the Positions page.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Impermanent Loss</p>
            <p>
              When you provide liquidity, the token ratio in your position changes as trades occur. If one token's price moves significantly relative to the other, you end up with a different mix than you deposited. The value difference between holding the tokens outright versus providing liquidity is called impermanent loss. It becomes permanent only if you withdraw while prices are diverged. Trading fees can offset it, but it is a real risk to understand before depositing.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Removing Liquidity</p>
            <p>Withdraw at any time by returning your LP tokens. You receive your share of both tokens plus accrued fees. No lock period or exit fee.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "staking",
    icon: <Lock className="h-4 w-4" />,
    title: "ALND Staking",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          Staking is how the community participates in the protocol's economics and governance. By locking ALND tokens, stakers earn a share of protocol revenue and gain voting power over proposals that shape the protocol's future.
        </p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">Where Do Staking Rewards Come From?</p>
            <p>
              Staking rewards are funded entirely by protocol revenue — not by printing new tokens. Three revenue streams feed the staking rewards pool:
            </p>
            <ul className="list-inside list-disc space-y-1 mt-2">
              <li><strong className="text-foreground">Borrowing interest reserve:</strong> 10% of all interest paid by borrowers is collected by the treasury. A portion of this is allocated to staking rewards.</li>
              <li><strong className="text-foreground">Swap fee share:</strong> 0.05% of every swap (from the 0.3% total fee) flows to the treasury and partially funds staker rewards.</li>
              <li><strong className="text-foreground">Liquidation fees:</strong> A small share of liquidation penalties contributes to the rewards pool.</li>
            </ul>
            <p className="mt-2">
              This design means rewards scale with protocol activity. Heavy lending, borrowing, and trading periods generate more revenue and more staker earnings. Quiet periods generate less. There is no reliance on inflationary emissions that dilute token holders over time.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Lock Tiers & APY</p>
            <p>Longer commitment earns higher returns. Each lock tier carries a multiplier on the base reward rate:</p>
            <ul className="list-inside list-disc space-y-1 mt-1">
              <li>Flexible (no lock) — Base rate (1x multiplier)</li>
              <li>30 days — 1.25x multiplier</li>
              <li>90 days — 1.5x multiplier</li>
              <li>180 days — 2x multiplier</li>
              <li>365 days — 3x multiplier</li>
            </ul>
            <p className="mt-2">
              Actual APY fluctuates based on total ALND staked and protocol revenue. The multipliers reward users who demonstrate longer-term commitment and help reduce circulating supply volatility.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Unstaking & Warmup Period</p>
            <p>
              When you unstake, your ALND enters a 3-day warmup period before returning to your wallet. During warmup, the tokens do not earn rewards and cannot vote. This prevents flash-staking — where someone stakes briefly to capture rewards or influence a governance vote, then immediately withdraws.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Governance Power</p>
            <p>1 staked ALND = 1 vote. Only staked tokens carry voting weight — unstaked ALND in your wallet has zero governance power. This ensures decisions are made by participants with real commitment to the protocol.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "healthfactor",
    icon: <Activity className="h-4 w-4" />,
    title: "Health Factor & Liquidation",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          The health factor is the most important number for any borrower on ArcLend. It measures how safe your borrow position is relative to liquidation.
        </p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">Calculation</p>
            <p>Health Factor = (Total Collateral Value × Liquidation Threshold) ÷ Total Debt Value</p>
            <p className="mt-2">Example: $1,000 of RIA supplied (80% liquidation threshold) and $400 of USDT borrowed gives HF = ($1,000 × 0.80) ÷ $400 = 2.0. That is a comfortable position.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Risk Levels</p>
            <ul className="list-inside list-disc space-y-1">
              <li>HF ≥ 2.0 — Safe. Collateral comfortably covers debt.</li>
              <li>1.5 ≤ HF &lt; 2.0 — Early warning. Consider reducing debt or adding collateral.</li>
              <li>1.2 ≤ HF &lt; 1.5 — Caution. Approaching the danger zone.</li>
              <li>1.0 ≤ HF &lt; 1.2 — High risk. A moderate price swing could trigger liquidation.</li>
              <li>HF &lt; 1.0 — Liquidation eligible. Any user can liquidate your position.</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground">Liquidation Process</p>
            <p>
              When HF drops below 1.0, a liquidator can repay up to 50% of the borrower's debt in one transaction and receive the equivalent collateral value plus a 5% bonus. This incentivizes third parties to keep the protocol solvent by clearing risky positions before they create bad debt.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Alert System</p>
            <p>
              ArcLend's health monitor lets you configure threshold alerts. When your HF crosses a level you have set — 1.5, 1.2, 1.0, or a custom value — you receive a notification. Email and Telegram alerts can be configured in the Health Monitor settings so you have time to act before liquidation occurs.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "governance",
    icon: <Gavel className="h-4 w-4" />,
    title: "Governance",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          ArcLend is governed by its community. Any user with staked ALND can participate in governance, and approved decisions are executed on-chain.
        </p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">What Can Be Governed</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Protocol parameters — reserve factor, LTV ratios, liquidation thresholds, interest rate slopes</li>
              <li>Adding or removing supported assets</li>
              <li>Treasury allocation — development funding, community grants, staking reward distribution, token buybacks</li>
              <li>Fee structure adjustments across lending, swaps, and liquidations</li>
              <li>Smart contract upgrades and module additions</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground">Proposal Lifecycle</p>
            <p>
              Any user with at least 100 staked ALND can submit a proposal. Proposals enter a 3-day discussion period, followed by a 4-day voting window. Passing requires a simple majority (over 50% of votes cast in favor) and a minimum quorum of 10% of total staked ALND participating. Approved proposals execute automatically after a 2-day timelock.
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Voting Weight</p>
            <p>Voting power equals staked ALND. Locked positions carry full weight. Unstaked tokens have no governance power. This ensures that people making decisions for the protocol have real stake in its outcome.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "faucet",
    icon: <Coins className="h-4 w-4" />,
    title: "Testnet Faucet",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          The faucet distributes free testnet tokens so anyone can try every feature of the protocol without cost. It is designed for testing, demonstration, and community onboarding.
        </p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">Claim Amounts</p>
            <ul className="list-inside list-disc space-y-1">
              <li>RIA — 100 tokens per claim</li>
              <li>WETH — 1 token per claim</li>
              <li>USDT — 1,000 tokens per claim</li>
              <li>ALND — 100 tokens per claim</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground">Cooldown</p>
            <p>Each token has a 24-hour cooldown per wallet address. Cooldowns are tracked independently — you can claim RIA even if WETH is still on cooldown. A countdown timer shows exactly when each token becomes claimable again.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Claim All</p>
            <p>One click claims every token whose cooldown has expired. Tokens still on cooldown are skipped.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "deploy",
    icon: <Rocket className="h-4 w-4" />,
    title: "Contract Deployment",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          ArcLend includes a contract deployment interface for developers building on Rialo. Deploy standard smart contract templates directly from the browser — no local development environment needed.
        </p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">Available Templates</p>
            <ul className="list-inside list-disc space-y-1">
              <li>ERC-20 Token — Fungible token with configurable supply and metadata</li>
              <li>ERC-721 NFT — Non-fungible token with metadata URI support</li>
              <li>ERC-1155 Multi-Token — Combined fungible and non-fungible standard</li>
              <li>Staking Contract — Lock-and-earn staking with configurable reward rates</li>
              <li>Multi-Signature Wallet — Multi-approval transaction execution</li>
              <li>Token Vesting — Time-locked distribution for teams and investors</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "rialo",
    icon: <Globe className="h-4 w-4" />,
    title: "Rialo Network",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          Rialo is a high-throughput Layer 1 blockchain designed for low transaction fees and fast finality. ArcLend is built specifically for Rialo, taking advantage of its cost structure and performance characteristics.
        </p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">Why Rialo</p>
            <p>Low fees make DeFi interactions economically viable for all users, not just large holders. On high-fee chains, a small borrow or swap can cost more in gas than the transaction is worth. On Rialo, every interaction — from a $10 swap to a $100,000 supply — has a negligible transaction cost.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">RIA Token</p>
            <p>RIA is Rialo's native gas token. On ArcLend, it is also accepted as collateral in lending pools, used as a base pair for swaps, and distributed through the testnet faucet.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Connecting to Rialo Testnet</p>
            <p>Connect your wallet (MetaMask or WalletConnect) through ArcLend's interface. The app handles network configuration automatically. On testnet, all transactions after wallet connection are simulated — no gas fees or signing prompts.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "glossary",
    icon: <HelpCircle className="h-4 w-4" />,
    title: "Glossary",
    content: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-2">
          <p><strong className="text-foreground">APY (Annual Percentage Yield)</strong> — The annualized return on a deposit or staking position, including compounding.</p>
          <p><strong className="text-foreground">TVL (Total Value Locked)</strong> — The total dollar value of assets deposited in a protocol's contracts.</p>
          <p><strong className="text-foreground">LTV (Loan-to-Value)</strong> — The maximum percentage of collateral value that can be borrowed.</p>
          <p><strong className="text-foreground">Health Factor</strong> — A ratio indicating borrow position safety. Below 1.0, the position can be liquidated.</p>
          <p><strong className="text-foreground">Liquidation</strong> — The process of closing an undercollateralized position. The liquidator repays debt and receives collateral at a discount.</p>
          <p><strong className="text-foreground">nTokens</strong> — Interest-bearing receipt tokens issued to suppliers, representing deposit plus accrued interest.</p>
          <p><strong className="text-foreground">vDebt Tokens</strong> — Non-transferable tokens tracking a borrower's outstanding obligation, including accrued interest.</p>
          <p><strong className="text-foreground">AMM (Automated Market Maker)</strong> — A contract that prices and executes token swaps using pooled liquidity and a mathematical formula.</p>
          <p><strong className="text-foreground">Impermanent Loss</strong> — The value difference between holding tokens vs. providing them as liquidity, caused by relative price changes.</p>
          <p><strong className="text-foreground">Slippage</strong> — The difference between quoted and executed trade price, caused by pool reserve changes.</p>
          <p><strong className="text-foreground">Reserve Factor</strong> — The percentage of borrower interest kept by the protocol treasury.</p>
          <p><strong className="text-foreground">Utilization Rate</strong> — The percentage of supplied assets currently being borrowed. Higher utilization raises interest rates.</p>
          <p><strong className="text-foreground">LP Tokens</strong> — Tokens representing your share of a liquidity pool. Burn them to withdraw your share plus earned fees.</p>
        </div>
      </div>
    ),
  },
];

const resources = [
  { label: "Rialo Network", url: "https://rialo.network", desc: "Official website" },
  { label: "Rialo on X", url: "https://x.com/riaboreal", desc: "Follow for updates" },
  { label: "Aave V3 Docs", url: "https://docs.aave.com", desc: "Lending model reference" },
  { label: "wagmi Docs", url: "https://wagmi.sh", desc: "React hooks for Ethereum" },
];

export default function Docs() {
  const [activeSection, setActiveSection] = useState("overview");
  const current = sections.find((s) => s.id === activeSection) || sections[0];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Documentation</h1>
        <p className="mt-1 text-sm text-muted-foreground">Complete guide to ArcLend Protocol on Rialo Network.</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <nav className="shrink-0 lg:w-56">
          <div className="sticky top-4 space-y-1 max-h-[80vh] overflow-y-auto">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  activeSection === s.id ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span className="text-primary">{s.icon}</span>
                <span className="flex-1">{s.title}</span>
              </button>
            ))}

            <div className="mt-6 border-t border-border pt-4">
              <p className="mb-2 px-3 text-xs font-semibold text-muted-foreground">Resources</p>
              {resources.map((r) => (
                <a key={r.label} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <ExternalLink className="h-3 w-3" />
                  <span>{r.label}</span>
                </a>
              ))}
            </div>
          </div>
        </nav>

        <div className="min-w-0 flex-1">
          <motion.div key={current.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">{current.icon}</div>
                  <h2 className="text-lg font-bold text-foreground">{current.title}</h2>
                </div>
                {current.content}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
