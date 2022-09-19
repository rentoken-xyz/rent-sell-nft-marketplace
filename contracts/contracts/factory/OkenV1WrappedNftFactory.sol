// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../utils/OkenV1Errors.sol";
import "./interfaces/IOkenV1WrappedNftFactory.sol";
import "../token/OkenV1WrappedNft.sol";

/*
contract OkenV1WrappedNftFactory is Ownable, IOkenV1WrappedNftFactory {
    //--------------------------------- events

    uint256 private _platformFee;

    uint256 private _mintFee;

    address payable private _feeRecipient;

    /// @notice OkenV1Marketplace address
    address private _rentMarketplace;

    address private _sellMarketplace;

    /// @notice original Nft contract address -> wrapped Nft contract address
    mapping(address => address) private _wrappedContracts;

    bytes4 private constant INTERFACE_ID_ERC721 = 0x80ac58cd;
    bytes4 private constant INTERFACE_ID_ERC721_METADATA = 0x5b5e139f;

    constructor(
        address rentMarketplace,
        address sellMarketplace,
        uint256 mintFee,
        address payable feeRecipient,
        uint256 platformFee
    ) {
        _rentMarketplace = rentMarketplace;
        _sellMarketplace = sellMarketplace;
        _mintFee = mintFee;
        _feeRecipient = feeRecipient;
        _platformFee = platformFee;
    }

    function wrapNftContract(address originalContract) external payable override returns (address) {
        // check if fees are paid
        if (msg.value < _platformFee) {
            revert InsufficientFunds(_platformFee, msg.value);
        }

        // check that contract is erc721
        if (!IERC165(originalContract).supportsInterface(INTERFACE_ID_ERC721)) {
            revert InvalidNftAddress(originalContract);
        }

        // send fees to recipient
        (bool success, ) = _feeRecipient.call{value: msg.value}("");
        if (!success) revert TransferFailed();

        // get metadata
        string memory name = "";
        string memory symbol = "";
        if (IERC165(originalContract).supportsInterface(INTERFACE_ID_ERC721_METADATA)) {
            name = IERC721Metadata(nft).name();
            symbol = IERC721Metadata(nft).symbol();
        }

        // deploy new Nft contract
        OkenV1WrappedNft nft = new OkenV1WrappedNft(
            name,
            symbol,
            _rentMarketplace,
            _sellMarketplace,
            _mintFee,
            _feeRecipient
        );
        _wrapped[originalContract] = address(nft);
        emit WrappedCreated(_msgSender(), address(nft));
        return address(nft);
    }

    //--------------------------------- accessors

    function getWrappedContract(address originalContract) external view override returns (address) {
        return _wrapped[originalContract];
    }

    function getExists(address originalContract) external view override returns (bool) {
        return _wrapped[originalContract] != address(0);
    }

    function getRentMarketplace() external view override returns (address) {
        return _rentMarketplace;
    }

    function setRentMarketplace(address marketplace) external override onlyOwner {
        _rentMarketplace = marketplace;
    }

    function getSellMarketplace() external view override returns (address) {
        return _sellMarketplace;
    }

    function setSellMarketplace(address marketplace) external override onlyOwner {
        _sellMarketplace = marketplace;
    }

    function getMintFee() external view override returns (uint256) {
        return _mintFee;
    }

    function setMintFee(uint256 fee) external override onlyOwner {
        _mintFee = fee;
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
*/
