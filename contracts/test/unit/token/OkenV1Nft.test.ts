import { assert, expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { network, deployments, ethers } from "hardhat";
import {
  developmentChains,
  INTERFACE_ID_ERC721,
  INTERFACE_ID_ERC721_METADATA,
  ZERO_ADDRESS,
} from "../../../utils/const";
import { OkenV1Nft } from "../../../typechain-types";
import {
  NAME,
  SYMBOL,
  RENT_MARKETPLACE,
  SELL_MARKETPLACE,
  PLATFORM_FEE,
} from "../../../deploy/token/nft";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("OkenV1Nft unit tests", function () {
      let nft: OkenV1Nft, nftContract: OkenV1Nft;
      let deployer: Signer, minter: Signer;
      let deployerAddr: string, minterAddr: string;

      beforeEach(async () => {
        // get accounts
        const accounts = await ethers.getSigners(); // could also do with getNamedAccounts
        deployer = accounts[0];
        minter = accounts[1];
        deployerAddr = await deployer.getAddress();
        minterAddr = await minter.getAddress();
        // get deployment
        await deployments.fixture(["nft"]);
        nftContract = await ethers.getContract("OkenV1Nft");
      });

      describe("constructor()", () => {
        beforeEach(async () => {
          nft = nftContract.connect(minter);
        });
        it("sets name", async () => {
          const expected = NAME;
          const actual = await nft.name();
          assert.equal(actual, expected);
        });
        it("sets symbol", async () => {
          const expected = SYMBOL;
          const actual = await nft.symbol();
          assert.equal(actual, expected);
        });
        it("sets token counter to zero", async () => {
          const expected = BigNumber.from(0);
          const actual = await nft.getTokenCounter();
          assert(actual.eq(expected));
        });
        it("sets rent marketplace", async () => {
          const expected = RENT_MARKETPLACE;
          const actual = await nft.getRentMarketplace();
          assert.equal(actual, expected);
        });
        it("sets sell marketplace", async () => {
          const expected = SELL_MARKETPLACE;
          const actual = await nft.getSellMarketplace();
          assert.equal(actual, expected);
        });
        it("sets platform fee", async () => {
          const expected = PLATFORM_FEE;
          const actual = await nft.getPlatformFee();
          assert(actual.eq(expected));
        });
        it("sets fee recipient", async () => {
          const expected = deployerAddr;
          const actual = await nft.getFeeRecipient();
          assert.equal(actual, expected);
        });
        it("sets owner", async () => {
          const expected = deployerAddr;
          const actual = await nft.owner();
          assert.equal(actual, expected);
        });
      });

      describe("mintNft()", () => {
        let platformFee: BigNumber;
        beforeEach(async () => {
          nft = nftContract.connect(minter);
          platformFee = await nft.getPlatformFee();
        });
        it("reverts if fee not paid", async () => {
          const value = PLATFORM_FEE.sub(1);
          const error = `InsufficientFunds(${platformFee.toString()}, ${value.toString()})`;
          await expect(nft.mintNft(minterAddr, "", { value: value })).to.be.revertedWith(error);
        });
        it("transfers fees to recipient", async () => {
          const balanceBefore = await deployer.getBalance();
          const expected = balanceBefore.add(platformFee);
          await nft.mintNft(minterAddr, "", { value: platformFee });
          const actual = await deployer.getBalance();
          assert(actual.eq(expected));
        });
        it("increments token counter", async () => {
          let expected = await nft.getTokenCounter();
          await nft.mintNft(minterAddr, "", { value: platformFee });
          const actual = await nft.getTokenCounter();
          assert(actual.eq(expected.add(1)));
        });
        it("sets ownerOf", async () => {
          const tokenId = await nft.getTokenCounter();
          await nft.mintNft(minterAddr, "", { value: platformFee });
          const owner = await nft.ownerOf(tokenId);
          assert.equal(owner, minterAddr);
        });
        it("sets uri", async () => {
          const expected = "this is a test uri";
          const tokenId = await nft.getTokenCounter();
          await nft.mintNft(minterAddr, expected, { value: platformFee });
          const actual = await nft.tokenURI(tokenId);
          assert.equal(actual, expected);
        });
        it("emits an event", async () => {
          await expect(nft.mintNft(minterAddr, "", { value: platformFee })).to.emit(
            nft,
            "NftMinted"
          );
        });
        it.skip("can handle reentrancy attacks", async () => {});
        it("can handle large uri", async () => {
          const uri =
            "https://imgs.search.brave.com/eaREZN67TmqxtEh0JhUK7sSvvpHXLsm41tsba3yVpIo/rs:fit:1024:1024:1/g:ce/aHR0cHM6Ly9jb250/ZW50LmNyeXB0b25l/d3MuY29tLmF1L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIxLzA0/L2Nyd3djd3JxY2h4/LnBuZw";
          const uriExpected = uri.concat(uri).concat(uri).concat(uri);
          const tokenId = await nft.getTokenCounter();
          await nft.mintNft(minterAddr, uriExpected, { value: platformFee });
          const uriActual = await nft.tokenURI(tokenId);
          assert.equal(uriActual, uriExpected);
        });
        it("reverts if minting to zero address", async () => {
          const error = "ERC721: mint to the zero address";
          await expect(nft.mintNft(ZERO_ADDRESS, "", { value: platformFee })).to.be.revertedWith(
            error
          );
        });
        it("token is ERC721", async () => {
          const supports = await nft.supportsInterface(INTERFACE_ID_ERC721);
          assert(supports);
        });
        it("token is ERC721Metadata", async () => {
          const supports = await nft.supportsInterface(INTERFACE_ID_ERC721_METADATA);
          assert(supports);
        });
      });

      describe("burn()", () => {
        let tokenId: BigNumber;
        beforeEach(async () => {
          nft = nftContract.connect(minter);
          tokenId = await nft.getTokenCounter();
          const platformFee = await nft.getPlatformFee();
          await nft.mintNft(minterAddr, "", { value: platformFee });
        });
        it("reverts if sender not approved nor owner", async () => {
          nft = nftContract.connect(deployer);
          const error = `NotOwnerNorApproved("${deployerAddr}")`;
          await expect(nft.burnNft(tokenId)).to.be.revertedWith(error);
        });
        it("burns token if owner", async () => {
          let exists = await nft.getExists(tokenId);
          assert(exists);
          await nft.burnNft(tokenId);
          exists = await nft.getExists(tokenId);
          assert(!exists);
        });
        it("burns token if approved", async () => {
          await nft.approve(deployerAddr, tokenId);
          nft = nftContract.connect(deployer);
          let exists = await nft.getExists(tokenId);
          assert(exists);
          await nft.burnNft(tokenId);
          exists = await nft.getExists(tokenId);
          assert(!exists);
        });
        it("burns token if approved for all", async () => {
          await nft.setApprovalForAll(deployerAddr, true);
          nft = nftContract.connect(deployer);
          let exists = await nft.getExists(tokenId);
          assert(exists);
          await nft.burnNft(tokenId);
          exists = await nft.getExists(tokenId);
          assert(!exists);
        });
        it("emits an event", async () => {
          await expect(nft.burnNft(tokenId)).to.emit(nft, "NftBurned");
        });
      });

      describe("isApproved()", () => {
        let platformFee: BigNumber;
        let tokenId: BigNumber;
        const randomAddr = "0x39f6a6c85d39d5abad8a398310c52e7c374f2ba3";
        beforeEach(async () => {
          nft = nftContract.connect(minter);
          platformFee = await nft.getPlatformFee();
          tokenId = await nft.getTokenCounter();
          await nft.mintNft(minterAddr, "", { value: platformFee });
        });
        it("returns true if approved for all", async () => {
          let approved = await nft.isApproved(tokenId, randomAddr);
          assert(!approved);
          await nft.setApprovalForAll(randomAddr, true);
          approved = await nft.isApproved(tokenId, randomAddr);
          assert(approved);
        });
        it("returns true if is approved", async () => {
          let approved = await nft.isApproved(tokenId, randomAddr);
          assert(!approved);
          await nft.approve(randomAddr, tokenId);
          approved = await nft.isApproved(tokenId, randomAddr);
          assert(approved);
        });
      });

      describe("isApprovedForAll()", () => {
        beforeEach(async () => {
          nft = nftContract.connect(minter);
        });
        it("returns true for rent marketplace", async () => {
          const approved = await nft.isApprovedForAll(minterAddr, RENT_MARKETPLACE);
          assert(approved);
        });
        it("returns true for sell marketplace", async () => {
          const approved = await nft.isApprovedForAll(minterAddr, SELL_MARKETPLACE);
          assert(approved);
        });
        it("approves for all", async () => {
          const randomAddress = "0x39F6a6C85d39d5ABAd8A398310c52E7c374F2bA3";
          let approved = await nft.isApprovedForAll(minterAddr, randomAddress);
          assert(!approved);
          await nft.setApprovalForAll(randomAddress, true);
          approved = await nft.isApprovedForAll(minterAddr, randomAddress);
          assert(approved);
          await nft.setApprovalForAll(randomAddress, false);
          approved = await nft.isApprovedForAll(minterAddr, randomAddress);
          assert(!approved);
        });
      });

      describe("setPlatformFee", () => {
        const newFee = ethers.utils.parseEther("0.0349547560246");
        beforeEach(() => {
          nft = nftContract.connect(deployer);
        });
        it("sets platform fee", async () => {
          await nft.setPlatformFee(newFee);
          const feeActual = await nft.getPlatformFee();
          assert(feeActual.eq(newFee));
        });
        it("emits an event", async () => {
          await expect(nft.setPlatformFee(newFee)).to.emit(nft, "PlatformFeeUpdated");
        });
        it("reverts if sender not owner", async () => {
          nft = nftContract.connect(minter);
          const feeExpected = await nft.getPlatformFee();
          await expect(nft.setPlatformFee(newFee)).to.be.revertedWith(
            "Ownable: caller is not the owner"
          );
          const feeActual = await nft.getPlatformFee();
          assert(feeActual.eq(feeExpected));
        });
      });

      describe("setFeeRecipient", () => {
        const newFeeRecipient = "0xf50814D1E060Ef124f052f6C7Df8a2a0Aadadd83";
        beforeEach(async () => {
          nft = nftContract.connect(deployer);
        });
        it("sets fee recipient", async () => {
          await nft.setFeeRecipient(newFeeRecipient);
          const recipientActual = await nft.getFeeRecipient();
          assert.equal(recipientActual, newFeeRecipient);
        });
        it("emits an event", async () => {
          await expect(nft.setFeeRecipient(newFeeRecipient)).to.emit(nft, "FeeRecipientUpdated");
        });
        it("reverts if sender not owner", async () => {
          nft = nftContract.connect(minter);
          const recipientExpected = await nft.getFeeRecipient();
          await expect(nft.setFeeRecipient(newFeeRecipient)).to.be.revertedWith(
            "Ownable: caller is not the owner"
          );
          const recipientActual = await nft.getFeeRecipient();
          assert.equal(recipientActual, recipientExpected);
        });
      });
    });
