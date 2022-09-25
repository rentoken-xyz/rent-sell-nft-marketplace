import { BigNumber } from "ethers";
import { network, ethers } from "hardhat";
import { developmentChains } from "../../../utils/const";
import * as tests from "./OkenV1NftFactory";

const deployOkenV1NftFactoryFixture: tests.Factory_deploy = async () => {
  const factoryFactory = await ethers.getContractFactory("OkenV1NftFactory");
  const [deployer, creator, user] = await ethers.getSigners();

  const args: tests.Factory_args = [
    "0xed58BCD968491DDaD2A933292447EFC90c5B0F02",
    "0x5E4e65926BA27467555EB562121fac00D24E9dD2",
    BigNumber.from("82209856378456903"),
    await deployer.getAddress(),
  ];

  const factory = await factoryFactory.deploy(args[0], args[1], args[2], args[3]);
  await factory.deployed();
  return { factory, deployer, creator, user, args };
};

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("OkenV1NftFactory unit tests", function () {
      tests.factory_constructor(deployOkenV1NftFactoryFixture);

      tests.factory_deployNftContract(
        deployOkenV1NftFactoryFixture,
        "OkenV1NftFactory",
        false,
        false
      );

      tests.factory_addNftContract(deployOkenV1NftFactoryFixture, false);

      tests.factory_removeNftContract(deployOkenV1NftFactoryFixture);

      tests.factory_setPlatformFee(deployOkenV1NftFactoryFixture);

      tests.factory_setFeeRecipient(deployOkenV1NftFactoryFixture);
    });
