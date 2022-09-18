// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IOkenV1AddressRegistry.sol";

contract OkenV1AddressRegistry is Ownable, IOkenV1AddressRegistry {
    address private _tokenRegistry;

    address private _nftFactory;

    address private _nftFactoryPrivate;

    address private _rentableNftFactory;

    address private _rentableNftFactoryPrivate;

    address private _wrappedNftFactory;

    address private _rentMarketplace;

    address private _sellMarketplace;

    /// @inheritdoc IOkenV1AddressRegistry
    function tokenRegistry() external view override returns (address) {
        return _tokenRegistry;
    }

    /// @inheritdoc IOkenV1AddressRegistry
    function updateTokenRegistry(address newTokenRegistry) external override onlyOwner {
        _tokenRegistry = newTokenRegistry;
    }

    /// @inheritdoc IOkenV1AddressRegistry
    function nftFactory() external view override returns (address) {
        return _nftFactory;
    }

    /// @inheritdoc IOkenV1AddressRegistry
    function updateNftFactory(address newNftFactory) external override onlyOwner {
        _nftFactory = newNftFactory;
    }

    /// @inheritdoc IOkenV1AddressRegistry
    function nftFactoryPrivate() external view override returns (address) {
        return _nftFactory;
    }

    /// @inheritdoc IOkenV1AddressRegistry
    function updateNftFactoryPrivate(address newNftFactory) external override onlyOwner {
        _nftFactory = newNftFactory;
    }

    /// @inheritdoc IOkenV1AddressRegistry
    function rentableNftFactory() external view override returns (address) {
        return _rentableNftFactory;
    }

    /// @inheritdoc IOkenV1AddressRegistry
    function updateRentableNftFactory(address newRentableNftFactory) external override onlyOwner {
        _rentableNftFactory = newRentableNftFactory;
    }

    /// @inheritdoc IOkenV1AddressRegistry
    function rentableNftFactoryPrivate() external view override returns (address) {
        return _rentableNftFactory;
    }

    /// @inheritdoc IOkenV1AddressRegistry
    function updateRentableNftFactoryPrivate(address newRentableNftFactory)
        external
        override
        onlyOwner
    {
        _rentableNftFactory = newRentableNftFactory;
    }

    /// @inheritdoc IOkenV1AddressRegistry
    function wrappedNftFactory() external view override returns (address) {
        return _wrappedNftFactory;
    }

    /// @inheritdoc IOkenV1AddressRegistry
    function updateWrappedNftFactory(address newWrappedNftFactory) external override onlyOwner {
        _wrappedNftFactory = newWrappedNftFactory;
    }

    /// @inheritdoc IOkenV1AddressRegistry
    function rentMarketplace() external view override returns (address) {
        return _rentMarketplace;
    }

    /// @inheritdoc IOkenV1AddressRegistry
    function updateRentMarketplace(address newRentMarketplace) external override onlyOwner {
        _rentMarketplace = newRentMarketplace;
    }

    /// @inheritdoc IOkenV1AddressRegistry
    function sellMarketplace() external view override returns (address) {
        return _sellMarketplace;
    }

    /// @inheritdoc IOkenV1AddressRegistry
    function updateSellMarketplace(address newSellMarketplace) external override onlyOwner {
        _sellMarketplace = newSellMarketplace;
    }
}
