"use client";

import { JSX } from "react";
import { WETH } from "@/lib/contracts";
import TokenLogo from "./TokenLogo";
import useMarketStats from "@/hooks/useMarketStats";
import { formatUsd } from "@/lib/format";



function Stat({ label, value }: { label: string; value: number }): JSX.Element {
  return (
    <div className="min-w-0">
      <p className="text-[12px] font-medium text-neutral-400">{label}</p>
      <p className="mt-1 text-[24px] font-medium leading-none tracking-tight tabular-nums text-neutral-900">
        {formatUsd(value)}
      </p>
    </div>
  );
}

export default function StatsComponent(): JSX.Element {
  const { totalAssets, totalBorrowed, totalPooled } = useMarketStats();
  const STATS = [
    { label: "Total market size", value: totalAssets },
    { label: "Total available", value: totalPooled },
    { label: "Total borrows", value: totalBorrowed },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-8 py-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <TokenLogo token={WETH} size={30} />

            <h1 className="text-[28px] font-medium leading-none tracking-tight text-neutral-900">
              Core
            </h1>

            <span className="rounded-md px-1.5 py-0.5 text-[12px] font-semibold text-amber-500 bg-amber-100">
              V1
            </span>
          </div>

          <p className="mt-2 text-[12px] text-neutral-400">
            Supply and borrow across the markets in this pool.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-12 gap-y-5">
          {STATS.map((s) => (
            <Stat key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      </div>
    </section>
  );
}
