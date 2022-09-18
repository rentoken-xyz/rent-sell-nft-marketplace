// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Rentable NFT Private Contract
/// @notice This contract can be used to mint and burn rentable NFTs.
/// It implements the [ERC721](https://eips.ethereum.org/EIPS/eip-721), [ERC721Metadata](https://eips.ethereum.org/EIPS/eip-721), and [ERC4907](https://eips.ethereum.org/EIPS/eip-4907) interfaces.
/// The `OkenV1RentMarketplace` and `OkenV1SellMarketplace` are approved on all NFTs to enable gas-less listings.
/// This contract differs to `OkenV1RentableNft` by only allowing this contract owner to mint NFTs.
interface IOkenV1RentableNftPrivate {
    //--------------------------------- events

    /// @notice Emitted when a rentable NFT is minted.
    /// @param tokenId Token ID of the newly minted NFT
    /// @param owner Owner of the newly minted NFT
    /// @param minter `msg.sender` minting the NFT
    event Minted(uint256 indexed tokenId, address indexed owner, address indexed minter);

    /// @notice Emitted when a rentable NFT is burned.
    /// @param tokenId Token ID of the burned NFT
    /// @param operator `msg.sender` burning the NFT
    event Burned(uint256 indexed tokenId, address indexed operator);

    /// @notice Emitted when the platform fee is modified.
    /// @param newFee New platform fee
    event PlatformFeeUpdated(uint256 indexed newFee);

    /// @notice Emitted when the fee recipient is modified.
    /// @param newRecipient New fee recipient
    event FeeRecipientUpdated(address payable indexed newRecipient);

    //--------------------------------- nft functions

    /// @notice Mints a new rentable NFT to `to` with token URI `uri`.
    /// @dev The transaction will revert if `msg.sender` is not the contract owner.
    /// The ETH amount sent must pay for the platform fee.
    /// The token ID assigned to the NFT corresponds to the value of the token counter at the state of the transaction.
    /// This function emits a `RentableNftMinted` event.
    /// @param to Owner of the newly minted NFT
    /// @param uri Token URI of the newly minted NFT
    function mint(address to, string calldata uri) external payable;

    /// @notice Burns the rentable NFT with token ID `tokenId`.
    /// @dev This function will revert if `msg.sender` isn't one of:
    /// - NFT owner
    /// - approved for NFT
    /// - approved for all on NFT owner
    /// - `OkenV1RentMarketplace` or `OkenV1SellMarketplace`
    /// @param tokenId Token ID of the NFT to burn
    function burn(uint256 tokenId) external;

    /// @notice Returns `true` if `operator` is either approved on NFT or approved for all on NFT owner.
    /// @param tokenId Token ID of the NFT
    /// @param operator Address to check approval for
    /// @return `operator` is either approved on NFT or approved for all on NFT owner
    function isApproved(uint256 tokenId, address operator) external view returns (bool);

    //--------------------------------- accessors

    /// @notice Returns the amount of rentable NFTs ever minted.
    /// @return Amount of NFTs ever minted
    function getTokenCounter() external view returns (uint256);

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
}
