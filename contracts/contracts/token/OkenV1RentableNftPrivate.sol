// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../utils/OkenV1Errors.sol";
import "../token/ERC4907URIStorage.sol";
import "./interfaces/IOkenV1RentableNftPrivate.sol";
import "../address/interfaces/IOkenV1AddressRegistry.sol";

contract OkenV1RentableNftPrivate is ERC4907URIStorage, IOkenV1RentableNftPrivate, Ownable {
    //--------------------------------- state variables

    // variable to assign to token ID
    uint256 private _tokenCounter;

    // address of the `OkenV1RentMarketplace` contract
    address private _rentMarketplace;

    // address of the `OkenV1SellMarketplace` contract
    address private _sellMarketplace;

    // mint fee in WEI
    uint256 private _platformFee;

    // address the fees are transferred to
    address payable private _feeRecipient;

    constructor(
        string memory name_,
        string memory symbol_,
        address rentMarketplace,
        address sellMarketplace,
        uint256 platformFee,
        address payable feeRecipient
    ) ERC721(name_, symbol_) {
        _tokenCounter = 0;
        _rentMarketplace = rentMarketplace;
        _sellMarketplace = sellMarketplace;
        _platformFee = platformFee;
        emit PlatformFeeUpdated(platformFee);
        _feeRecipient = feeRecipient;
        emit FeeRecipientUpdated(feeRecipient);
    }

    //--------------------------------- nft functions

    /// @inheritdoc IOkenV1RentableNftPrivate
    function mint(address to, string calldata uri) external payable override onlyOwner {
        // require fees are paid
        if (msg.value < _platformFee) revert InsufficientFunds(_platformFee, msg.value);

        // mint new rentable NFT
        uint256 tokenId = _tokenCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _tokenCounter += 1;

        // send fee to fee recipient
        (bool success, ) = _feeRecipient.call{value: msg.value, gas: 2300}("");
        if (!success) revert TransferFailed();

        emit Minted(tokenId, to, _msgSender());
    }

    /// @inheritdoc IOkenV1RentableNftPrivate
    function burn(uint256 tokenId) external override {
        // require is owner or approved
        address operator = _msgSender();
        if ((ownerOf(tokenId) != operator) && (!isApproved(tokenId, operator)))
            revert NotOwnerNorApproved(operator);

        // burn token
        _burn(tokenId);
        emit Burned(tokenId, operator);
    }

    /// @inheritdoc IOkenV1RentableNftPrivate
    function isApproved(uint256 tokenId, address operator) public view override returns (bool) {
        return isApprovedForAll(ownerOf(tokenId), operator) || getApproved(tokenId) == operator;
    }

    /// @dev Override `isApprovedForAll()` to whitelist Oken contracts to enable gas-less listings
    function isApprovedForAll(address owner, address operator) public view override returns (bool) {
        if ((_rentMarketplace == operator) || (_sellMarketplace == operator)) {
            return true;
        }
        return super.isApprovedForAll(owner, operator);
    }

    /// @dev Override `_isApprovedOrOwner()` to whitelist Oken contracts to enable gas-less listings
    function _isApprovedOrOwner(address spender, uint256 tokenId)
        internal
        view
        override
        returns (bool)
    {
        if (!_exists(tokenId)) revert NotExists(tokenId);
        address owner = ERC721.ownerOf(tokenId);
        if (isApprovedForAll(owner, spender)) return true;
        return super._isApprovedOrOwner(spender, tokenId);
    }

    //--------------------------------- accessors

    /// @inheritdoc IOkenV1RentableNftPrivate
    function getTokenCounter() external view override returns (uint256) {
        return _tokenCounter;
    }

    /// @inheritdoc IOkenV1RentableNftPrivate
    function getExists(uint256 tokenId) external view override returns (bool) {
        return _exists(tokenId);
    }

    /// @inheritdoc IOkenV1RentableNftPrivate
    function getRentMarketplace() external view override returns (address) {
        return _rentMarketplace;
    }

    /// @inheritdoc IOkenV1RentableNftPrivate
    function getSellMarketplace() external view override returns (address) {
        return _sellMarketplace;
    }

    /// @inheritdoc IOkenV1RentableNftPrivate
    function getPlatformFee() external view override returns (uint256) {
        return _platformFee;
    }

    /// @inheritdoc IOkenV1RentableNftPrivate
    function setPlatformFee(uint256 newFee) external override onlyOwner {
        _platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }

    /// @inheritdoc IOkenV1RentableNftPrivate
    function getFeeRecipient() external view override returns (address payable) {
        return _feeRecipient;
    }

    /// @inheritdoc IOkenV1RentableNftPrivate
    function setFeeRecipient(address payable newRecipient) external override onlyOwner {
        _feeRecipient = newRecipient;
        emit FeeRecipientUpdated(newRecipient);
    }
}
