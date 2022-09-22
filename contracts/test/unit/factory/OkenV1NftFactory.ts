import { BigNumber, Contract } from "ethers";
import { deployments, ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect, assert } from "chai";

export type Factory_args = [
    rentMarketplace: string,
    sellMarketplace: string,
    platformFee: BigNumber,
    feeRecipient: string
];

export type Factory_deploy = () => Promise<{
    factory: Contract;
    deployer: SignerWithAddress;
    creator: SignerWithAddress;
    user: SignerWithAddress;
    args: Factory_args;
}>;

export const factory_constructor = (deployFactoryFixture: Factory_deploy) => {
    describe("constructor", () => {
        let factory: Contract;
        let deployer: SignerWithAddress, creator: SignerWithAddress, user: SignerWithAddress;
        let args: Factory_args;

        beforeEach(async () => {
            ({ factory, deployer, creator, user, args } = await loadFixture(deployFactoryFixture));
        });

        it("sets rent marketplace", async () => {
            expect(await factory.getRentMarketplace()).to.equal(args[0]);
        });

        it("sets sell marketplace", async () => {
            expect(await factory.getSellMarketplace()).to.equal(args[1]);
        });

        it("sets platform fee", async () => {
            const actual = await factory.getPlatformFee();
            assert(actual.eq(args[2]));
        });

        it("sets fee recipient", async () => {
            expect(await factory.getFeeRecipient()).to.equal(args[3]);
        });
    });
};

export const factory_deployNftContract = (
    deployFactoryFixture: Factory_deploy,
    nftContractName: string,
    isRentable: boolean,
    isPrivate: boolean
) => {
    describe("deployNftContract()", () => {
        let factory: Contract;
        let deployer: SignerWithAddress, creator: SignerWithAddress;
        let deployerAddr: string, creatorAddr: string;
        // arguments
        let platformFee: BigNumber;
        const name = "paur aorih2480 w084y 420t 48t h248 4t";
        const symbol = " 84yt 489t 2284ht 048t";
        const mintFee = ethers.utils.parseEther("0.02973478");
        let feeRecipient: string;

        beforeEach(async () => {
            ({ factory, deployer, creator } = await loadFixture(deployFactoryFixture));
            deployerAddr = await deployer.getAddress();
            creatorAddr = await creator.getAddress();
            feeRecipient = creatorAddr;
            platformFee = await factory.getPlatformFee();
            if (isPrivate) await factory.transferOwnership(creatorAddr);
        });

        it("reverts if platform fee not paid", async () => {
            const value = platformFee.sub(1);
            const error = `InsufficientFunds(${platformFee.toString()}, ${value.toString()})`;
            await expect(
                factory
                    .connect(creator)
                    .deployNftContract(name, symbol, mintFee, feeRecipient, { value: value })
            ).to.be.revertedWith(error);
        });

        it("transfers to fee recipient", async () => {
            const balanceBefore = await deployer.getBalance();
            const expected = balanceBefore.add(platformFee);
            await factory
                .connect(creator)
                .deployNftContract(name, symbol, mintFee, feeRecipient, { value: platformFee });
            const actual = await deployer.getBalance();
            assert(actual.eq(expected));
        });

        it("emitsContractCreated event", async () => {
            expect(
                await factory
                    .connect(creator)
                    .deployNftContract(name, symbol, mintFee, feeRecipient, { value: platformFee })
            ).to.emit(factory, "ContractCreated");
        });

        it("sets exists to true", async () => {
            const tx = await factory
                .connect(creator)
                .deployNftContract(name, symbol, mintFee, feeRecipient, { value: platformFee });
            const receipt = await tx.wait();
            const event = receipt.events[receipt.events.length - 1];
            const nftAddress = event.args.nftContract;
            const nft = await ethers.getContractAt(nftContractName, nftAddress);
            const exists = await factory.getExists(nftAddress);
            assert(exists);
        });

        it("transfers ownership", async () => {
            const tx = await factory
                .connect(creator)
                .deployNftContract(name, symbol, mintFee, feeRecipient, { value: platformFee });
            const receipt = await tx.wait();
            const event = receipt.events[receipt.events.length - 1];
            const nftAddress = event.args.nftContract;
            const nft = await ethers.getContractAt(nftContractName, nftAddress);
            const actual = await nft.owner();
            assert.equal(actual, creatorAddr);
        });
    });
};

export const factory_addNftContract = (
    deployFactoryFixture: Factory_deploy,
    isRentable: boolean
) => {
    describe("addNftContract()", () => {
        let factory: Contract;
        let deployer: SignerWithAddress;
        let deployerAddr: string, nftAddress: string;

        beforeEach(async () => {
            ({ factory, deployer } = await loadFixture(deployFactoryFixture));
            deployerAddr = await deployer.getAddress();
            if (isRentable) {
                await deployments.fixture(["basicERC4907"]);
                const nftContract = await ethers.getContract("BasicERC4907");
                nftAddress = nftContract.address;
            } else {
                await deployments.fixture(["basicERC721"]);
                const nftContract = await ethers.getContract("BasicERC721");
                nftAddress = nftContract.address;
            }
        });

        it("reverts if contract already exists", async () => {
            await factory.connect(deployer).addNftContract(nftAddress);
            const error = `ContractAlreadyExists("${nftAddress}")`;
            await expect(factory.connect(deployer).addNftContract(nftAddress)).to.be.revertedWith(
                error
            );
        });

        it(isRentable ? "reverts if not ERC4907" : "reverts if not ERC721", async () => {
            const error = `InvalidNftAddress("${factory.address}")`;
            expect(
                await factory.connect(deployer).addNftContract(factory.address)
            ).to.be.revertedWith(error);
        });

        it("sets exists to true", async () => {
            let exists = await factory.getExists(nftAddress);
            assert(!exists);
            await factory.connect(deployer).addNftContract(nftAddress);
            exists = await factory.getExists(nftAddress);
            assert(exists);
        });

        it("emits NftContractAdded event", async () => {
            expect(await factory.connect(deployer).addNftContract(nftAddress)).to.emit(
                factory,
                "NftContractAdded"
            );
        });
    });
};

export const factory_removeNftContract = (deployFactoryFixture: Factory_deploy) => {
    describe("removeNftContract()", () => {
        let factory: Contract;
        let deployer: SignerWithAddress;
        let deployerAddr: string;
        let nftAddress: string;

        beforeEach(async () => {
            ({ factory, deployer } = await loadFixture(deployFactoryFixture));
            deployerAddr = await deployer.getAddress();
            const platformFee = await factory.getPlatformFee();
            const tx = await factory
                .connect(deployer)
                .deployNftContract("", "", "0", deployerAddr, { value: platformFee });
            const receipt = await tx.wait();
            const event = receipt.events[receipt.events.length - 1];
            nftAddress = event.args.nftContract;
        });

        it("reverts if contract not exists", async () => {
            const randomAddr = "0xAc94e76C0f93FD8ad4e7A994249a8eBBF3393788";
            const error = `ContractNotExists("${randomAddr}")`;
            await expect(
                factory.connect(deployer).removeNftContract(randomAddr)
            ).to.be.revertedWith(error);
        });

        it("removes contracts", async () => {
            let exists = await factory.getExists(nftAddress);
            assert(exists);
            await factory.connect(deployer).removeNftContract(nftAddress);
            exists = await factory.getExists(nftAddress);
            assert(!exists);
        });

        it("emits a NftContractRemoved event", async () => {
            expect(await factory.connect(deployer).removeNftContract(nftAddress)).to.emit(
                factory,
                "NftContractRemoved"
            );
        });
    });
};

export const factory_setPlatformFee = (deployNftFixture: Factory_deploy) => {
    describe("setPlatformFee()", () => {
        let factory: Contract;
        let deployer: SignerWithAddress, creator: SignerWithAddress;
        let deployerAddr: string, creatorAddr: string;
        const newFee = ethers.utils.parseEther("0.0349547560246");

        beforeEach(async () => {
            // deploy
            ({ factory, deployer, creator } = await loadFixture(deployNftFixture));
            // get addresses
            deployerAddr = await deployer.getAddress();
            creatorAddr = await creator.getAddress();
        });

        it("sets platform fee", async () => {
            await factory.connect(deployer).setPlatformFee(newFee);
            const actual = await factory.getPlatformFee();
            assert(actual.eq(newFee));
        });

        it("reverts if sender not owner", async () => {
            const expected = await factory.getPlatformFee();
            await expect(factory.connect(creator).setPlatformFee(newFee)).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
            const actual = await factory.getPlatformFee();
            assert(actual.eq(expected));
        });
    });
};

export const factory_setFeeRecipient = (deployNftFixture: Factory_deploy) => {
    describe("setFeeRecipient()", () => {
        let factory: Contract;
        let deployer: SignerWithAddress, creator: SignerWithAddress;
        let deployerAddr: string, creatorAddr: string;
        const newRecipient = "0x3C352eA32DFBb757CCdf4b457E52daF6eCC21917";

        beforeEach(async () => {
            // deploy
            ({ factory, deployer, creator } = await loadFixture(deployNftFixture));
            // get addresses
            deployerAddr = await deployer.getAddress();
            creatorAddr = await creator.getAddress();
        });

        it("sets fee recipient", async () => {
            await factory.connect(deployer).setFeeRecipient(newRecipient);
            const actual = await factory.getFeeRecipient();
            assert.equal(actual, newRecipient);
        });

        it("reverts if sender not owner", async () => {
            const expected = await factory.getFeeRecipient();
            await expect(factory.connect(creator).setFeeRecipient(newRecipient)).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
            const actual = await factory.getFeeRecipient();
            assert.equal(actual, expected);
        });
    });
};
