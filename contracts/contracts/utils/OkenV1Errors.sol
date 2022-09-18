// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//------------------------------------- ETH transfer

/// @dev Thrown when not enough ETH is transferred
/// @param expected k
error InsufficientFunds(uint256 expected, uint256 actual);

/// @dev Thrown if `address.call{value: value}("")` returns false
error TransferFailed();

error InvalidCall(bytes data);

//------------------------------------- Nft

/// @dev Thrown if token ID does NOT exist
error NotExists(uint256 tokenId);

error NotOwner(address operator);

error NotApproved(address nftAddress, uint256 tokenId);

/// @dev Thrown if `operator` is neither owner nor approved for token ID nor approved for all
error NotOwnerNorApproved(address operator);

error InvalidNftAddress(address nftAddress);

error ContractAlreadyExists(address nftAddress);

error ContractNotExists(address nftAddress);

//------------------------------------- Marketplace

/// @notice Thrown when a transaction requires an item to be listed in the marketplace.
/// @param nftAddress Address of the NFT contract of the item
/// @param tokenId Token ID of the NFT item
/// @param owner Owner of the NFT item
error NotListed(address nftAddress, uint256 tokenId, address owner);

/// @notice Thrown when a transaction requires an item NOT to be listed in the marketplace.
/// @param nftAddress Address of the NFT contract
/// @param tokenId Token ID of the NFT item
/// @param owner Owner of the NFT item
error AlreadyListed(address nftAddress, uint256 tokenId, address owner);

error CurrentlyRented(address nftAddress, uint256 tokenId);

error InvalidExpires(uint64 expires);

error InvalidTimestamps(uint256 start, uint256 end);

error InvalidAmount(uint256 price);

error InvalidPayToken(address payToken);

error NoProceeds(address operator, address token);

error NotRedeemable(address nftAddress, uint256 tokenId);
