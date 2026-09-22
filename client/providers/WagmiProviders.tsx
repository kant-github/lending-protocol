"use client"
import { config } from "@/lib/wagmi.client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";

export default function WagmiProviders({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient);
    return (
        <WagmiProvider config={config} reconnectOnMount={true}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}