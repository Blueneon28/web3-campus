// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

/**
 * @title CourseBadge
 * @dev Multi-token untuk berbagai badges dan certificates
 * Token types:
 * - Course completion certificates (non-fungible)
 * - Event attendance badges (fungible)
 * - Achievement medals (limited supply)
 * - Workshop participation tokens
 */
contract CourseBadge is ERC1155, AccessControl, Pausable, ERC1155Supply {
    // Role definitions
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Token ID ranges untuk organization
    uint256 public constant CERTIFICATE_BASE = 1000;
    uint256 public constant EVENT_BADGE_BASE = 2000;
    uint256 public constant ACHIEVEMENT_BASE = 3000;
    uint256 public constant WORKSHOP_BASE = 4000;
    
    // Token metadata structure
    struct TokenInfo {
        string name;
        string category;
        uint256 maxSupply;
        bool isTransferable;
        uint256 validUntil; // 0 = no expiry
        address issuer;
    }
    
    // TODO: Add mappings
    mapping(uint256 => TokenInfo) public tokenInfo;
    mapping(uint256 => string) private _tokenURIs;
    
    // Track student achievements
    mapping(address => uint256[]) public studentBadges;
    mapping(uint256 => mapping(address => uint256)) public earnedAt; // Timestamp
    
    // Counter untuk generate unique IDs
    uint256 private _certificateCounter;
    uint256 private _eventCounter;
    uint256 private _achievementCounter;
    uint256 private _workshopCounter;

    event CertificateTypeCreated(uint256 indexed tokenId, string name, uint256 maxSupply);
    event CertificateIssued(address indexed student, uint256 indexed tokenId, uint256 timestamp);
    event EventBadgeMinted(uint256 indexed eventId, address[] attendees, uint256 amount);
    event AchievementGranted(address indexed student, uint256 indexed tokenId, uint256 rarity);


    constructor() ERC1155("") {
        // TODO: Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(URI_SETTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /**
     * @dev Create new certificate type
     * Use case: Mata kuliah baru atau program baru
     */
    function createCertificateType(
        string memory name,
        uint256 maxSupply,
        string memory _uri
    ) public onlyRole(MINTER_ROLE) returns (uint256) {
        // TODO: Create new certificate type
        // 1. Generate ID: CERTIFICATE_BASE + _certificateCounter++
        // 2. Store token info
        // 3. Set URI
        // 4. Return token ID

        uint256 tokenId = CERTIFICATE_BASE + _certificateCounter;
        _certificateCounter++;

        tokenInfo[tokenId] = TokenInfo({
            name: name,
            category: "Certificate",
            maxSupply: maxSupply,
            isTransferable: false, // Certificates biasanya tidak bisa dipindahtangankan
            validUntil: 0, // No expiry untuk certificate
            issuer: msg.sender
        });

        _tokenURIs[tokenId] = _uri;
        emit CertificateTypeCreated(tokenId, name, maxSupply);
        return tokenId;
    }

    /**
     * @dev Issue certificate to student
     * Use case: Student lulus mata kuliah
     */
    function issueCertificate(
        address student,
        uint256 certificateType,
        string memory additionalData
    ) public onlyRole(MINTER_ROLE) {
        // TODO: Mint certificate
        // 1. Verify certificate type exists
        // 2. Check max supply not exceeded
        // 3. Mint 1 token to student
        // 4. Record timestamp
        // 5. Add to student's badge list

        require(bytes(tokenInfo[certificateType].name).length > 0, "Certificate type does not exist");
        require(
            totalSupply(certificateType) < tokenInfo[certificateType].maxSupply,
            "Max supply exceeded"
        );

        require(balanceOf(student, certificateType) == 0, "Student already has this certificate");
        _mint(student, certificateType, 1, bytes(additionalData));
        earnedAt[certificateType][student] = block.timestamp;
        studentBadges[student].push(certificateType);

        emit CertificateIssued(student, certificateType, block.timestamp);
    }

    /**
     * @dev Batch mint event badges
     * Use case: Attendance badges untuk peserta event
     */
    function mintEventBadges(
        address[] memory attendees,
        uint256 eventId,
        uint256 amount
    ) public onlyRole(MINTER_ROLE) {
        // TODO: Batch mint to multiple addresses
        // Use loop to mint to each attendee
        // Record participation
        require(eventId >= EVENT_BADGE_BASE, "Invalid event ID");

         for (uint256 i = 0; i < attendees.length; i++) {
            address attendee = attendees[i];
            
            _mint(attendee, eventId, amount, "");
            
            if (earnedAt[eventId][attendee] == 0) {
                earnedAt[eventId][attendee] = block.timestamp;
                studentBadges[attendee].push(eventId);
            }
        }

        emit EventBadgeMinted(eventId, attendees, amount);
    }

    /**
     * @dev Set metadata URI untuk token
     */
    function setTokenURI(uint256 tokenId, string memory newuri) 
        public onlyRole(URI_SETTER_ROLE) 
    {
        // TODO: Store custom URI per token
        _tokenURIs[tokenId] = newuri;
    }

    /**
     * @dev Get all badges owned by student
     */
    function getStudentBadges(address student) 
        public view returns (uint256[] memory) 
    {
        // TODO: Return array of token IDs owned by student
        return studentBadges[student];
    }

    /**
     * @dev Verify badge ownership dengan expiry check
     */
    function verifyBadge(address student, uint256 tokenId) 
        public view returns (bool isValid, uint256 earnedTimestamp) 
    {
        // TODO: Check ownership and validity
        // 1. Check balance > 0
        // 2. Check not expired
        // 3. Return status and when earned
        uint256 balance = balanceOf(student, tokenId);
        earnedTimestamp = earnedAt[tokenId][student];

        uint256 validUntil = tokenInfo[tokenId].validUntil;
        bool notExpired = (validUntil == 0) || (block.timestamp <= validUntil);

        isValid = (balance > 0) && notExpired;
    }

    /**
     * @dev Pause all transfers
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev Override transfer to check transferability and pause
     */
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Supply) whenNotPaused {
        // TODO: Check transferability for each token
        for (uint i = 0; i < ids.length; i++) {
            if (from != address(0) && to != address(0)) { // Not mint or burn
                require(tokenInfo[ids[i]].isTransferable, "Token not transferable");
            }
        }
        
        super._update(from, to, ids, values);
    }

    /**
     * @dev Override to return custom URI per token
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        // TODO: Return stored URI for token
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Check interface support
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // Achievement System Functions
    
    /**
     * @dev Grant achievement badge
     * Use case: Dean's list, competition winner, etc
     */
    function grantAchievement(
        address student,
        string memory achievementName,
        uint256 rarity // 1 = common, 2 = rare, 3 = legendary
    ) public onlyRole(MINTER_ROLE) returns (uint256) {
        // TODO: Create unique achievement NFT
        // Generate achievement ID
        // Set limited supply based on rarity
        // Mint to deserving student
         uint256 tokenId = ACHIEVEMENT_BASE + _achievementCounter;
        _achievementCounter++;

        uint256 maxSupply;
        if (rarity == 1) {
            maxSupply = 1000; // Common
        } else if (rarity == 2) {
            maxSupply = 100;  // Rare
        } else if (rarity == 3) {
            maxSupply = 10;   // Legendary
        } else {
            revert("Invalid rarity level");
        }

        tokenInfo[tokenId] = TokenInfo({
            name: achievementName,
            category: "Achievement",
            maxSupply: maxSupply,
            isTransferable: true, // Achievements bisa dipindahtangankan
            validUntil: 0, // No expiry
            issuer: msg.sender
        });

        _mint(student, tokenId, 1, "");

        earnedAt[tokenId][student] = block.timestamp;
        studentBadges[student].push(tokenId);

        emit AchievementGranted(student, tokenId, rarity);
        return tokenId;
    }

    /**
     * @dev Create workshop series dengan multiple sessions
     */
    function createWorkshopSeries(
        string memory seriesName,
        uint256 totalSessions
    ) public onlyRole(MINTER_ROLE) returns (uint256[] memory) {
        // TODO: Create multiple related tokens
        // Return array of token IDs for each session

        require(totalSessions > 0, "Total sessions must be greater than 0");
        
        uint256[] memory tokenIds = new uint256[](totalSessions);

        for (uint256 i = 0; i < totalSessions; i++) {
            uint256 tokenId = WORKSHOP_BASE + _workshopCounter;
            _workshopCounter++;
            
            string memory sessionName = string(abi.encodePacked(
                seriesName, " - Session ", toString(i + 1)
            ));
            
            tokenInfo[tokenId] = TokenInfo({
                name: sessionName,
                category: "Workshop",
                maxSupply: 500, 
                isTransferable: true,
                validUntil: 0,
                issuer: msg.sender
            });
            
            tokenIds[i] = tokenId;
        }

        return tokenIds;
    }

    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}