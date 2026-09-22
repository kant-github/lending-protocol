"use client";

import { JSX, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { formatTokenAmount, formatUsd, usdValue } from "@/lib/format";
import type { Market } from "@/hooks/useMarkets";
import TokenLogo from "./TokenLogo";
import Button from "./Button";
import useSupply from "@/hooks/useSupply";
import SuccessView from "./SuccessView";
import useBorrow from "@/hooks/useBorrow";
import { safeParse } from "@/hooks/useSupply";

type Tab = "supply" | "borrow";

function Stat({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div>
      <p className="text-[10px] text-neutral-400">{label}</p>
      <p className="mt-0.5 text-[13px] font-medium tabular-nums text-neutral-900">
        {value}
      </p>
    </div>
  );
}

export default function MarketDialog({
  market,
}: {
  market: Market;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("supply");
  const [value, setValue] = useState("");
  const {
    notEnoughBalance,
    needsApproval,
    supply,
    approve,
    isSupplyPending,
    isApprovePending,
    isSupplySuccess,
    reset: resetTx,
  } = useSupply(market.token!, value);

  const {
    borrow,
    isBorrowPending,
    isBorrowSuccess,
    reset: resetBorrow,
  } = useBorrow(market.token!, value);

  const token = market.token!;
  const isSupply = tab === "supply";
  const borrowDisabled = !isSupply && !market.borrowingEnabled;

  const parsed = safeParse(value, token.decimals);
  const notEnoughLiquidity = !isSupply && parsed > market.totalPooled;

  const busy = isSupply ? isApprovePending || isSupplyPending : isBorrowPending;
  const isSuccess = isSupply ? isSupplySuccess : isBorrowSuccess;

  const label = isSupply
    ? isApprovePending
      ? "Approving\u2026"
      : isSupplyPending
        ? "Supplying\u2026"
        : notEnoughBalance
          ? "Insufficient balance"
          : needsApproval
            ? `Approve ${token.symbol}`
            : `Supply ${token.symbol}`
    : isBorrowPending
      ? "Borrowing\u2026"
      : borrowDisabled
        ? "Borrowing disabled"
        : notEnoughLiquidity
          ? "Not enough liquidity"
          : `Borrow ${token.symbol}`;

  const onAction = isSupply ? (needsApproval ? approve : supply) : borrow;

  const disabled =
    !value ||
    busy ||
    borrowDisabled ||
    (isSupply ? notEnoughBalance : notEnoughLiquidity);

  function reset() {
    resetTx();
    resetBorrow();
    setValue("");
    setOpen(false);
  }

  const supplied = usdValue(market.totalAssets, token.decimals, market.price);
  const borrowed = usdValue(market.totalBorrowed, token.decimals, market.price);
  const available = usdValue(market.totalPooled, token.decimals, market.price);
  const utilization = supplied > 0 ? (borrowed / supplied) * 100 : 0;

  function handleAction() {
    if (tab === "borrow") {
      borrow();
    } else {
      if (needsApproval) {
        approve();
      } else {
        supply();
      }
    }
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Details</DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="gap-0 rounded-4xl bg-white p-6 sm:max-w-md"
      >
        <DialogTitle className="sr-only">{token.name}</DialogTitle>

        {isSuccess ? (
          <SuccessView
            token={token}
            amount={value}
            action={isSupply ? "Supply" : "Borrow"}
            onDone={reset}
          />
        ) : (
          <>
            <div className="flex items-center gap-3">
              <TokenLogo token={token} size={36} />
              <div className="leading-tight">
                <p className="text-[15px] font-medium text-neutral-900">
                  {token.name}
                </p>
                <p className="text-[11px] text-neutral-400">{token.symbol}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl bg-neutral-50 p-4">
              <Stat label="Reserve size" value={formatUsd(supplied)} />
              <Stat label="Available liquidity" value={formatUsd(available)} />
              <Stat
                label="Utilization rate"
                value={`${utilization.toFixed(2)}%`}
              />
              <Stat
                label="Oracle price"
                value={formatUsd(Number(market.price) / 1e8)}
              />
            </div>

            <div className="mt-5 flex gap-1 rounded-lg bg-neutral-100 p-1">
              {(["supply", "borrow"] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className="relative flex-1 cursor-pointer rounded-md py-1.5 text-[12px] font-medium capitalize outline-none"
                >
                  {tab === t && (
                    <motion.span
                      layoutId="market-tab"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 38,
                      }}
                      style={{ borderRadius: 6 }}
                      className="absolute inset-0 bg-white shadow-sm"
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors ${tab === t
                      ? "text-neutral-900"
                      : "text-neutral-500 hover:text-neutral-900"
                      }`}
                  >
                    {t}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-neutral-400">Amount</label>
                <button
                  type="button"
                  className="cursor-pointer text-[11px] font-medium text-neutral-400 outline-none hover:text-neutral-900"
                >
                  Max
                </button>
              </div>

              <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2.5 focus-within:border-neutral-400">
                <input
                  type="text"
                  inputMode="decimal"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="0.00"
                  className="min-w-0 flex-1 bg-transparent text-[18px] font-medium tabular-nums text-neutral-900 outline-none placeholder:text-neutral-300"
                />
                <span className="flex shrink-0 items-center gap-1.5">
                  <TokenLogo token={token} size={20} />
                  <span className="text-[13px] font-medium text-neutral-700">
                    {token.symbol}
                  </span>
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
                <span>Wallet balance</span>
                <span className="tabular-nums">
                  {formatTokenAmount(0n, token.decimals)} {token.symbol}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-2 border-t border-neutral-100 pt-4">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-neutral-400">
                  {tab === "supply" ? "Supply APY" : "Borrow rate"}
                </span>
                <span className="tabular-nums text-neutral-900">
                  {market.borrowingEnabled
                    ? `${market.borrowRate.toString()}%`
                    : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-neutral-400">Max LTV</span>
                <span className="tabular-nums text-neutral-900">
                  {market.collateralFactor}%
                </span>
              </div>
            </div>

            {borrowDisabled && (
              <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-[11px] text-rose-500">
                Borrowing is disabled for {token.symbol}. It can only be used as
                collateral.
              </p>
            )}

            <button
              type="button"
              disabled={disabled}
              onClick={onAction}
              className="
                        mt-5 h-11 w-full cursor-pointer rounded-xl bg-neutral-900
                        text-[13px] font-medium text-white outline-none transition-colors
                        hover:bg-neutral-800
                        disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400
                    "
            >
              {label}
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
