"use client";

import { JSX, useState } from "react";
import { useMint } from "@/hooks/useMint";
import type { TokenInfo } from "@/lib/contracts";
import TokenLogo from "./TokenLogo";
import Button from "./Button";

export default function MintRow({ token }: { token: TokenInfo }): JSX.Element {
    const [amount, setAmount] = useState("");
    const { mint, isBusy } = useMint(token);

    function handleMint() {
        mint(amount);
        setAmount("");
    }

    return (
        <div className="pointer-events-auto flex items-center gap-2">
            <div className="relative min-w-0 flex-1">
                <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">
                    <TokenLogo token={token} size={16} />
                </span>
                <input
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Amount of ${token.symbol}`}
                    className="
                        h-9 w-full rounded-lg border border-neutral-300 bg-white
                        pl-8 pr-3 text-[12px] font-medium tabular-nums text-neutral-900
                        outline-none placeholder:text-neutral-400
                        focus-visible:ring-2 focus-visible:ring-neutral-900/20
                    "
                />
            </div>

            <Button className="shrink-0" disabled={isBusy || !amount} onClick={handleMint}>
                {isBusy ? "Minting…" : `Mint ${token.symbol}`}
            </Button>
        </div>
    );
}
