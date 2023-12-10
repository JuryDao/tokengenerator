// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract RandomNFT is ERC721, VRFConsumerBase {

    bytes32 internal keyHash;
    uint256 internal fee;
    
    mapping(bytes32 => address[]) public randomResults; 
    
    address[20] public players;
    uint256 public numPlayers = 0;
    
    constructor() 
        ERC721("RandomNFT", "RNDM") 
        VRFConsumerBase(
            0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, // VRF Coordinator
            0xa36085F69e2889c224210F603D836748e7dC0088  // LINK Token
        )
    {
        keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
        fee = 0.1 * 10 ** 18; // 0.1 LINK
    }
    
    function addPlayer(address player) public {
        require(numPlayers < 20, "Maximum number of players reached");
        players[numPlayers] = player;
        numPlayers++;
    }
    
    function getRandomPlayers() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        address[] memory winners = new address[](7);
        
        for (uint i = 0; i < 7; i++) {
            uint256 index = randomness % numPlayers;
            winners[i] = players[index];
            randomness /= numPlayers;
        }
        
        randomResults[requestId] = winners;
        
        for (uint i = 0; i < 7; i++) {
            _safeMint(winners[i], i); 
        }
    } 
}