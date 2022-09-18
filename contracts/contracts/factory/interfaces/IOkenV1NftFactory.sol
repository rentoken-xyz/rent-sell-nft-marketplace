// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title NFT Factory contract to deploy `OkenV1Nft` contracts
interface IOkenV1NftFactory {
    //--------------------------------- events

    /// @dev Emitted when a `OkenV1Nft` contract is deployed or added
    event NftAdded(address indexed operator, address indexed nft);

    /// @dev Emitted when a `OkenV1Nft` contract is removed
    event NftRemoved(address indexed operator, address indexed nft);

    //--------------------------------- functions

    /// @notice Deploys a `OkenV1Nft` contract
    /// @dev This function will revert if the ETH balance transferred is less than `_platformFee`
    /// Emits a `NftAdded` event
    /// @param name_ `ERC721Metadata` name
    /// @param symbol_ `ERC721Metadata` symbol
    /// @param mintFee Fee to mint a NFT
    /// @param feeRecipient Address the mint fees will transferred to
    /// @return Address of the `OkenV1Nft` contract deployed
    function deployNftContract(
        string memory name_,
        string memory symbol_,
        uint256 mintFee,
        address payable feeRecipient
    ) external payable returns (address);

    /// @notice Adds an already deployed ERC721 contract to the factory
    /// @dev Reverts if the contract is not ERC721 or has already been added
    /// Emits a `NftAdded` event
    /// @param nft Address of the ERC721 contract
    function addNftContract(address nft) external;

    /// @notice Removes a contract from the factory
    /// @dev Reverts if the contract has not already been added
    /// Emits a `NftRemoved` event
    /// @param nft Address of the ERC721 contract
    function removeNftContract(address nft) external;

    //--------------------------------- accessors

    function getExists(address nft) external view returns (bool);

    function getRentMarketplace() external view returns (address);

    function setRentMarketplace(address newRentMarketplace) external;

    function getSellMarketplace() external view returns (address);

    function setSellMarketplace(address newSellMarketplace) external;

    function getPlatformFee() external view returns (uint256);

    function setPlatformFee(uint256 newFee) external;

    function getFeeRecipient() external view returns (address payable);

    function setFeeRecipient(address payable newRecipient) external;
}
