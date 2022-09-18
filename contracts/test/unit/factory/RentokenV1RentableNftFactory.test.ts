import { assert, expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { network, deployments, ethers } from "hardhat";
import { developmentChains, networkConfig, ZERO_ADDRESS } from "../../../utils/const";
import { OkenV1RentableNftFactory } from "../../../typechain-types";

/*
!developmentChains.includes(network.name)
  ? describe.skip
  : describe.skip("OkenV1RentableNftFactory unit tests", function () {
      let factory: OkenV1RentableNftFactory, factoryContract: OkenV1RentableNftFactory;
      let deployer: Signer, creator: Signer, minter: Signer;
      let deployerAddr: string, creatorAddr: string, minterAddr: string;
      let chainId: number;

      beforeEach(async () => {
        // get accounts
        const accounts = await ethers.getSigners(); // could also do with getNamedAccounts
        deployer = accounts[0];
        deployerAddr = await deployer.getAddress();
        creator = accounts[1];
        creatorAddr = await creator.getAddress();
        minter = accounts[2];
        minterAddr = await minter.getAddress();
        chainId = network.config.chainId ? network.config.chainId : 31337;
        // get deployment
        await deployments.fixture(["rentable-nft-factory"]);
        factoryContract = await ethers.getContract("OkenV1RentableNftFactory");
      });

      describe("constructor", () => {
        this.beforeEach(async () => {
          factory = factoryContract.connect(creator);
        });
        it("rentMarketplace correct", async () => {
          const expected = networkConfig[chainId]["rentMarketplace"];
          const actual = await factory.getRentMarketplace();
          assert.equal(actual, expected);
        });
        it("sellMarketplace correct", async () => {
          const expected = networkConfig[chainId]["sellMarketplace"];
          const actual = await factory.getSellMarketplace();
          assert.equal(actual, expected);
        });
        it("mintFee correct", async () => {
          const expected = networkConfig[chainId]["mintFee"] || ethers.utils.parseEther("0.01");
          const actual = await factory.getMintFee();
          assert(actual.eq(expected));
        });
        it("feeRecipient correct", async () => {
          const expected = deployerAddr;
          const actual = await factory.getFeeRecipient();
          assert.equal(actual, expected);
        });
        it("platformFee correct", async () => {
          const expected = networkConfig[chainId]["platformFee"] || ethers.utils.parseEther("0.1");
          const actual = await factory.getPlatformFee();
          assert(actual.eq(expected));
        });
      });

      describe("accessors", () => {
        beforeEach(async () => {
          factory = factoryContract.connect(deployer);
        });
        it("setRentMarketplace", async () => {
          const expected = "0xac4D08f220E0688111F1CEFb39f7D657F203e034";
          await factory.setRentMarketplace(expected);
          const actual = await factory.getRentMarketplace();
          assert.equal(actual, expected);
        });
        it("setSellMarketplace", async () => {
          const expected = "0xac4D08f220E0688111F1CEFb39f7D657F203e034";
          await factory.setSellMarketplace(expected);
          const actual = await factory.getSellMarketplace();
          assert.equal(actual, expected);
        });
        it("setMintFee", async () => {
          const expected = ethers.utils.parseEther("0.69237");
          await factory.setMintFee(expected);
          const actual = await factory.getMintFee();
          assert(actual.eq(expected));
        });
        it("setPlatformFee", async () => {
          const expected = ethers.utils.parseEther("0.042684");
          await factory.setPlatformFee(expected);
          const actual = await factory.getPlatformFee();
          assert(actual.eq(expected));
        });
        it("setFeeRecipient", async () => {
          const expected = "0xac4D08f220E0688111F1CEFb39f7D657F203e034";
          await factory.setFeeRecipient(expected);
          const actual = await factory.getFeeRecipient();
          assert.equal(actual, expected);
        });
      });

      describe("accessors only owner", () => {
        beforeEach(async () => {
          factory = factoryContract.connect(creator);
        });
        it("setRentMarketplace only owner", async () => {
          const expected = "0xac4D08f220E0688111F1CEFb39f7D657F203e034";
          await expect(factory.setRentMarketplace(expected)).to.be.revertedWith(
            "Ownable: caller is not the owner"
          );
        });
        it("setSellMarketplace only owner", async () => {
          const expected = "0xac4D08f220E0688111F1CEFb39f7D657F203e034";
          await expect(factory.setSellMarketplace(expected)).to.be.revertedWith(
            "Ownable: caller is not the owner"
          );
        });
        it("setMintFee only owner", async () => {
          const expected = "6792";
          await expect(factory.setMintFee(expected)).to.be.revertedWith(
            "Ownable: caller is not the owner"
          );
        });
        it("setPlatformFee only owner", async () => {
          const expected = "63983";
          await expect(factory.setPlatformFee(expected)).to.be.revertedWith(
            "Ownable: caller is not the owner"
          );
        });
        it("setFeeRecipient only owner", async () => {
          const expected = "0xac4D08f220E0688111F1CEFb39f7D657F203e034";
          await expect(factory.setFeeRecipient(expected)).to.be.revertedWith(
            "Ownable: caller is not the owner"
          );
        });
      });

      describe("createNftContract", () => {
        const name = "Hi there this is our nft contract";
        const symbol = "orgoh";
        let platformFee: BigNumber;
        beforeEach(async () => {
          factory = factoryContract.connect(creator);
          platformFee = await factory.getPlatformFee();
        });
        it("reverts if platform fees not paid", async () => {
          const error = `InsufficientFunds(${platformFee.toString()}, 0)`;
          await expect(factory.createNftContract(name, symbol)).to.be.revertedWith(error);
        });
        it("transfers to fee recipient", async () => {
          const balanceBefore = await deployer.getBalance();
          const balanceAfterExpected = balanceBefore.add(platformFee);
          await factory.createNftContract(name, symbol, { value: platformFee });
          const balanceAfterActual = await deployer.getBalance();
          assert(balanceAfterActual.eq(balanceAfterExpected));
        });
        it("emits ContractCreated event", async () => {
          await expect(
            await factory.createNftContract(name, symbol, { value: platformFee })
          ).to.emit(factory, "ContractCreated");
        });
        it.skip("sets exists to true", async () => {
          await factory.createNftContract(name, symbol, { value: platformFee });
          const events = factory.filters.ContractCreated(creatorAddr);
          console.log(events);
          console.log(factory.address);
          console.log(ethers.utils.id("ContractCreated(address,address)"));
          console.log(creatorAddr);
        });
        it.skip("transfers ownership", async () => {
          await factory.createNftContract(name, symbol, { value: platformFee });
          let emitted = false;
          factory.on("ContractCreated", async (operator: string, contractAddress: string) => {
            emitted = true;
            const nft = await ethers.getContractAt(
              "OkenV1RentableNft",
              contractAddress,
              creator
            );
            const owner = await nft.owner();
            assert.equal(owner, creatorAddr);
          });
          assert(emitted);
        });
        it.skip("returns nft address", async () => {});
      });
    });
*/
