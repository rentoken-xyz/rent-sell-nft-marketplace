// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./interfaces/IERC4907.sol";

abstract contract ERC4907 is ERC721, IERC4907 {
    struct UserInfo {
        address user; // address of user role
        uint64 expires; // unix timestamp, user expires
    }

    mapping(uint256 => UserInfo) internal _users;

    /// @notice set the user and expires of a Nft
    /// @dev The zero address indicates there is no user
    /// Throws if `tokenId` is not valid Nft
    /// @param user  The new user of the Nft
    /// @param expires  UNIX timestamp, The new user could use the Nft before expires
    function setUser(
        uint256 tokenId,
        address user,
        uint64 expires
    ) public virtual override {
        require(
            _isApprovedOrOwner(msg.sender, tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        UserInfo storage info = _users[tokenId];
        info.user = user;
        info.expires = expires;
        emit UpdateUser(tokenId, user, expires);
    }

    /// @notice Get the user address of an Nft
    /// @dev The zero address indicates that there is no user or the user is expired
    /// @param tokenId The Nft to get the user address for
    /// @return The user address for this Nft
    function userOf(uint256 tokenId) public view virtual override returns (address) {
        if (uint256(_users[tokenId].expires) >= block.timestamp) {
            return _users[tokenId].user;
        } else {
            return address(0);
        }
    }

    /// @notice Get the user expires of an Nft
    /// @dev The zero value indicates that there is no user
    /// @param tokenId The Nft to get the user expires for
    /// @return The user expires for this Nft
    function userExpires(uint256 tokenId) public view virtual override returns (uint256) {
        return _users[tokenId].expires;
    }

    /// @dev See {IERC165-supportsInterface}.
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC4907).interfaceId || super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);

        if (from != to) {
            _users[tokenId].user = address(0);
            _users[tokenId].expires = 0;
            emit UpdateUser(tokenId, address(0), 0);
        }
    }
}
