// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CampusCredit is ERC20, ERC20Burnable, Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    struct MerchantData {
        address merchant;
        string merchantName;
        bool isMerchantActive;
        uint256 registeredAt;
    }

    struct Product {
        uint256 productId;
        string productName;
        uint256 price;
        uint256 quantity;
        string imageURL;
        uint256 soldCount;
    }

    struct SalesTransaction {
        uint256 productId;
        string productName;
        uint256 quantity;
        uint256 totalPaid;
        uint256 timestamp;
        address buyer;
    }

    mapping(address => MerchantData) public merchantData;
    mapping(address => mapping(uint256 => Product)) public merchantProducts;
    mapping(address => uint256) public merchantProductCounter;

    mapping(address => mapping(uint256 => SalesTransaction))
        public merchantSalesHistory;
    mapping(address => uint256) public merchantSalesCount;

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
    event RegisterMerchantExecuted(address indexed merchant, string name);
    event UpdateMerchantExecuted(address indexed merchant, string name);
    event UnregisterMerchantExecuted(address indexed merchant);
    event ProductAdded(
        address indexed merchant,
        uint256 indexed productId,
        string name
    );
    event ProductUpdated(
        address indexed merchant,
        uint256 indexed productId,
        string name
    );
    event ProductPurchased(
        address indexed buyer,
        address indexed merchant,
        uint256 indexed productId,
        uint256 quantity
    );

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
        require(
            !merchantData[merchant].isMerchantActive,
            "Merchant already registered"
        );

        merchantData[merchant] = MerchantData({
            merchant: merchant,
            merchantName: name,
            isMerchantActive: true,
            registeredAt: block.timestamp
        });

        emit RegisterMerchantExecuted(merchant, name);
    }

    function updateMerchant(
        address merchant,
        string memory name
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            merchantData[merchant].registeredAt != 0,
            "Merchant not registered"
        );

        merchantData[merchant].merchantName = name;

        emit UpdateMerchantExecuted(merchant, name);
    }

    function unregisterMerchant(
        address merchant
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(merchantData[merchant].isMerchantActive, "Merchant not active");
        merchantData[merchant].isMerchantActive = false;

        emit UnregisterMerchantExecuted(merchant);
    }

    function getAllMerchantProducts(
        address merchant
    ) external view returns (Product[] memory) {
        require(merchantData[merchant].isMerchantActive, "Merchant not active");

        uint256 count = merchantProductCounter[merchant];
        Product[] memory products = new Product[](count);

        for (uint256 i = 0; i < count; i++) {
            uint256 productId = i + 1;
            products[i] = merchantProducts[merchant][productId];
        }
        return products;
    }

    function addProduct(
        string memory name,
        uint256 price,
        uint256 quantity,
        string memory imageURL
    ) public {
        require(
            merchantData[msg.sender].isMerchantActive,
            "Not a registered merchant"
        );

        merchantProductCounter[msg.sender]++;
        uint256 newProductId = merchantProductCounter[msg.sender];

        merchantProducts[msg.sender][newProductId] = Product({
            productId: newProductId,
            productName: name,
            price: price,
            quantity: quantity,
            imageURL: imageURL,
            soldCount: 0
        });

        emit ProductAdded(msg.sender, newProductId, name);
    }

    function updateProduct(
        uint256 productId,
        string memory name,
        uint256 price,
        uint256 quantity,
        string memory imageURL
    ) public {
        require(
            merchantData[msg.sender].isMerchantActive,
            "Not a registered merchant"
        );
        require(
            merchantProducts[msg.sender][productId].productId != 0,
            "Product not found"
        );

        Product storage product = merchantProducts[msg.sender][productId];
        product.productName = name;
        product.price = price;
        product.quantity = quantity;
        product.imageURL = imageURL;

        emit ProductUpdated(msg.sender, productId, name);
    }

    function buyProduct(
        address merchant,
        uint256 productId,
        uint256 quantity
    ) public {
        require(merchantData[merchant].isMerchantActive, "Merchant not active");
        Product storage product = merchantProducts[merchant][productId];
        require(product.productId != 0, "Product not found");
        require(product.quantity >= quantity, "Not enough stock");

        uint256 totalPrice = product.price * quantity;

        _checkSpendingLimit(msg.sender, totalPrice);
        _updateSpending(msg.sender, totalPrice);

        _transfer(msg.sender, merchant, totalPrice);
        emit TransferExecuted(msg.sender, merchant, totalPrice);

        uint256 cashback = (totalPrice * cashbackPercentage) / 100;
        _mint(msg.sender, cashback);
        emit CashbackReceived(msg.sender, cashback);

        product.quantity -= quantity;
        product.soldCount += quantity;

        uint256 salesIndex = merchantSalesCount[merchant]++;
        merchantSalesHistory[merchant][salesIndex] = SalesTransaction({
            productId: productId,
            productName: product.productName,
            quantity: quantity,
            totalPaid: totalPrice,
            timestamp: block.timestamp,
            buyer: msg.sender
        });

        emit ProductPurchased(msg.sender, merchant, productId, quantity);
    }

    function getMerchantSalesHistory(
        address merchant
    ) external view returns (SalesTransaction[] memory) {
        uint256 count = merchantSalesCount[merchant];
        SalesTransaction[] memory history = new SalesTransaction[](count);
        for (uint256 i = 0; i < count; i++) {
            history[i] = merchantSalesHistory[merchant][i];
        }
        return history;
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
        require(
            merchantData[merchant].isMerchantActive,
            "Not a registered merchant"
        );
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
