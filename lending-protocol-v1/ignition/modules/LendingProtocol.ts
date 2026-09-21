import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("LendingProtocol", (m) => {
    const usdc = m.contract("MockERC20", ["MOCK USDC", "USDC", 6], { id: "USDC" });
    const weth = m.contract("MockERC20", ["MOCK WETH", "WETH", 18], { id: "WETH" });

    const pool = m.contract("LendingPool", [weth, usdc]);

    m.call(pool, "listMarket", [usdc, true, 80, 8, 100_000_000n], { id: "listUSDC" })
    m.call(pool, "listMarket", [weth, false, 75, 0, 200_000_000_000n], { id: "listWETH" })

    return { weth, usdc, pool };
})