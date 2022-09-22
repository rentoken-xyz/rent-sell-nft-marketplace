// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Contract to wrap ERC721 into ERC4907
interface IOkenV1WrappedNft {
    //--------------------------------- events

    /// @notice Emitted when a wrapped NFT is minted.
    /// @param nftId Token ID of the newly minted NFT
    /// @param owner Owner of the newly minted NFT
    /// @param minter `msg.sender` minting the NFT
    event Minted(uint256 indexed nftId, address indexed owner, address indexed minter);

    /// @notice Emitted when a rentable NFT is burned.
    /// @param nftId Token ID of the burned NFT
    /// @param operator `msg.sender` burning the NFT
    event Burned(uint256 indexed nftId, address indexed originalOwner, address indexed operator);

    /// @notice Emitted when platform fee is modified
    event PlatformFeeUpdated(uint256 indexed newFee);

    /// @notice Emitted when fee recipient is modified
    event FeeRecipientUpdated(address payable indexed newRecipient);

    //--------------------------------- functions

    function mint(uint256 nftId) external payable;

    function burn(uint256 nftId) external;

    function isApproved(uint256 nftId, address operator) external view returns (bool);

    //--------------------------------- accessors

    /// @notice This function returns `true` if the rentable NFT with token ID `tokenId` exists.
    /// @param tokenId Token ID of the NFT
    /// @return NFT exists
    function getExists(uint256 tokenId) external view returns (bool);

    /// @notice Returns the address of the `OkenV1RentMarketplace` contract.
    /// @return Address of the `OkenV1RentMarketplace` contract
    function getRentMarketplace() external view returns (address);

    /// @notice Returns the address of the `OkenV1SellMarketplace` contract.
    /// @return Address of the `OkenV1SellMarketplace` contract
    function getSellMarketplace() external view returns (address);

    /// @notice Returns the platform fee for minting rentable NFTs in WEI.
    /// @return Platform fee in WEI
    function getPlatformFee() external view returns (uint256);

    /// @notice Modifies the platform fee for minting rentable NFTs.
    /// @dev The transaction will revert if `msg.sender` is not the contract owner.
    /// @param newFee New platform fee in WEI
    function setPlatformFee(uint256 newFee) external;

    /// @notice Returns the fee recipient, address who the platform fees are transferred to.
    /// @return Fee recipient
    function getFeeRecipient() external view returns (address payable);

    /// @notice Modifies the fee recipient, address who the fees are transferred to.
    /// @dev The transaction will revert if `msg.sender` is not the contract owner.
    /// @param newRecipient New fee recipient
    function setFeeRecipient(address payable newRecipient) external;

    /// @notice Returns the address of the original ERC721 NFT contract wrapped by this contract.
    /// @return Address of original NFT contract
    function getOriginalNftContract() external view returns (address);

    /// @notice Returns owner of original NFT.
    /// @param nftId Token ID of original NFT
    /// @return Address of owner of original NFT
    function getOriginalOwnerOf(uint256 nftId) external view returns (address);
}
