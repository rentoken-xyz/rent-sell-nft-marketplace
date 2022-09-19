// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../utils/OkenV1Errors.sol";
import "../token/OkenV1NftPrivate.sol";
import "./interfaces/IOkenV1NftFactoryPrivate.sol";

contract OkenV1NftFactoryPrivate is Ownable, IOkenV1NftFactoryPrivate {
    //--------------------------------- state variables

    // Address of `OkenV1RentMarketplace` contract
    address private _rentMarketplace;

    // Address of `OkenV1SellMarketplace` contract
    address private _sellMarketplace;

    // Fee to deploy a `OkenV1RentableNft` contract
    uint256 private _platformFee;

    // Address the fees are transferred to
    address payable _feeRecipient;

    // `OkenV1RentableNft` address -> exists in the factory
    mapping(address => bool) private _exists;

    // interface id of ERC721
    bytes4 private constant INTERFACE_ID_ERC721 = 0x80ac58cd;

    //--------------------------------- constructor

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

    //--------------------------------- factory functions

    /// @inheritdoc IOkenV1NftFactoryPrivate
    function deployNftContract(
        string memory name,
        string memory symbol,
        uint256 mintFee,
        address payable feeRecipient
    ) external payable override returns (address) {
        // require fees are paid
        if (msg.value < _platformFee) revert InsufficientFunds(_platformFee, msg.value);
        // send fees to fee recipient
        (bool success, ) = _feeRecipient.call{value: msg.value, gas: 2300}("");
        if (!success) revert TransferFailed();

        // deploy new `OkenV1NftPrivate` contract
        OkenV1NftPrivate nft = new OkenV1NftPrivate(
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

    /// @inheritdoc IOkenV1NftFactoryPrivate
    function addNftContract(address nftContract) external override onlyOwner {
        // require not already added
        if (_exists[nftContract]) revert ContractAlreadyExists(nftContract);

        // check if contract is ERC4907
        if (!IERC165(nftContract).supportsInterface(INTERFACE_ID_ERC721))
            revert InvalidNftAddress(nftContract);

        // update exists
        _exists[nftContract] = true;
        emit NftContractAdded(_msgSender(), nftContract);
    }

    /// @inheritdoc IOkenV1NftFactoryPrivate
    function removeNftContract(address nftContract) external override onlyOwner {
        // require contract exists
        if (!_exists[nftContract]) revert ContractNotExists(nftContract);

        // update exists
        _exists[nftContract] = false;
        emit NftContractRemoved(_msgSender(), nftContract);
    }

    //--------------------------------- accessor functions

    /// @inheritdoc IOkenV1NftFactoryPrivate
    function getExists(address nftContract) external view override returns (bool) {
        return _exists[nftContract];
    }

    /// @inheritdoc IOkenV1NftFactoryPrivate
    function getRentMarketplace() external view override returns (address) {
        return _rentMarketplace;
    }

    /// @inheritdoc IOkenV1NftFactoryPrivate
    function setRentMarketplace(address newRentMarketplace) external override onlyOwner {
        _rentMarketplace = newRentMarketplace;
    }

    /// @inheritdoc IOkenV1NftFactoryPrivate
    function getSellMarketplace() external view override returns (address) {
        return _sellMarketplace;
    }

    /// @inheritdoc IOkenV1NftFactoryPrivate
    function setSellMarketplace(address newSellMarketplace) external override onlyOwner {
        _sellMarketplace = newSellMarketplace;
    }

    /// @inheritdoc IOkenV1NftFactoryPrivate
    function getPlatformFee() external view override returns (uint256) {
        return _platformFee;
    }

    /// @inheritdoc IOkenV1NftFactoryPrivate
    function setPlatformFee(uint256 newFee) external override onlyOwner {
        _platformFee = newFee;
    }

    /// @inheritdoc IOkenV1NftFactoryPrivate
    function getFeeRecipient() external view override returns (address payable) {
        return _feeRecipient;
    }

    /// @inheritdoc IOkenV1NftFactoryPrivate
    function setFeeRecipient(address payable newRecipient) external override onlyOwner {
        _feeRecipient = newRecipient;
    }
}
