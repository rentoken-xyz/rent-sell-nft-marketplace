import { assert, expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { network, deployments, ethers } from "hardhat";
import { developmentChains, networkConfig, ZERO_ADDRESS } from "../../../utils/const";
import { OkenV1Nft, OkenV1SellMarketplace } from "../../../typechain-types";

/*
!developmentChains.includes(network.name)
  ? describe.skip
  : describe.skip("OkenV1SellMarketplace unit tests", function () {
      let marketplace: OkenV1SellMarketplace, marketplaceContract: OkenV1SellMarketplace;
      let nft: OkenV1Nft;
      let tokenId: BigNumber;
      let deployer: Signer, seller: Signer, buyer: Signer;
      let deployerAddr: string, sellerAddr: string, buyerAddr: string;
      let chainId: number;

      beforeEach(async () => {
        // get accounts
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        deployerAddr = await deployer.getAddress();
        seller = accounts[1];
        sellerAddr = await seller.getAddress();
        buyer = accounts[2];
        buyerAddr = await buyer.getAddress();
        chainId = network.config.chainId ? network.config.chainId : 31337;
        // get deployment
        await deployments.fixture(["sellMarketplace", "nft"]);
        marketplaceContract = await ethers.getContract("OkenV1SellMarketplace");
        nft = await ethers.getContract("OkenV1Nft", seller);
        tokenId = await nft.getTokenCounter();
        await nft.mintNft(sellerAddr, "");
      });

      describe("constructor", () => {
        beforeEach(async () => {
          marketplace = marketplaceContract.connect(deployer);
        });
        it.skip("sets address registry", async () => {
          await deployments.fixture(["addressRegistry"]);
          const addressRegistry = await ethers.getContract("OkenV1AddressRegistry");
          const expected = addressRegistry.address;
          const actual = await marketplace.getAddressRegistry();
          assert.equal(actual, expected);
        });
        it("sets platform fee", async () => {
          const expected = networkConfig[chainId]["sellFee"] || BigNumber.from("0");
          const actual = await marketplace.getPlatformFee();
          assert(expected.eq(actual));
        });
        it("sets fee recipient", async () => {
          const actual = await marketplace.getFeeRecipient();
          assert.equal(actual, deployerAddr);
        });
      });
      describe("listItem()", () => {
        beforeEach(async () => {
          marketplace = marketplaceContract.connect(seller);
        });
      });
    });
*/
