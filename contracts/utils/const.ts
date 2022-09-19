import { BigNumber, ethers } from "ethers";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export interface NetworkConfigItem {
    name: string;
    OkenV1RentMarketplace_platformFee?: BigNumber;
    OkenV1RentMarketplace_feeRecipient?: string;
    // rentable nft factory
    OkenV1RentableNftFactory_rentMarketplace?: string;
    OkenV1RentableNftFactory_sellMarketplace?: string;
    OkenV1RentableNftFactory_platformFee?: BigNumber;
    OkenV1RentableNftFactory_feeRecipient?: string;
    // rentable nft factory private
    OkenV1RentableNftFactoryPrivate_rentMarketplace?: string;
    OkenV1RentableNftFactoryPrivate_sellMarketplace?: string;
    OkenV1RentableNftFactoryPrivate_platformFee?: BigNumber;
    OkenV1RentableNftFactoryPrivate_feeRecipient?: string;
}

export interface NetworkConfigInfo {
    [key: number]: NetworkConfigItem;
}

export const networkConfig: NetworkConfigInfo = {
    31337: {
        name: "localhost",
    },
    5: {
        name: "goerli",
        OkenV1RentMarketplace_platformFee: BigNumber.from("250"),
        // rentable nft factory
        // OkenV1RentableNftFactory_rentMarketplace: ,
        // OkenV1RentableNftFactory_sellMarketplace: ,
        OkenV1RentableNftFactory_platformFee: ethers.utils.parseEther("0.01"),
        // OkenV1RentableNftFactory_feeRecipient: ,
    },
    1: {
        name: "mainnet",
    },
};

export const developmentChains = ["hardhat", "localhost"];

export const VERIFICATION_BLOCK_CONFIRMATIONS = 6;

export const INTERFACE_ID_ERC721 = "0x80ac58cd";
export const INTERFACE_ID_ERC721_METADATA = "0x5b5e139f";
export const INTERFACE_ID_ERC4907 = "0xad092b5c";
export const ON_ERC721_RECEIVED = "0x150b7a02";
