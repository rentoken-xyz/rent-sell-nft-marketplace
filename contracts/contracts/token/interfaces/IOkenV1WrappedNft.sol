// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IOkenV1WrappedNft {
    //--------------------------------- events

    /// @notice Emitted when a token is minted
    event WrappedNftMinted(uint256 indexed tokenId, address indexed owner, address indexed minter);

    /// @notice Emitted when a token is burned
    event WrappedNftBurned(
        uint256 indexed tokenId,
        address indexed operator,
        address indexed originalOwner
    );

    /// @notice Emitted when platform fee is modified
    event PlatformFeeUpdated(uint256 indexed newFee);

    /// @notice Emitted when fee recipient is modified
    event FeeRecipientUpdated(address payable indexed newRecipient);

    //--------------------------------- functions

    function mintWrappedNft(uint256 tokenId) external payable;

    function burnWrappedNft(uint256 tokenId) external;

    function isApproved(uint256 tokenId, address operator) external view returns (bool);

    //--------------------------------- accessors

    function getRentMarketplace() external view returns (address);

    function getSellMarketplace() external view returns (address);

    function getPlatformFee() external view returns (uint256);

    function setPlatformFee(uint256 newFee) external;

    function getFeeRecipient() external view returns (address payable);

    function setFeeRecipient(address payable newRecipient) external;

    function getOriginalNftContract() external view returns (address);

    function originalOwnerOf(uint256 tokenId) external view returns (address);
}
