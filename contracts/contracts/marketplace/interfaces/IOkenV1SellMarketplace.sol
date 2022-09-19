// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IOkenV1SellMarketplace {
    //--------------------------------- types

    struct Listing {
        // NFT owner listing and selling NFT
        address seller;
        // ERC20 token used for payment
        address payToken;
        // NFT price in `payToken`
        uint256 price;
    }

    //--------------------------------- events

    /// @notice Emitted when a new listing is created for an item.
    /// @param nftContract Address of the ERC721 contract
    /// @param nftId Token ID of the NFT
    /// @param seller Owner of the NFT
    /// @param payToken ERC20 token used for payment
    /// @param price Item price in `payToken`
    event ItemListed(
        address indexed nftContract,
        uint256 indexed nftId,
        address indexed seller,
        address payToken,
        uint256 price
    );

    /// @notice Emitted when an item listing is updated.
    /// @param nftContract Address of the ERC721 contract
    /// @param nftId Token ID of the NFT
    /// @param seller Owner of the NFT
    /// @param payToken ERC20 token used for payment
    /// @param price Item price in `payToken`
    event ListingUpdated(
        address indexed nftContract,
        uint256 indexed nftId,
        address indexed seller,
        address payToken,
        uint256 price
    );

    /// @notice Emitted when an item is rented
    /// @param seller Previous owner of the NFT
    /// @param buyer New owner of the NFT
    /// @param nftContract Address of the ERC721 contract
    /// @param nftId Token ID of the NFT
    /// @param payToken ERC20 token used for payment
    /// @param amountPaid Item price in `payToken`
    event ItemSold(
        address indexed nftContract,
        uint256 nftId,
        address indexed seller,
        address indexed buyer,
        address payToken,
        uint256 amountPaid
    );

    /// @notice Emitted when an item listing is canceled.
    /// @param nftContract Address of the ERC721 contract
    /// @param nftId Token ID of the NFT
    /// @param operator Address the listing is canceled for
    event ListingCanceled(
        address indexed nftContract,
        uint256 indexed nftId,
        address indexed operator
    );

    /// @notice Emitted when proceeds are withdrawn.
    /// @param operator Sender withdrawing their proceeds
    /// @param payToken ERC20 token the proceeds are withdrawn for
    /// @param proceeds Proceeds amount
    event ProceedsWithdrawn(address indexed operator, address indexed payToken, uint256 proceeds);

    //--------------------------------- marketplace functions

    /// @notice Lists a ERC721 NFT for sale.
    /// @dev The transaction will revert if one of the following requirements is not satisfied:
    /// - calling `ERC165.supportsInterface()` on NFT contract with interface id of ERC721 returns false
    /// - `msg.sender` is not NFT owner
    /// - `address(this)` is not either approved on NFT or approved for all on NFT owner
    /// - price must be strictly positive
    /// @param nftContract Address of the ERC721 contract
    /// @param nftId Token ID of NFT
    /// @param payToken ERC20 token used to pay for item
    /// @param price Item price in `payToken` (non-zero)
    function listItem(
        address nftContract,
        uint256 nftId,
        address payToken,
        uint256 price
    ) external;

    /// @notice Updates an item listing.
    /// @dev The transaction will revert if no listing exists for item and `msg.sender` and if `msg.sender` is not item owner.
    /// @param nftContract Address of ERC721 contract
    /// @param nftId Token ID of NFT
    /// @param newPayToken ERC20 token used for payment
    /// @param newPrice Item price in `payToken` (non-zero)
    function updateListing(
        address nftContract,
        uint256 nftId,
        uint256 newPrice,
        address newPayToken
    ) external;

    /// @notice Buys an item.
    /// @dev The item must be listed and the price and fee must be paid for.
    /// @param nftContract Address of ERC721 contract
    /// @param nftId Token ID of NFT
    /// @param payToken ERC20 token used for payment
    function buyItem(
        address nftContract,
        uint256 nftId,
        address payToken
    ) external payable;

    /// @notice Removes an item listing.
    /// @dev A listing must exists for item and `msg.sender`.
    /// @param nftContract Address of ERC721 contract
    /// @param nftId Token ID of NFT
    function cancelListing(address nftContract, uint256 nftId) external;

    /// @notice Withdraws proceeds of `msg.sender`.
    /// @dev Proceeds must exists for `msg.sender` and `token`.
    /// @param token ERC20 token to withdraw the proceeds for
    function withdrawProceeds(address token) external;

    //--------------------------------- accessor functions

    /// @notice Returns the address of `OkenV1AddressRegistry`.
    /// @return Address of `OkenV1AddressRegistry`
    function getAddressRegistry() external view returns (address);

    /// @notice Modifies the address of `OkenV1AddressRegistry`.
    /// @dev `msg.sender` must be the contract owner.
    /// @param newAddressRegistry New address of `OkenV1AddressRegistry`
    function setAddressRegistry(address newAddressRegistry) external;

    /// @notice Returns the address the platform fees are transferred to.
    /// @return Fee recipient
    function getFeeRecipient() external view returns (address);

    /// @notice Modifies the address the platform fees are transferred to.
    /// @dev `msg.sender` must be the contract owner.
    /// @param newFeeRecipient New fee recipient
    function setFeeRecipient(address payable newFeeRecipient) external;

    /// @notice Returns the platform fee, fee to buy a NFT.
    /// @return Platform fee
    function getPlatformFee() external view returns (uint16);

    /// @notice Modifies platform fee, fee to buy a NFT.
    /// @dev `msg.sender` must be the contract owner.
    /// @param newFee New platform fee
    function setPlatformFee(uint16 newFee) external;

    /// @notice Returns an item listing.
    /// @param nftContract Address of ERC721 contract
    /// @param nftId Token ID of NFT
    /// @param operator Sender which listed the item
    /// @return Item listing
    function getListing(
        address nftContract,
        uint256 nftId,
        address operator
    ) external view returns (Listing memory);

    /// @notice Returns the proceeds of `operator` in `token`.
    /// @param operator Address the proceeds belong to
    /// @param token ERC20 token the proceeds are in
    /// @return Proceeds amount in `token`
    function getProceeds(address operator, address token) external view returns (uint256);
}
