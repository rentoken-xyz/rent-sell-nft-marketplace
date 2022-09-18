// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../utils/OkenV1Errors.sol";
import "../token/OkenV1RentableNftPrivate.sol";
import "./interfaces/IOkenV1RentableNftFactoryPrivate.sol";

/// @title Rentable NFT Factory contract to deploy `OkenV1RentableNftPrivate` contracts
contract OkenV1RentableNftFactoryPrivate is Ownable, IOkenV1RentableNftFactoryPrivate {
    //--------------------------------- state variables

    // Address of `OkenV1RentMarketplace` contract
    address private _rentMarketplace;

    // Address of `OkenV1SellMarketplace` contract
    address private _sellMarketplace;

    // Fee to deploy a `OkenV1RentableNftPrivate` contract
    uint256 private _platformFee;

    // Address the fees are transferred to
    address payable _feeRecipient;

    // `OkenV1RentableNftPrivate` address -> exists in the factory
    mapping(address => bool) private _exists;

    // interface id of ERC4907
    bytes4 internal constant INTERFACE_ID_ERC4907 = 0xad092b5c;

    //--------------------------------- constructor

    constructor(
        address rentMarketplace,
        address sellMarketplace,
        uint256 platformFee,
        address payable feeRecipient
    ) {
        _rentMarketplace = rentMarketplace;
        _sellMarketplace = sellMarketplace;
        _platformFee = platformFee;
        _feeRecipient = feeRecipient;
    }

    //--------------------------------- factory functions

    /// @inheritdoc IOkenV1RentableNftFactoryPrivate
    function deployNftContract(
        string memory name,
        string memory symbol,
        uint256 mintFee,
        address payable feeRecipient
    ) external payable override returns (address) {
        // require fees are paid
        if (msg.value < _platformFee) revert InsufficientFunds(_platformFee, msg.value);
        // send fees to fee recipient
        (bool success, ) = _feeRecipient.call{value: msg.value}("");
        if (!success) revert TransferFailed();

        // deploy new `OkenV1RentableNftPrivate` contract
        OkenV1RentableNftPrivate nft = new OkenV1RentableNftPrivate(
            name,
            symbol,
            _rentMarketplace,
            _sellMarketplace,
            mintFee,
            feeRecipient
        );
        nft.transferOwnership(_msgSender());

        // update exists
        _exists[address(nft)] = true;
        emit NftContractAdded(_msgSender(), address(nft));
        return address(nft);
    }

    /// @inheritdoc IOkenV1RentableNftFactoryPrivate
    function addNftContract(address nftContract) external override onlyOwner {
        // require not already added
        if (_exists[nftContract]) revert ContractAlreadyExists(nftContract);

        // check if contract is ERC4907
        if (!IERC165(nftContract).supportsInterface(INTERFACE_ID_ERC4907))
            revert InvalidNftAddress(nftContract);

        // update exists
        _exists[nftContract] = true;
        emit NftContractAdded(_msgSender(), nftContract);
    }

    /// @inheritdoc IOkenV1RentableNftFactoryPrivate
    function removeNftContract(address nftContract) external override onlyOwner {
        // require contract exists
        if (!_exists[nftContract]) revert ContractNotExists(nftContract);

        // update exists
        _exists[nftContract] = false;
        emit NftContractRemoved(_msgSender(), nftContract);
    }

    //--------------------------------- accessors

    /// @inheritdoc IOkenV1RentableNftFactoryPrivate
    function getExists(address nftContract) external view override returns (bool) {
        return _exists[nftContract];
    }

    /// @inheritdoc IOkenV1RentableNftFactoryPrivate
    function getRentMarketplace() external view override returns (address) {
        return _rentMarketplace;
    }

    /// @inheritdoc IOkenV1RentableNftFactoryPrivate
    function setRentMarketplace(address newRentMarketplace) external override onlyOwner {
        _rentMarketplace = newRentMarketplace;
    }

    /// @inheritdoc IOkenV1RentableNftFactoryPrivate
    function getSellMarketplace() external view override returns (address) {
        return _sellMarketplace;
    }

    /// @inheritdoc IOkenV1RentableNftFactoryPrivate
    function setSellMarketplace(address newSellMarketplace) external override onlyOwner {
        _sellMarketplace = newSellMarketplace;
    }

    /// @inheritdoc IOkenV1RentableNftFactoryPrivate
    function getPlatformFee() external view override returns (uint256) {
        return _platformFee;
    }

    /// @inheritdoc IOkenV1RentableNftFactoryPrivate
    function setPlatformFee(uint256 newFee) external override onlyOwner {
        _platformFee = newFee;
    }

    /// @inheritdoc IOkenV1RentableNftFactoryPrivate
    function getFeeRecipient() external view override returns (address payable) {
        return _feeRecipient;
    }

    /// @inheritdoc IOkenV1RentableNftFactoryPrivate
    function setFeeRecipient(address payable newRecipient) external override onlyOwner {
        _feeRecipient = newRecipient;
    }
}
