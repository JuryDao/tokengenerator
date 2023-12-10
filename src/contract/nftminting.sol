// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract JuryDAO is ERC721, Ownable {
    uint256 public tokenIdCounter;

    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("JuryDAO", "JDAO") Ownable(msg.sender) {}

    function mintToken(string memory name, uint256 age) external onlyOwner {
        uint256 tokenId = tokenIdCounter + 1;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, generateMetadata(name, age, 0));
        tokenIdCounter++;
    }

    function mintNFT(string memory name, uint256 age) external {
        uint256 tokenId = tokenIdCounter + 1;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, generateMetadata(name, age, 0));
        tokenIdCounter++;
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(ownerOf(tokenId) != address(0), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function generateMetadata(string memory name, uint256 age, uint256 numberOfCases) internal pure returns (string memory) {
        return string(abi.encodePacked("{\"name\": \"", name, "\", \"age\": ", toString(age), ", \"cases\": ", toString(numberOfCases), "}"));
    }

    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 length;
        while (temp > 0) {
            length++;
            temp /= 10;
        }
        bytes memory result = new bytes(length);
        temp = value;
        for (uint256 i = length; i > 0; i--) {
            result[i - 1] = bytes1(uint8(48 + temp % 10));
            temp /= 10;
        }
        return string(result);
    }
}
