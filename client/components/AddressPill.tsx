"use client";

import { JSX, useState } from "react";
import { motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import WalletShell from "./WalletShell";
import HistoryShell from "./HistoryShell";

type Tab = "wallet" | "history";

export default function AddressPill({
  address,
}: {
  address: string;
}): JSX.Element {
  const [tab, setTab] = useState<Tab>("wallet");

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

        <div className="mb-5 flex gap-1 rounded-lg bg-neutral-100 p-1">
          {(["wallet", "history"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="relative flex-1 cursor-pointer rounded-md py-1.5 text-[12px] font-medium capitalize outline-none"
            >
              {tab === t && (
                <motion.span
                  layoutId="wallet-tab"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  style={{ borderRadius: 6 }}
                  className="absolute inset-0 bg-white shadow-sm"
                />
              )}
              <span
                className={`relative z-10 transition-colors ${
                  tab === t
                    ? "text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {t}
              </span>
            </button>
          ))}
        </div>

        <div className="h-[230px] overflow-y-auto">
          {tab === "wallet" ? (
            <WalletShell address={address} />
          ) : (
            <HistoryShell />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
