import {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    networkConfig,
    ZERO_ADDRESS,
} from "../../../utils/const";
import verify from "../../../utils/verify";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployRentableNftFactory: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, network, ethers } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    const chainId = network.config.chainId ? network.config.chainId : 5;
    const config = networkConfig[chainId];
    const args = [
        config.OkenV1RentableNftFactory_rentMarketplace || ZERO_ADDRESS,
        config.OkenV1RentableNftFactory_sellMarketplace || ZERO_ADDRESS,
        config.OkenV1RentableNftFactory_platformFee || ethers.utils.parseEther("0.01"),
        config.OkenV1RentableNftFactory_feeRecipient || deployer,
    ];

    const rentableNftFactory = await deploy("OkenV1RentableNftFactory", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(rentableNftFactory.address, args);
    }
};

export default deployRentableNftFactory;
deployRentableNftFactory.tags = ["publicRentableNftFactory", "public"];
