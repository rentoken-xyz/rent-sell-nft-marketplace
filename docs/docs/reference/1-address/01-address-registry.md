---
sidebar_position: 1
---

# OkenV1AddressRegistry

This contract stores the deployment addresses of Oken V1 contracts.

_This contract inherits OpenZeppelin's `Ownable` [contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol)._

## Address

### tokenRegistry

```solidity
function tokenRegistry() external view returns (address)
```

Returns the address of the `OkenV1TokenRegistry` contract.

| Name | Type    | Description                                   |
| ---- | ------- | --------------------------------------------- |
| [0]  | address | Address of the `OkenV1TokenRegistry` contract |

### updateTokenRegistry

```solidity
function updateTokenRegistry(address newTokenRegistry) external
```

Modifies the address of the `OkenV1TokenRegistry` contract.

_This function will revert if `msg.sender` is not the contract owner._

| Name             | Type    | Description                                       |
| ---------------- | ------- | ------------------------------------------------- |
| newTokenRegistry | address | Address of the new `OkenV1TokenRegistry` contract |

## Factory

### nftFactory

```solidity
function nftFactory() external view returns (address)
```

Returns the address of the `OkenV1NftFactory` contract.

| Name | Type    | Description                                |
| ---- | ------- | ------------------------------------------ |
| [0]  | address | Address of the `OkenV1NftFactory` contract |

### updateNftFactory

```solidity
function updateNftFactory(address newNftFactory) external
```

Modifies the address of the `OkenV1NftFactory` contract.

_This function will revert if `msg.sender` is not the contract owner._

| Name          | Type    | Description                                    |
| ------------- | ------- | ---------------------------------------------- |
| newNftFactory | address | Address of the new `OkenV1NftFactory` contract |

### nftFactoryPrivate

```solidity
function nftFactoryPrivate() external view returns (address)
```

Returns the address of the `OkenV1NftFactoryPrivate` contract.

| Name | Type    | Description                                       |
| ---- | ------- | ------------------------------------------------- |
| [0]  | address | Address of the `OkenV1NftFactoryPrivate` contract |

### updateNftFactoryPrivate

```solidity
function updateNftFactoryPrivate(address newNftFactoryPrivate) external
```

Modifies the address of the `OkenV1NftFactoryPrivate` contract.

_This function will revert if `msg.sender` is not the contract owner._

| Name                 | Type    | Description                                           |
| -------------------- | ------- | ----------------------------------------------------- |
| newNftFactoryPrivate | address | Address of the new `OkenV1NftFactoryPrivate` contract |

### rentableNftFactory

```solidity
function rentableNftFactory() external view returns (address)
```

Returns the address of the `OkenV1RentableNftFactory` contract.

| Name | Type    | Description                                        |
| ---- | ------- | -------------------------------------------------- |
| [0]  | address | Address of the `OkenV1RentableNftFactory` contract |

### updateRentableNftFactory

```solidity
function updateRentableNftFactory(address newRentableNftFactory) external
```

Modifies the address of the `OkenV1RentableNftFactory` contract.

_This function will revert if `msg.sender` is not the contract owner._

| Name                  | Type    | Description                                        |
| --------------------- | ------- | -------------------------------------------------- |
| newRentableNftFactory | address | Address of new `OkenV1RentableNftFactory` contract |

### rentableNftFactoryPrivate

```solidity
function rentableNftFactoryPrivate() external view returns (address)
```

Returns the address of the `OkenV1RentableNftFactoryPrivate` contract.

| Name | Type    | Description                                               |
| ---- | ------- | --------------------------------------------------------- |
| [0]  | address | Address of the `OkenV1RentableNftFactoryPrivate` contract |

### updateRentableNftFactoryPrivate

```solidity
function updateRentableNftFactoryPrivate(address newRentableNftFactoryPrivate) external
```

Modifies the address of the `OkenV1RentableNftFactoryPrivate` contract.

_This function will revert if `msg.sender` is not the contract owner._

| Name                         | Type    | Description                                               |
| ---------------------------- | ------- | --------------------------------------------------------- |
| newRentableNftFactoryPrivate | address | Address of new `OkenV1RentableNftFactoryPrivate` contract |

### wrappedNftFactory

```solidity
function wrappedNftFactory() external view returns (address)
```

Returns the address of the `OkenV1WrappedNftFactory` contract.

| Name | Type    | Description                                       |
| ---- | ------- | ------------------------------------------------- |
| [0]  | address | Address of the `OkenV1WrappedNftFactory` contract |

### updateWrappedNftFactory

```solidity
function updateWrappedNftFactory(address newWrappedNftFactory) external
```

Modifies the address of the `OkenV1WrappedNftFactory` contract.

_This function will revert if `msg.sender` is not the contract owner._

| Name                 | Type    | Description                                       |
| -------------------- | ------- | ------------------------------------------------- |
| newWrappedNftFactory | address | Address of new `OkenV1WrappedNftFactory` contract |

## Marketplace

### rentMarketplace

```solidity
function rentMarketplace() external view returns (address)
```

Returns the address of the `OkenV1RentMarketplace` contract.

| Name | Type    | Description                                 |
| ---- | ------- | ------------------------------------------- |
| [0]  | address | Address of `OkenV1RentMarketplace` contract |

### updateRentMarketplace

```solidity
function updateRentMarketplace(address newRentMarketplace) external
```

Modifies the address of the `OkenV1RentMarketplace` contract.

_This function will revert if `msg.sender` is not the contract owner._

| Name               | Type    | Description                                     |
| ------------------ | ------- | ----------------------------------------------- |
| newRentMarketplace | address | Address of new `OkenV1RentMarketplace` contract |

### sellMarketplace

```solidity
function sellMarketplace() external view returns (address)
```

Returns the address of the `OkenV1SellMarketplace` contract.

| Name | Type    | Description                                     |
| ---- | ------- | ----------------------------------------------- |
| [0]  | address | Address of the `OkenV1SellMarketplace` contract |

### updateSellMarketplace

```solidity
function updateSellMarketplace(address newSellMarketplace) external
```

Modifies the address of the `OkenV1SellMarketplace` contract.

_This function will revert if `msg.sender` is not the contract owner._

| Name               | Type    | Description                                     |
| ------------------ | ------- | ----------------------------------------------- |
| newSellMarketplace | address | Address of new `OkenV1SellMarketplace` contract |
