// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    uint8 private immutable _decimals;

    constructor(
        string memory name,
        string memory symbol,
        uint8 dec
    ) ERC20(name, symbol) {
        _decimals = dec;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function mint(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }
}
