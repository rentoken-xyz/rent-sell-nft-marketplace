import { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } from "../../../utils/const";
import verify from "../../../utils/verify";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployAddressRegistry: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, network } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    const args: [] = [];
    const addressRegistry = await deploy("OkenV1AddressRegistry", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(addressRegistry.address, args);
    }
};

export default deployAddressRegistry;
deployAddressRegistry.tags = ["test", "testAddressRegistry"];
