// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

interface IOkenV1SellMarketplace {
    //--------------------------------- types

    struct Listing {
        address owner;
        uint256 price;
        address payToken; // token address to pay
    }

    //--------------------------------- events

    /// @notice Event emitted when a new item is listed
    event ItemListed(
        address indexed owner,
        address indexed nftAddress,
        uint256 tokenId,
        uint256 price,
        address payToken
    );

    /// @notice Event emitted when an item is rented
    event ItemBought(
        address indexed buyer,
        address indexed seller,
        address indexed nftAddress,
        uint256 tokenId,
        uint256 price,
        address payToken
    );

    /// @notice Event emitted when an item listing is updated
    event ItemUpdated(
        address indexed owner,
        address indexed nftAddress,
        uint256 tokenId,
        uint256 price,
        address payToken
    );

    /// @notice Event emitted when an item listing is canceled
    event ItemCanceled(address indexed owner, address indexed nftAddress, uint256 tokenId);

    /// @notice Event emitted when proceeds are withdrawn
    event ProceedsWithdrawn(address indexed operator, address indexed token, uint256 proceeds);

    //--------------------------------- external functions

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price,
        address payToken
    ) external;

    function buyItem(
        address nftAddress,
        uint256 tokenId,
        address payToken
    ) external payable;

    function updateItem(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice,
        address newPayToken
    ) external;

    function cancelItem(address nftAddress, uint256 tokenId) external;

    function withdrawProceeds(address token) external;

    //--------------------------------- getters

    function getAddressRegistry() external view returns (address);

    function setAddressRegistry(address newAddressRegistry) external;

    function getFeeRecipient() external view returns (address);

    function setFeeRecipient(address payable newFeeRecipient) external;

    function getPlatformFee() external view returns (uint16);

    function setPlatformFee(uint16 newFee) external;

    /// @return Item listing
    function getListing(address nftAddress, uint256 tokenId) external view returns (Listing memory);

    /// @return Proceeds of `addr`
    function getProceeds(address operator, address payToken) external view returns (uint256);
}
