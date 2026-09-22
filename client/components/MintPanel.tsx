"use client";

import { JSX, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import MintRow from "./MintRow";
import { USDC, WETH } from "@/lib/contracts";

const spring = { type: "spring", stiffness: 400, damping: 34 } as const;

const PANEL_SIZE = "h-32 w-80";

export default function MintPanel({
  address,
}: {
  address: string;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <div aria-hidden className="invisible rounded-lg border pb-1">
        <span className="block px-3 py-1.75 text-[11px] font-medium">
          Mint tokens
        </span>
      </div>

      <motion.button
        layout
        onClick={() => setOpen(true)}
        style={{ borderRadius: 8 }}
        transition={spring}
        className={`
                    absolute right-0 top-0 z-50 cursor-pointer outline-none
                    border-[1px] border-neutral-300 bg-[#e4e4e7] pb-1
                    focus-visible:ring-2 focus-visible:ring-neutral-900/20
                    ${open ? PANEL_SIZE : "h-full w-full"}
                `}
      >
        <motion.div
          layout
          style={{ borderRadius: 7 }}
          transition={spring}
          className="h-full w-full bg-white"
        />
      </motion.button>

      <motion.span
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.12, delay: open ? 0 : 0.14 }}
        className="
                    pointer-events-none absolute right-0 top-0 z-50
                    block whitespace-nowrap px-3 py-1.75
                    text-[11px] font-medium text-neutral-900
                "
      >
        Mint tokens
      </motion.span>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.16, delay: 0.14 },
            }}
            exit={{
              opacity: 0,
              y: -4,
              transition: { duration: 0.08, delay: 0 },
            }}
            className={`pointer-events-none absolute right-0 top-0 z-50 ${PANEL_SIZE} p-4`}
          >
            <div className="flex flex-col gap-2.5">
              <MintRow token={USDC} />
              <MintRow token={WETH} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
