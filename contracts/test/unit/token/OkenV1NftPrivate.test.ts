import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { BigNumber, Contract, ContractFactory } from "ethers";
import { network, deployments, ethers } from "hardhat";
import { developmentChains } from "../../../utils/const";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  Nft_deploy,
  Nft_args,
  Nft_mint,
  Nft_burn,
  Nft_isApproved,
  Nft_isApprovedForAll,
  Nft_constructor,
  Nft_setPlatformFee,
  Nft_setFeeRecipient,
} from "./OkenV1Nft";

const deployOkenV1NftPrivateFixture: Nft_deploy = async () => {
  const nftFactory = await ethers.getContractFactory("OkenV1NftPrivate");
  const [deployer, minter, user] = await ethers.getSigners();

  const args: Nft_args = [
    "rf o wiug owefb  owub293r 37vehf 083rb 9273f fhwef9273",
    "djf274rt29u r2397r 9327trg f892t7 23f982t f230i3 fet9fouv9",
    "0xed58BCD968491DDaD2A933292447EFC90c5B0F02",
    "0x5E4e65926BA27467555EB562121fac00D24E9dD2",
    BigNumber.from("82209856378456903"),
    await deployer.getAddress(),
  ];

  const nft = await nftFactory.deploy(args[0], args[1], args[2], args[3], args[4], args[5]);
  await nft.deployed();
  return { nft, deployer, minter, user, args };
};

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("OkenV1NftPrivate unit tests", function () {
      Nft_constructor(deployOkenV1NftPrivateFixture);
      Nft_mint(deployOkenV1NftPrivateFixture, false, true);
      Nft_burn(deployOkenV1NftPrivateFixture);
      Nft_isApproved(deployOkenV1NftPrivateFixture);
      Nft_isApprovedForAll(deployOkenV1NftPrivateFixture);
      Nft_setPlatformFee(deployOkenV1NftPrivateFixture);
      Nft_setFeeRecipient(deployOkenV1NftPrivateFixture);
    });
