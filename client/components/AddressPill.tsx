"use client";

import { JSX, useState } from "react";
import { HiOutlineCheck, HiOutlineSquare2Stack } from "react-icons/hi2";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { TOKENS, type TokenInfo } from "@/lib/contracts";
import TokenLogo from "./TokenLogo";

function BalanceRow({ token }: { token: TokenInfo }): JSX.Element {
    const { formatted, isLoading } = useTokenBalance(token);

    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
                <TokenLogo token={token} size={30} />
                <span className="text-[13px] font-medium text-neutral-900">
                    {token.symbol}
                </span>
            </div>

            {isLoading ? (
                <span className="h-3.5 w-16 animate-pulse rounded bg-neutral-100" />
            ) : (
                <span className="text-[13px] tabular-nums text-neutral-900">
                    {Number(formatted).toLocaleString(undefined, {
                        maximumFractionDigits: 4,
                    })}
                </span>
            )}
        </div>
    );
}

export default function AddressPill({ address }: { address: string }): JSX.Element {
    const [copied, setCopied] = useState(false);

    async function copy() {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    return (
        <Dialog>
            <DialogTrigger
                render={
                    <button
                        type="button"
                        className="
                            pointer-events-auto flex h-8 cursor-pointer items-center gap-2
                            rounded-full border border-neutral-300 bg-white pl-2.5 pr-3
                            outline-none transition-colors hover:bg-neutral-50
                            focus-visible:ring-2 focus-visible:ring-neutral-900/20
                        "
                    />
                }
            >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-medium tabular-nums text-neutral-700">
                    {address.slice(0, 6)}…{address.slice(-4)}
                </span>
            </DialogTrigger>

            <DialogContent
                showCloseButton={false}
                className="gap-0 rounded-2xl bg-white p-6 sm:max-w-xs"
            >
                <DialogTitle className="sr-only">Wallet</DialogTitle>

                <button
                    type="button"
                    onClick={copy}
                    className="
                        group flex w-full cursor-pointer items-center justify-center gap-2
                        outline-none
                    "
                >
                    <span className="text-[15px] font-medium tabular-nums text-neutral-900">
                        {address.slice(0, 6)}…{address.slice(-4)}
                    </span>
                    {copied ? (
                        <HiOutlineCheck className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                        <HiOutlineSquare2Stack className="h-3.5 w-3.5 text-neutral-300 transition-colors group-hover:text-neutral-500" />
                    )}
                </button>

                <p className="mt-1 text-center text-[11px] text-neutral-400">
                    {copied ? "Copied" : "Connected"}
                </p>

                <div className="mt-5 divide-y divide-neutral-100 border-t border-neutral-100">
                    {TOKENS.map((t) => (
                        <BalanceRow key={t.address} token={t} />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
