import { BigNumber, Contract, ethers } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect, assert } from "chai";
import {
    ZERO_ADDRESS,
    INTERFACE_ID_ERC721,
    INTERFACE_ID_ERC721_METADATA,
    INTERFACE_ID_ERC4907,
} from "../../../utils/const";

export type Nft_args = [
    name: string,
    symbol: string,
    rentMarketplace: string,
    sellMarketplace: string,
    platformFee: BigNumber,
    feeRecipient: string
];

export type Nft_deploy = () => Promise<{
    nft: Contract;
    deployer: SignerWithAddress;
    minter: SignerWithAddress;
    user: SignerWithAddress;
    args: Nft_args;
}>;

export const Nft_constructor = (deployNftFixture: Nft_deploy) => {
    describe("constructor()", () => {
        let nft: Contract,
            deployer: SignerWithAddress,
            minter: SignerWithAddress,
            user: SignerWithAddress;
        let args: Nft_args;
        let deployerAddr: string, minterAddr: string;

        beforeEach(async () => {
            // deploy
            ({ nft, deployer, minter, user, args } = await loadFixture(deployNftFixture));
            // get addresses
            deployerAddr = await deployer.getAddress();
            minterAddr = await minter.getAddress();
        });

        it("sets token counter to zero", async () => {
            const expected = BigNumber.from(0);
            const actual = await nft.getTokenCounter();
            assert(actual.eq(expected));
        });

        it("sets name", async () => {
            const expected = args[0];
            const actual = await nft.name();
            assert.equal(actual, expected);
        });

        it("sets symbol", async () => {
            const expected = args[1];
            const actual = await nft.symbol();
            assert.equal(actual, expected);
        });

        it("sets rent marketplace", async () => {
            const expected = args[2];
            const actual = await nft.getRentMarketplace();
            assert.equal(actual, expected);
        });

        it("sets sell marketplace", async () => {
            const expected = args[3];
            const actual = await nft.getSellMarketplace();
            assert.equal(actual, expected);
        });

        it("sets platform fee", async () => {
            const expected = args[4];
            const actual = await nft.getPlatformFee();
            assert(actual.eq(expected));
        });

        it("sets fee recipient", async () => {
            const expected = args[5];
            const actual = await nft.getFeeRecipient();
            assert.equal(actual, expected);
        });

        it("sets owner", async () => {
            const expected = deployerAddr;
            const actual = await nft.owner();
            assert.equal(actual, expected);
        });
    });
};

export const Nft_mint = (deployNftFixture: Nft_deploy, isRentable: boolean, isPrivate: boolean) => {
    describe("mint()", () => {
        let nft: Contract;
        let deployer: SignerWithAddress, minter: SignerWithAddress;
        let deployerAddr: string, minterAddr: string;
        let platformFee: BigNumber;

        beforeEach(async () => {
            ({ nft, deployer, minter } = await loadFixture(deployNftFixture));
            deployerAddr = await deployer.getAddress();
            minterAddr = await minter.getAddress();
            platformFee = await nft.getPlatformFee();
            if (isPrivate) await nft.transferOwnership(minterAddr);
            nft = nft.connect(minter);
        });

        it("reverts if platform fee not paid", async () => {
            const value = platformFee.sub(1);
            const error = `InsufficientFunds(${platformFee.toString()}, ${value.toString()})`;
            await expect(nft.mint(minterAddr, "", { value: value })).to.be.revertedWith(error);
        });

        it("transfers fee to fee recipient", async () => {
            const balanceBefore = await deployer.getBalance();
            const expected = balanceBefore.add(platformFee);
            await nft.mint(minterAddr, "", { value: platformFee });
            const actual = await deployer.getBalance();
            assert(actual.eq(expected));
        });

        it("increments token counter", async () => {
            let expected = await nft.getTokenCounter();
            expected = expected.add(1);
            await nft.mint(minterAddr, "", { value: platformFee });
            const actual = await nft.getTokenCounter();
            assert(actual.eq(expected));
        });

        it("sets ownerOf", async () => {
            const tokenId = await nft.getTokenCounter();
            await nft.mint(minterAddr, "", { value: platformFee });
            const owner = await nft.ownerOf(tokenId);
            assert.equal(owner, minterAddr);
        });

        it("sets uri", async () => {
            const expected = "this is a test uri";
            const tokenId = await nft.getTokenCounter();
            await nft.mint(minterAddr, expected, { value: platformFee });
            const actual = await nft.tokenURI(tokenId);
            assert.equal(actual, expected);
        });

        it("emits an event", async () => {
            await expect(nft.mint(minterAddr, "", { value: platformFee })).to.emit(nft, "Minted");
        });

        it.skip("can handle reentrancy attacks", async () => {});

        it("can handle large uri", async () => {
            const uri =
                "https://imgs.search.brave.com/eaREZN67TmqxtEh0JhUK7sSvvpHXLsm41tsba3yVpIo/rs:fit:1024:1024:1/g:ce/aHR0cHM6Ly9jb250/ZW50LmNyeXB0b25l/d3MuY29tLmF1L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIxLzA0/L2Nyd3djd3JxY2h4/LnBuZw";
            const uriExpected = uri.concat(uri).concat(uri).concat(uri);
            const tokenId = await nft.getTokenCounter();
            await nft.mint(minterAddr, uriExpected, { value: platformFee });
            const uriActual = await nft.tokenURI(tokenId);
            assert.equal(uriActual, uriExpected);
        });

        it("reverts if minting to zero address", async () => {
            const error = "ERC721: mint to the zero address";
            await expect(nft.mint(ZERO_ADDRESS, "", { value: platformFee })).to.be.revertedWith(
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

        if (isRentable) {
            it("token is ERC4907", async () => {
                const supports = await nft.supportsInterface(INTERFACE_ID_ERC4907);
                assert(supports);
            });
        }

        if (isPrivate) {
            it("only admin can mint", async () => {
                await nft.transferOwnership(deployerAddr);
                const error = "Ownable: caller is not the owner";
                await expect(nft.mint(minterAddr, "", { value: platformFee })).to.be.revertedWith(
                    error
                );
            });
        }
    });
};

export const Nft_burn = (deployNftFixture: Nft_deploy) => {
    describe("burn()", () => {
        let nft: Contract;
        let deployer: SignerWithAddress, minter: SignerWithAddress;
        let deployerAddr: string, minterAddr: string;
        let platformFee: BigNumber, nftId: BigNumber;

        beforeEach(async () => {
            ({ nft, deployer, minter } = await loadFixture(deployNftFixture));
            deployerAddr = await deployer.getAddress();
            minterAddr = await minter.getAddress();
            platformFee = await nft.getPlatformFee();
            nftId = await nft.getTokenCounter();
            await nft.mint(minterAddr, "", { value: platformFee });
            nft = nft.connect(minter);
        });

        it("reverts if sender not approved nor owner", async () => {
            const error = `NotOwnerNorApproved("${deployerAddr}")`;
            await expect(nft.connect(deployer).burn(nftId)).to.be.revertedWith(error);
        });

        it("burns token if owner", async () => {
            let exists = await nft.getExists(nftId);
            assert(exists);
            await nft.connect(minter).burn(nftId);
            exists = await nft.getExists(nftId);
            assert(!exists);
        });

        it("burns token if approved", async () => {
            await nft.approve(deployerAddr, nftId);
            let exists = await nft.getExists(nftId);
            assert(exists);
            await nft.connect(deployer).burn(nftId);
            exists = await nft.getExists(nftId);
            assert(!exists);
        });

        it("burns token if approved for all", async () => {
            await nft.setApprovalForAll(deployerAddr, true);
            let exists = await nft.getExists(nftId);
            assert(exists);
            await nft.connect(deployer).burn(nftId);
            exists = await nft.getExists(nftId);
            assert(!exists);
        });

        it("emits an event", async () => {
            await expect(nft.connect(minter).burn(nftId)).to.emit(nft, "Burned");
        });
    });
};

export const Nft_isApproved = (deployNftFixture: Nft_deploy) => {
    describe("isApproved()", () => {
        let nft: Contract;
        let deployer: SignerWithAddress, minter: SignerWithAddress;
        let deployerAddr: string, minterAddr: string;
        let platformFee: BigNumber, nftId: BigNumber;
        const randomAddr = "0xb00bB3aD27BAdCC4F6A4003626139A638A913664";

        beforeEach(async () => {
            ({ nft, deployer, minter } = await loadFixture(deployNftFixture));
            deployerAddr = await deployer.getAddress();
            minterAddr = await minter.getAddress();
            platformFee = await nft.getPlatformFee();
            nftId = await nft.getTokenCounter();
            await nft.mint(minterAddr, "", { value: platformFee });
            nft = nft.connect(minter);
        });

        it("returns true if approved for all", async () => {
            let approved = await nft.isApproved(nftId, randomAddr);
            assert(!approved);
            await nft.setApprovalForAll(randomAddr, true);
            approved = await nft.isApproved(nftId, randomAddr);
            assert(approved);
        });

        it("returns true if approved", async () => {
            let approved = await nft.isApproved(nftId, randomAddr);
            assert(!approved);
            await nft.approve(randomAddr, nftId);
            approved = await nft.isApproved(nftId, randomAddr);
            assert(approved);
        });
    });
};

export const Nft_isApprovedForAll = (deployNftFixture: Nft_deploy) => {
    describe("isApprovedForAll()", () => {
        let nft: Contract,
            deployer: SignerWithAddress,
            minter: SignerWithAddress,
            user: SignerWithAddress;
        let args: Nft_args;
        let deployerAddr: string, minterAddr: string;
        let platformFee: BigNumber, nftId: BigNumber;

        beforeEach(async () => {
            ({ nft, deployer, minter, user, args } = await loadFixture(deployNftFixture));
            deployerAddr = await deployer.getAddress();
            minterAddr = await minter.getAddress();
            platformFee = await nft.getPlatformFee();
            nftId = await nft.getTokenCounter();
            await nft.mint(minterAddr, "", { value: platformFee });
            nft = nft.connect(minter);
        });

        it("returns true for rent marketplace", async () => {
            const approved = await nft.isApprovedForAll(minterAddr, args[2]);
            assert(approved);
        });

        it("returns true for sell marketplace", async () => {
            const approved = await nft.isApprovedForAll(minterAddr, args[3]);
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
};

export const Nft_setPlatformFee = (deployNftFixture: Nft_deploy) => {
    describe("setPlatformFee()", () => {
        let nft: Contract, deployer: SignerWithAddress, minter: SignerWithAddress;
        let deployerAddr: string, minterAddr: string;
        const newFee = ethers.utils.parseEther("0.0349547560246");

        beforeEach(async () => {
            // deploy
            ({ nft, deployer, minter } = await loadFixture(deployNftFixture));
            // get addresses
            deployerAddr = await deployer.getAddress();
            minterAddr = await minter.getAddress();
        });

        it("sets platform fee", async () => {
            await nft.connect(deployer).setPlatformFee(newFee);
            const actual = await nft.getPlatformFee();
            assert(actual.eq(newFee));
        });

        it("emits an event", async () => {
            await expect(nft.connect(deployer).setPlatformFee(newFee)).to.emit(
                nft,
                "PlatformFeeUpdated"
            );
        });

        it("reverts if sender not owner", async () => {
            const expected = await nft.getPlatformFee();
            await expect(nft.connect(minter).setPlatformFee(newFee)).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
            const actual = await nft.getPlatformFee();
            assert(actual.eq(expected));
        });
    });
};

export const Nft_setFeeRecipient = (deployNftFixture: Nft_deploy) => {
    describe("setFeeRecipient()", () => {
        let nft: Contract, deployer: SignerWithAddress, minter: SignerWithAddress;
        let deployerAddr: string, minterAddr: string;
        const newRecipient = "0x3C352eA32DFBb757CCdf4b457E52daF6eCC21917";

        beforeEach(async () => {
            // deploy
            ({ nft, deployer, minter } = await loadFixture(deployNftFixture));
            // get addresses
            deployerAddr = await deployer.getAddress();
            minterAddr = await minter.getAddress();
        });

        it("sets fee recipient", async () => {
            await nft.connect(deployer).setFeeRecipient(newRecipient);
            const actual = await nft.getFeeRecipient();
            assert.equal(actual, newRecipient);
        });

        it("emits an event", async () => {
            await expect(nft.connect(deployer).setFeeRecipient(newRecipient)).to.emit(
                nft,
                "FeeRecipientUpdated"
            );
        });

        it("reverts if sender not owner", async () => {
            const expected = await nft.getFeeRecipient();
            await expect(nft.connect(minter).setFeeRecipient(newRecipient)).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
            const actual = await nft.getFeeRecipient();
            assert.equal(actual, expected);
        });
    });
};
