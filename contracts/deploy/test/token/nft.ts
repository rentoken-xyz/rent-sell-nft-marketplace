import { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } from "../../../utils/const";
import verify from "../../../utils/verify";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { BigNumber, utils } from "ethers";

export const NAME = "This is a test name for a test nft";
export const SYMBOL = "TIATNFATNFT";
export const RENT_MARKETPLACE = "0x24dB0b6cBEcFbAABDE6FCd3951C43C3E6f41B8cD";
export const SELL_MARKETPLACE = "0x3931100307e589FCa4FEb4337cFEEC02ada358a9";
export const PLATFORM_FEE = utils.parseEther("0.0235679327");

const deployNft: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, network, ethers } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    // arguments
    const args: [string, string, string, string, BigNumber, string] = [
        NAME,
        SYMBOL,
        RENT_MARKETPLACE,
        SELL_MARKETPLACE,
        PLATFORM_FEE,
        deployer,
    ];

    // deploy
    const nft = await deploy("OkenV1Nft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });

    // verify deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(nft.address, args);
    }
};

export default deployNft;
deployNft.tags = ["testNft", "test"];
