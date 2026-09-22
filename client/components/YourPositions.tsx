"use client";

import { JSX } from "react";
import { useConnection } from "wagmi";
import YourSupplies from "./YourSupplies";
import YourBorrows from "./YourBorrows";

export default function YourPositions(): JSX.Element | null {
  const { status, address } = useConnection();

  if (status !== "connected" || !address) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-8 pb-10">
      <h2 className="text-[20px] font-medium tracking-tight text-neutral-900 pl-2">
        Your positions
      </h2>

      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        <YourSupplies />
        <YourBorrows />
      </div>
    </section>
  );
}
