import useMarkets, { Market } from "./useMarkets"
import { formatUnits } from "viem";

export default function useMarketStats() {
    const { markets } = useMarkets();

    function learnConversion(m: Market, amount: bigint): number {
        if (!m.token) return 0;
        const value = amount * m.price;
        const divided = value / 10n ** BigInt(m.token.decimals);
        return Number(formatUnits(divided, 8));
    }

    const totalAssets = markets.reduce((acc, market) => acc + learnConversion(market, market.totalAssets), 0);
    const totalBorrowed = markets.reduce((acc, market) => acc + learnConversion(market, market.totalBorrowed), 0);
    const totalPooled = markets.reduce((acc, market) => acc + learnConversion(market, market.totalPooled), 0);

    return {
        totalAssets,
        totalBorrowed,
        totalPooled,
    }
}