"use client";

import { JSX } from "react";
import { useConnect, useConnection, useConnectors } from "wagmi";
import { RiArrowRightSLine } from "react-icons/ri";
import AddressPill from "./AddressPill";
import MintPanel from "./MintPanel";
import Button from "./Button";

export default function Navbar(): JSX.Element {
  const { status, address } = useConnection();
  const connectors = useConnectors();
  const { mutate: connect } = useConnect();

  const connected = status === "connected" && !!address;

  return (
    <nav className="w-full border-b border-neutral-200">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-end gap-2">
        {connected ? (
          <>
            <AddressPill address={address} />
            <MintPanel address={address} />
          </>
        ) : (
          <Button onClick={() => connect({ connector: connectors[0] })}>
            Connect Wallet
            <RiArrowRightSLine />
          </Button>
        )}
      </div>
    </nav>
  );
}
