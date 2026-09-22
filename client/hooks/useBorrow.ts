import { POOL, TokenInfo } from "@/lib/contracts";
import { safeParse } from "./useSupply";
import { useConnection, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { lendingPoolAbi } from "@/abis/lendingPool";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function useBorrow(token: TokenInfo, amount: string) {
    const parsed = safeParse(amount, token.decimals);
    const { address } = useConnection();
    const queryClient = useQueryClient();

    const { data } = useReadContract({
        abi: lendingPoolAbi,
        address: POOL,
        functionName: "debt",
        args: [token.address, address!],
        query: { enabled: !!address },
    })

    const borrowTx = useWriteContract();
    const borrowTxReciept = useWaitForTransactionReceipt({
        hash: borrowTx.data,
        query: {
            enabled: !!borrowTx.data,
        }
    })

    useEffect(() => {
        if (borrowTxReciept.isSuccess) {
            queryClient.invalidateQueries()
        }
        else if(borrowTxReciept.isError) {
            console.log("Borrow transaction failed:", borrowTxReciept.error);
        }
    }, [borrowTxReciept.isSuccess, queryClient]);

    function borrow() {
        if (!parsed) return;
        borrowTx.reset();
        borrowTx.mutate({
            abi: lendingPoolAbi,
            address: POOL,
            functionName: "borrow",
            args: [token.address, parsed],
        });
    }

    return {
        debt: data ?? 0n,
        borrow,
        reset: () => borrowTx.reset(),
        isBorrowPending: borrowTx.isPending || borrowTxReciept.isLoading,
        isBorrowSuccess: borrowTxReciept.isSuccess,
    }
}