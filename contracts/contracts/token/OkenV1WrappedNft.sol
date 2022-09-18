// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../utils/OkenV1Errors.sol";
import "../token/ERC4907URIStorage.sol";
import "./interfaces/IOkenV1WrappedNft.sol";

contract OkenV1WrappedNft is ERC4907URIStorage, IOkenV1WrappedNft, Ownable {
    //--------------------------------- state variables

    address private _rentMarketplace;

    address private _sellMarketplace;

    uint256 private _platformFee;

    address payable private _feeRecipient;

    IERC721Metadata private _originalNftContract;

    mapping(uint256 => address) private _originalOwners;

    bytes4 private constant INTERFACE_ID_ERC721_METADATA = 0x5b5e139f;

    constructor(
        string memory name_,
        string memory symbol_,
        address rentMarketplace,
        address sellMarketplace,
        uint256 platformFee,
        address payable feeRecipient,
        address originalNftContract
    ) ERC721(name_, symbol_) {
        _rentMarketplace = rentMarketplace;
        _sellMarketplace = sellMarketplace;
        _feeRecipient = feeRecipient;
        _platformFee = platformFee;
        _originalNftContract = IERC721Metadata(originalNftContract);
    }

    function mintWrappedNft(uint256 tokenId) external payable override {
        // check if fees are paid
        if (msg.value < _platformFee) revert InsufficientFunds(_platformFee, msg.value);

        address owner = _originalNftContract.ownerOf(tokenId);
        if (
            owner != _msgSender() &&
            _originalNftContract.getApproved(tokenId) != _msgSender() &&
            !_originalNftContract.isApprovedForAll(owner, _msgSender())
        ) {
            revert NotOwnerNorApproved(_msgSender());
        }

        // send fees to fee recipient
        (bool success, ) = _feeRecipient.call{value: msg.value}("");
        if (!success) revert TransferFailed();

        string memory uri = "";
        if (IERC165(address(_originalNftContract)).supportsInterface(INTERFACE_ID_ERC721_METADATA))
            uri = _originalNftContract.tokenURI(tokenId);

        // transfer nft from owner to this
        _originalNftContract.transferFrom(owner, address(this), tokenId);
        _safeMint(owner, tokenId);
        _setTokenURI(tokenId, uri);
        emit WrappedNftMinted(tokenId, owner, _msgSender());
    }

    function burnWrappedNft(uint256 tokenId) external override {
        address operator = _msgSender();
        // require sender is owner or approved or approved for all
        if ((operator != ownerOf(tokenId)) && (!isApproved(tokenId, operator)))
            revert NotOwnerNorApproved(_msgSender());

        // burn wrapped nft
        _burn(tokenId); // consider overriding _burn to delete original owner of tokenId

        // transfer original nft back to original owner
        address originalOwner = _originalOwners[tokenId];
        _originalNftContract.transferFrom(address(this), originalOwner, tokenId);
        delete (_originalOwners[tokenId]);
        emit WrappedNftBurned(tokenId, operator, originalOwner);
    }

    /// @dev Check if `operator` is either approved for all or for the single token ID
    function isApproved(uint256 tokenId, address operator) public view override returns (bool) {
        return isApprovedForAll(ownerOf(tokenId), operator) || getApproved(tokenId) == operator;
    }

    /// @dev Override `isApprovedForAll()` to whitelist Oken contracts to enable gas-less listings
    function isApprovedForAll(address owner, address operator) public view override returns (bool) {
        if ((_rentMarketplace == operator) || (_sellMarketplace == operator)) return true;
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

    function getRentMarketplace() external view override returns (address) {
        return _rentMarketplace;
    }

    function getSellMarketplace() external view override returns (address) {
        return _sellMarketplace;
    }

    function getPlatformFee() external view override returns (uint256) {
        return _platformFee;
    }

    function setPlatformFee(uint256 fee) external override onlyOwner {
        _platformFee = fee;
        emit PlatformFeeUpdated(fee);
    }

    function getFeeRecipient() external view override returns (address payable) {
        return _feeRecipient;
    }

    function setFeeRecipient(address payable recipient) external override onlyOwner {
        _feeRecipient = recipient;
        emit FeeRecipientUpdated(recipient);
    }

    function getOriginalNftContract() external view override returns (address) {
        return address(_originalNftContract);
    }

    function originalOwnerOf(uint256 tokenId) external view override returns (address) {
        return _originalOwners[tokenId];
    }
}
