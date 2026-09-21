"use client";

import { JSX, useState } from "react";
import Image from "next/image";
import type { TokenInfo } from "@/lib/contracts";

export default function TokenLogo({
    token,
    size = 28,
}: {
    token: TokenInfo;
    size?: number;
}): JSX.Element {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <span
                style={{ width: size, height: size }}
                className="flex shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-semibold text-neutral-600"
            >
                {token.symbol.slice(0, 2)}
            </span>
        );
    }

    return (
        <Image
            src={token.logo}
            alt={token.symbol}
            width={size}
            height={size}
            onError={() => setFailed(true)}
            className="shrink-0 rounded-full"
        />
    );
}
