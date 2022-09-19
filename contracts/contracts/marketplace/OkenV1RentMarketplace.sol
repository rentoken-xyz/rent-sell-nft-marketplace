// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../token/interfaces/IERC4907.sol";
import "./interfaces/IOkenV1RentMarketplace.sol";
import "../address/interfaces/IOkenV1AddressRegistry.sol";
import "../utils/OkenV1Errors.sol";

contract OkenV1RentMarketplace is Ownable, ReentrancyGuard, IOkenV1RentMarketplace {
    //--------------------------------- state variables

    // NFT contract address -> NFT token ID -> owner
    mapping(address => mapping(uint256 => address)) private _owners;

    // NFT contract address -> NFT token ID -> owner -> Listing
    mapping(address => mapping(uint256 => mapping(address => Listing))) private _listings;

    // operator address -> ERC20 token address -> proceeds
    mapping(address => mapping(address => uint256)) private _proceeds;

    // Address of `OkenV1AddressRegistry` contract
    IOkenV1AddressRegistry private _addressRegistry;

    // Rent fee, 123 = 1.23%, fee <= 10000
    uint16 private _platformFee;

    // address the platform fees are transferred to
    address payable private _feeRecipient;

    bytes4 internal constant ON_ERC721_RECEIVED = 0x150b7a02;
    bytes4 internal constant INTERFACE_ID_ERC4907 = 0xad092b5c;
    uint256 internal constant MAX_UINT64 = 0xffffffffffffffff;

    //--------------------------------- misc functions

    constructor(
        address addressRegistry,
        uint16 platformFee,
        address payable feeRecipient
    ) {
        _addressRegistry = IOkenV1AddressRegistry(addressRegistry);
        _platformFee = platformFee;
        _feeRecipient = feeRecipient;
    }

    receive() external payable {
        _proceeds[_msgSender()][address(0)] += msg.value;
    }

    fallback() external payable {
        revert InvalidCall(_msgData());
    }

    //--------------------------------- marketplace functions

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 start,
        uint256 end,
        uint256 pricePerSecond,
        address payToken
    ) external override {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        // require item is not listed
        if (_listings[nftAddress][tokenId][owner].pricePerSecond != 0)
            revert AlreadyListed(nftAddress, tokenId, owner);
        // require `address(this)` is either approved or approved for all
        if (
            nft.getApproved(tokenId) != address(this) && !nft.isApprovedForAll(owner, address(this))
        ) revert NotApproved(nftAddress, tokenId);
        // require `msg.sender` is owner
        if (owner != _msgSender()) revert NotOwner(_msgSender());
        // require is ERC4907
        if (!IERC165(nftAddress).supportsInterface(INTERFACE_ID_ERC4907))
            revert InvalidNftAddress(nftAddress);

        // to make rent period start from transaction time
        if (start == 0) start = block.timestamp;

        // require `start` is now or in the future, and `end` can be type casted to `uint64`
        _validTimestamps(start, block.timestamp, end, MAX_UINT64);

        // require `pricePerSecond` non zero and `payToken` valid
        _validPayment(pricePerSecond, 1, payToken);

        // modify listing
        _listings[nftAddress][tokenId][owner] = Listing(start, end, pricePerSecond, payToken);
        emit ItemListed(nftAddress, tokenId, owner, start, end, pricePerSecond, payToken);
    }

    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 start,
        uint256 end,
        uint256 pricePerSecond,
        address payToken
    ) external override {
        address owner = IERC721(nftAddress).ownerOf(tokenId);
        // require `msg.sender` is owner
        if (_msgSender() != owner) revert NotOwner(_msgSender());
        // require the item is listed
        if (_listings[nftAddress][tokenId][owner].pricePerSecond == 0)
            revert NotListed(nftAddress, tokenId, owner);

        // to make rent period start from transaction time
        if (start == 0) start = block.timestamp;

        // require `start` is now or in the future, and `end` can be casted to `uint64`
        _validTimestamps(start, block.timestamp, end, MAX_UINT64);

        // require `pricePerSecond` non zero and `payToken` valid
        _validPayment(pricePerSecond, 1, payToken);

        // modify listing
        _listings[nftAddress][tokenId][owner] = Listing(start, end, pricePerSecond, payToken);
        emit ListingUpdated(nftAddress, tokenId, owner, start, end, pricePerSecond, payToken);
    }

    function rentItem(
        address nftAddress,
        uint256 tokenId,
        uint256 start,
        uint256 end,
        address payToken
    ) external payable override nonReentrant {
        IERC721 nft = IERC721(nftAddress);
        address owner = ownerOf(nftAddress, tokenId);
        address renter = _msgSender();
        Listing memory listing = _listings[nftAddress][tokenId][owner];
        // require item is listed
        if (listing.pricePerSecond == 0) revert NotListed(nftAddress, tokenId, owner);
        // require item is not currently rented
        if (IERC4907(nftAddress).userOf(tokenId) != address(0))
            revert CurrentlyRented(nftAddress, tokenId);

        // to make rent period start from transaction time
        if (start == 0) start = block.timestamp;

        // require asked rent period is within listed rent period
        _validTimestamps(start, listing.start, end, listing.end);

        // compute minimum rent price and platform fees
        uint256 minRentPrice = (end - start + 1) * listing.pricePerSecond;
        uint256 fee = (minRentPrice * uint256(_platformFee)) / 10000;

        // require `msg.value` pays for rent and fee, and `payToken` is valid
        uint256 amount = listing.payToken == address(0)
            ? msg.value
            : IERC20(listing.payToken).allowance(renter, address(this));
        _validPayment(amount, minRentPrice + fee, payToken);

        if (listing.payToken != address(0)) {
            bool success = IERC20(listing.payToken).transferFrom(
                renter,
                address(this),
                minRentPrice + fee
            );
            if (!success) revert TransferFailed();
        }

        // transfer rented Nft from owner to `address(this)`
        if (nft.ownerOf(tokenId) != address(this)) {
            nft.safeTransferFrom(owner, address(this), tokenId);
            // _owners[nftAddress][tokenId] = owner;
        }

        // set user to rent Nft
        IERC4907(nftAddress).setUser(tokenId, renter, uint64(end));

        // update proceeds
        _proceeds[_feeRecipient][payToken] += fee;
        _proceeds[owner][payToken] += msg.value - fee;

        emit ItemRented(nftAddress, tokenId, owner, renter, start, end, msg.value, payToken);
    }

    function redeemItem(address nftAddress, uint256 tokenId) external override {
        // require item is not currently rented
        if (IERC4907(nftAddress).userOf(tokenId) != address(0))
            revert CurrentlyRented(nftAddress, tokenId);
        // require sender is original owner
        address owner = ownerOf(nftAddress, tokenId);
        if (owner != _msgSender()) revert NotOwner(_msgSender());

        // transfer nft back to original owner
        IERC721(nftAddress).transferFrom(address(this), owner, tokenId);
        delete (_owners[nftAddress][tokenId]);
        emit ItemRedeemed(nftAddress, tokenId, owner);
    }

    function cancelListing(address nftAddress, uint256 tokenId) external override {
        address operator = _msgSender();
        // require a listing exists for NFT and operator
        if (_listings[nftAddress][tokenId][operator].pricePerSecond == 0)
            revert NotListed(nftAddress, tokenId, operator);

        // cancel listing
        delete (_listings[nftAddress][tokenId][operator]);
        emit ListingCanceled(nftAddress, tokenId, operator);
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

    /// @notice Handle the receipt of an Nft
    /// @dev The ERC721 smart contract calls this function on the recipient
    ///  after a `transfer`. This function MAY throw to revert and reject the
    ///  transfer. Return of other than the magic value MUST result in the
    ///  transaction being reverted.
    ///  Note: the contract address is always the message sender.
    /// @param operator The address which called `safeTransferFrom` function
    /// @param from The address which previously owned the token
    /// @param tokenId The Nft identifier which is being transferred
    /// @param data Additional data with no specified format
    /// @return `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
    ///  unless throwing
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        if (operator != address(this)) revert();
        if (_owners[_msgSender()][tokenId] != address(0)) revert();
        _owners[_msgSender()][tokenId] = from;
        return ON_ERC721_RECEIVED;
    }

    //--------------------------------- internal functions

    function _validTimestamps(
        uint256 start,
        uint256 minTimestamp,
        uint256 end,
        uint256 maxTimestamp
    ) internal pure {
        if ((start < minTimestamp) || (maxTimestamp < end) || (end < start))
            revert InvalidTimestamps(start, end);
    }

    function _validPayment(
        uint256 amount,
        uint256 minAmount,
        address payToken
    ) internal pure {
        if (minAmount < amount) revert InvalidAmount(amount);
        if (
            (payToken != address(0)) /* &&
            (!IOkenV1TokenRegistry(addressRegistry.tokenRegistry()).authorized(payToken)) */
        ) revert InvalidPayToken(payToken);
    }

    //--------------------------------- accessors

    function ownerOf(address nftAddress, uint256 tokenId) public view override returns (address) {
        address owner = IERC721(nftAddress).ownerOf(tokenId);
        if (owner != address(this)) return owner;
        return _owners[nftAddress][tokenId];
    }

    function getListing(
        address nftAddress,
        uint256 tokenId,
        address operator
    ) external view override returns (Listing memory) {
        return _listings[nftAddress][tokenId][operator];
    }

    function getProceeds(address operator, address payToken)
        external
        view
        override
        returns (uint256)
    {
        return _proceeds[operator][payToken];
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
}
