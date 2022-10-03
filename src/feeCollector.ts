import {
  logBase,
  intToHex,
  intToPaddedHex,
  initProvider,
  blocks,
} from "./utils";
import { ethers } from "ethers";
import { collectEventABI, collectEventNameTypes } from "./constants";
import * as uniSdk from "@uniswap/v3-sdk";
import { jsonRpcProvider } from "./utils";
import { getPoolImmutables } from "./v3Methods";
import { ChainId, Fetcher } from "@uniswap/sdk";

const alchemyProvider = initProvider();
const iface = new ethers.utils.Interface(collectEventABI);
const eventSig = ethers.utils.id(collectEventNameTypes);
const base = Math.sqrt(1.0001);
const tickBytes = 32;

export interface PoolTokenInfo {
  tickSpacing: number;
  decimal0: number;
  decimal1: number;
  tokenName0: string;
  tokenName1: string;
}

export async function getPoolTokenInfo(pool: string): Promise<PoolTokenInfo> {
  console.log(`pool is`, pool);
  console.log(`provider is`, jsonRpcProvider);

  const res = await getPoolImmutables(
    "0xCBCdF9626bC03E24f779434178A73a0B4bad62eD",
    jsonRpcProvider
  );
  const tickSpacing = res.tickSpacing;
  const token0Address = res.token0;
  const token1Address = res.token1;
  const chainId = ChainId.MAINNET;
  const token0 = await Fetcher.fetchTokenData(chainId, token0Address);
  const token1 = await Fetcher.fetchTokenData(chainId, token1Address);
  const decimal0 = token0.decimals;
  const decimal1 = token1.decimals;

  return {
    tickSpacing: tickSpacing,
    decimal0: decimal0,
    decimal1: decimal1,
    tokenName0: token0.name,
    tokenName1: token1.name,
  } as PoolTokenInfo;
}

export function getNearestTickFromPrice(
  price: number,
  token0Decimal: number,
  token1Decimal: number,
  tickSpacing: number
): number {
  const scaledPrice = (price * 10 ** token1Decimal) / 10 ** token0Decimal;

  const tick = Math.floor(logBase(Math.sqrt(scaledPrice), base));
  const nearestUsableTick = uniSdk.nearestUsableTick(tick, tickSpacing);
  return nearestUsableTick;
}

export async function getFees(
  pool: string,
  priceLower: number,
  priceUpper: number,
  startTime: string,
  endTime: string
) {
  const poolTokenInfo = await getPoolTokenInfo(pool);

  const tickSpacing = poolTokenInfo.tickSpacing;
  const token0Decimal = poolTokenInfo.decimal0;
  const token1Decimal = poolTokenInfo.decimal1;

  const nearestUsableTickLower = getNearestTickFromPrice(
    priceLower,
    token0Decimal,
    token1Decimal,
    tickSpacing
  );
  const nearestUsableTickUpper = getNearestTickFromPrice(
    priceUpper,
    token0Decimal,
    token1Decimal,
    tickSpacing
  );

  const tickLowerHexPadded = intToPaddedHex(nearestUsableTickLower, tickBytes);
  const tickUpperHexPadded = intToPaddedHex(nearestUsableTickUpper, tickBytes);

  const startTimeBlockQuery = await blocks.getDate(startTime);
  const endTimeBlockQuery = await blocks.getDate(endTime);
  if (startTimeBlockQuery !== null && endTimeBlockQuery !== null) {
    const fromBlockHex = intToHex(startTimeBlockQuery.block);
    const toBlockHex = intToHex(endTimeBlockQuery.block);

    const logs = await alchemyProvider.core.getLogs({
      address: pool,
      topics: [eventSig, null, tickLowerHexPadded, tickUpperHexPadded],
      fromBlock: fromBlockHex,
      toBlock: toBlockHex,
    });
    console.log("logs are", logs);

    logs.forEach((log) => {
      const decoded = iface.parseLog(log);
      const token0Amount = ethers.utils.formatUnits(decoded.args[4], 8);
      const token1Amount = ethers.utils.formatUnits(decoded.args[5], 18);
      const tickLower = decoded.args[2];
      const tickUpper = decoded.args[3];
      console.log(tickLower, token0Amount, tickUpper, token1Amount);
    });
  }
}
