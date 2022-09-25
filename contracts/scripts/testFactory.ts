import { testnetChains, networkConfig, ZERO_ADDRESS } from "../utils/const";
import { ethers, network } from "hardhat";

const testFactory = async (factoryName: string, nftName: string) => {
    if (!testnetChains.includes(network.name)) return;

    // get factory contract
    console.log(`fetching ${factoryName} contract...`);
    const signers = await ethers.getSigners();
    const deployer = signers[0];
    const deployerAddr = await deployer.getAddress();
    const chainId = network.config.chainId || 5;
    // console.log(chainId);
    const factoryAddr = networkConfig[chainId][factoryName] || ZERO_ADDRESS;
    const factory = await ethers.getContractAt(factoryName, factoryAddr);
    console.log(`${factoryName} fetched at address ${factoryAddr}.`);

    // deploy nft contract
    console.log(`Deploying ${nftName} contract...`);
    const name = "dh oau aoigh oau g";
    const symbol = "opoargPI OURO804";
    const mintFee = ethers.utils.parseEther("0");
    const feeRecipient = deployerAddr;
    const deployFee = await factory.getPlatformFee();
    let tx = await factory.deployNftContract(name, symbol, mintFee, feeRecipient, {
        value: deployFee,
    });
    let receipt = await tx.wait();
    const event = receipt.events[receipt.events.length - 1];
    const nftAddress = event.args.nftContract;
    const nft = await ethers.getContractAt("OkenV1RentableNft", nftAddress);
    console.log(`${nftName} deployed at ${nftAddress}`);

    // mint nft
    console.log("Minting NFT...");
    tx = await nft.mint(deployerAddr, "gpiauergpoairjgoairjgaong", { value: mintFee });
    console.log("NFT minted");
};

testFactory("OkenV1RentableNftFactory", "OkenV1RentableNft").catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
