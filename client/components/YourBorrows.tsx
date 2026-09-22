"use client";

import { JSX } from "react";
import TokenLogo from "./TokenLogo";
import Button from "./Button";
import usePositions, { Position } from "@/hooks/usePositions";
import { formatTokenAmount, formatUsd } from "@/lib/format";

const COLS = "grid grid-cols-[1.5fr_1fr_96px] items-center gap-3 px-5";
const ROW = `${COLS} h-[68px]`;

function Summary({
  label,
  value,
}: {
  label: string;
  value: string;
}): JSX.Element {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] text-neutral-400">{label}</span>
      <span className="text-[11px] font-medium tabular-nums text-neutral-900">
        {value}
      </span>
    </div>
  );
}

function Row({ position }: { position: Position }): JSX.Element {
  const { market, debt, debtUsd } = position;
  const token = market.token!;

  return (
    <div className={`${ROW} transition-colors hover:bg-neutral-50`}>
      <div className="flex items-center gap-3">
        <TokenLogo token={token} size={32} />
        <div className="leading-tight">
          <p className="text-[13px] font-medium text-neutral-900">
            {token.symbol}
          </p>
          <p className="mt-0.5 text-[11px] tabular-nums text-neutral-400">
            {market.borrowRate} rate
          </p>
        </div>
      </div>

      <div className="leading-tight">
        <p className="text-[13px] tabular-nums text-neutral-900">{formatTokenAmount(debt, token.decimals)}</p>
        <p className="mt-0.5 text-[11px] tabular-nums text-neutral-400">
          {formatUsd(debtUsd)}
        </p>
      </div>

      <Button className="w-full">Repay</Button>
    </div>
  );
}

export default function YourBorrows(): JSX.Element {
  const { debtUsd, positions } = usePositions();
  const hasBorrows = positions.filter((position) => position.debt > 0).length > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-neutral-200 px-5 py-3.5">
        <p className="text-[13px] font-medium text-neutral-900">Your borrows</p>

        <div className="flex items-center gap-4">
          <Summary label="Debt" value={formatUsd(debtUsd)} />
        </div>
      </div>

      {!hasBorrows ? (
        <p className="px-5 py-10 text-center text-[12px] text-neutral-400">
          Nothing borrowed yet.
        </p>
      ) : (
        <div className="divide-y divide-neutral-100">
          {positions.filter((position) => position.debt > 0).map((position) => (
            <Row key={position.market.address} position={position} />
          ))}
        </div>
      )}
    </div>
  );
}
