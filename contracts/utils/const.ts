import { BigNumber, ethers } from "ethers";

export interface NetworkConfigItem {
    name: string;
    // address registry
    OkenV1AddressRegistry?: string;
    // token registry
    OkenV1TokenRegistry?: string;
    // rent marketplace
    OkenV1RentMarketplace?: string;
    OkenV1RentMarketplace_platformFee?: BigNumber;
    OkenV1RentMarketplace_feeRecipient?: string;
    // sell marketplace
    OkenV1SellMarketplace?: string;
    OkenV1SellMarketplace_platformFee?: BigNumber;
    OkenV1SellMarketplace_feeRecipient?: string;
    // nft factory
    OkenV1NftFactory?: string;
    OkenV1NftFactory_platformFee?: BigNumber;
    OkenV1NftFactory_feeRecipient?: string;
    // nft factory private
    OkenV1NftFactoryPrivate?: string;
    OkenV1NftFactoryPrivate_platformFee?: BigNumber;
    OkenV1NftFactoryPrivate_feeRecipient?: string;
    // rentable nft factory
    OkenV1RentableNftFactory?: string;
    OkenV1RentableNftFactory_platformFee?: BigNumber;
    OkenV1RentableNftFactory_feeRecipient?: string;
    // rentable nft factory private
    OkenV1RentableNftFactoryPrivate?: string;
    OkenV1RentableNftFactoryPrivate_platformFee?: BigNumber;
    OkenV1RentableNftFactoryPrivate_feeRecipient?: string;
}

export interface NetworkConfigInfo {
    [key: number]: NetworkConfigItem;
}

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const networkConfig: NetworkConfigInfo = {
    31337: {
        name: "localhost",
    },
    5: {
        name: "goerli",
        // address registry
        OkenV1AddressRegistry: ZERO_ADDRESS,
        // token registry
        OkenV1TokenRegistry: ZERO_ADDRESS,
        // rent marketplace
        OkenV1RentMarketplace: ZERO_ADDRESS,
        OkenV1RentMarketplace_platformFee: BigNumber.from("250"),
        OkenV1RentMarketplace_feeRecipient: "0x2d949C8bC0d866783C0a8629208cb9dd2a5d2302",
        // sell marketplace
        OkenV1SellMarketplace: ZERO_ADDRESS,
        OkenV1SellMarketplace_platformFee: BigNumber.from("250"),
        OkenV1SellMarketplace_feeRecipient: "0x2d949C8bC0d866783C0a8629208cb9dd2a5d2302",
        // nft factory
        OkenV1NftFactory: ZERO_ADDRESS,
        OkenV1NftFactory_platformFee: ethers.utils.parseEther("0.01"),
        OkenV1NftFactory_feeRecipient: "0x2d949C8bC0d866783C0a8629208cb9dd2a5d2302",
        // nft factory private
        OkenV1NftFactoryPrivate: ZERO_ADDRESS,
        OkenV1NftFactoryPrivate_platformFee: ethers.utils.parseEther("0.01"),
        OkenV1NftFactoryPrivate_feeRecipient: "0x2d949C8bC0d866783C0a8629208cb9dd2a5d2302",
        // rentable nft factory
        OkenV1RentableNftFactory: "0xCe1776104c88B5c3b063E1f4437fF99e8Fe0a010",
        OkenV1RentableNftFactory_platformFee: ethers.utils.parseEther("0.01"),
        OkenV1RentableNftFactory_feeRecipient: "0x2d949C8bC0d866783C0a8629208cb9dd2a5d2302",
        // rentable nft factory private
        OkenV1RentableNftFactoryPrivate: ZERO_ADDRESS,
        OkenV1RentableNftFactoryPrivate_platformFee: ethers.utils.parseEther("0.01"),
        OkenV1RentableNftFactoryPrivate_feeRecipient: "0x2d949C8bC0d866783C0a8629208cb9dd2a5d2302",
    },
    1: {
        name: "mainnet",
    },
};

export const developmentChains = ["hardhat", "localhost"];
export const testnetChains = ["goerli"];

export const VERIFICATION_BLOCK_CONFIRMATIONS = 6;

export const INTERFACE_ID_ERC721 = "0x80ac58cd";
export const INTERFACE_ID_ERC721_METADATA = "0x5b5e139f";
export const INTERFACE_ID_ERC4907 = "0xad092b5c";
export const ON_ERC721_RECEIVED = "0x150b7a02";
