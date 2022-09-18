import { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } from "../../../utils/const";
import verify from "../../../utils/verify";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { BigNumber } from "ethers";

export const RENT_FEE = BigNumber.from("250");

const deployRentMarketplace: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, network, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    const args: [BigNumber, string] = [RENT_FEE, deployer];
    const rentMarketplace = await deploy("OkenV1RentMarketplace", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(rentMarketplace.address, args);
    }
};

export default deployRentMarketplace;
deployRentMarketplace.tags = ["test", "testRentMarketplace"];
