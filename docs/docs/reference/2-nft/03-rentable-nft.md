---
sidebar_position: 3
---

# `OkenV1RentableNft`

This contract can be used to mint and burn rentable NFTs.
It implements the [ERC721](https://eips.ethereum.org/EIPS/eip-721), [ERC721Metadata](https://eips.ethereum.org/EIPS/eip-721), and [ERC4907](https://eips.ethereum.org/EIPS/eip-4907) interfaces.
The `OkenV1RentMarketplace` and `OkenV1SellMarketplace` are approved on all NFTs to enable gas-less listings.

## Events

### Minted

```solidity
event Minted(uint256 tokenId, address owner, address minter)
```

Emitted when a rentable NFT is minted.

| Name    | Type    | Description                      |
| ------- | ------- | -------------------------------- |
| tokenId | uint256 | Token ID of the newly minted NFT |
| owner   | address | Owner of the newly minted NFT    |
| minter  | address | `msg.sender` minting the NFT     |

### Burned

```solidity
event Burned(uint256 tokenId, address operator)
```

Emitted when a rentable NFT is burned.

| Name     | Type    | Description                  |
| -------- | ------- | ---------------------------- |
| tokenId  | uint256 | Token ID of the burned NFT   |
| operator | address | `msg.sender` burning the NFT |

### PlatformFeeUpdated

```solidity
event PlatformFeeUpdated(uint256 newFee)
```

Emitted when the platform fee is modified.

| Name   | Type    | Description      |
| ------ | ------- | ---------------- |
| newFee | uint256 | New platform fee |

### FeeRecipientUpdated

```solidity
event FeeRecipientUpdated(address payable newRecipient)
```

Emitted when the fee recipient is modified.

| Name         | Type            | Description       |
| ------------ | --------------- | ----------------- |
| newRecipient | address payable | New fee recipient |

## NFT functions

### mint

```solidity
function mint(address to, string uri) external payable
```

Mints a new rentable NFT to `to` with token URI `uri`.

_The ETH amount sent must pay for the platform fee. The token ID assigned to the NFT corresponds to the value of the token counter at the state of the transaction.
This function emits a `RentableNftMinted` event._

| Name | Type    | Description                       |
| ---- | ------- | --------------------------------- |
| to   | address | Owner of the newly minted NFT     |
| uri  | string  | Token URI of the newly minted NFT |

### burn

```solidity
function burn(uint256 tokenId) external
```

Burns the rentable NFT with token ID `tokenId`.

\_This function will revert if `msg.sender` isn't one of:

- NFT owner
- approved for NFT
- approved for all on NFT owner
- `OkenV1RentMarketplace` or `OkenV1SellMarketplace`\_

| Name    | Type    | Description                 |
| ------- | ------- | --------------------------- |
| tokenId | uint256 | Token ID of the NFT to burn |

### isApproved

```solidity
function isApproved(uint256 tokenId, address operator) external view returns (bool)
```

Returns `true` if `operator` is either approved on NFT or approved for all on NFT owner.

| Name     | Type    | Description                   |
| -------- | ------- | ----------------------------- |
| tokenId  | uint256 | Token ID of the NFT           |
| operator | address | Address to check approval for |

| Name | Type | Description                                                           |
| ---- | ---- | --------------------------------------------------------------------- |
| [0]  | bool | `operator` is either approved on NFT or approved for all on NFT owner |

## Accessor functions

### getTokenCounter

```solidity
function getTokenCounter() external view returns (uint256)
```

Returns the amount of rentable NFTs ever minted.

| Name | Type    | Description                |
| ---- | ------- | -------------------------- |
| [0]  | uint256 | Amount of NFTs ever minted |

### getExists

```solidity
function getExists(uint256 tokenId) external view returns (bool)
```

This function returns `true` if the rentable NFT with token ID `tokenId` exists.

| Name    | Type    | Description         |
| ------- | ------- | ------------------- |
| tokenId | uint256 | Token ID of the NFT |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0]  | bool | NFT exists  |

### getRentMarketplace

```solidity
function getRentMarketplace() external view returns (address)
```

Returns the address of the `OkenV1RentMarketplace` contract.

| Name | Type    | Description                                     |
| ---- | ------- | ----------------------------------------------- |
| [0]  | address | Address of the `OkenV1RentMarketplace` contract |

### getSellMarketplace

```solidity
function getSellMarketplace() external view returns (address)
```

Returns the address of the `OkenV1SellMarketplace` contract.

| Name | Type    | Description                                     |
| ---- | ------- | ----------------------------------------------- |
| [0]  | address | Address of the `OkenV1SellMarketplace` contract |

### getPlatformFee

```solidity
function getPlatformFee() external view returns (uint256)
```

Returns the platform fee for minting rentable NFTs in WEI.

| Name | Type    | Description         |
| ---- | ------- | ------------------- |
| [0]  | uint256 | Platform fee in WEI |

### setPlatformFee

```solidity
function setPlatformFee(uint256 newFee) external
```

Modifies the platform fee for minting rentable NFTs.

_The transaction will revert if `msg.sender` is not the contract owner._

| Name   | Type    | Description             |
| ------ | ------- | ----------------------- |
| newFee | uint256 | New platform fee in WEI |

### getFeeRecipient

```solidity
function getFeeRecipient() external view returns (address payable)
```

Returns the fee recipient, address who the platform fees are transferred to.

| Name | Type            | Description   |
| ---- | --------------- | ------------- |
| [0]  | address payable | Fee recipient |

### setFeeRecipient

```solidity
function setFeeRecipient(address payable newRecipient) external
```

Modifies the fee recipient, address who the fees are transferred to.

_The transaction will revert if `msg.sender` is not the contract owner._

| Name         | Type            | Description       |
| ------------ | --------------- | ----------------- |
| newRecipient | address payable | New fee recipient |
