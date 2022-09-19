// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IOkenV1WrappedNftFactory {
    //--------------------------------- events

    /// @dev Emitted when a Nft contract is created
    event WrappedNftAdded(
        address indexed originalNftContract,
        address indexed wrappedNftContract,
        address indexed operator
    );

    event WrappedNftRemoved(
        address indexed originalNftContract,
        address indexed wrappedNftContract,
        address indexed operator
    );

    //--------------------------------- functions

    function deployWrappedNftContract(address originalNftContract)
        external
        payable
        returns (address);

    function addWrappedNftContract(address wrappedNftContract) external;

    function removeWrappedNftContract(address wrappedNftContract) external;

    //--------------------------------- accessors

    function getWrappedContract(address originalContract) external view returns (address);

    function getExists(address originalContract) external view returns (bool);

    function getRentMarketplace() external view returns (address);

    function setRentMarketplace(address marketplace) external;

    function getSellMarketplace() external view returns (address);

    function setSellMarketplace(address marketplace) external;

    function getMintFee() external view returns (uint256);

    function setMintFee(uint256 fee) external;

    function getPlatformFee() external view returns (uint256);

    function setPlatformFee(uint256 fee) external;

    function getFeeRecipient() external view returns (address payable);

    function setFeeRecipient(address payable recipient) external;
}
