// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract BazookaContract is ERC721URIStorage, VRFConsumerBase {
    bytes32 internal keyHash;
    uint256 internal fee;

    using Counters for Counters.Counter;
    Counters.Counter public BazookaIds;
    mapping(uint256 => Bazooka) public listofBazookas;

    uint256 public randomNumberFromVRF;

    struct Bazooka {
        uint256 tokenId;
        string cid;
        uint256 expectedTimberValue;
        uint256 estimatedCO2Aborption;
        uint256 trunkSize;
        address owner;
    }

    event BazookaCreated(
        uint256 tokenId,
        string cid,
        uint256 timeBeforeCutting,
        uint256 estimatedCO2Aborption,
        uint256 trunkSize,
        uint256 precentGiveBack,
        address owner
    );

    /**
     * Constructor inherits VRFConsumerBase
     *
     * Network: Polygon (Matic) Mumbai Testnet
     * Chainlink VRF Coordinator address: 0x8C7382F9D8f56b33781fE506E897a4F1e2d17255
     * LINK token address:                0x326C977E6efc84E512bB9C30f76E30c160eD06FB
     * Key Hash: 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4
     */
    constructor()
        ERC721("COBazooka NFT", "COT")
        VRFConsumerBase(
            0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, // VRF Coordinator
            0x326C977E6efc84E512bB9C30f76E30c160eD06FB // LINK Token
        )
    {
        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        fee = 0.0001 * 10**18; // 0.0001 LINK (Varies by network)
    }

    function mintBazooka(
        string memory _cid,
        uint256 _timeBeforeCutting,
        uint256 _expectedTimberValue,
        uint256 _estimatedCO2Aborption,
        uint256 _trunkSize
    ) public payable returns (uint256) {
        BazookaIds.increment();
        uint256 newBazookaId = BazookaIds.current();

        _mint(msg.sender, newBazookaId);
        _setTokenURI(newBazookaId, _cid);

        uint256 precentGiveBack = getRandomValue(10);
        uint256 amount = (msg.value * precentGiveBack) / 100;
        payable(msg.sender).transfer(amount);

        listofBazookas[newBazookaId] = Bazooka(
            newBazookaId,
            _cid,
            _timeBeforeCutting,
            _expectedTimberValue,
            _estimatedCO2Aborption,
            _trunkSize,
            msg.sender
        );

        return precentGiveBack;
    }

    function fetchUserBazookaNFTs(address _userAddress)
        public
        view
        returns (Bazooka[] memory)
    {
        uint256 totalNFTCount = BazookaIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalNFTCount; i++) {
            if (listofBazookas[i + 1].owner == _userAddress) {
                itemCount += 1;
            }
        }

        Bazooka[] memory items = new Bazooka[](itemCount);

        for (uint256 i = 0; i < totalNFTCount; i++) {
            if (listofBazookas[i + 1].owner == _userAddress) {
                uint256 currentId = i + 1;
                Bazooka storage currentBazooka = listofBazookas[currentId];
                items[currentIndex] = currentBazooka;
                currentIndex += 1;
            }
        }

        return items;
    }

    function getRandomNumber() public returns (bytes32 requestId) {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK - fill contract with faucet"
        );
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        randomNumberFromVRF = randomness;
    }

    function getRandomValue(uint256 mod) internal view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.difficulty,
                        msg.sender,
                        randomNumberFromVRF
                    )
                )
            ) % mod;
    }

    // WARMING: Remove this on production
    // Withdraw all the funds from the contract
    function withdraw() public {
        payable(msg.sender).transfer(address(this).balance);
    }

    /**
     * WARMING: Remove this on production
     * Avoid locking your LINK in the contract
     */
    function withdrawLink() external {
        require(
            LINK.transfer(msg.sender, LINK.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
