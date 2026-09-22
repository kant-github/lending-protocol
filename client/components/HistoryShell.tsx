"use client";

import { JSX } from "react";
import { HiOutlineArrowDownTray, HiOutlineArrowUpTray } from "react-icons/hi2";
import { TOKENS } from "@/lib/contracts";
import TokenLogo from "./TokenLogo";

type Entry = {
  id: number;
  action: "Supplied" | "Borrowed";
  amount: string;
  symbol: string;
  when: string;
};

const ENTRIES: Entry[] = [
  { id: 1, action: "Supplied", amount: "2.0", symbol: "WETH", when: "2h ago" },
  { id: 2, action: "Borrowed", amount: "1,200", symbol: "USDC", when: "5h ago" },
  { id: 3, action: "Supplied", amount: "500", symbol: "USDC", when: "1d ago" },
];

function Row({ entry }: { entry: Entry }): JSX.Element {
  const token = TOKENS.find((t) => t.symbol === entry.symbol);
  const isIn = entry.action === "Supplied";

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <span className="relative">
          {token && <TokenLogo token={token} size={36} />}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-neutral-100">
            {isIn ? (
              <HiOutlineArrowDownTray className="h-2 w-2 text-emerald-600" />
            ) : (
              <HiOutlineArrowUpTray className="h-2 w-2 text-neutral-500" />
            )}
          </span>
        </span>

        <span className="leading-tight">
          <span className="block text-[13px] font-medium text-neutral-900">
            {entry.action}
          </span>
          <span className="block text-[11px] text-neutral-400">
            {entry.when}
          </span>
        </span>
      </div>

      <span className="text-[13px] tabular-nums text-neutral-900">
        {entry.amount} {entry.symbol}
      </span>
    </div>
  );
}

export default function HistoryShell(): JSX.Element {
  if (ENTRIES.length === 0) {
    return (
      <p className="py-10 text-center text-[12px] text-neutral-400">
        No activity yet.
      </p>
    );
  }

  return (
    <div className="divide-y divide-neutral-100 border-t border-neutral-100">
      {ENTRIES.map((e) => (
        <Row key={e.id} entry={e} />
      ))}
    </div>
  );
}
