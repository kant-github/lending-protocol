"use client";

import { JSX } from "react";
import { motion } from "motion/react";
import { HiCheck } from "react-icons/hi2";
import type { TokenInfo } from "@/lib/contracts";
import TokenLogo from "./TokenLogo";

export default function SuccessView({
    token,
    amount,
    action,
    onDone,
}: {
    token: TokenInfo;
    amount: string;
    action: string;
    onDone: () => void;
}): JSX.Element {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center py-6"
        >
            <motion.span
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.05 }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50"
            >
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.18 }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500"
                >
                    <HiCheck className="h-5 w-5 text-white" />
                </motion.span>
            </motion.span>

            <p className="mt-4 text-[15px] font-medium text-neutral-900">
                {action} successful
            </p>

            <div className="mt-3 flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1.5">
                <TokenLogo token={token} size={18} />
                <span className="text-[13px] font-medium tabular-nums text-neutral-900">
                    {amount} {token.symbol}
                </span>
            </div>

            <button
                type="button"
                onClick={onDone}
                className="
                    mt-6 h-11 w-full cursor-pointer rounded-xl bg-neutral-900
                    text-[13px] font-medium text-white outline-none
                    transition-colors hover:bg-neutral-800
                "
            >
                Done
            </button>
        </motion.div>
    );
}
