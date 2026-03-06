import { FC, ReactNode } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { rialoTestnet } from "@/lib/chains";

const config = getDefaultConfig({
  appName: "ArcLend",
  projectId: "arclend-demo-project",
  chains: [rialoTestnet],
  ssr: false,
});

const queryClient = new QueryClient();

export const Web3Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const isDark = document.documentElement.classList.contains("dark");

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={isDark ? darkTheme({ accentColor: "hsl(263, 70%, 58%)", borderRadius: "medium" }) : lightTheme({ accentColor: "hsl(263, 70%, 58%)", borderRadius: "medium" })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
