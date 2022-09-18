import { assert, expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { network, deployments, ethers } from "hardhat";
import { developmentChains, networkConfig, ZERO_ADDRESS } from "../../../utils/const";
import { OkenV1AddressRegistry } from "../../../typechain-types";

/*
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("OkenV1AddressRegistry unit tests", function () {
      let addressRegistry: OkenV1AddressRegistry, addressRegistryContract: OkenV1AddressRegistry;
      let deployer: Signer, attacker: Signer;

      beforeEach(async () => {
        // get accounts
        const accounts = await ethers.getSigners(); // could also do with getNamedAccounts
        deployer = accounts[0];
        attacker = accounts[1];
        // get deployment
        await deployments.fixture(["addressRegistry"]);
        addressRegistryContract = await ethers.getContract("OkenV1AddressRegistry");
      });

      describe("initial addresses are zero address", () => {
        beforeEach(async () => {
          addressRegistry = addressRegistryContract.connect(deployer);
        });
        it("token registry", async () => {
          const actual = await addressRegistry.getTokenRegistry();
          assert.equal(actual, ZERO_ADDRESS);
        });
        it("rent marketplace", async () => {
          const actual = await addressRegistry.getRentMarketplace();
          assert.equal(actual, ZERO_ADDRESS);
        });
        it("sell marketplace", async () => {
          const actual = await addressRegistry.getSellMarketplace();
          assert.equal(actual, ZERO_ADDRESS);
        });
      });

      describe("only owner allowed to set", () => {
        const randomAddress = "0x31D2f1bBaaab525E7808F8EA6853b1AcF778B184";
        beforeEach(async () => {
          addressRegistry = addressRegistryContract.connect(attacker);
        });
        it("token registry", async () => {
          await expect(addressRegistry.setTokenRegistry(randomAddress)).to.be.revertedWith(
            "Ownable: caller is not the owner"
          );
          const actual = await addressRegistry.getTokenRegistry();
          assert.equal(actual, ZERO_ADDRESS);
        });
        it("rent marketplace", async () => {
          await expect(addressRegistry.setRentMarketplace(randomAddress)).to.be.revertedWith(
            "Ownable: caller is not the owner"
          );
          const actual = await addressRegistry.getRentMarketplace();
          assert.equal(actual, ZERO_ADDRESS);
        });
        it("sell marketplace", async () => {
          await expect(addressRegistry.setSellMarketplace(randomAddress)).to.be.revertedWith(
            "Ownable: caller is not the owner"
          );
          const actual = await addressRegistry.getSellMarketplace();
          assert.equal(actual, ZERO_ADDRESS);
        });
      });

      describe("sets the addresses", () => {
        const randomAddress = "0x31D2f1bBaaab525E7808F8EA6853b1AcF778B184";
        beforeEach(async () => {
          addressRegistry = addressRegistryContract.connect(deployer);
        });
        it("token registry", async () => {
          await addressRegistry.setTokenRegistry(randomAddress);
          const actual = await addressRegistry.getTokenRegistry();
          assert.equal(actual, randomAddress);
        });
        it("rent marketplace", async () => {
          await addressRegistry.setRentMarketplace(randomAddress);
          const actual = await addressRegistry.getRentMarketplace();
          assert.equal(actual, randomAddress);
        });
        it("sell marketplace", async () => {
          await addressRegistry.setSellMarketplace(randomAddress);
          const actual = await addressRegistry.getSellMarketplace();
          assert.equal(actual, randomAddress);
        });
      });

      describe("deployment addresses are correct", () => {
        let rentMarketplaceAddress: string, sellMarketplaceAddress: string;
        beforeEach(async () => {
          await deployments.fixture(["all"]);
          const rentMarketplace = await ethers.getContract("OkenV1RentMarketplace");
          rentMarketplaceAddress = rentMarketplace.address;
          const sellMarketplace = await ethers.getContract("OkenV1SellMarketplace");
          sellMarketplaceAddress = sellMarketplace.address;
        });
        it.skip("token registry", async () => {});
        it.skip("rent marketplace", async () => {
          const actual = await addressRegistry.getRentMarketplace();
          assert.equal(actual, rentMarketplaceAddress);
        });
        it.skip("sell marketplace", async () => {
          const actual = await addressRegistry.getSellMarketplace();
          assert.equal(actual, sellMarketplaceAddress);
        });
      });
    });
*/
