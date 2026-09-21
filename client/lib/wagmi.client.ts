import { createConfig, http, injected } from "wagmi";
import { hardhat } from "wagmi/chains";

export const config = createConfig({
    ssr: true,
    chains: [hardhat],
    connectors: [injected()],
    transports: {
        [hardhat.id]: http(),
    }
})