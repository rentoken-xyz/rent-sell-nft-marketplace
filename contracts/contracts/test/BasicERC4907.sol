// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../token/ERC4907.sol";

contract BasicERC4907 is ERC4907 {
    uint256 public tokenCounter;

    constructor() ERC721("Basic ERC4907 NFT", "ERC4907") {
        tokenCounter = 0;
    }

    function mint() external {
        uint256 tokenId = tokenCounter++;
        _safeMint(_msgSender(), tokenId);
    }
}
