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
import { getPoolImmutables,getTokenImmutables } from "./v3Methods";


const alchemyProvider = initProvider();
const iface = new ethers.utils.Interface(collectEventABI);
const eventSig = ethers.utils.id(collectEventNameTypes);
const base = Math.sqrt(1.0001);
const tickBytes = 32;

export interface PoolTokenInfo {
  tickSpacing: number;
  decimal0: number;
  decimal1: number;
  token0Name: string;
  token1Name: string;
}

export async function getPoolTokenInfo(pool: string): Promise<PoolTokenInfo> {

  const res = await getPoolImmutables(
    pool,
    jsonRpcProvider
  );
  const tickSpacing = res.tickSpacing;
  const token0Address = res.token0;
  const token1Address = res.token1;
  const token0 = await getTokenImmutables(token0Address, jsonRpcProvider)
  const token1 = await getTokenImmutables(token1Address, jsonRpcProvider)
  const decimal0 = token0.decimals;
  const decimal1 = token1.decimals;

  return {
    tickSpacing: tickSpacing,
    decimal0: decimal0,
    decimal1: decimal1,
    token0Name: token0.name,
    token1Name: token1.name,
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

    let token0AmountTotal = 0
    let token1AmountTotal = 0

    logs.forEach((log) => {
      const decoded = iface.parseLog(log);
      const token0Amount = ethers.utils.formatUnits(decoded.args[4], 8);
      const token1Amount = ethers.utils.formatUnits(decoded.args[5], 18);
      token0AmountTotal = token0AmountTotal + parseFloat(token0Amount)
      token1AmountTotal = token1AmountTotal + parseFloat(token1Amount)
      
    });
    console.log(`Collected ${token0AmountTotal} of ${poolTokenInfo.token0Name} and ${token1AmountTotal} of ${poolTokenInfo.token1Name} in the specied pool, price and time range`);
  }
}
