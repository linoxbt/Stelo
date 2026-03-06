import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, BarChart3, ArrowLeftRight, Droplets, Coins, Shield, Rocket,
  Activity, Users, Gavel, Lock, ExternalLink, Target, Eye, Lightbulb,
  Layers, HelpCircle
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
          ArcLend is a decentralized lending and borrowing protocol purpose-built for the Rialo Network. It gives users a single interface to lend idle assets for yield, borrow against collateral, swap tokens, provide liquidity, and stake for governance — without relying on centralized intermediaries.
        </p>
        <p>
          The protocol draws from the battle-tested mechanics of Aave's lending model — variable interest rates driven by utilization, over-collateralized borrowing, and a transparent liquidation framework — while adapting them for Rialo's low-fee, high-throughput environment. Every action on ArcLend runs through auditable smart contracts, meaning users retain custody of their assets at all times.
        </p>
        <p>
          ArcLend currently operates on <strong className="text-foreground">Rialo Testnet</strong>. The testnet deployment is a fully interactive simulation: wallet connection is real, but all subsequent transactions — supply, borrow, swap, stake — execute in virtual state. This lets builders, testers, and the Rialo community experience the full protocol without risking real funds.
        </p>

        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-2">
          <p className="font-semibold text-foreground">Supported Assets</p>
          <div className="space-y-1.5">
            <p><strong className="text-foreground">RIA</strong> — Rialo Network's native gas and utility token. Used for transaction fees on-chain and accepted as collateral in ArcLend lending pools.</p>
            <p><strong className="text-foreground">WETH</strong> — Wrapped Ether. A tokenized representation of ETH that conforms to the ERC-20 standard, widely used across DeFi as a trading pair and collateral asset.</p>
            <p><strong className="text-foreground">USDT</strong> — Tether USD. A fiat-backed stablecoin pegged to the US dollar. Provides a stable unit of account for lending, borrowing, and liquidity provision.</p>
            <p><strong className="text-foreground">ALND</strong> — ArcLend's governance and staking token. Holders can stake ALND to earn protocol revenue and vote on proposals that shape the protocol's future.</p>
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
          Most DeFi lending protocols today are concentrated on a handful of established networks — Ethereum, Arbitrum, Base. Emerging Layer 1 blockchains like Rialo face a cold-start problem: there is no native lending infrastructure, so users have no productive way to put their assets to work. Capital sits idle in wallets, liquidity is fragmented, and developers building on the chain lack the financial primitives they need.
        </p>
        <p>
          At the same time, existing lending protocols are not designed to port cleanly to new chains. Their architectures assume specific oracle infrastructure, governance models, and liquidity depths that don't exist on a nascent network. Forking them results in hollow deployments with no real liquidity, no community, and no long-term alignment with the ecosystem.
        </p>
        <p>
          ArcLend exists to solve this gap. Rather than fork and forget, we are building a lending protocol from the ground up that is aligned with Rialo's roadmap, designed for its fee structure, and governed by its community. The goal is to be the foundational DeFi layer that makes Rialo a chain where capital is productive from day one.
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
          <strong className="text-foreground">Mission:</strong> To provide Rialo Network with reliable, transparent, and community-governed financial infrastructure that lets anyone lend, borrow, and earn yield without intermediaries.
        </p>
        <p>
          <strong className="text-foreground">Vision:</strong> ArcLend aims to become the primary liquidity layer on Rialo — the place where users, builders, and institutions interact with capital on-chain. We envision a protocol that grows alongside Rialo itself: as the network attracts more users and applications, ArcLend deepens the liquidity that makes those applications possible.
        </p>
        <p>
          Long-term, ArcLend plans to expand beyond basic lending into structured products — fixed-rate lending, under-collateralized institutional loans with on-chain credit scoring, and cross-chain liquidity bridges. But the foundation comes first: a lending protocol that works reliably, is governed transparently, and earns the trust of its users through consistent operation.
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
          A protocol is only as durable as its revenue model. ArcLend generates revenue from two primary sources:
        </p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">1. Borrowing Interest Spread</p>
            <p>When users borrow assets, they pay variable interest. A portion of that interest — the protocol's reserve factor — is retained by the treasury rather than passed entirely to suppliers. This reserve factor is initially set at 10% and can be adjusted through governance. It funds ongoing development, security audits, and ecosystem grants.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">2. Swap Fees</p>
            <p>Every token swap executed through ArcLend's AMM incurs a 0.3% fee. Of that fee, 0.25% goes to liquidity providers and 0.05% flows to the protocol treasury. At scale, even a small slice of swap volume creates meaningful, recurring revenue.</p>
          </div>
        </div>
        <p>
          These revenue streams fund three things: protocol development (engineering, audits, infrastructure), staking rewards for ALND holders, and a community grants program for builders creating tools and integrations on Rialo. Because revenue is tied to actual usage — not token emissions — the model remains sustainable regardless of market conditions.
        </p>
        <p>
          Governance controls the allocation. ALND stakers vote on how treasury funds are spent, what the reserve factor should be, and whether to introduce new fee structures. This means the community that uses the protocol also decides how it sustains itself.
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
          ArcLend is structured as a set of modular smart contracts deployed on Rialo Network. The core components are:
        </p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">Lending Pool</p>
            <p>The central contract that manages all supply and borrow operations. When a user deposits an asset, the pool mints nTokens (interest-bearing receipt tokens) proportional to their deposit. When a user borrows, the pool issues vDebt tokens that track the growing debt obligation. Interest rates are calculated algorithmically based on the pool's utilization ratio — higher utilization pushes borrow rates up and supply rates up, naturally rebalancing supply and demand.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">nTokens (Deposit Receipts)</p>
            <p>When you supply 100 USDT, you receive nUSDT tokens. These tokens accrue value over time as interest is paid by borrowers. When you withdraw, you burn nUSDT and receive your original USDT plus earned interest. nTokens are standard ERC-20 tokens, meaning they can be transferred, used as collateral in other protocols, or held in multi-sig wallets.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">vDebt Tokens (Debt Tracking)</p>
            <p>Borrowing creates vDebt tokens that represent your outstanding debt. These are non-transferable and increase in value over time as interest accrues. To close a borrow position, you repay the debt amount (which may be slightly more than what you originally borrowed due to accrued interest) and the vDebt tokens are burned.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Price Oracle</p>
            <p>Asset prices feed into collateral valuation and health factor calculations. On mainnet, ArcLend will integrate with Rialo's native oracle infrastructure or a decentralized oracle network. On testnet, prices are simulated with minor fluctuations to demonstrate dynamic behavior.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Liquidation Engine</p>
            <p>Monitors all borrow positions. When a position's health factor drops below 1.0, it becomes eligible for liquidation. Any user can act as a liquidator: they repay part of the borrower's debt and receive the equivalent collateral plus a 5% liquidation bonus. This mechanism keeps the protocol solvent by ensuring bad debt is cleared before it can cascade.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">AMM (Automated Market Maker)</p>
            <p>A constant-product market maker (x × y = k) that enables token swaps. Liquidity providers deposit equal-value pairs of tokens and earn trading fees. The AMM is integrated directly into the ArcLend interface for convenience but operates as an independent contract module.</p>
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
          Lending and borrowing are the core of ArcLend. The mechanics are straightforward but worth understanding in detail.
        </p>

        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">Supplying Assets</p>
            <p>
              To earn yield, you deposit supported assets into ArcLend's lending pool. Your deposit is added to a shared liquidity pool that borrowers draw from. In return, you receive nTokens — interest-bearing receipt tokens — that represent your claim on the pool. As borrowers pay interest, the value of your nTokens increases automatically. You can withdraw your deposit plus earned interest at any time, subject to available liquidity.
            </p>
            <p className="mt-2">
              Supplied assets also serve as collateral. If you later want to borrow, the protocol uses the value of your supplied assets to determine how much you can borrow.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground">Borrowing Against Collateral</p>
            <p>
              To borrow, you must first have assets supplied as collateral. Each asset has a Loan-to-Value (LTV) ratio — currently set at 75% across all supported tokens. This means if you supply $1,000 worth of RIA, you can borrow up to $750 worth of any supported asset. Borrowing creates vDebt tokens that track your growing obligation.
            </p>
            <p className="mt-2">
              Borrow interest rates are variable and depend on the pool's utilization. When utilization is low (lots of idle liquidity), rates are low. When utilization is high (most liquidity is being borrowed), rates increase to incentivize repayment and new deposits.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground">Interest Rate Model</p>
            <p>
              ArcLend uses a two-slope interest rate curve. Below the optimal utilization point (80%), rates increase gradually. Above 80%, rates increase steeply to discourage excessive borrowing and protect supplier withdrawals. This model ensures the protocol remains liquid while offering competitive rates.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground">Key Parameters</p>
            <ul className="list-inside list-disc space-y-1 mt-1">
              <li>Supply APY — Variable interest earned on deposits, driven by borrower demand</li>
              <li>Borrow APY — Variable interest paid by borrowers, driven by pool utilization</li>
              <li>LTV (Loan-to-Value) — 75% for all assets (maximum borrow power relative to collateral)</li>
              <li>Liquidation Threshold — 80% (the point at which collateral is at risk)</li>
              <li>Liquidation Penalty — 5% bonus paid to liquidators from the borrower's collateral</li>
              <li>Reserve Factor — 10% of borrower interest retained by the protocol treasury</li>
            </ul>
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
          The health factor is the single most important number for any borrower on ArcLend. It tells you how safe your position is relative to liquidation.
        </p>

        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">How It's Calculated</p>
            <p>Health Factor = (Total Collateral Value × Liquidation Threshold) ÷ Total Debt Value</p>
            <p className="mt-2">For example, if you have $1,000 of RIA supplied as collateral (with an 80% liquidation threshold) and $400 of USDT borrowed, your health factor is ($1,000 × 0.80) ÷ $400 = 2.0. That is a safe position.</p>
          </div>

          <div>
            <p className="font-semibold text-foreground">What the Numbers Mean</p>
            <ul className="list-inside list-disc space-y-1">
              <li>HF ≥ 2.0 — Safe. Your collateral comfortably covers your debt.</li>
              <li>1.5 ≤ HF &lt; 2.0 — Early warning. Consider reducing your debt or adding collateral.</li>
              <li>1.2 ≤ HF &lt; 1.5 — Caution. You are approaching the danger zone.</li>
              <li>1.0 ≤ HF &lt; 1.2 — High risk. A moderate price movement could trigger liquidation.</li>
              <li>HF &lt; 1.0 — Liquidation eligible. Any user can liquidate your position.</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-foreground">Liquidation Process</p>
            <p>
              When a position's health factor drops below 1.0, it becomes eligible for liquidation. A liquidator can repay up to 50% of the borrower's debt in a single transaction. In return, they receive the equivalent value of the borrower's collateral plus a 5% liquidation bonus. This incentivizes external actors to keep the protocol solvent by clearing risky positions before they turn into bad debt.
            </p>
            <p className="mt-2">
              Liquidation is not instant — it requires a third party to execute the transaction. ArcLend's alert system (email and Telegram) can notify you when your health factor drops below your configured thresholds, giving you time to repay debt or add collateral before liquidation occurs.
            </p>
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
          ArcLend includes a built-in token swap interface powered by an Automated Market Maker (AMM). This allows users to exchange any supported token for another without needing to leave the protocol.
        </p>

        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">How Swaps Work</p>
            <p>
              The AMM uses the constant product formula (x × y = k) to determine exchange rates. When you swap RIA for USDT, you are adding RIA to the RIA/USDT pool and removing USDT. The price you receive depends on the pool's current reserves — larger trades relative to pool size will experience more slippage.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground">Fees & Slippage</p>
            <p>Every swap incurs a 0.3% fee. Of that, 0.25% goes to liquidity providers for the trading pair, and 0.05% goes to the protocol treasury. Slippage tolerance is configurable in the swap interface — the default is 0.5%, meaning a trade will revert if the executed price deviates more than 0.5% from the quoted price.</p>
          </div>

          <div>
            <p className="font-semibold text-foreground">Available Pairs</p>
            <p>RIA/USDT, RIA/WETH, USDT/WETH, ALND/USDT. Any token can be swapped for any other through multi-hop routing when a direct pair doesn't exist.</p>
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
          Liquidity pools are the backbone of ArcLend's swap functionality. By depositing tokens into a pool, you enable other users to trade — and you earn fees for providing that service.
        </p>

        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">Adding Liquidity</p>
            <p>
              To provide liquidity, you deposit two tokens in equal dollar value into a pool (for example, $500 of RIA and $500 of USDT into the RIA/USDT pool). In return, you receive LP tokens that represent your proportional share of the pool. As trades occur, fees accumulate in the pool, increasing the value of your LP tokens.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground">Earning Fees</p>
            <p>Every time someone swaps through a pool you've provided liquidity to, 0.25% of the trade value is distributed pro-rata to all liquidity providers in that pool. The more liquidity you provide and the more trading volume the pool sees, the more fees you earn.</p>
          </div>

          <div>
            <p className="font-semibold text-foreground">Impermanent Loss</p>
            <p>
              When you provide liquidity, the ratio of your deposited tokens changes as trades occur. If the price of one token moves significantly relative to the other, you may end up with a different mix of tokens than you deposited. The difference in value between holding the tokens vs. providing liquidity is called impermanent loss. It becomes permanent only if you withdraw while prices are diverged. Trading fees can offset impermanent loss, but it is a real risk that liquidity providers should understand before depositing.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground">Removing Liquidity</p>
            <p>You can withdraw your liquidity at any time by returning your LP tokens. You receive your proportional share of both tokens in the pool, plus any accrued fees. There is no lock period or withdrawal fee for liquidity positions.</p>
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
          Staking ALND tokens serves two purposes: earning a share of protocol revenue and gaining governance voting power. It is the primary mechanism through which the community participates in the protocol's economics and decision-making.
        </p>

        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">Where Do Staking Rewards Come From?</p>
            <p>
              Staking rewards are not created from thin air or inflationary token minting. They come directly from protocol revenue:
            </p>
            <ul className="list-inside list-disc space-y-1 mt-2">
              <li><strong className="text-foreground">Borrowing interest reserve:</strong> 10% of all borrowing interest paid by users is collected by the protocol treasury. A portion of this is allocated to the staking rewards pool.</li>
              <li><strong className="text-foreground">Swap fee share:</strong> 0.05% of every swap (out of the 0.3% total fee) flows to the treasury. Part of this is distributed to stakers.</li>
              <li><strong className="text-foreground">Liquidation fees:</strong> The protocol retains a small portion of liquidation penalties, which also contributes to the rewards pool.</li>
            </ul>
            <p className="mt-2">
              This means staking rewards are directly tied to protocol usage. The more lending, borrowing, and trading that happens on ArcLend, the more revenue is generated, and the more stakers earn. In periods of low activity, rewards naturally decrease. This alignment ensures the reward model is sustainable without relying on token inflation.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground">Lock Tiers & APY</p>
            <p>Stakers can choose different lock periods. Longer locks earn higher APY multipliers because they demonstrate stronger commitment to the protocol and reduce circulating supply:</p>
            <ul className="list-inside list-disc space-y-1 mt-1">
              <li>Flexible (no lock) — 4% APY (1x multiplier)</li>
              <li>30 days — 5% APY (1.25x multiplier)</li>
              <li>90 days — 6% APY (1.5x multiplier)</li>
              <li>180 days — 8% APY (2x multiplier)</li>
              <li>365 days — 12% APY (3x multiplier)</li>
            </ul>
            <p className="mt-2">
              These rates are targets based on projected protocol revenue at moderate utilization. Actual APY will fluctuate based on total ALND staked and protocol revenue. Governance can vote to adjust the multiplier structure.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground">Unstaking & Warmup</p>
            <p>
              When you unstake, your ALND enters a 3-day warmup (cooldown) period before it returns to your wallet. This prevents flash-staking attacks where someone stakes briefly to capture rewards or voting power and immediately withdraws. During the warmup, your ALND does not earn rewards and cannot vote.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground">Governance Power</p>
            <p>1 staked ALND = 1 vote. Staked ALND that is in a locked position carries full voting weight. Unstaked ALND has no voting power. This ensures that governance decisions are made by participants with skin in the game.</p>
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
          ArcLend is governed by its community through a proposal and voting system. Any user with staked ALND can participate in governance, and decisions are binding on-chain.
        </p>

        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">What Can Be Governed</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Protocol parameters — reserve factor, LTV ratios, liquidation thresholds, interest rate curve slopes</li>
              <li>Adding or removing supported assets</li>
              <li>Treasury allocation — how protocol revenue is spent (development, grants, staking rewards, buybacks)</li>
              <li>Fee structure changes</li>
              <li>Smart contract upgrades</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-foreground">Proposal Lifecycle</p>
            <p>
              Any user with at least 100 staked ALND can create a proposal. Proposals enter a 3-day discussion period, followed by a 4-day voting window. To pass, a proposal needs a simple majority (more than 50% of votes cast in favor) and a minimum quorum of 10% of total staked ALND participating. Approved proposals are executed automatically after a 2-day timelock.
            </p>
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
          The ArcLend testnet faucet distributes free tokens so anyone can try the full protocol without spending real assets. It is designed for testing and demonstration purposes only.
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
            <p>Each token has a 24-hour cooldown between claims. Cooldowns are tracked independently per token and per wallet address. A countdown timer shows exactly when each token becomes claimable again.</p>
          </div>

          <div>
            <p className="font-semibold text-foreground">Claim All</p>
            <p>The "Claim All" button lets you claim every available token in one click. It only processes tokens whose cooldown has expired.</p>
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
          ArcLend includes a contract deployment interface for developers building on Rialo. Deploy standard contract templates directly from the browser — no local development environment required.
        </p>

        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div>
            <p className="font-semibold text-foreground">Available Templates</p>
            <ul className="list-inside list-disc space-y-1">
              <li>ERC-20 Token — Standard fungible token with configurable supply and metadata</li>
              <li>ERC-721 NFT — Non-fungible token with metadata URI support</li>
              <li>ERC-1155 Multi-Token — Combined fungible and non-fungible token standard</li>
              <li>Staking Contract — Lock-and-earn staking with configurable reward rates</li>
              <li>Multi-Signature Wallet — Require multiple approvals for transactions</li>
              <li>Token Vesting — Time-locked token distribution for teams and investors</li>
            </ul>
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
          <p><strong className="text-foreground">APY (Annual Percentage Yield)</strong> — The annualized return on a deposit or staking position, including the effect of compounding.</p>
          <p><strong className="text-foreground">TVL (Total Value Locked)</strong> — The total dollar value of all assets deposited in a protocol's smart contracts.</p>
          <p><strong className="text-foreground">LTV (Loan-to-Value)</strong> — The maximum percentage of collateral value that can be borrowed. A 75% LTV means you can borrow up to 75% of your collateral's value.</p>
          <p><strong className="text-foreground">Health Factor</strong> — A ratio indicating the safety of a borrow position. Below 1.0, the position can be liquidated.</p>
          <p><strong className="text-foreground">Liquidation</strong> — The process by which an undercollateralized borrow position is closed by a third party. The liquidator repays the debt and receives the borrower's collateral at a discount.</p>
          <p><strong className="text-foreground">nTokens</strong> — Interest-bearing receipt tokens issued to suppliers. They represent your deposit plus accrued interest.</p>
          <p><strong className="text-foreground">vDebt Tokens</strong> — Non-transferable tokens that track a borrower's outstanding debt obligation, including accrued interest.</p>
          <p><strong className="text-foreground">AMM (Automated Market Maker)</strong> — A smart contract that facilitates token swaps using a mathematical pricing formula and pooled liquidity, rather than a traditional order book.</p>
          <p><strong className="text-foreground">Impermanent Loss</strong> — The difference in value between holding tokens in your wallet vs. providing them as liquidity in a pool. Caused by relative price changes between paired tokens.</p>
          <p><strong className="text-foreground">Slippage</strong> — The difference between the expected price of a trade and the actual executed price, caused by changes in pool reserves between quote and execution.</p>
          <p><strong className="text-foreground">Reserve Factor</strong> — The percentage of borrower interest that is retained by the protocol treasury rather than passed to suppliers.</p>
          <p><strong className="text-foreground">Utilization Rate</strong> — The percentage of supplied assets currently being borrowed. Higher utilization leads to higher interest rates.</p>
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
        <p className="mt-1 text-sm text-muted-foreground">Everything you need to know about ArcLend Protocol.</p>
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
