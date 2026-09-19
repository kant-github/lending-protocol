// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RToken is ERC20 {
    address _pool;
    uint8 _decimal;

    modifier onlyPool() {
        require(msg.sender == _pool, "RToken: only pool");
        _;
    }

    constructor(
        string memory name,
        string memory symbol,
        uint8 dec,
        address pool
    ) ERC20(name, symbol) {
        _pool = pool;
        _decimal = dec;
    }

    function decimals() public view override returns (uint8) {
        return _decimal;
    }

    function mint(address _to, uint256 _amount) external onlyPool {
        _mint(_to, _amount);
    }

    function burn(address _from, uint256 amount) external onlyPool {
        _burn(_from, amount);
    }
}
