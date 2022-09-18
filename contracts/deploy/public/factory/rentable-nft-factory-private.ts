import {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    networkConfig,
    ZERO_ADDRESS,
} from "../../../utils/const";
import verify from "../../../utils/verify";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployRentableNftFactoryPrivate: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { deployments, getNamedAccounts, network, ethers } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    const chainId = network.config.chainId ? network.config.chainId : 5;
    const config = networkConfig[chainId];
    const args = [
        config.OkenV1RentableNftFactoryPrivate_rentMarketplace || ZERO_ADDRESS,
        config.OkenV1RentableNftFactoryPrivate_sellMarketplace || ZERO_ADDRESS,
        config.OkenV1RentableNftFactoryPrivate_platformFee || ethers.utils.parseEther("0.01"),
        config.OkenV1RentableNftFactoryPrivate_feeRecipient || deployer,
    ];

    const rentableNftFactoryPrivate = await deploy("OkenV1RentableNftFactoryPrivate", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(rentableNftFactoryPrivate.address, args);
    }
};

export default deployRentableNftFactoryPrivate;
deployRentableNftFactoryPrivate.tags = ["publicRentableNftFactoryPrivate", "public"];
