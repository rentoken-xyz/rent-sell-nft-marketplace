import {
    developmentChains,
    networkConfig,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    ZERO_ADDRESS,
} from "../utils/const";
import verify from "../utils/verify";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { BigNumber } from "ethers";

const deployPublic: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, network, getNamedAccounts } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;
    const chainId = network.config.chainId ? network.config.chainId : 5;

    //--------------------------------- address registry
    // arguments
    const argsAddressRegistry: [] = [];
    // deploy
    const addressRegistry = await deploy("OkenV1AddressRegistry", {
        from: deployer,
        args: argsAddressRegistry,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });
    // verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(addressRegistry.address, argsAddressRegistry);
    }

    //--------------------------------- token registry

    //--------------------------------- rent marketplace
    // arguments
    const argsRentMarketplace: [BigNumber, string] = [
        networkConfig[chainId]["OkenV1RentMarketplace_platformFee"] || BigNumber.from("0"),
        networkConfig[chainId]["OkenV1RentMarketplace_feeRecipient"] || deployer,
    ];
    // deploy
    const rentMarketplace = await deploy("OkenV1RentMarketplace", {
        from: deployer,
        args: argsRentMarketplace,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });
    // verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(rentMarketplace.address, argsRentMarketplace);
    }

    //--------------------------------- sell marketplace

    //--------------------------------- nft factory

    //--------------------------------- rentable nft factory
    // arguments
    const argsRentableNftFactory: [string, string, BigNumber, string] = [
        rentMarketplace.address,
        ZERO_ADDRESS,
        BigNumber.from(0),
        deployer,
    ];
    // deploy
    const rentableNftFactory = await deploy("OkenV1RentableNftFactory", {
        from: deployer,
        args: argsRentableNftFactory,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });
    // verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(rentableNftFactory.address, argsRentableNftFactory);
    }

    //--------------------------------- wrapped nft factory

    //--------------------------------- update address registry
};

export default deployPublic;
deployPublic.tags = ["public"];
