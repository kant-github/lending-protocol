"use client";

import { useEffect } from "react";
import {
    useConnection,
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi";
import { parseUnits } from "viem";
import { erc20Abi } from "@/abis/erc20";
import type { TokenInfo } from "@/lib/contracts";

export function useMint(token: TokenInfo) {
    const { address } = useConnection();

    const { data: balance, refetch } = useReadContract({
        address: token.address,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address!],
        query: { enabled: !!address },
    });

    const { mutate: write, data: hash, isPending, error, reset } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
        query: { enabled: !!hash },
    });

    useEffect(() => {
        if (isSuccess) refetch();
    }, [isSuccess, refetch]);

    function mint(amount: string) {
        if (!address || !amount) return;
        reset();
        write({
            address: token.address,
            abi: erc20Abi,
            functionName: "mint",
            args: [address, parseUnits(amount, token.decimals)],
        });
    }

    return {
        mint,
        balance,
        isBusy: isPending || isConfirming,
        isSuccess,
        error,
    };
}
