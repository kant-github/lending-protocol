"use client";

import { JSX } from "react";
import useMarkets, { type Market } from "@/hooks/useMarkets";
import { formatTokenAmount, formatUsd, usdValue } from "@/lib/format";
import TokenLogo from "./TokenLogo";
import MarketDialog from "./MarketDialog";

const COLS = "grid grid-cols-[1.6fr_1fr_1fr_1fr_80px] items-center gap-4";

function Amount({ value, usd }: { value: string; usd: string }): JSX.Element {
  return (
    <div className="leading-tight">
      <p className="text-[13px] tabular-nums text-neutral-900">{value}</p>
      <p className="text-[11px] tabular-nums text-neutral-400">{usd}</p>
    </div>
  );
}

function Row({ market }: { market: Market }): JSX.Element | null {
  const { token } = market;
  if (!token) return null;

  const supplied = formatTokenAmount(market.totalAssets, token.decimals);
  const suppliedUsd = formatUsd(
    usdValue(market.totalAssets, token.decimals, market.price),
  );
  const borrowed = formatTokenAmount(market.totalBorrowed, token.decimals);
  const borrowedUsd = formatUsd(
    usdValue(market.totalBorrowed, token.decimals, market.price),
  );

  return (
    <div className={`${COLS} px-5 py-4 transition-colors hover:bg-neutral-50`}>
      <div className="flex items-center gap-3">
        <TokenLogo token={token} size={36} />
        <div className="leading-tight">
          <p className="text-[13px] font-medium text-neutral-900">
            {token.name}
          </p>
          <p className="text-[11px] text-neutral-400">{token.symbol}</p>
        </div>
      </div>

      <Amount value={supplied} usd={suppliedUsd} />

      {market.borrowingEnabled ? (
        <Amount value={borrowed} usd={borrowedUsd} />
      ) : (
        <p className="text-[13px] text-neutral-300">—</p>
      )}

      {market.borrowingEnabled ? (
        <p className="text-[13px] tabular-nums text-neutral-900">
          {market.borrowRate.toString()}%
        </p>
      ) : (
        <span className="inline-flex w-fit rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-medium text-rose-500">
          Disabled
        </span>
      )}

      <MarketDialog market={market} />
    </div>
  );
}

function Skeleton(): JSX.Element {
  return (
    <div className={`${COLS} px-5 py-4`}>
      <div className="flex items-center gap-3">
        <span className="h-8 w-8 animate-pulse rounded-full bg-neutral-100" />
        <span className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
      </div>
      <span className="h-4 w-16 animate-pulse rounded bg-neutral-100" />
      <span className="h-4 w-16 animate-pulse rounded bg-neutral-100" />
      <span className="h-4 w-10 animate-pulse rounded bg-neutral-100" />
      <span className="h-8 w-16 animate-pulse rounded-lg bg-neutral-100" />
    </div>
  );
}

export default function MarketList(): JSX.Element {
  const { markets, isLoading } = useMarkets();

  return (
    <section className="mx-auto w-full max-w-7xl px-8 pb-12">
      <h2 className="text-[20px] font-medium tracking-tight text-neutral-900 pl-2">
        Listed Markets 
      </h2>
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white mt-4">
        <div
          className={`${COLS} border-b border-neutral-200 px-5 py-3 text-[11px] font-medium text-neutral-400`}
        >
          <p>Asset</p>
          <p>Total supplied</p>
          <p>Total borrowed</p>
          <p>Borrow rate</p>
          <span />
        </div>

        <div className="divide-y divide-neutral-100">
          {isLoading ? (
            <>
              <Skeleton />
              <Skeleton />
            </>
          ) : (
            markets.map((m) => <Row key={m.address} market={m} />)
          )}
        </div>
      </div>
    </section>
  );
}
