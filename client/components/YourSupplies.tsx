"use client";

import { JSX } from "react";
import { USDC, WETH, type TokenInfo } from "@/lib/contracts";
import TokenLogo from "./TokenLogo";
import Button from "./Button";
import usePositions, { Position } from "@/hooks/usePositions";
import { formatTokenAmount, formatUsd, usdValue } from "@/lib/format";

interface Supply {
  token: TokenInfo;
  amount: string;
  usd: string;
  isCollateral: boolean;
}

const SUPPLIES: Supply[] = [
  { token: WETH, amount: "2.0", usd: "US$4,000", isCollateral: true },
  { token: USDC, amount: "500", usd: "US$500", isCollateral: false },
];

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
  const { market, supplied, suppliedUsd, isCollateral } = position;
  const token = market.token!;
  return (
    <div className={`${ROW} transition-colors hover:bg-neutral-50`}>
      <div className="flex items-center gap-3">
        <TokenLogo token={market.token!} size={36} />
        <div className="leading-tight">
          <p className="text-[13px] font-medium text-neutral-900">
            {token.symbol}
          </p>
          <p
            className={`mt-0.5 text-[11px] ${isCollateral ? "text-emerald-600" : "text-neutral-400"
              }`}
          >
            {isCollateral ? "Collateral" : "Not collateral"}
          </p>
        </div>
      </div>

      <div className="leading-tight">
        <p className="text-[13px] tabular-nums text-neutral-900">{formatTokenAmount(supplied, token.decimals)}</p>
        <p className="mt-0.5 text-[11px] tabular-nums text-neutral-400">
          {formatUsd(suppliedUsd)}
        </p>
      </div>

      <Button className="w-full">Withdraw</Button>
    </div>
  );
}

export default function YourSupplies(): JSX.Element {
  const { positions, supplyUsd, collateralUsd } = usePositions();
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-neutral-200 px-5 py-3.5">
        <p className="text-[13px] font-medium text-neutral-900">
          Your supplies
        </p>

        <div className="flex items-center gap-4">
          <Summary label="Balance" value={formatUsd(supplyUsd)} />
          <Summary label="Collateral" value={formatUsd(collateralUsd)} />
        </div>
      </div>

      {SUPPLIES.length === 0 ? (
        <p className="px-5 py-10 text-center text-[12px] text-neutral-400">
          Nothing supplied yet.
        </p>
      ) : (
        <>
          <div className="divide-y divide-neutral-100">
            {positions.filter((position) => position.supplied > 0).map((position) => (
              <Row key={position.market.address} position={position} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
