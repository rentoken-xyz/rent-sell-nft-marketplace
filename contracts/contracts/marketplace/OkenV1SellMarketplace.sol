// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../token/interfaces/IERC4907.sol";
import "./interfaces/IOkenV1SellMarketplace.sol";
import "../utils/OkenV1Errors.sol";

contract OkenV1SellMarketplace is
    Ownable,
    // ReentrancyGuard,
    IOkenV1SellMarketplace
{
    //--------------------------------- state variables

    // ERC721 contract address -> token id -> Listing
    mapping(address => mapping(uint256 => Listing)) private _listings;

    // operator address -> token address -> proceeds
    mapping(address => mapping(address => uint256)) private _proceeds;

    // `OkenV1AddressRegistry`
    address private _addressRegistry;

    // Rent fee, 123 = 1.23%, fee <= 10000
    uint16 private _platformFee;

    // address the platform fees are transferred too
    address payable private _feeRecipient;

    bytes4 private constant INTERFACE_ID_ERC721 = 0x80ac58cd;

    //--------------------------------- misc functions

    constructor(
        address addressRegistry,
        uint16 platformFee,
        address payable feeRecipient
    ) {
        _addressRegistry = addressRegistry;
        _platformFee = platformFee;
        _feeRecipient = feeRecipient;
    }

    receive() external payable {
        _proceeds[_msgSender()][address(0)] += msg.value;
    }

    fallback() external payable {
        revert InvalidCall(_msgData());
    }

    //--------------------------------- modifiers

    //--------------------------------- external functions

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price,
        address payToken
    ) external override {}

    function buyItem(
        address nftAddress,
        uint256 tokenId,
        address payToken
    ) external payable override {}

    function updateItem(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice,
        address newPayToken
    ) external override {}

    function cancelItem(address nftAddress, uint256 tokenId) external override {}

    function withdrawProceeds(address token) external override {}

    //--------------------------------- accessors

    function getAddressRegistry() external view override returns (address) {
        return _addressRegistry;
    }

    function setAddressRegistry(address newAddressRegistry) external override onlyOwner {
        _addressRegistry = newAddressRegistry;
    }

    function getFeeRecipient() external view override returns (address) {
        return _feeRecipient;
    }

    function setFeeRecipient(address payable newFeeRecipient) external override onlyOwner {
        _feeRecipient = newFeeRecipient;
    }

    function getPlatformFee() external view override returns (uint16) {
        return _platformFee;
    }

    function setPlatformFee(uint16 newPlatformFee) external override onlyOwner {
        _platformFee = newPlatformFee;
    }

    function getListing(address nftAddress, uint256 tokenId)
        external
        view
        override
        returns (Listing memory)
    {
        return _listings[nftAddress][tokenId];
    }

    function getProceeds(address operator, address payToken)
        external
        view
        override
        returns (uint256)
    {
        return _proceeds[operator][payToken];
    }
}
