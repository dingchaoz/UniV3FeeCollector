import { ethers } from "ethers";
import { Alchemy, Network } from "alchemy-sdk";
import Blocks from "eth-block-timestamp";
import * as dotenv from "dotenv";

dotenv.config();

export const logBase = (n: number, base: number) =>
  Math.log(n) / Math.log(base);

export const intToHex = (n: number) => ethers.utils.hexlify(n);

export const intToPaddedHex = (n: number, bytes: number) =>
  ethers.utils.hexZeroPad(intToHex(n), bytes);

export const blocks = new Blocks(
  "https://eth-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_KEY
);

export function initProvider() {
  if (!process.env.ALCHEMY_KEY) {
    throw new Error("ALCHEMY_KEY not set.");
  }
  const settings = {
    apiKey: process.env.ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
  };

  return new Alchemy(settings);
}
