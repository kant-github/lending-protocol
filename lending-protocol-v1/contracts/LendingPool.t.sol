// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;

import {Test} from "forge-std/Test.sol";
import {LendingPool} from "./LendingPool.sol";
import {MockERC20} from "./MockERC20.sol";

contract LendingPoolTest is Test {
    LendingPool pool;
    MockERC20 weth;
    MockERC20 usdc;

    address rishi = address(0x1);
    address somya = address(0x2);

    function setUp() public {
        weth = new MockERC20("Mock WETH", "WETH", 18);
        usdc = new MockERC20("Mock USDC", "USDC", 6);

        pool = new LendingPool(address(weth), address(usdc));

        pool.listMarket(address(weth), true, 75, 8, 2000e8);
        pool.listMarket(address(usdc), false, 75, 8, 1e8);

        usdc.mint(rishi, 1000e6);
        weth.mint(somya, 1e18);
    }
}
