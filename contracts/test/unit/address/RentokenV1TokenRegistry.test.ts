import { Provider } from "@ethersproject/abstract-provider";
import { assert, expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { network, deployments, ethers } from "hardhat";
import { developmentChains, networkConfig } from "../../../utils/const";
import { OkenV1TokenRegistry } from "../../../typechain-types";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe.skip("OkenV1TokenRegistry unit tests", function () {
      let rentokenV1TokenRegistry: OkenV1TokenRegistry;
      let deployer: Signer, deployerAddr: string;
      const token = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

      beforeEach(async () => {
        const accounts = await ethers.getSigners(); // could also do with getNamedAccounts
        deployer = accounts[0];
        deployerAddr = await deployer.getAddress();
        await deployments.fixture(["OkenV1TokenRegistry"]);
        rentokenV1TokenRegistry = await ethers.getContract("OkenV1TokenRegistry");
      });

      it("emits an event when token added", async () => {
        await expect(rentokenV1TokenRegistry.add(token)).to.emit(
          rentokenV1TokenRegistry,
          "TokenAdded"
        );
      });
      it("adds a token", async () => {
        const enabledBefore = await rentokenV1TokenRegistry.enabled(token);
        assert(!enabledBefore);
        await rentokenV1TokenRegistry.add(token);
        const enabledAfter = await rentokenV1TokenRegistry.enabled(token);
        assert(enabledAfter);
      });
      it("reverts if token already enabled", async () => {
        const error = `AlreadyEnabled("${token}")`;
        await rentokenV1TokenRegistry.add(token);
        await expect(rentokenV1TokenRegistry.add(token)).to.be.revertedWith(error);
      });
      it("emits an event when token removed", async () => {
        await rentokenV1TokenRegistry.add(token);
        await expect(rentokenV1TokenRegistry.remove(token)).to.emit(
          rentokenV1TokenRegistry,
          "TokenRemoved"
        );
      });
      it("removes a token", async () => {
        await rentokenV1TokenRegistry.add(token);
        await rentokenV1TokenRegistry.remove(token);
        const enabled = await rentokenV1TokenRegistry.enabled(token);
        assert(!enabled);
      });
      it("reverts if token not enabled", async () => {
        const error = `NotEnabled("${token}")`;
        await expect(rentokenV1TokenRegistry.remove(token)).to.be.revertedWith(error);
      });
    });
