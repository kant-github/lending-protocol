"use client";

import { JSX, useState } from "react";
import { HiOutlineCheck, HiOutlineSquare2Stack } from "react-icons/hi2";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { TOKENS, type TokenInfo } from "@/lib/contracts";
import TokenLogo from "./TokenLogo";
import { useDisconnect } from "wagmi";

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

export default function WalletShell({
  address,
}: {
  address: string;
}): JSX.Element {
  const [copied, setCopied] = useState(false);
  const { mutate: disconnect } = useDisconnect();

  async function copy() {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div>
      <button
        type="button"
        onClick={copy}
        className="group flex w-full cursor-pointer items-center justify-center gap-2 outline-none"
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

      <button
        type="button"
        onClick={() => disconnect()}
        className="mt-5 h-9 w-full cursor-pointer rounded-lg bg-neutral-100 text-[12px] font-medium text-neutral-600 outline-none transition-colors hover:bg-rose-100 hover:text-rose-500"
      >
        Disconnect
      </button>
    </div>
  );
}
