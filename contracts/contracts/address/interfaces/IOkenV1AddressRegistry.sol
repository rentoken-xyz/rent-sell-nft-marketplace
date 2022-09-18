// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Address Registry Contract
/// @notice This contract stores the deployment addresses of Oken V1 contracts.
/// @dev This contract inherits OpenZeppelin's `Ownable` [contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol).
interface IOkenV1AddressRegistry {
    /// @notice Returns the address of the `OkenV1TokenRegistry` contract.
    /// @return Address of the `OkenV1TokenRegistry` contract
    function tokenRegistry() external view returns (address);

    /// @notice Modifies the address of the `OkenV1TokenRegistry` contract.
    /// @dev This function will revert if `msg.sender` is not the contract owner.
    /// @param newTokenRegistry Address of the new `OkenV1TokenRegistry` contract
    function updateTokenRegistry(address newTokenRegistry) external;

    /// @notice Returns the address of the `OkenV1NftFactory` contract.
    /// @return Address of the `OkenV1NftFactory` contract
    function nftFactory() external view returns (address);

    /// @notice Modifies the address of the `OkenV1NftFactory` contract.
    /// @dev This function will revert if `msg.sender` is not the contract owner.
    /// @param newNftFactory Address of the new `OkenV1NftFactory` contract
    function updateNftFactory(address newNftFactory) external;

    /// @notice Returns the address of the `OkenV1NftFactoryPrivate` contract.
    /// @return Address of the `OkenV1NftFactoryPrivate` contract
    function nftFactoryPrivate() external view returns (address);

    /// @notice Modifies the address of the `OkenV1NftFactoryPrivate` contract.
    /// @dev This function will revert if `msg.sender` is not the contract owner.
    /// @param newNftFactoryPrivate Address of the new `OkenV1NftFactoryPrivate` contract
    function updateNftFactoryPrivate(address newNftFactoryPrivate) external;

    /// @notice Returns the address of the `OkenV1RentableNftFactory` contract.
    /// @return Address of the `OkenV1RentableNftFactory` contract
    function rentableNftFactory() external view returns (address);

    /// @notice Modifies the address of the `OkenV1RentableNftFactory` contract.
    /// @dev This function will revert if `msg.sender` is not the contract owner.
    /// @param newRentableNftFactory Address of new `OkenV1RentableNftFactory` contract
    function updateRentableNftFactory(address newRentableNftFactory) external;

    /// @notice Returns the address of the `OkenV1RentableNftFactoryPrivate` contract.
    /// @return Address of the `OkenV1RentableNftFactoryPrivate` contract
    function rentableNftFactoryPrivate() external view returns (address);

    /// @notice Modifies the address of the `OkenV1RentableNftFactoryPrivate` contract.
    /// @dev This function will revert if `msg.sender` is not the contract owner.
    /// @param newRentableNftFactoryPrivate Address of new `OkenV1RentableNftFactoryPrivate` contract
    function updateRentableNftFactoryPrivate(address newRentableNftFactoryPrivate) external;

    /// @notice Returns the address of the `OkenV1WrappedNftFactory` contract.
    /// @return Address of the `OkenV1WrappedNftFactory` contract
    function wrappedNftFactory() external view returns (address);

    /// @notice Modifies the address of the `OkenV1WrappedNftFactory` contract.
    /// @dev This function will revert if `msg.sender` is not the contract owner.
    /// @param newWrappedNftFactory Address of new `OkenV1WrappedNftFactory` contract
    function updateWrappedNftFactory(address newWrappedNftFactory) external;

    /// @notice Returns the address of the `OkenV1RentMarketplace` contract.
    /// @return Address of `OkenV1RentMarketplace` contract
    function rentMarketplace() external view returns (address);

    /// @notice Modifies the address of the `OkenV1RentMarketplace` contract.
    /// @dev This function will revert if `msg.sender` is not the contract owner.
    /// @param newRentMarketplace Address of new `OkenV1RentMarketplace` contract
    function updateRentMarketplace(address newRentMarketplace) external;

    /// @notice Returns the address of the `OkenV1SellMarketplace` contract.
    /// @return Address of the `OkenV1SellMarketplace` contract
    function sellMarketplace() external view returns (address);

    /// @notice Modifies the address of the `OkenV1SellMarketplace` contract.
    /// @dev This function will revert if `msg.sender` is not the contract owner.
    /// @param newSellMarketplace Address of new `OkenV1SellMarketplace` contract
    function updateSellMarketplace(address newSellMarketplace) external;
}
