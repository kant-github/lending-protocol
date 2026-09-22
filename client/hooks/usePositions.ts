import { useConnection, useReadContracts } from "wagmi";
import useMarkets, { Market } from "./useMarkets";
import { POOL, WETH } from "@/lib/contracts";
import { lendingPoolAbi } from "@/abis/lendingPool";
import { erc20Abi } from "@/abis/erc20";
import { usdValue } from "@/lib/format";

export interface Position {
    market: Market;
    supplied: bigint;
    suppliedUsd: number;
    debt: bigint;
    debtUsd: number;
    isCollateral: boolean;
}

export default function usePositions() {
    const { address } = useConnection();
    const { markets } = useMarkets();

    const { data, isLoading: isPositionsLoading } = useReadContracts({
        contracts: markets.flatMap((m) => [
            {
                address: m.rToken,
                abi: erc20Abi,
                functionName: "balanceOf",
                args: [address!],
            } as const,
            {
                address: m.rToken,
                abi: erc20Abi,
                functionName: "totalSupply",
            } as const,
            {
                address: POOL,
                abi: lendingPoolAbi,
                functionName: "debt",
                args: [m.address, address!],
            } as const,
        ]),
        query: { enabled: !!address && markets.length > 0 },
    });

    const positions: Position[] = markets.map((market, i) => {
        const shares = (data?.[i * 3]?.result as bigint | undefined) ?? 0n;
        const totalShares = (data?.[i * 3 + 1]?.result as bigint | undefined) ?? 0n;
        const debt = (data?.[i * 3 + 2]?.result as bigint | undefined) ?? 0n;

        const supplied =
            totalShares === 0n ? 0n : (shares * market.totalAssets) / totalShares;

        const decimals = market.token?.decimals ?? 18;

        return {
            market,
            supplied,
            suppliedUsd: usdValue(supplied, decimals, market.price),
            debt,
            debtUsd: usdValue(debt, decimals, market.price),
            isCollateral:
                market.address.toLowerCase() === WETH.address.toLowerCase(),
        };
    });


    const supplyUsd = positions.filter((p) => p.supplied > 0).reduce((acc, position) => acc + position.suppliedUsd, 0);
    const debtUsd = positions.filter((p) => p.debt > 0).reduce((acc, position) => acc + position.debtUsd, 0);
    const collateralUsd = positions.filter((p) => p.isCollateral).reduce((acc, position) => acc + position.suppliedUsd, 0);

    return { positions, supplyUsd, debtUsd, collateralUsd };
}