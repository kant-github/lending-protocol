// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;
import "./RToken.sol";
import "forge-std/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract LendingPool {
    event Supplied(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 shares
    );
    event Withdrawn(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 shares
    );
    event Borrowed(address indexed user, address indexed token, uint256 amount);
    event Repaid(
        address indexed user,
        address indexed token,
        uint256 principle,
        uint256 interest
    );
    struct Market {
        bool isListed;
        bool borrowingEnabled;
        RToken rToken;
        uint256 borrowRate;
        uint8 collateralFactor;
        uint256 price;
        uint256 totalPooled;
        uint256 totalBorrowed;
    }

    address public immutable WETH;
    address public immutable USDC;

    mapping(address => Market) public markets;
    mapping(address => mapping(address => uint256)) public debt;

    address[] public listedTokens;

    constructor(address _weth, address _usdc) {
        WETH = _weth;
        USDC = _usdc;
    }

    function supply(address _token, uint256 _amount) external {
        Market storage m = markets[_token];

        require(m.isListed, "market is not listed");
        require(_amount > 0, "amount can not be 0");

        uint256 shares = toShares(_token, _amount);
        require(shares > 0, "amount too small");

        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        m.totalPooled += _amount;
        m.rToken.mint(msg.sender, shares);
        emit Supplied(msg.sender, _token, _amount, shares);
    }

    function withdraw(address _token, uint256 shares) external {
        Market storage m = markets[_token];
        require(m.isListed, "");
        require(m.isListed, "market is not listed");
        require(m.rToken.balanceOf(msg.sender) >= shares, "not enough shares");

        uint256 amount = toAssets(_token, shares);

        require(amount > 0, "amount can not be 0");
        require(amount <= m.totalPooled, "not enough money in the pool");

        m.rToken.burn(msg.sender, amount);
        m.totalPooled -= amount;
        IERC20(_token).transfer(msg.sender, amount);
        emit Withdrawn(msg.sender, _token, amount, shares);
    }

    function borrow(address _token, uint256 _amount) external {
        Market storage m = markets[_token];

        require(m.isListed, "market is not listed");
        require(m.borrowingEnabled, "borrowing is not enabled in this token");
        require(_amount > 0, "amount can not be 0");
        require(m.totalPooled >= _amount, "not enough to borrow");

        m.totalPooled -= _amount;
        m.totalBorrowed += _amount;
        debt[_token][msg.sender] += _amount;

        require(isHealthy(msg.sender), "not enough collateral");

        IERC20(_token).transfer(msg.sender, _amount);
        emit Borrowed(msg.sender, _token, _amount);
    }

    function repay(address _token, uint256 _amount) external {
        Market storage m = markets[_token];
        require(m.isListed, "market is not listed");
        uint principle = debt[_token][msg.sender];
        require(principle > 0, "you don't have any debt");
        uint interest = (principle * m.borrowRate) / 100;
        uint256 owed = principle + interest;

        require(_amount >= owed, "you owe more than the limit");

        debt[_token][msg.sender] = 0;
        m.totalBorrowed -= principle;
        m.totalPooled += owed;
        IERC20(_token).transferFrom(msg.sender, address(this), owed);
        emit Repaid(msg.sender, _token, principle, interest);
    }

    // these comments are mine, not ai generated
    // <---------------------------------------- HELPER-FUNCTIONS ---------------------------------------->
    function toShares(
        address _token,
        uint256 _amount
    ) public view returns (uint256) {
        uint256 availableSupply = markets[_token].rToken.totalSupply();
        if (availableSupply == 0) return _amount;
        return (_amount * availableSupply) / totalAssets(_token);
    }

    function toAssets(
        address _token,
        uint256 shares
    ) public view returns (uint256) {
        Market storage m = markets[_token];
        if (m.rToken.totalSupply() == 0) return shares;
        return (totalAssets(_token) * shares) / m.rToken.totalSupply();
    }

    function totalAssets(address _token) public view returns (uint256) {
        Market storage m = markets[_token];
        return m.totalBorrowed + m.totalPooled;
    }

    function isHealthy(address _user) public view returns (bool) {
        uint256 wethHeld = toAssets(
            WETH,
            markets[WETH].rToken.balanceOf(_user)
        );
        uint usdValueOfEth = toUsd(WETH, wethHeld);
        uint usdValueOfEthwithCollateral = (usdValueOfEth *
            markets[WETH].collateralFactor) / 100;
        uint256 debtUsd = toUsd(USDC, debt[USDC][_user]);

        return debtUsd <= usdValueOfEthwithCollateral;
    }

    function toUsd(
        address _token,
        uint256 amount
    ) public view returns (uint256) {
        uint priceOfOne = markets[_token].price;
        uint256 decimalPlaces = 10 ** IERC20Metadata(_token).decimals();
        return (amount * priceOfOne) / decimalPlaces;
    }

    function listMarket(
        address _token,
        bool _borrowingEnabled,
        uint8 _collateralFactor,
        uint256 _borrowRate,
        uint256 price
    ) external {
        require(!markets[_token].isListed, "market is already listed");
        // here I have to make the r's token.. again this is my comment not of an AI..
        string memory sym = string.concat("r", IERC20Metadata(_token).symbol());
        RToken rToken = new RToken(
            sym,
            sym,
            IERC20Metadata(_token).decimals(),
            address(this)
        );
        markets[_token] = Market({
            isListed: true,
            borrowingEnabled: _borrowingEnabled,
            rToken: rToken,
            borrowRate: _borrowRate,
            collateralFactor: _collateralFactor,
            price: price,
            totalPooled: 0,
            totalBorrowed: 0
        });
    }
}
