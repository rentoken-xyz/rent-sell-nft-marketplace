import { assert, expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { network, deployments, ethers } from "hardhat";
import { developmentChains, ON_ERC721_RECEIVED, ZERO_ADDRESS } from "../../../utils/const";
import { BasicERC4907, BasicERC721, OkenV1RentMarketplace } from "../../../typechain-types";
import { RENT_FEE } from "../../../deploy/marketplace/rent-marketplace";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("OkenV1RentMarketplace unit tests", function () {
      let marketplace: OkenV1RentMarketplace, marketplaceContract: OkenV1RentMarketplace;
      let nft: BasicERC4907;
      let tokenId: BigNumber;
      let deployer: Signer, lessor: Signer, renter: Signer;
      let deployerAddr: string, lessorAddr: string, renterAddr: string;
      // let chainId: number;

      beforeEach(async () => {
        // get accounts
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        deployerAddr = await deployer.getAddress();
        lessor = accounts[1];
        lessorAddr = await lessor.getAddress();
        renter = accounts[2];
        renterAddr = await renter.getAddress();
        // chainId = network.config.chainId ? network.config.chainId : 31337;
        // get deployment
        await deployments.fixture(["rentMarketplace", "basicERC4907"]);
        marketplaceContract = await ethers.getContract("OkenV1RentMarketplace");
        nft = await ethers.getContract("BasicERC4907", lessor);
        tokenId = await nft.tokenCounter();
        await nft.mint();
        await nft.approve(marketplaceContract.address, tokenId);
      });

      describe("constructor()", () => {
        beforeEach(async () => {
          marketplace = marketplaceContract.connect(deployer);
        });
        it("sets platform fee", async () => {
          const actual = await marketplace.getPlatformFee();
          assert(RENT_FEE.eq(actual));
        });
        it("sets fee recipient", async () => {
          const actual = await marketplace.getFeeRecipient();
          assert.equal(actual, deployerAddr);
        });
      });

      describe("receive() and fallback()", () => {
        this.beforeEach(async () => {
          marketplace = marketplaceContract.connect(deployer);
        });
        it("receive()", async () => {
          const proceedsBefore = await marketplace.getProceeds(renterAddr, ZERO_ADDRESS);
          assert(proceedsBefore.eq(0));
          const amount = ethers.utils.parseEther("0.26359");
          await renter.sendTransaction({
            to: marketplaceContract.address,
            value: amount,
          });
          const proceedsAfter = await marketplace.getProceeds(renterAddr, ZERO_ADDRESS);
          assert(proceedsAfter.eq(amount));
        });
        it("callback()", async () => {
          const data = "0x285642039562837565";
          const error = `InvalidCall("${data}")`;
          await expect(
            renter.sendTransaction({
              to: marketplaceContract.address,
              value: "1",
              data: data,
            })
          ).to.be.revertedWith(error);
        });
      });

      describe("setters", () => {
        beforeEach(async () => {
          marketplace = marketplaceContract.connect(deployer);
        });
        it("sets platform fee", async () => {
          const expectedFee = 2382;
          await marketplace.setPlatformFee(expectedFee);
          const actualFee: number = await marketplace.getPlatformFee();
          assert.equal(actualFee, expectedFee);
        });
        it("sets fee recipient", async () => {
          const expectedFeeRecipient = renterAddr;
          await marketplace.setFeeRecipient(expectedFeeRecipient);
          const actualFeeRecipient = await marketplace.getFeeRecipient();
          assert.equal(actualFeeRecipient, expectedFeeRecipient);
        });
        it("reverts if non owner tries setting platform fee", async () => {
          marketplace = marketplaceContract.connect(lessor);
          const error = "Ownable: caller is not the owner";
          await expect(marketplace.setPlatformFee(3283)).to.be.revertedWith(error);
        });
        it("reverts if non owner tries setting fee recipient", async () => {
          marketplace = marketplaceContract.connect(lessor);
          const error = "Ownable: caller is not the owner";
          await expect(marketplace.setFeeRecipient(lessorAddr)).to.be.revertedWith(error);
        });
      });

      describe("listItem()", () => {
        let expires: BigNumber;
        let pricePerSecond: BigNumber;
        let payToken: string;
        let rentalPeriod: number;
        beforeEach(async () => {
          marketplace = marketplaceContract.connect(lessor);
          const currentTime = Math.round(new Date().getTime() / 1000);
          rentalPeriod = 27956;
          expires = BigNumber.from(currentTime + rentalPeriod);
          pricePerSecond = BigNumber.from("123456789");
          payToken = ZERO_ADDRESS;
        });
        it("reverts if sender is not owner", async () => {
          marketplace = marketplaceContract.connect(deployer);
          const error = `NotOwner("${deployerAddr}")`;
          await expect(
            marketplace.listItem(nft.address, tokenId, expires, pricePerSecond, payToken)
          ).to.be.revertedWith(error);
        });
        it("reverts if item is already listed", async () => {
          const error = `AlreadyListed("${nft.address}", ${tokenId})`;
          await marketplace.listItem(nft.address, tokenId, expires, pricePerSecond, payToken);
          await expect(
            marketplace.listItem(nft.address, tokenId, expires, pricePerSecond, payToken)
          ).to.be.revertedWith(error);
        });
        // it("reverts if not ERC4907", async () => {
        //   await deployments.fixture(["basicERC721"]);
        //   const erc721: BasicERC721 = await ethers.getContract("BasicERC721", lessor);
        //   tokenId = await erc721.tokenCounter();
        //   await erc721.mint();
        //   await erc721.approve(marketplaceContract.address, tokenId);
        //   const error = `InvalidNftAddress("${erc721.address}")`;
        //   await expect(
        //     marketplace.listItem(erc721.address, tokenId, expires, pricePerSecond, payToken)
        //   ).to.be.revertedWith(error);
        // });
        it("reverts if marketplace is neither approved for token nor approved for all", async () => {
          await nft.approve(ZERO_ADDRESS, tokenId);
          await nft.setApprovalForAll(marketplaceContract.address, false);
          const error = `NotApproved("${nft.address}", ${tokenId})`;
          await expect(
            marketplace.listItem(nft.address, tokenId, expires, pricePerSecond, payToken)
          ).to.be.revertedWith(error);
        });
        it("reverts if expires is before `block.timestamp`", async () => {
          expires = expires.sub(rentalPeriod).sub(10);
          const error = `InvalidExpires(${expires.toString()})`;
          await expect(
            marketplace.listItem(nft.address, tokenId, expires, pricePerSecond, payToken)
          ).to.be.revertedWith(error);
        });
        it("reverts if price is zero", async () => {
          pricePerSecond = BigNumber.from("0");
          const error = `InvalidAmount(${pricePerSecond.toString()})`;
          await expect(
            marketplace.listItem(nft.address, tokenId, expires, pricePerSecond, payToken)
          ).to.be.revertedWith(error);
        });
        it("reverts if pay token is not authorized", async () => {
          payToken = renterAddr;
          const error = `InvalidPayToken("${renterAddr}")`;
          await expect(
            marketplace.listItem(nft.address, tokenId, expires, pricePerSecond, payToken)
          ).to.be.revertedWith(error);
        });
        it("updates listing if approved", async () => {
          await nft.approve(marketplaceContract.address, tokenId);
          await nft.setApprovalForAll(marketplaceContract.address, false);
          await marketplace.listItem(nft.address, tokenId, expires, pricePerSecond, payToken);
          const listing = await marketplace.getListing(nft.address, tokenId);
          assert.equal(listing.owner, lessorAddr);
          assert(listing.expires.eq(expires));
          assert(listing.pricePerSecond.eq(pricePerSecond));
          assert.equal(listing.payToken, ZERO_ADDRESS);
        });
        it("updates listing if approved for all", async () => {
          await nft.approve(ZERO_ADDRESS, tokenId);
          await nft.setApprovalForAll(marketplaceContract.address, true);
          await marketplace.listItem(nft.address, tokenId, expires, pricePerSecond, payToken);
          const listing = await marketplace.getListing(nft.address, tokenId);
          assert.equal(listing.owner, lessorAddr);
          assert(listing.expires.eq(expires));
          assert(listing.pricePerSecond.eq(pricePerSecond));
          assert.equal(listing.payToken, ZERO_ADDRESS);
        });
        it("emits `ItemListed` event", async () => {
          expect(
            await marketplace.listItem(nft.address, tokenId, expires, pricePerSecond, payToken)
          ).to.emit("marketplace", "ItemListed");
        });
      });

      describe("updateListing()", () => {
        let expiresBefore: BigNumber, pricePerSecondBefore: BigNumber, payTokenBefore: string;
        let expiresAfter: BigNumber, pricePerSecondAfter: BigNumber, payTokenAfter: string;
        let rentalPeriodBefore: number, rentalPeriodAfter: number;
        beforeEach(async () => {
          marketplace = marketplaceContract.connect(lessor);
          const currentTime = Math.round(new Date().getTime() / 1000);
          rentalPeriodBefore = 129;
          expiresBefore = BigNumber.from(currentTime + rentalPeriodBefore);
          pricePerSecondBefore = BigNumber.from("2974563247");
          payTokenBefore = ZERO_ADDRESS;
          await marketplace.listItem(
            nft.address,
            tokenId,
            expiresBefore,
            pricePerSecondBefore,
            payTokenBefore
          );
          rentalPeriodAfter = 67;
          expiresAfter = BigNumber.from(currentTime + rentalPeriodAfter);
          pricePerSecondAfter = BigNumber.from("29765027652876");
          payTokenAfter = ZERO_ADDRESS;
        });
        it("reverts if item is not listed", async () => {
          tokenId = await nft.tokenCounter();
          await nft.mint();
          const error = `NotListed("${nft.address}", ${tokenId})`;
          await expect(
            marketplace.updateListing(
              nft.address,
              tokenId,
              expiresAfter,
              pricePerSecondAfter,
              payTokenAfter
            )
          ).to.be.revertedWith(error);
        });
        it("reverts if sender is not owner", async () => {
          marketplace = marketplaceContract.connect(renter);
          const error = `NotOwner("${renterAddr}")`;
          await expect(
            marketplace.updateListing(
              nft.address,
              tokenId,
              expiresAfter,
              pricePerSecondAfter,
              payTokenAfter
            )
          ).to.be.revertedWith(error);
        });
        it("reverts if expires is before now", async () => {
          expiresAfter = expiresAfter.sub(rentalPeriodAfter).sub(10);
          const error = `InvalidExpires(${expiresAfter.toString()})`;
          await expect(
            marketplace.updateListing(
              nft.address,
              tokenId,
              expiresAfter,
              pricePerSecondAfter,
              payTokenAfter
            )
          ).to.be.revertedWith(error);
        });
        it("reverts if price per second is zero", async () => {
          pricePerSecondAfter = BigNumber.from(0);
          const error = `InvalidAmount(${pricePerSecondAfter.toString()})`;
          await expect(
            marketplace.updateListing(
              nft.address,
              tokenId,
              expiresAfter,
              pricePerSecondAfter,
              payTokenAfter
            )
          ).to.be.revertedWith(error);
        });
        it("reverts if pay token is invalid", async () => {
          payTokenAfter = nft.address;
          const error = `InvalidPayToken("${payTokenAfter}")`;
          await expect(
            marketplace.updateListing(
              nft.address,
              tokenId,
              expiresAfter,
              pricePerSecondAfter,
              payTokenAfter
            )
          ).to.be.revertedWith(error);
        });
        it("updates listing", async () => {
          await marketplace.updateListing(
            nft.address,
            tokenId,
            expiresAfter,
            pricePerSecondAfter,
            payTokenAfter
          );
          const listing = await marketplace.getListing(nft.address, tokenId);
          assert.equal(listing.owner, await nft.ownerOf(tokenId));
          assert(listing.expires.eq(expiresAfter));
          assert(listing.pricePerSecond.eq(pricePerSecondAfter));
          assert.equal(listing.payToken, payTokenAfter);
        });
        it("emits a `ItemUpdated` event", async () => {
          expect(
            await marketplace.updateListing(
              nft.address,
              tokenId,
              expiresAfter,
              pricePerSecondAfter,
              payTokenAfter
            )
          ).to.emit(marketplace, "ItemUpdated");
        });
      });

      describe("rentItem()", () => {
        let expires: BigNumber;
        let pricePerSecond: BigNumber;
        let price: BigNumber;
        let payToken: string;
        let rentalPeriod: number;
        beforeEach(async () => {
          marketplace = marketplaceContract.connect(lessor);
          const currentTime = Math.round(new Date().getTime() / 1000);
          rentalPeriod = 27956;
          expires = BigNumber.from(currentTime + rentalPeriod);
          pricePerSecond = BigNumber.from("123456789");
          price = pricePerSecond.mul(rentalPeriod + 1);
          payToken = ZERO_ADDRESS;
          await marketplace.listItem(nft.address, tokenId, expires, pricePerSecond, payToken);
          marketplace = marketplaceContract.connect(renter);
        });
        it("reverts if item is not listed", async () => {
          tokenId = await nft.tokenCounter();
          await nft.mint();
          const error = `NotListed("${nft.address}", ${tokenId})`;
          await expect(
            marketplace.rentItem(nft.address, tokenId, expires, payToken, { value: price })
          ).to.be.revertedWith(error);
        });
        it("reverts if item is already being rented", async () => {
          const error = `CurrentlyRented("${nft.address}", ${tokenId})`;
          await marketplace.rentItem(nft.address, tokenId, expires, payToken, { value: price });
          await expect(
            marketplace.rentItem(nft.address, tokenId, expires, payToken, { value: price })
          ).to.be.revertedWith(error);
        });
        it("reverts if expires is before `block.timestamp`", async () => {
          expires = expires.sub(rentalPeriod).sub(1);
          // calculating price will underflow
          const error = `InvalidExpires(${expires})`;
          await expect(
            marketplace.rentItem(nft.address, tokenId, expires, payToken, { value: price })
          ).to.be.reverted;
        });
        it("reverts if expires is after rent limit", async () => {
          expires = expires.add(1);
          const error = `InvalidExpires(${expires})`;
          await expect(
            marketplace.rentItem(nft.address, tokenId, expires, payToken, { value: price })
          ).to.be.revertedWith(error);
        });
        it("reverts if not enough ETH is sent", async () => {
          price = price.sub(pricePerSecond.mul(3));
          const error = `InvalidAmount(${price})`;
          await expect(
            marketplace.rentItem(nft.address, tokenId, expires, payToken, { value: price })
          ).to.be.revertedWith(error);
        });
        it("reverts if pay token is invalid", async () => {
          payToken = nft.address;
          const error = `InvalidPayToken("${payToken}")`;
          await expect(
            marketplace.rentItem(nft.address, tokenId, expires, payToken, { value: price })
          ).to.be.revertedWith(error);
        });
        it("transfers item from owner to marketplace", async () => {
          let owner = await nft.ownerOf(tokenId);
          assert.equal(owner, lessorAddr);
          await marketplace.rentItem(nft.address, tokenId, expires, payToken, { value: price });
          owner = await nft.ownerOf(tokenId);
          assert.equal(owner, marketplaceContract.address);
        });
        it("sets user to renter", async () => {
          let user = await nft.userOf(tokenId);
          assert.equal(user, ZERO_ADDRESS);
          await marketplace.rentItem(nft.address, tokenId, expires, payToken, { value: price });
          user = await nft.userOf(tokenId);
          assert.equal(user, renterAddr);
        });
        it("updates proceeds", async () => {
          const fee = price.mul(RENT_FEE).div("10000");
          let recipientProceeds = await marketplace.getProceeds(deployerAddr, ZERO_ADDRESS);
          let ownerProceeds = await marketplace.getProceeds(lessorAddr, ZERO_ADDRESS);
          assert(recipientProceeds.eq(0));
          assert(ownerProceeds.eq(0));
          await marketplace.rentItem(nft.address, tokenId, expires, payToken, { value: price });
          recipientProceeds = await marketplace.getProceeds(deployerAddr, ZERO_ADDRESS);
          ownerProceeds = await marketplace.getProceeds(lessorAddr, ZERO_ADDRESS);
          assert(recipientProceeds.gte(fee.mul("90").div("100")));
          assert(ownerProceeds.gte(price.sub(fee).mul("90").div("100")));
        });
        it("emits a `ItemRented` event", async () => {
          expect(
            await marketplace.rentItem(nft.address, tokenId, expires, payToken, { value: price })
          ).to.emit(marketplace, "ItemRented");
        });
      });

      describe("redeemItem()", () => {
        beforeEach(async () => {
          const currentTime = Math.round(new Date().getTime() / 1000);
          marketplace = marketplaceContract.connect(lessor);
          await marketplace.listItem(
            nft.address,
            tokenId,
            BigNumber.from(currentTime + 67239),
            BigNumber.from("26597"),
            ZERO_ADDRESS
          );
        });
        it("revers if item is being rented", async () => {
          marketplace = marketplaceContract.connect(renter);
          const listing = await marketplace.getListing(nft.address, tokenId);
          await marketplace.rentItem(nft.address, tokenId, listing.expires, listing.payToken, {
            value: ethers.utils.parseEther("1"),
          });
          marketplace = marketplaceContract.connect(lessor);
          const error = `CurrentlyRented("${nft.address}", ${tokenId})`;
          await expect(marketplace.redeemItem(nft.address, tokenId)).to.be.revertedWith(error);
        });
        it("reverts if sender is not nft owner", async () => {
          marketplace = marketplaceContract.connect(deployer);
          const error = `NotOwner("${deployerAddr}")`;
          await expect(marketplace.redeemItem(nft.address, tokenId)).to.be.revertedWith(error);
        });
        it("reverts if nft is not owned by marketplace, i.e. has never been rented", async () => {
          const error = `NotRedeemable("${nft.address}", ${tokenId})`;
          await expect(marketplace.redeemItem(nft.address, tokenId)).to.be.revertedWith(error);
        });
        it("transfers the nft to owner", async () => {
          await nft.transferFrom(lessorAddr, marketplaceContract.address, tokenId);
          await marketplace.redeemItem(nft.address, tokenId);
          const owner = await nft.ownerOf(tokenId);
          assert.equal(owner, lessorAddr);
        });
        it("emits a `ItemRedeemed` event", async () => {
          await nft.transferFrom(lessorAddr, marketplaceContract.address, tokenId);
          expect(await marketplace.redeemItem(nft.address, tokenId)).to.emit(
            marketplace,
            "ItemRedeemed"
          );
        });
      });

      describe("cancelListing()", () => {
        beforeEach(async () => {
          const currentTime = Math.round(new Date().getTime() / 1000);
          marketplace = marketplaceContract.connect(lessor);
          await marketplace.listItem(
            nft.address,
            tokenId,
            BigNumber.from(currentTime + 67239),
            BigNumber.from("26597"),
            ZERO_ADDRESS
          );
        });
        it("reverts if item is not listed", async () => {
          tokenId = await nft.tokenCounter();
          await nft.mint();
          const error = `NotListed("${nft.address}", ${tokenId})`;
          await expect(marketplace.cancelListing(nft.address, tokenId)).to.be.revertedWith(error);
        });
        it("reverts if item is being rented", async () => {
          marketplace = marketplaceContract.connect(renter);
          const listing = await marketplace.getListing(nft.address, tokenId);
          await marketplace.rentItem(nft.address, tokenId, listing.expires, listing.payToken, {
            value: ethers.utils.parseEther("1"),
          });
          marketplace = marketplaceContract.connect(lessor);
          const error = `CurrentlyRented("${nft.address}", ${tokenId})`;
          await expect(marketplace.cancelListing(nft.address, tokenId)).to.be.revertedWith(error);
        });
        it("reverts if item not redeemed", async () => {
          await nft.transferFrom(lessorAddr, marketplaceContract.address, tokenId);
          const error = `NotOwner("${lessorAddr}")`;
          await expect(marketplace.cancelListing(nft.address, tokenId)).to.be.revertedWith(error);
        });
        it("reverts if sender is not owner", async () => {
          marketplace = marketplaceContract.connect(renter);
          const error = `NotOwner("${renterAddr}")`;
          await expect(marketplace.cancelListing(nft.address, tokenId)).to.be.revertedWith(error);
        });
        it("cancels item if item has never been rented", async () => {
          await marketplace.cancelListing(nft.address, tokenId);
          const listing = await marketplace.getListing(nft.address, tokenId);
          assert.equal(listing.owner, ZERO_ADDRESS);
          assert(listing.expires.eq(0));
          assert(listing.pricePerSecond.eq(0));
          assert.equal(listing.payToken, ZERO_ADDRESS);
        });
        it("cancels item if has been rented but rental period has expired", async () => {
          await nft.transferFrom(lessorAddr, marketplaceContract.address, tokenId);
          await marketplace.redeemItem(nft.address, tokenId);
          await marketplace.cancelListing(nft.address, tokenId);
          const listing = await marketplace.getListing(nft.address, tokenId);
          assert.equal(listing.owner, ZERO_ADDRESS);
          assert(listing.expires.eq(0));
          assert(listing.pricePerSecond.eq(0));
          assert.equal(listing.payToken, ZERO_ADDRESS);
        });
        it("emits `ItemCanceled` event", async () => {
          expect(await marketplace.cancelListing(nft.address, tokenId)).to.emit(
            marketplace,
            "ItemCanceled"
          );
        });
      });

      describe("withdrawProceeds()", () => {
        const value: BigNumber = BigNumber.from("193475297365892734");
        beforeEach(async () => {
          marketplace = marketplaceContract.connect(renter);
          await renter.sendTransaction({ to: marketplaceContract.address, value: value });
        });
        it("withdraws ETH proceeds", async () => {
          let proceeds = await marketplace.getProceeds(renterAddr, ZERO_ADDRESS);
          const balanceBefore = await renter.getBalance();
          assert(proceeds.eq(value));
          await marketplace.withdrawProceeds(ZERO_ADDRESS);
          proceeds = await marketplace.getProceeds(renterAddr, ZERO_ADDRESS);
          const balanceAfter = await renter.getBalance();
          assert(proceeds.eq(0));
          assert(balanceAfter.gte(balanceBefore.add(value.mul(99).div(100))));
        });
      });

      describe("onERC721Received()", () => {
        it("handles the receipt of an nft", async () => {
          const actual = await marketplace.onERC721Received(
            ZERO_ADDRESS,
            ZERO_ADDRESS,
            "0",
            "0x00"
          );
          assert.equal(actual, ON_ERC721_RECEIVED);
        });
        it("ERC721.safeTransferFrom() does not revert", async () => {
          await expect(
            nft["safeTransferFrom(address,address,uint256)"](
              lessorAddr,
              marketplaceContract.address,
              tokenId
            )
          ).to.not.reverted;
        });
      });
    });
