import { lendingPoolAbi } from "@/abis/lendingPool";
import { POOL, TokenInfo } from "@/lib/contracts";
import { useConnection, useReadContract } from "wagmi";

export default function useRepay(token: TokenInfo, amount: string) {
    const { address } = useConnection();
    const { data: debt } = useReadContract({
        abi: lendingPoolAbi,
        address: POOL,
        functionName: "debt",
        args: [token.address, address!],
        query: { enabled: !!address }
    })
    console.log("Debt:", debt);
}