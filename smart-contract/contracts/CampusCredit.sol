// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CampusCredit is ERC20, ERC20Burnable, Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    mapping(address => bool) public isMerchant;
    mapping(address => string) public merchantName;

    mapping(address => uint256) public dailySpendingLimit;
    mapping(address => uint256) public spentToday;
    mapping(address => uint256) public lastSpendingReset;

    uint256 public cashbackPercentage = 2;

    constructor() ERC20("Campus Credit", "CREDIT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _mint(msg.sender, 100_000 * (10 ** decimals()));
    }

    // Events
    event WithdrawnExecuted(address indexed user, uint256 amount);
    event TopupExecuted(address indexed student, uint256 amount);
    event TransferExecuted(address indexed from, address to, uint256 amount);
    event CashbackReceived(address indexed student, uint256 amount);
    event RegisterMerchantExecuted(address indexed merchant);
    event UnregisterMerchantExecuted(address indexed merchant);

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function studentTopup(uint256 amount) public {
        _mint(msg.sender, amount);

        emit TopupExecuted(msg.sender, amount);
    }

    function registerMerchant(
        address merchant,
        string memory name
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        isMerchant[merchant] = true;
        merchantName[merchant] = name;

        emit RegisterMerchantExecuted(merchant);
    }

    function unregisterMerchant(
        address merchant
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        isMerchant[merchant] = false;
        merchantName[merchant] = "";

        emit UnregisterMerchantExecuted(merchant);
    }

    function processWithdrawal(uint256 amount) public {
        burn(amount);

        emit WithdrawnExecuted(msg.sender, amount);
    }

    function setDailyLimit(
        address student,
        uint256 limit
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        dailySpendingLimit[student] = limit;
    }

    function transferWithLimit(address to, uint256 amount) public {
        _checkSpendingLimit(msg.sender, amount);
        _updateSpending(msg.sender, amount);
        _transfer(msg.sender, to, amount);

        emit TransferExecuted(msg.sender, to, amount);
    }

    function transferWithCashback(address merchant, uint256 amount) public {
        require(isMerchant[merchant], "Not a registered merchant");
        _checkSpendingLimit(msg.sender, amount);
        _updateSpending(msg.sender, amount);

        _transfer(msg.sender, merchant, amount);
        emit TransferExecuted(msg.sender, merchant, amount);

        uint256 cashback = (amount * cashbackPercentage) / 100;
        _mint(msg.sender, cashback);
        emit CashbackReceived(msg.sender, cashback);
    }

    function _checkSpendingLimit(
        address student,
        uint256 amount
    ) internal view {
        uint256 limit = dailySpendingLimit[student];
        if (limit > 0) {
            uint256 today = block.timestamp / 1 days;
            if (lastSpendingReset[student] < today) {
                require(amount <= limit, "Over daily limit");
            } else {
                require(
                    spentToday[student] + amount <= limit,
                    "Over daily limit"
                );
            }
        }
    }

    function _updateSpending(address student, uint256 amount) internal {
        uint256 today = block.timestamp / 1 days;
        if (lastSpendingReset[student] < today) {
            spentToday[student] = 0;
            lastSpendingReset[student] = today;
        }
        spentToday[student] += amount;
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(!paused(), "CampusCredit: paused");
        super._update(from, to, amount);
    }
}
