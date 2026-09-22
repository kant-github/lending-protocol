import { erc20Abi } from "@/abis/erc20";
import { lendingPoolAbi } from "@/abis/lendingPool";
import { POOL, TokenInfo } from "@/lib/contracts";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { parseUnits } from "viem/utils";
import {
    useConnection,
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi";

export function safeParse(value: string, decimals: number): bigint {
    try {
        return value ? parseUnits(value, decimals) : 0n;
    } catch {
        return 0n;
    }
}

export default function useSupply(token: TokenInfo, amount: string) {
    const parsed = safeParse(amount, token.decimals);
    const { address } = useConnection();
    const queryClient = useQueryClient();

    const { data: balance } = useReadContract({
        address: token.address,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address!],
        query: { enabled: !!address },
    });

    const { data: allowance } = useReadContract({
        address: token.address,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address!, POOL],
        query: { enabled: !!address },
    });

    const supplyTx = useWriteContract();
    const supplyReceipt = useWaitForTransactionReceipt({
        hash: supplyTx.data,
        query: { enabled: !!supplyTx.data },
    });

    const approveTx = useWriteContract();
    const approveReceipt = useWaitForTransactionReceipt({
        hash: approveTx.data,
        query: { enabled: !!approveTx.data },
    });

    useEffect(() => {
        if (approveReceipt.isSuccess || supplyReceipt.isSuccess) {
            queryClient.invalidateQueries();
        }
    }, [approveReceipt.isSuccess, supplyReceipt.isSuccess, queryClient]);

    function supply() {
        if (!address || parsed === 0n) return;
        supplyTx.reset();
        supplyTx.mutate({
            address: POOL,
            abi: lendingPoolAbi,
            functionName: "supply",
            args: [token.address, parsed],
        });
    }

    function approve() {
        if (!address || parsed === 0n) return;
        approveTx.reset();
        approveTx.mutate({
            address: token.address,
            abi: erc20Abi,
            functionName: "approve",
            args: [POOL, parsed],
        });
    }

    return {
        balance: balance ?? 0n,
        notEnoughBalance: parsed > (balance ?? 0n),
        needsApproval: parsed > 0n && (allowance ?? 0n) < parsed,
        supply,
        approve,
        reset: () => {
            supplyTx.reset();
            approveTx.reset();
        },
        isSupplyPending: supplyTx.isPending || supplyReceipt.isLoading,
        isApprovePending: approveTx.isPending || approveReceipt.isLoading,
        isSupplySuccess: supplyReceipt.isSuccess,
        isApproveSuccess: approveReceipt.isSuccess,
    };
}
