// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicERC721 is ERC721 {
    uint256 public tokenCounter;

    constructor() ERC721("Basic ERC721 NFT", "ERC721") {
        tokenCounter = 0;
    }

    function mint() external {
        uint256 tokenId = tokenCounter++;
        _safeMint(_msgSender(), tokenId);
    }
}
