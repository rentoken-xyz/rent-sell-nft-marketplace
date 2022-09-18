// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../utils/OkenV1Errors.sol";
import "../token/OkenV1Nft.sol";
import "./interfaces/IOkenV1NftFactory.sol";

contract OkenV1NftFactory is Ownable, IOkenV1NftFactory {
    //--------------------------------- state variables

    /// @notice Address of `OkenV1RentMarketplace` contract
    address private _rentMarketplace;

    /// @notice Address of `OkenV1SellMarketplace` contract
    address private _sellMarketplace;

    /// @notice Platform fee for deploying a new Nft Contract
    uint256 private _platformFee;

    /// @notice Platform fee recipient
    address payable _feeRecipient;

    /// @notice Nft address -> exists
    mapping(address => bool) private _exists;

    bytes4 private constant INTERFACE_ID_ERC721 = 0x80ac58cd;

    //--------------------------------- functions

    constructor(
        address rentMarketplace,
        address sellMarketplace,
        uint256 platformFee,
        address payable feeRecipient
    ) {
        _rentMarketplace = rentMarketplace;
        _sellMarketplace = sellMarketplace;
        _feeRecipient = feeRecipient;
        _platformFee = platformFee;
    }

    function deployNftContract(
        string memory name_,
        string memory symbol_,
        uint256 mintFee,
        address payable feeRecipient
    ) external payable override returns (address) {
        // check if fees are paid
        if (msg.value < _platformFee) {
            revert InsufficientFunds(_platformFee, msg.value);
        }

        // send fees to fee recipient
        (bool success, ) = _feeRecipient.call{value: msg.value}("");
        if (!success) revert TransferFailed();

        // deploy new Nft contract
        OkenV1Nft nft = new OkenV1Nft(
            name_,
            symbol_,
            _rentMarketplace,
            _sellMarketplace,
            mintFee,
            feeRecipient
        );
        nft.transferOwnership(_msgSender());

        // update exists
        _exists[address(nft)] = true;
        emit NftAdded(_msgSender(), address(nft));
        return address(nft);
    }

    function addNftContract(address nft) external override onlyOwner {
        if (_exists[nft]) revert ContractAlreadyExists(nft);

        if (!IERC165(nft).supportsInterface(INTERFACE_ID_ERC721)) {
            revert InvalidNftAddress(nft);
        }

        _exists[nft] = true;
        emit NftAdded(_msgSender(), nft);
    }

    function removeNftContract(address nft) external override onlyOwner {
        if (!_exists[nft]) revert ContractNotExists(nft);
        _exists[nft] = false;
        emit NftRemoved(_msgSender(), nft);
    }

    //--------------------------------- accessors

    function getExists(address nft) external view override returns (bool) {
        return _exists[nft];
    }

    function getRentMarketplace() external view override returns (address) {
        return _rentMarketplace;
    }

    function setRentMarketplace(address newRentMarketplace) external override onlyOwner {
        _rentMarketplace = newRentMarketplace;
    }

    function getSellMarketplace() external view override returns (address) {
        return _sellMarketplace;
    }

    function setSellMarketplace(address newSellMarketplace) external override onlyOwner {
        _sellMarketplace = newSellMarketplace;
    }

    function getPlatformFee() external view override returns (uint256) {
        return _platformFee;
    }

    function setPlatformFee(uint256 fee) external override onlyOwner {
        _platformFee = fee;
    }

    function getFeeRecipient() external view override returns (address payable) {
        return _feeRecipient;
    }

    function setFeeRecipient(address payable recipient) external override onlyOwner {
        _feeRecipient = recipient;
    }
}
