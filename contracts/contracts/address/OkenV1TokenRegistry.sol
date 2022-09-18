// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IOkenV1TokenRegistry.sol";

error AlreadyAdded(address token);
error NotAdded(address token);

contract OkenV1TokenRegistry is Ownable, IOkenV1TokenRegistry {
    // ERC20 token address -> is authorized
    mapping(address => bool) internal _authorized;

    /// @inheritdoc IOkenV1TokenRegistry
    function add(address token) external override onlyOwner {
        if (_authorized[token]) revert AlreadyAdded(token);
        _authorized[token] = true;
        emit TokenAdded(token);
    }

    /// @inheritdoc IOkenV1TokenRegistry
    function remove(address token) external override onlyOwner {
        if (!_authorized[token]) revert NotAdded(token);
        _authorized[token] = false;
        emit TokenRemoved(token);
    }

    /// @inheritdoc IOkenV1TokenRegistry
    function getAuthorized(address token) external view override returns (bool) {
        return _authorized[token];
    }
}
