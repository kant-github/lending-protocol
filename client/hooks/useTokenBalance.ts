"use client";

import { erc20Abi } from "@/abis/erc20";
import type { TokenInfo } from "@/lib/contracts";
import { formatUnits } from "viem";
import { useConnection, useReadContract } from "wagmi";

export const useTokenBalance = (token: TokenInfo) => {
    const { address } = useConnection();
    const { data, isLoading, refetch } = useReadContract({
        abi: erc20Abi,
        address: token.address,
        args: [address!],
        functionName: "balanceOf",
        query: { enabled: !!address },
    });
    return {
        raw: data ?? 0n,
        formatted: formatUnits(data ?? 0n, token.decimals),
        isLoading,
        refetch,
    };
};
