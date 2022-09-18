// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Token Registry
/// @notice
interface IOkenV1TokenRegistry {
    /// @notice Emitted when a new ERC20 token is added.
    /// @param token address of ERC20 token
    event TokenAdded(address token);

    /// @notice Emitted when a new ERC20 token is removed.
    /// @param token address of ERC20 token
    event TokenRemoved(address token);

    /// @notice Adds a ERC20 token to the list of authorized tokens.
    /// @dev `msg.sender` must be the contract owner. The transaction will revert if the token is already authorized.
    /// @param token address of the ERC20 token
    function add(address token) external;

    /// @notice Removes a ERC20 token to the list of authorized tokens.
    /// @dev `msg.sender` must be the contract owner. The transaction will revert if the token is not authorized.
    /// @param token address of the ERC20 token
    function remove(address token) external;

    /// @notice Returns `true` if ERC20 `token` is authorized.
    /// @param token address of ERC20 token
    /// @return ERC20 token authorized
    function getAuthorized(address token) external view returns (bool);
}
