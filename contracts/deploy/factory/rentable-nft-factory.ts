import {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    networkConfig,
    ZERO_ADDRESS,
} from "../../utils/const";
import verify from "../../utils/verify";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployRentableNftFactory: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, network, ethers } = hre;
    const { deploy } = deployments;
    const signers = await ethers.getSigners();
    const deployer = signers[0];
    const deployerAddr = await deployer.getAddress();
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    const chainId = network.config.chainId ? network.config.chainId : 5;
    const config = networkConfig[chainId];
    const args = [
        config.OkenV1RentMarketplace || ZERO_ADDRESS,
        config.OkenV1SellMarketplace || ZERO_ADDRESS,
        config.OkenV1RentableNftFactory_platformFee || ethers.utils.parseEther("0"),
        config.OkenV1RentableNftFactory_feeRecipient || deployerAddr,
    ];

    const rentableNftFactory = await deploy("OkenV1RentableNftFactory", {
        from: deployerAddr,
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
deployRentableNftFactory.tags = ["rentableNftFactory", "all"];
