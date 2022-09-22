// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/// @title List and Rent ERC4907 NFTs
interface IOkenV1RentMarketplace is IERC721Receiver {
    //--------------------------------- types

    struct Listing {
        // UNIX timestamp of start of renting period, given by `block.timestamp`
        uint256 start;
        // UNIX timestamp of end of renting period, given by `block.timestamp`
        uint256 end;
        // Minimum rent price per second
        uint256 pricePerSecond;
        // ERC20 token used to pay for rent
        address payToken;
    }

    //--------------------------------- events

    /// @notice Emitted when a new ERC4907 NFT is listed
    /// @param nftAddress Address of the ERC4907 contract
    /// @param tokenId Token ID of the listed NFT
    /// @param owner Owner of the NFT
    /// @param start UNIX timestamp of start of renting period, given by `block.timestamp`
    /// @param end UNIX timestamp of end of renting period, given by `block.timestamp`
    /// @param pricePerSecond Minimum rent price per second
    /// @param payToken ERC20 token used to pay for rent
    event ItemListed(
        address indexed nftAddress,
        uint256 indexed tokenId,
        address indexed owner,
        uint256 start,
        uint256 end,
        uint256 pricePerSecond,
        address payToken
    );

    /// @notice Emitted when an existing item listing is modified.
    /// @param nftAddress Address of the ERC4907 contract
    /// @param tokenId Token ID of the listed NFT
    /// @param owner Owner of the NFT
    /// @param start UNIX timestamp of start of renting period, given by `block.timestamp`
    /// @param end UNIX timestamp of end of renting period, given by `block.timestamp`
    /// @param pricePerSecond Minimum rent price per second
    /// @param payToken ERC20 token used to pay for rent
    event ListingUpdated(
        address indexed nftAddress,
        uint256 indexed tokenId,
        address indexed owner,
        uint256 start,
        uint256 end,
        uint256 pricePerSecond,
        address payToken
    );

    /// @notice Emitted when an item is rented.
    /// @param nftAddress Address of the ERC4907 contract
    /// @param tokenId Token ID of the listed NFT
    /// @param owner NFT item owner
    /// @param renter ERC4907 user
    /// @param start UNIX timestamp of start of renting period, given by `block.timestamp`
    /// @param end UNIX timestamp of end of renting period, given by `block.timestamp`
    /// @param pricePaid Rent price + platform fee
    /// @param payToken ERC20 token used to pay for rent
    event ItemRented(
        address indexed nftAddress,
        uint256 tokenId,
        address indexed owner,
        address indexed renter,
        uint256 start,
        uint256 end,
        uint256 pricePaid,
        address payToken
    );

    /// @notice Emitted when an item has been transferred from `address(this)` to the original owner.
    /// @param nftAddress Address of the ERC4907 contract
    /// @param tokenId Token ID of the listed NFT
    /// @param owner Owner of the NFT
    event ItemRedeemed(address indexed nftAddress, uint256 indexed tokenId, address indexed owner);

    /// @notice Emitted when an item listing is deleted
    /// @param nftAddress Address of the ERC4907 contract
    /// @param tokenId Token ID of the listed NFT
    /// @param owner Owner of the NFT
    event ListingCanceled(
        address indexed nftAddress,
        uint256 indexed tokenId,
        address indexed owner
    );

    /// @notice Emitted when proceeds are withdrawn
    /// @param operator Address withdrawing their proceeds
    /// @param payToken ERC20 the proceeds are withdrawn in
    /// @param proceeds Proceeds amount withdrawn
    event ProceedsWithdrawn(address indexed operator, address indexed payToken, uint256 proceeds);

    //--------------------------------- marketplace functions

    /// @notice Lists a ERC4907 NFT.
    /// @dev `msg.sender` must be the NFT owner. The transaction will revert if a listing already exists for this item and this owner.
    /// @param nftAddress Address of the ERC4907 contract. Calling `ERC165.supportsInterface()` with the interface id of ERC4907 (`0xad092b5c`) must return true.
    /// @param tokenId Token ID of the NFT. This marketplace must either be approved or approved for all.
    /// @param start UNIX timestamp of start of renting period, given by `block.timestamp`
    /// @param end UNIX timestamp of end of renting period, given by `block.timestamp`
    /// @param pricePerSecond Rent price per second. This value must be strictly positive.
    /// @param payToken ERC20 token used to pay rent price. The token must be authorized by `OkenV1TokenRegistry`
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 start,
        uint256 end,
        uint256 pricePerSecond,
        address payToken
    ) external;

    /// @notice Updates a ERC4907 NFT item listing.
    /// @dev The item must already be listed.
    /// @dev `msg.sender` must be the NFT owner.
    /// @param nftAddress Address of the ERC4907 contract.
    /// @param tokenId Token ID of the NFT.
    /// @param start UNIX timestamp of start of renting period, given by `block.timestamp`
    /// @param end UNIX timestamp of end of renting period, given by `block.timestamp`
    /// @param pricePerSecond Rent price per second. This value cannot be zero.
    /// @param payToken ERC20 token used to pay rent price. The token must be authorized by `OkenV1TokenRegistry`
    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 start,
        uint256 end,
        uint256 pricePerSecond,
        address payToken
    ) external;

    /// @notice Rent a NFT.
    /// The rent price is (rent duration) * (price per second) * (1 + fee)
    /// @dev The NFT must be listed and must not already be rented.
    /// @param nftAddress Address of the ERC4907 contract
    /// @param tokenId Token ID of the NFT
    /// @param start UNIX timestamp of start of renting period, given by `block.timestamp`
    /// @param end UNIX timestamp of end of renting period, given by `block.timestamp`
    /// @param payToken ERC20 token used to pay for rent
    function rentItem(
        address nftAddress,
        uint256 tokenId,
        uint256 start,
        uint256 end,
        address payToken
    ) external payable;

    /// @notice Transfers the NFT item from this marketplace to the original owner.
    /// @dev `msg.sender` must be the NFT original owner.
    /// The transaction will revert if the item is being rented.
    /// @param nftAddress Address of the ERC4907 contract
    /// @param tokenId Token ID of the NFT
    function redeemItem(address nftAddress, uint256 tokenId) external;

    function cancelListing(address nftAddress, uint256 tokenId) external;

    function withdrawProceeds(address token) external;

    //--------------------------------- accessor functions

    /// @notice Returns the owner of the NFT
    function getOwnerOf(address nftAddress, uint256 tokenId) external view returns (address);

    /// @return Item listing
    function getListing(
        address nftAddress,
        uint256 tokenId,
        address operator
    ) external view returns (Listing memory);

    /// @return Proceeds of `addr`
    function getProceeds(address operator, address currency) external view returns (uint256);

    function getFeeRecipient() external view returns (address);

    function setFeeRecipient(address payable newFeeRecipient) external;

    function getPlatformFee() external view returns (uint16);

    function setPlatformFee(uint16 newFee) external;

    function getAddressRegistry() external view returns (address);

    function setAddressRegistry(address newAddressRegistry) external;
}
