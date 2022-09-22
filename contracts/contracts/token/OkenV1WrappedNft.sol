// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../utils/OkenV1Errors.sol";
import "../token/ERC4907URIStorage.sol";
import "./interfaces/IOkenV1WrappedNft.sol";

contract OkenV1WrappedNft is ERC4907URIStorage, IOkenV1WrappedNft, Ownable {
    //--------------------------------- state variables

    // address of the `OkenV1RentMarketplace` contract
    address private _rentMarketplace;

    // address of the `OkenV1SellMarketplace` contract
    address private _sellMarketplace;

    // mint fee in WEI
    uint256 private _platformFee;

    // address the fees are transferred to
    address payable private _feeRecipient;

    // ERC721 NFT contract being wrapped
    IERC721Metadata private _originalNftContract;

    // original NFT owners
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
        _platformFee = platformFee;
        _feeRecipient = feeRecipient;
        _originalNftContract = IERC721Metadata(originalNftContract);
    }

    function mint(uint256 nftId) external payable override {
        // require fees are paid
        if (msg.value < _platformFee) revert InsufficientFunds(_platformFee, msg.value);

        // require `msg.sender` is owner or approved or approved for all
        address owner = _originalNftContract.ownerOf(nftId);
        address operator = _msgSender();
        if (owner != operator && !isApproved(nftId, operator))
            revert NotOwnerNorApproved(_msgSender());

        // send fees to fee recipient
        (bool success, ) = _feeRecipient.call{value: msg.value, gas: 2300}("");
        if (!success) revert TransferFailed();

        // transfer nft from owner to this contract
        _originalNftContract.transferFrom(owner, address(this), nftId);

        // mint wrapped nft
        string memory uri = "";
        if (IERC165(address(_originalNftContract)).supportsInterface(INTERFACE_ID_ERC721_METADATA))
            uri = _originalNftContract.tokenURI(nftId);
        _safeMint(owner, nftId);
        _setTokenURI(nftId, uri);
        emit Minted(nftId, owner, operator);
    }

    function burn(uint256 nftId) external override {
        address operator = _msgSender();
        // require sender is owner or approved or approved for all
        if ((operator != ownerOf(nftId)) && (!isApproved(nftId, operator)))
            revert NotOwnerNorApproved(operator);

        // burn wrapped nft
        _burn(nftId); // consider overriding _burn to delete original owner of nftId

        // transfer original nft back to original owner
        address originalOwner = _originalOwners[nftId];
        _originalNftContract.safeTransferFrom(address(this), originalOwner, nftId);
        delete (_originalOwners[nftId]);
        emit Burned(nftId, originalOwner, operator);
    }

    /// @dev Check if `operator` is either approved for all or for the single token ID
    function isApproved(uint256 nftId, address operator) public view override returns (bool) {
        return isApprovedForAll(ownerOf(nftId), operator) || getApproved(nftId) == operator;
    }

    /// @dev Override `isApprovedForAll()` to whitelist Oken contracts to enable gas-less listings
    function isApprovedForAll(address owner, address operator) public view override returns (bool) {
        if ((_rentMarketplace == operator) || (_sellMarketplace == operator)) return true;
        return super.isApprovedForAll(owner, operator);
    }

    /// @dev Override `_isApprovedOrOwner()` to whitelist Oken contracts to enable gas-less listings
    function _isApprovedOrOwner(address spender, uint256 nftId)
        internal
        view
        override
        returns (bool)
    {
        if (!_exists(nftId)) revert NotExists(nftId);
        address owner = ERC721.ownerOf(nftId);
        if (isApprovedForAll(owner, spender)) return true;
        return super._isApprovedOrOwner(spender, nftId);
    }

    //--------------------------------- accessors

    /// @inheritdoc IOkenV1WrappedNft
    function getExists(uint256 nftId) external view override returns (bool) {
        return _exists(nftId);
    }

    /// @inheritdoc IOkenV1WrappedNft
    function getRentMarketplace() external view override returns (address) {
        return _rentMarketplace;
    }

    /// @inheritdoc IOkenV1WrappedNft
    function getSellMarketplace() external view override returns (address) {
        return _sellMarketplace;
    }

    /// @inheritdoc IOkenV1WrappedNft
    function getPlatformFee() external view override returns (uint256) {
        return _platformFee;
    }

    /// @inheritdoc IOkenV1WrappedNft
    function setPlatformFee(uint256 newFee) external override onlyOwner {
        _platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }

    /// @inheritdoc IOkenV1WrappedNft
    function getFeeRecipient() external view override returns (address payable) {
        return _feeRecipient;
    }

    /// @inheritdoc IOkenV1WrappedNft
    function setFeeRecipient(address payable newRecipient) external override onlyOwner {
        _feeRecipient = newRecipient;
        emit FeeRecipientUpdated(newRecipient);
    }

    function getOriginalNftContract() external view override returns (address) {
        return address(_originalNftContract);
    }

    function getOriginalOwnerOf(uint256 nftId) external view override returns (address) {
        return _originalOwners[nftId];
    }
}
