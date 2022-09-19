// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "../token/interfaces/IERC4907.sol";
import "./interfaces/IOkenV1SellMarketplace.sol";
import "../utils/OkenV1Errors.sol";
import "../address/OkenV1AddressRegistry.sol";
import "../address/OkenV1TokenRegistry.sol";

contract OkenV1SellMarketplace is Ownable, ReentrancyGuard, IOkenV1SellMarketplace {
    //--------------------------------- state variables

    // ERC721 contract address -> token id -> seller -> Listing
    mapping(address => mapping(uint256 => mapping(address => Listing))) private _listings;

    // operator address -> token address -> proceeds
    mapping(address => mapping(address => uint256)) private _proceeds;

    // `OkenV1AddressRegistry`
    OkenV1AddressRegistry private _addressRegistry;

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
        _addressRegistry = OkenV1AddressRegistry(addressRegistry);
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

    //--------------------------------- marketplace functions

    function listItem(
        address nftContract,
        uint256 nftId,
        address payToken,
        uint256 price
    ) external override {
        // require is ERC721
        if (!IERC165(nftContract).supportsInterface(INTERFACE_ID_ERC721))
            revert InvalidNftAddress(nftContract);
        // require sender is owner
        IERC721 nft = IERC721(nftContract);
        address owner = nft.ownerOf(nftId);
        if (_msgSender() != owner) revert NotOwner(_msgSender());
        // require matketplace is allowed
        if (nft.getApproved(nftId) != address(this) && !nft.isApprovedForAll(owner, address(this)))
            revert NotApproved(nftContract, nftId);
        // require not listed
        if (_listings[nftContract][nftId][owner].price != 0)
            revert AlreadyListed(nftContract, nftId, owner);
        // require price strictly positive and pay token is valid
        _validPayment(price, 1, payToken);

        _listings[nftContract][nftId][owner] = Listing(owner, payToken, price);
        emit ItemListed(nftContract, nftId, owner, payToken, price);
    }

    function updateListing(
        address nftContract,
        uint256 nftId,
        uint256 newPrice,
        address newPayToken
    ) external override {
        // require sender is owner
        address owner = IERC721(nftContract).ownerOf(nftId);
        if (_msgSender() != owner) revert NotOwner(_msgSender());
        // require is listed
        Listing memory listing = _listings[nftContract][nftId][owner];
        if (listing.price == 0) revert NotListed(nftContract, nftId, owner);
        // require price and pay token are valid
        _validPayment(newPrice, 1, newPayToken);

        if (newPrice != listing.price) _listings[nftContract][nftId][owner].price = newPrice;
        if (newPayToken != listing.payToken)
            _listings[nftContract][nftId][owner].payToken = newPayToken;
        emit ListingUpdated(nftContract, nftId, owner, newPayToken, newPrice);
    }

    function buyItem(
        address nftContract,
        uint256 nftId,
        address payToken
    ) external payable override {
        // require item is listed
        address seller = IERC721(nftContract).ownerOf(nftId);
        address buyer = _msgSender();
        Listing memory listing = _listings[nftContract][nftId][seller];
        if (listing.price == 0) revert NotListed(nftContract, nftId, seller);
        // require pay token same as listing
        if (payToken != listing.payToken) revert InvalidPayToken(payToken);

        // compute price
        uint256 fees = (listing.price * uint256(_platformFee)) / 10000;

        uint256 amount = listing.payToken == address(0)
            ? msg.value
            : IERC20(listing.payToken).allowance(buyer, address(this));
        _validPayment(amount, listing.price + fees, listing.payToken);

        delete (_listings[nftContract][nftId][seller]);

        if (listing.payToken != address(0)) {
            bool success = IERC20(listing.payToken).transferFrom(
                buyer,
                address(this),
                listing.price + fees
            );
            if (!success) revert TransferFailed();
        }

        IERC721(nftContract).safeTransferFrom(seller, buyer, nftId);
        emit ItemSold(nftContract, nftId, seller, buyer, listing.payToken, listing.price + fees);
    }

    function cancelListing(address nftContract, uint256 nftId) external override {
        // require listing exists
        if (_listings[nftContract][nftId][_msgSender()].price == 0)
            revert NotListed(nftContract, nftId, _msgSender());
        delete (_listings[nftContract][nftId][_msgSender()]);
        emit ListingCanceled(nftContract, nftId, _msgSender());
    }

    function withdrawProceeds(address payToken) external override {
        address operator = _msgSender();
        uint256 proceeds = _proceeds[operator][payToken];
        // require there are proceeds
        if (proceeds == 0) revert NoProceeds(operator, payToken);

        // set proceeds to zero
        delete (_proceeds[operator][payToken]);

        // transfer balance and verify
        if (payToken == address(0)) {
            (bool success, ) = payable(operator).call{value: proceeds, gas: 2300}("");
            if (!success) revert TransferFailed();
        } else {
            bool success = IERC20(payToken).transferFrom(address(this), operator, proceeds);
            if (!success) revert TransferFailed();
        }
        emit ProceedsWithdrawn(operator, payToken, proceeds);
    }

    //--------------------------------- internal functions

    function _validPayment(
        uint256 amount,
        uint256 minAmount,
        address payToken
    ) internal view {
        if (amount < minAmount) revert InvalidAmount(amount);
        if (
            (payToken != address(0)) &&
            (!IOkenV1TokenRegistry(_addressRegistry.tokenRegistry()).getAuthorized(payToken))
        ) revert InvalidPayToken(payToken);
    }

    //--------------------------------- accessor functions

    function getAddressRegistry() external view override returns (address) {
        return address(_addressRegistry);
    }

    function setAddressRegistry(address newAddressRegistry) external override onlyOwner {
        _addressRegistry = OkenV1AddressRegistry(newAddressRegistry);
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

    function getListing(
        address nftContract,
        uint256 nftId,
        address operator
    ) external view override returns (Listing memory) {
        return _listings[nftContract][nftId][operator];
    }

    function getProceeds(address operator, address token) external view override returns (uint256) {
        return _proceeds[operator][token];
    }
}
