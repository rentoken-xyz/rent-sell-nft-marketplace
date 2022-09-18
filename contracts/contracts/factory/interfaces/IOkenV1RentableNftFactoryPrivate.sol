// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Rentable NFT Factory Private Contract
/// @notice This contract can be used to deploy `OkenV1RentableNftPrivate` contracts.
interface IOkenV1RentableNftFactoryPrivate {
    //--------------------------------- events

    /// @notice Emitted when a `OkenV1RentableNftPrivate` contract is deployed or added to this factory.
    /// @param operator `msg.sender` deploying or adding the contract
    /// @param nftContract `OkenV1RentableNftPrivate` contract added
    event NftContractAdded(address indexed operator, address indexed nftContract);

    /// @notice Emitted when a `OkenV1RentableNftPrivate` contract is removed from this factory.
    /// @param operator `msg.sender` removing the contract
    /// @param nftContract `OkenV1RentableNftPrivate` contract removed
    event NftContractRemoved(address indexed operator, address indexed nftContract);

    //--------------------------------- factory functions

    /// @notice Deploys a `OkenV1RentableNftPrivate` contract
    /// @dev The transaction will revert if the ETH balance sent does not pay for the platform fee. A `NftContractAdded` event is emitted.
    /// @param name NFT contract name
    /// @param symbol NFT contract symbol
    /// @param mintFee Fee to mint a new NFT from the NFT contract
    /// @param feeRecipient Address the mint fees will be transferred to
    /// @return Address of the newly deployed `OkenV1RentableNftPrivate` contract
    function deployNftContract(
        string memory name,
        string memory symbol,
        uint256 mintFee,
        address payable feeRecipient
    ) external payable returns (address);

    /// @notice Adds an already deployed ERC4907 contract to the factory.
    /// @dev The transaction will revert if the contract is not ERC4907 or has already been added to the factory. A `NftContractAdded` event will be emitted.
    /// @param nftContract Address of the ERC4907 contract
    function addNftContract(address nftContract) external;

    /// @notice Removes a ERC4907 contract from the factory.
    /// @dev The transaction will revert if the contract doesn't exist in the factory. A `NftContractRemoved` event will be emitted.
    /// @param nftContract Address of the ERC4907 contract
    function removeNftContract(address nftContract) external;

    //--------------------------------- accessors

    /// @notice Returns `true` if `nftContract` exists in the factory.
    /// @param nftContract Address of the `OkenV1RentableNftPrivate` contract
    /// @return Exists in factory
    function getExists(address nftContract) external view returns (bool);

    /// @notice Returns the address of the `OkenV1RentMarketplace` contract.
    /// @return Address of the `OkenV1RentMarketplace` contract
    function getRentMarketplace() external view returns (address);

    /// @notice Modifies the address of the `OkenV1RentMarketplace` contract.
    /// @dev The transaction will revert if `msg.sender` is not the contract owner.
    /// @param newRentMarketplace New `OkenV1RentMarketplace` contract address
    function setRentMarketplace(address newRentMarketplace) external;

    /// @notice Returns the address of the `OkenV1SellMarketplace` contract.
    /// @return Address of the `OkenV1SellMarketplace` contract
    function getSellMarketplace() external view returns (address);

    /// @notice Modify the address of the `OkenV1SellMarketplace` contract.
    /// @dev The transaction will revert if `msg.sender` is not the contract owner.
    /// @param newSellMarketplace New `OkenV1SellMarketplace` contract address
    function setSellMarketplace(address newSellMarketplace) external;

    /// @notice Returns the platform fee, fee to deploy a new `OkenV1RentableNftPrivate` contract.
    /// @return Platform fee
    function getPlatformFee() external view returns (uint256);

    /// @notice Modify the platform fee, fee to deploy a new `OkenV1RentableNftPrivate` contract.
    /// @dev The transaction will revert if `msg.sender` is not the contract owner.
    /// @param newFee New platform fee
    function setPlatformFee(uint256 newFee) external;

    /// @notice Returns the fee recipient, address the platform fees are transferred to.
    /// @return Fee recipient
    function getFeeRecipient() external view returns (address payable);

    /// @notice Modify the fee recipient, address the platform fees are transferred to.
    /// @dev The transaction will revert if `msg.sender` is not the contract owner.
    /// @param newRecipient New fee recipient
    function setFeeRecipient(address payable newRecipient) external;
}
