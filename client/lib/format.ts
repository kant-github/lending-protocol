import { formatUnits } from "viem";

export function usdValue(amount: bigint, decimals: number, price: bigint): number {
    return Number(formatUnits((amount * price) / 10n ** BigInt(decimals), 8));
}

export function formatTokenAmount(raw: bigint, decimals: number): string {
    return formatNumber(Number(formatUnits(raw, decimals)));
}

export function formatUsd(n: number): string {
    return n.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 2,
    });
}

export function formatNumber(n: number): string {
    return n.toLocaleString(undefined, {
        notation: "compact",
        maximumFractionDigits: 2,
    });
}
