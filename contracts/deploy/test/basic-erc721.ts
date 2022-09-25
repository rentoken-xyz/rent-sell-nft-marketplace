import { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } from "../../utils/const";
import verify from "../../utils/verify";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployBasicERC721: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, network } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    const args: any[] = [];
    const basicERC721 = await deploy("BasicERC721", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(basicERC721.address, args);
    }
};

export default deployBasicERC721;
deployBasicERC721.tags = ["basicERC721", "test"];
