export const POOL = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0" as const;

export interface TokenInfo {
    address: `0x${string}`;
    symbol: string;
    name: string;
    decimals: number;
    logo: string;
}

const logo = (mainnetAddress: string) =>
    `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${mainnetAddress}/logo.png`;

export const USDC: TokenInfo = {
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    symbol: "USDC",
    name: "Mock USDC",
    decimals: 6,
    logo: logo("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"),
};

export const WETH: TokenInfo = {
    address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    symbol: "WETH",
    name: "Mock WETH",
    decimals: 18,
    logo: logo("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"),
};

export const TOKENS: TokenInfo[] = [USDC, WETH];
