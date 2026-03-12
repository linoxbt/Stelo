# Stelo Deployment Guide — Rialo Network

This guide covers deploying all Stelo smart contracts on **Rialo Testnet** using Remix IDE.

> **Important:** RLO is the native gas token on Rialo. WETH and USDT are custom ERC-20 tokens deployed specifically for testing Stelo.

## Prerequisites

- MetaMask connected to Rialo Testnet
- Testnet RLO for gas fees
- [Remix IDE](https://remix.ethereum.org)

---

## 1. MockUSDT.sol — Deploy First

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockUSDT is ERC20, Ownable {
    constructor() ERC20("Stelo USDT", "USDT") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10**decimals());
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
```

### Remix Steps:
1. Create `MockUSDT.sol` and paste the code
2. Compile with Solidity `0.8.20`
3. Set Environment to "Injected Provider - MetaMask"
4. Ensure MetaMask is on Rialo Testnet
5. Deploy and save the contract address

---

## 2. MockWETH.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockWETH is ERC20, Ownable {
    constructor() ERC20("Stelo WETH", "WETH") Ownable(msg.sender) {
        _mint(msg.sender, 10_000 * 10**decimals());
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
```

Deploy using the same Remix steps. Save the address.

---

## 3. PriceOracle.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PriceOracle is Ownable {
    mapping(address => uint256) public prices;

    constructor() Ownable(msg.sender) {}

    function setPrice(address asset, uint256 price) external onlyOwner {
        prices[asset] = price;
    }

    function getPrice(address asset) external view returns (uint256) {
        require(prices[asset] > 0, "Price not set");
        return prices[asset];
    }
}
```

**After deploying:**
1. `setPrice(USDT_ADDRESS, 100000000)` — USDT = $1.00
2. `setPrice(WETH_ADDRESS, 225374000000)` — WETH = $2253.74

---

## 4. LendingPool.sol — Core Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LendingPool is Ownable, ReentrancyGuard {
    struct Reserve {
        address aTokenAddress;
        address debtTokenAddress;
        uint256 liquidationThreshold;
        uint256 ltv;
        uint256 totalSupplied;
        uint256 totalBorrowed;
        uint256 supplyRate;
        uint256 borrowRate;
        bool isActive;
    }

    struct UserPosition {
        uint256 supplied;
        uint256 borrowed;
    }

    mapping(address => Reserve) public reserves;
    mapping(address => mapping(address => UserPosition)) public userPositions;
    address[] public reservesList;
    address public priceOracle;

    event Supply(address indexed user, address indexed asset, uint256 amount);
    event Borrow(address indexed user, address indexed asset, uint256 amount);
    event Repay(address indexed user, address indexed asset, uint256 amount);
    event Withdraw(address indexed user, address indexed asset, uint256 amount);

    constructor(address _priceOracle) Ownable(msg.sender) {
        priceOracle = _priceOracle;
    }

    function initReserve(
        address asset,
        address aToken,
        address debtToken,
        uint256 liquidationThreshold,
        uint256 ltv
    ) external onlyOwner {
        reserves[asset] = Reserve({
            aTokenAddress: aToken,
            debtTokenAddress: debtToken,
            liquidationThreshold: liquidationThreshold,
            ltv: ltv,
            totalSupplied: 0,
            totalBorrowed: 0,
            supplyRate: 300,
            borrowRate: 500,
            isActive: true
        });
        reservesList.push(asset);
    }

    function supply(address asset, uint256 amount) external nonReentrant {
        require(reserves[asset].isActive, "Reserve not active");
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        userPositions[asset][msg.sender].supplied += amount;
        reserves[asset].totalSupplied += amount;
        emit Supply(msg.sender, asset, amount);
    }

    function borrow(address asset, uint256 amount) external nonReentrant {
        require(reserves[asset].isActive, "Reserve not active");
        userPositions[asset][msg.sender].borrowed += amount;
        reserves[asset].totalBorrowed += amount;
        IERC20(asset).transfer(msg.sender, amount);
        emit Borrow(msg.sender, asset, amount);
    }

    function repay(address asset, uint256 amount) external nonReentrant {
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        userPositions[asset][msg.sender].borrowed -= amount;
        reserves[asset].totalBorrowed -= amount;
        emit Repay(msg.sender, asset, amount);
    }

    function withdraw(address asset, uint256 amount) external nonReentrant {
        userPositions[asset][msg.sender].supplied -= amount;
        reserves[asset].totalSupplied -= amount;
        IERC20(asset).transfer(msg.sender, amount);
        emit Withdraw(msg.sender, asset, amount);
    }

    function getHealthFactor(address user) external view returns (uint256) {
        uint256 totalCollateralETH = 0;
        uint256 totalDebtETH = 0;
        for (uint i = 0; i < reservesList.length; i++) {
            address asset = reservesList[i];
            UserPosition memory pos = userPositions[asset][user];
            totalCollateralETH += pos.supplied;
            totalDebtETH += pos.borrowed;
        }
        if (totalDebtETH == 0) return type(uint256).max;
        return (totalCollateralETH * 10000) / totalDebtETH;
    }
}
```

**Deploy with constructor:** Pass PriceOracle address.

**After deploying:**
1. `initReserve(USDT_ADDRESS, aTokenAddr, debtTokenAddr, 8000, 7500)`
2. `initReserve(WETH_ADDRESS, aTokenAddr, debtTokenAddr, 8200, 7800)`

---

## 5. Faucet.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Faucet is Ownable {
    mapping(address => mapping(address => uint256)) public lastClaim;
    uint256 public cooldown = 24 hours;
    mapping(address => uint256) public claimAmounts;

    constructor() Ownable(msg.sender) {}

    function setClaimAmount(address token, uint256 amount) external onlyOwner {
        claimAmounts[token] = amount;
    }

    function claim(address token) external {
        require(block.timestamp - lastClaim[msg.sender][token] >= cooldown, "Cooldown active");
        uint256 amount = claimAmounts[token];
        require(amount > 0, "Token not configured");
        lastClaim[msg.sender][token] = block.timestamp;
        IERC20(token).transfer(msg.sender, amount);
    }

    function claimAll(address[] calldata tokens) external {
        for (uint i = 0; i < tokens.length; i++) {
            if (block.timestamp - lastClaim[msg.sender][tokens[i]] >= cooldown) {
                uint256 amount = claimAmounts[tokens[i]];
                if (amount > 0) {
                    lastClaim[msg.sender][tokens[i]] = block.timestamp;
                    IERC20(tokens[i]).transfer(msg.sender, amount);
                }
            }
        }
    }
}
```

**After deploying:**
1. `setClaimAmount(USDT_ADDRESS, 1000000)` — 1 USDT
2. `setClaimAmount(WETH_ADDRESS, 1000000000000000000)` — 1 WETH
3. Mint tokens to Faucet: `MockUSDT.mint(FAUCET_ADDR, 1000000000000)` and `MockWETH.mint(FAUCET_ADDR, 10000000000000000000000)`

---

## 6. LiquidityPool.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LiquidityPool is ERC20 {
    IERC20 public tokenA;
    IERC20 public tokenB;
    uint256 public reserveA;
    uint256 public reserveB;

    constructor(address _tokenA, address _tokenB) ERC20("Stelo LP", "STL-LP") {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external returns (uint256 liquidity) {
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);
        liquidity = amountA + amountB;
        _mint(msg.sender, liquidity);
        reserveA += amountA;
        reserveB += amountB;
    }

    function removeLiquidity(uint256 liquidity) external {
        uint256 totalSupply_ = totalSupply();
        uint256 amountA = (liquidity * reserveA) / totalSupply_;
        uint256 amountB = (liquidity * reserveB) / totalSupply_;
        _burn(msg.sender, liquidity);
        reserveA -= amountA;
        reserveB -= amountB;
        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);
    }

    function swap(address tokenIn, uint256 amountIn) external returns (uint256 amountOut) {
        require(tokenIn == address(tokenA) || tokenIn == address(tokenB), "Invalid");
        bool isA = tokenIn == address(tokenA);
        (uint256 resIn, uint256 resOut) = isA ? (reserveA, reserveB) : (reserveB, reserveA);
        uint256 amountInWithFee = amountIn * 997;
        amountOut = (amountInWithFee * resOut) / (resIn * 1000 + amountInWithFee);
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        if (isA) {
            reserveA += amountIn;
            reserveB -= amountOut;
            tokenB.transfer(msg.sender, amountOut);
        } else {
            reserveB += amountIn;
            reserveA -= amountOut;
            tokenA.transfer(msg.sender, amountOut);
        }
    }
}
```

**Deploy one per pair:**
- `LiquidityPool(WETH_ADDRESS, USDT_ADDRESS)`
- Seed with `addLiquidity`

---

## Deployment Checklist

1. ✅ Deploy `MockUSDT` → save address
2. ✅ Deploy `MockWETH` → save address
3. ✅ Deploy `PriceOracle` → set prices
4. ✅ Deploy `LendingPool(oracleAddress)` → init reserves
5. ✅ Deploy `Faucet` → set amounts, mint tokens to faucet
6. ✅ Deploy `LiquidityPool(WETH, USDT)` → seed liquidity

## Frontend Integration

After deploying, update the frontend:
1. Add all contract addresses to `src/lib/contracts.ts`
2. Create ABIs from Remix (Compilation Details)
3. Replace toast handlers with `useWriteContract` calls
4. Add ERC-20 approval flows before supply/swap
5. Connect balance reading via `useReadContract`
6. Test full supply → borrow → repay → withdraw flow
