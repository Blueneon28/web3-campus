// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title StudentID
 * @dev NFT-based student identity card
 * Features:
 * - Auto-expiry after 4 years
 * - Renewable untuk active students
 * - Contains student metadata
 * - Non-transferable (soulbound)
 */
contract StudentID is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    uint256 private _nextTokenId;
    
    struct StudentData {
        string nim;
        string name;
        string major;
        uint256 enrollmentYear;
        uint256 expiryDate;
        bool isActive;
        uint8 semester;
    }
    
    // TODO: Add mappings
    mapping(uint256 => StudentData) public studentData;
    mapping(string => uint256) public nimToTokenId; // Prevent duplicate NIM
    mapping(address => uint256) public addressToTokenId; // One ID per address
    
    // Array untuk menyimpan semua token IDs yang pernah di-mint
    uint256[] private _allTokenIds;
    
    // Events
    event StudentIDIssued(
        uint256 indexed tokenId, 
        string nim, 
        address student,
        uint256 expiryDate
    );
    event StudentIDUpdated(
        uint256 indexed tokenId, 
        string nim, 
        address student,
        uint256 expiryDate
    );
    event StudentIDRenewed(uint256 indexed tokenId, uint256 newExpiryDate);
    event StudentStatusUpdated(uint256 indexed tokenId, bool isActive);
    event ExpiredIDBurned(uint256 indexed tokenId);

    uint256 public constant INITIAL_VALIDITY_PERIOD = 4 * 365 days;
    uint256 public constant RENEWAL_PERIOD = 180 days;             
    uint8 public constant MAX_SEMESTER = 14;                        

    constructor() ERC721("Student Identity Card", "SID") Ownable(msg.sender) {
        _nextTokenId = 1;
    }

    /**
     * @dev Issue new student ID
     * Use case: New student enrollment
     */
    function issueStudentID(
        address to,
        string memory nim,
        string memory name,
        string memory major,
        string memory uri
    ) public onlyOwner {
        // TODO: Implement ID issuance
        // Hints:
        // 1. Check NIM tidak duplicate (use nimToTokenId)
        // 2. Check address belum punya ID (use addressToTokenId)
        // 3. Calculate expiry (4 years from now)
        // 4. Mint NFT
        // 5. Set token URI (foto + metadata)
        // 6. Store student data
        // 7. Update mappings
        // 8. Emit event
         // 1. INPUT VALIDATION
        require(to != address(0), "Cannot issue to zero address");
        require(bytes(nim).length > 0, "NIM cannot be empty");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(major).length > 0, "Major cannot be empty");
        require(bytes(uri).length > 0, "URI cannot be empty");
        
        // 2. DUPLICATE CHECKS
        require(nimToTokenId[nim] == 0, "NIM already exists");
        require(addressToTokenId[to] == 0, "Address already has Student ID");
        
        // 3. CALCULATE DATES
        uint256 currentYear = (block.timestamp / 365 days) + 1970; // Approximate current year
        uint256 expiryDate = block.timestamp + INITIAL_VALIDITY_PERIOD;
        
        // 4. MINT NFT
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        
        // 5. SET METADATA
        _setTokenURI(tokenId, uri);
        
        // 6. STORE STUDENT DATA
        studentData[tokenId] = StudentData({
            nim: nim,
            name: name,
            major: major,
            enrollmentYear: currentYear,
            expiryDate: expiryDate,
            isActive: true,
            semester: 1
        });
        
        // 7. UPDATE MAPPINGS
        nimToTokenId[nim] = tokenId;
        addressToTokenId[to] = tokenId;
        
        // 8. ADD TO ALL TOKENS ARRAY
        _allTokenIds.push(tokenId);
        
        // 9. EMIT EVENT
        emit StudentIDIssued(tokenId, nim, to, expiryDate);
    }
    
    /**
     * @dev Renew student ID untuk semester baru
     */
    function renewStudentID(uint256 tokenId) public onlyOwner {
        // TODO: Extend expiry date
        // Check token exists
        // Check student is active
        // Add 6 months to expiry
        // Update semester
        // Emit renewal event
        require(_ownerOf(tokenId) != address(0),"Token not exist");

        StudentData storage student = studentData[tokenId];
        require(student.isActive, "Student is not active");

        require(student.semester < MAX_SEMESTER, "Maximum semester reached");

        uint256 extendedExpired = block.timestamp + RENEWAL_PERIOD;
        student.expiryDate = extendedExpired;
        student.semester += 1;
          
        emit StudentIDRenewed(tokenId, extendedExpired);
    }
    
    /**
     * @dev Update student status (active/inactive)
     * Use case: Cuti, DO, atau lulus
     */
    function updateStudentStatus(uint256 tokenId, bool isActive) public onlyOwner {
        // TODO: Update active status
        // If inactive, maybe reduce privileges
        require(_ownerOf(tokenId) != address(0),"Token not exist");

        StudentData storage student = studentData[tokenId];
        student.isActive = isActive;
    }
    
    /**
     * @dev Burn expired IDs
     * Use case: Cleanup expired cards
     */
    function burnExpired(uint256 tokenId) public {
        // TODO: Allow anyone to burn if expired
        // Check token exists
        // Check if expired (block.timestamp > expiryDate)
        // Burn token
        // Clean up mappings
        // Emit event
        require(_ownerOf(tokenId) != address(0),"Token not exist");
        require(!isExpired(tokenId), "Token is expired");

        _burn(tokenId);
    }
    
    /**
     * @dev Check if NIM is active
     */
    function isActiveStudent(string memory nim) public view returns (bool) {
        // TODO: Return true if student data exists and is active
        uint256 tokenId = nimToTokenId[nim];

        require(_ownerOf(tokenId) != address(0),"Owner not exist");

        return studentData[tokenId].isActive;
    }
    
    /**
     * @dev Check if ID is expired
     */
    function isExpired(uint256 tokenId) public view returns (bool) {
        // TODO: Return true if expired
        require(_ownerOf(tokenId) != address(0), "Owner not exist");
        
        StudentData storage student = studentData[tokenId];
        return block.timestamp > student.expiryDate;
    }
    
    /**
     * @dev Get student info by token ID
     */
    function getStudentByTokenID(uint256 tokenId) public view returns (address owner, StudentData memory data) {
        // TODO: Lookup student by token ID
        require(_ownerOf(tokenId) != address(0), "Owner not exist");

        StudentData storage student = studentData[tokenId];

        return (_ownerOf(tokenId),student);
    }
    
    /**
     * @dev Get student info by NIM
     */
    function getStudentByNIM(string memory nim) public view returns (
        address owner,
        uint256 tokenId,
        StudentData memory data
    ) {
        // TODO: Lookup student by NIM
        uint256 token = nimToTokenId[nim];

        require(_ownerOf(token) != address(0),"Owner not exist");

        StudentData storage student = studentData[token];

        return (_ownerOf(token), token, student);
    }

    /**
     * @dev Get student info by address including URI
     * @param studentAddress Address of the student
     * @return tokenId Token ID of the student
     * @return data Student data
     * @return uri Token URI containing metadata
     */
    function getStudentByAddress(address studentAddress) public view returns (
        uint256 tokenId,
        StudentData memory data,
        string memory uri
    ) {
        require(studentAddress != address(0), "Invalid address");
        
        tokenId = addressToTokenId[studentAddress];
        require(tokenId != 0, "No student ID found for this address");
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        data = studentData[tokenId];
        uri = tokenURI(tokenId);
        
        return (tokenId, data, uri);
    }

    function getAllStudents() public view returns (
        uint256[] memory tokenIds,
        address[] memory addresses,
        StudentData[] memory students,
        string[] memory uris
    ) {
        // Count active tokens (non-burned)
        uint256 activeCount = 0;
        for (uint256 i = 0; i < _allTokenIds.length; i++) {
            if (_ownerOf(_allTokenIds[i]) != address(0)) {
                activeCount++;
            }
        }
        
        // Initialize arrays with active count
        tokenIds = new uint256[](activeCount);
        addresses = new address[](activeCount);
        students = new StudentData[](activeCount);
        uris = new string[](activeCount);
        
        // Fill arrays with active student data
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < _allTokenIds.length; i++) {
            uint256 tokenId = _allTokenIds[i];
            address owner = _ownerOf(tokenId);
            
            if (owner != address(0)) {
                tokenIds[currentIndex] = tokenId;
                addresses[currentIndex] = owner;
                students[currentIndex] = studentData[tokenId];
                uris[currentIndex] = tokenURI(tokenId);
                currentIndex++;
            }
        }
        
        return (tokenIds, addresses, students, uris);
    }

    function getTotalStudentsCount() public view returns (uint256) {
        return _allTokenIds.length;
    }

    /**
     * @dev Get total number of active students (excluding burned tokens)
     */
    function getActiveStudentsCount() public view returns (uint256) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < _allTokenIds.length; i++) {
            if (_ownerOf(_allTokenIds[i]) != address(0)) {
                activeCount++;
            }
        }
        return activeCount;
    }

    function updateStudentInfo(
        uint256 tokenId,
        string memory name,
        string memory major,
        string memory uri
    ) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        StudentData storage student = studentData[tokenId];
        
        // Update name if provided
        if (bytes(name).length > 0) {
            student.name = name;
        }
        
        // Update major if provided
        if (bytes(major).length > 0) {
            student.major = major;
        }
        
        // Update URI if provided
        if (bytes(uri).length > 0) {
            _setTokenURI(tokenId, uri);
        }
        emit StudentIDUpdated(tokenId,student.nim,_ownerOf(tokenId),student.expiryDate);
    }


    // Override functions required untuk multiple inheritance
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    //     super._burn(tokenId);
    //     // TODO: Clean up student data when burning
    //     // delete studentData[tokenId];
    //     // delete nimToTokenId[studentData[tokenId].nim];
    //     // delete addressToTokenId[ownerOf(tokenId)];
    // }
}