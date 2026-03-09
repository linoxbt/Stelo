import { defineChain } from "viem";

export const rialoTestnet = defineChain({
  id: 9876,
  name: "Rialo Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Rialo",
    symbol: "RLO",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet-rpc.rialo.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Rialo Explorer",
      url: "https://testnet-explorer.rialo.network",
    },
  },
  testnet: true,
});
