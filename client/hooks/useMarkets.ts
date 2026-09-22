"use client";

import { useReadContract, useReadContracts } from "wagmi";
import { lendingPoolAbi } from "@/abis/lendingPool";
import { POOL, TOKENS, type TokenInfo } from "@/lib/contracts";

type MarketTuple = readonly [
    boolean,
    boolean,
    `0x${string}`,
    bigint,
    number,
    bigint,
    bigint,
    bigint,
];

export interface Market {
    address: `0x${string}`;
    token: TokenInfo | undefined;
    borrowingEnabled: boolean;
    borrowRate: bigint;
    collateralFactor: number;
    rToken: `0x${string}`; 
    price: bigint;
    totalPooled: bigint;
    totalBorrowed: bigint;
    totalAssets: bigint;
}

export default function useMarkets() {
    const { data: listedTokenAddresses, isLoading: isListLoading } =
        useReadContract({
            address: POOL,
            abi: lendingPoolAbi,
            functionName: "getListedMarkets",
        });

    const { data: listedMarketData, isLoading: isMarketDataLoading } =
        useReadContracts({
            contracts: (listedTokenAddresses ?? []).flatMap((tokenAddress) => [
                {
                    address: POOL,
                    abi: lendingPoolAbi,
                    functionName: "markets",
                    args: [tokenAddress],
                } as const,
                {
                    address: POOL,
                    abi: lendingPoolAbi,
                    functionName: "totalAssets",
                    args: [tokenAddress],
                } as const,
            ]),
            query: { enabled: !!listedTokenAddresses?.length },
        });

    const markets: Market[] = (listedTokenAddresses ?? []).map(
        (tokenAddress, i) => {
            const m = listedMarketData?.[i * 2]?.result as
                | MarketTuple
                | undefined;
            const totalAssets = listedMarketData?.[i * 2 + 1]?.result as
                | bigint
                | undefined;

            return {
                address: tokenAddress,
                token: TOKENS.find(
                    (t) =>
                        t.address.toLowerCase() === tokenAddress.toLowerCase(),
                ),
                borrowingEnabled: m?.[1] ?? false,
                borrowRate: m?.[3] ?? 0n,
                rToken: m?.[2] ?? "0x",
                collateralFactor: Number(m?.[4] ?? 0),
                price: m?.[5] ?? 0n,
                totalPooled: m?.[6] ?? 0n,
                totalBorrowed: m?.[7] ?? 0n,
                totalAssets: totalAssets ?? 0n,
            };
        },
    );

    return {
        markets,
        isLoading: isListLoading || isMarketDataLoading,
    };
}
