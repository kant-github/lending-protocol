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

    // only "connected" guarantees address is defined — "reconnecting" can have
    // isConnected true while address is still undefined
    const connected = status === "connected" && !!address;

    return (
        <nav className="w-full h-16 flex items-center justify-end gap-2 px-8 border-b border-neutral-200">
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
        </nav>
    );
}
