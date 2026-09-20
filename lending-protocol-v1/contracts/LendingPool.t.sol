// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;

import {Test} from "forge-std/Test.sol";
import {LendingPool} from "./LendingPool.sol";
import {MockERC20} from "./MockERC20.sol";
import {RToken} from "./RToken.sol";

contract LendingPoolTest is Test {
    LendingPool pool;
    MockERC20 weth;
    MockERC20 usdc;

    address rishi = address(0x1);
    address somya = address(0x2);
    address namya = address(0x3);

    function setUp() public {
        weth = new MockERC20("Mock WETH", "WETH", 18);
        usdc = new MockERC20("Mock USDC", "USDC", 6);

        pool = new LendingPool(address(weth), address(usdc));

        pool.listMarket(address(usdc), true, 80, 8, 1e8);
        pool.listMarket(address(weth), false, 75, 0, 2000e8);

        usdc.mint(rishi, 1000e6);
        usdc.mint(namya, 1000e6);
        weth.mint(somya, 1e18);
    }

    function test_FirstSupplierGetsOneToOne() public {
        supplyAs(rishi, usdc, 1000e6);
        assertEq(rTokenOf(address(usdc)).balanceOf(rishi), 1000e6);
        assertEq(pool.totalAssets(address(usdc)), 1000e6);
    }

    function test_SupplyingTwiceToOneUserAddsUp() public {
        supplyAs(rishi, usdc, 500e6);
        supplyAs(rishi, usdc, 500e6);
        assertEq(pool.totalAssets(address(usdc)), 1000e6);
        assertEq(rTokenOf(address(usdc)).balanceOf(rishi), 1000e6);
    }

    function test_SupplyZeroReverts() public {
        // supplyAs(rishi, usdc, 0);
        vm.startPrank(rishi);
        vm.expectRevert("amount can not be 0");
        pool.supply(address(usdc), 0);
        vm.stopPrank();
    }

    function test_SupplyUnlistedMarketReverts() public {
        vm.startPrank(rishi);
        vm.expectRevert("market is not listed");
        pool.supply(address(0), 500e6);
        vm.stopPrank();
    }

    function test_SupplyWithoutApprovalReverts() public {
        vm.startPrank(rishi);
        vm.expectRevert();
        pool.supply(address(usdc), 500e6);
        vm.stopPrank();
    }

    function test_SupplyTooSmallToBuyAShareReverts() public {
        supplyAs(address(rishi), usdc, 1000e6);
        earnInterest();

        vm.startPrank(namya);
        usdc.approve(address(pool), 1);
        vm.expectRevert("amount too small");
        pool.supply(address(usdc), 1);
        vm.stopPrank();
    }

    // helper function which I will need, if someone watching this I just want you to know that these are my written comments...
    function rTokenOf(address tokenName) internal view returns (RToken) {
        (, , RToken rToken, , , , , ) = pool.markets(address(tokenName));
        return rToken;
    }

    function supplyAs(address who, MockERC20 _token, uint256 _amount) internal {
        vm.startPrank(who);
        _token.approve(address(pool), _amount);
        pool.supply(address(_token), _amount);
        vm.stopPrank();
    }

    function earnInterest() internal {
        supplyAs(somya, weth, 1e18);
        vm.startPrank(somya);
        pool.borrow(address(usdc), 500e6);
        vm.stopPrank();

        usdc.mint(somya, 40e6);

        vm.startPrank(somya);
        usdc.approve(address(pool), 540e6);
        pool.repay(address(usdc), 540e6);
        vm.stopPrank();
    }
}
