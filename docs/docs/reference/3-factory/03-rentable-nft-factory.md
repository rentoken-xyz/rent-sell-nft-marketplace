---
sidebar_position: 3
---

# `OkenV1RentableNftFactory`

This contract can be used to deploy `OkenV1RentableNft` contracts.

## Events

This contract can be used to deploy `OkenV1RentableNft` contracts.

### NftContractAdded

```solidity
event NftContractAdded(address operator, address nftContract)
```

Emitted when a `OkenV1RentableNft` contract is deployed or added to this factory.

| Name        | Type    | Description                             |
| ----------- | ------- | --------------------------------------- |
| operator    | address | Sender deploying or adding the contract |
| nftContract | address | `OkenV1RentableNft` contract added      |

### NftContractRemoved

```solidity
event NftContractRemoved(address operator, address nftContract)
```

Emitted when a `OkenV1RentableNft` contract is removed from this factory.

| Name        | Type    | Description                          |
| ----------- | ------- | ------------------------------------ |
| operator    | address | Sender removing the contract         |
| nftContract | address | `OkenV1RentableNft` contract removed |

## Factory functions

### deployNftContract

```solidity
function deployNftContract(string name, string symbol, uint256 mintFee, address payable feeRecipient) external payable returns (address)
```

Deploys a `OkenV1RentableNft` contract

_The transaction will revert if the ETH balance sent does not pay for the platform fee. A `NftContractAdded` event is emitted._

| Name         | Type            | Description                                  |
| ------------ | --------------- | -------------------------------------------- |
| name         | string          | NFT contract name                            |
| symbol       | string          | NFT contract symbol                          |
| mintFee      | uint256         | Fee to mint a new NFT from the NFT contract  |
| feeRecipient | address payable | Address the mint fees will be transferred to |

| Name | Type    | Description                                                |
| ---- | ------- | ---------------------------------------------------------- |
| [0]  | address | Address of the newly deployed `OkenV1RentableNft` contract |

### addNftContract

```solidity
function addNftContract(address nftContract) external
```

Adds an already deployed ERC4907 contract to the factory.

_The transaction will revert if the contract is not ERC4907 or has already been added to the factory. A `NftContractAdded` event will be emitted._

| Name        | Type    | Description                     |
| ----------- | ------- | ------------------------------- |
| nftContract | address | Address of the ERC4907 contract |

### removeNftContract

```solidity
function removeNftContract(address nftContract) external
```

Removes a `OkenV1RentableNft` contract from the factory.

_The transaction will revert if the contract doesn't exist in the factory. A `NftContractRemoved` event will be emitted._

| Name        | Type    | Description                     |
| ----------- | ------- | ------------------------------- |
| nftContract | address | Address of the ERC4907 contract |

## Accessor functions

### getExists

```solidity
function getExists(address nftContract) external view returns (bool)
```

Returns `true` if `rentableNftContract` exists in the factory.

| Name        | Type    | Description                                 |
| ----------- | ------- | ------------------------------------------- |
| nftContract | address | Address of the `OkenV1RentableNft` contract |

| Name | Type | Description       |
| ---- | ---- | ----------------- |
| [0]  | bool | Exists in factory |

### getRentMarketplace

```solidity
function getRentMarketplace() external view returns (address)
```

Returns the address of the `OkenV1RentMarketplace` contract.

| Name | Type    | Description                                     |
| ---- | ------- | ----------------------------------------------- |
| [0]  | address | Address of the `OkenV1RentMarketplace` contract |

### setRentMarketplace

```solidity
function setRentMarketplace(address newRentMarketplace) external
```

Modifies the address of the `OkenV1RentMarketplace` contract.

_The transaction will revert if `msg.sender` is not the contract owner._

| Name               | Type    | Description                                  |
| ------------------ | ------- | -------------------------------------------- |
| newRentMarketplace | address | New `OkenV1RentMarketplace` contract address |

### getSellMarketplace

```solidity
function getSellMarketplace() external view returns (address)
```

Returns the address of the `OkenV1SellMarketplace` contract.

| Name | Type    | Description                                     |
| ---- | ------- | ----------------------------------------------- |
| [0]  | address | Address of the `OkenV1SellMarketplace` contract |

### setSellMarketplace

```solidity
function setSellMarketplace(address newSellMarketplace) external
```

Modify the address of the `OkenV1SellMarketplace` contract.

_The transaction will revert if `msg.sender` is not the contract owner._

| Name               | Type    | Description                                  |
| ------------------ | ------- | -------------------------------------------- |
| newSellMarketplace | address | New `OkenV1SellMarketplace` contract address |

### getPlatformFee

```solidity
function getPlatformFee() external view returns (uint256)
```

Returns the platform fee, fee to deploy a new `OkenV1RentableNft` contract.

| Name | Type    | Description  |
| ---- | ------- | ------------ |
| [0]  | uint256 | Platform fee |

### setPlatformFee

```solidity
function setPlatformFee(uint256 newFee) external
```

Modify the platform fee, fee to deploy a new `OkenV1RentableNft` contract.

_The transaction will revert if `msg.sender` is not the contract owner._

| Name   | Type    | Description      |
| ------ | ------- | ---------------- |
| newFee | uint256 | New platform fee |

### getFeeRecipient

```solidity
function getFeeRecipient() external view returns (address payable)
```

Returns the fee recipient, address the platform fees are transferred to.

| Name | Type            | Description   |
| ---- | --------------- | ------------- |
| [0]  | address payable | Fee recipient |

### setFeeRecipient

```solidity
function setFeeRecipient(address payable newRecipient) external
```

Modify the fee recipient, address the platform fees are transferred to.

_The transaction will revert if `msg.sender` is not the contract owner._

| Name         | Type            | Description       |
| ------------ | --------------- | ----------------- |
| newRecipient | address payable | New fee recipient |
