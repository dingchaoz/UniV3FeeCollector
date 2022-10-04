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
import { getPoolImmutables, getTokenImmutables } from "./v3Methods";

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

/**
 * Function to get tick spacing, tokens name, decimals from pool address
 * @param pool address of the pool to check
 * @returns PoolTokenInfo interface
 */
export async function getPoolTokenInfo(pool: string): Promise<PoolTokenInfo> {
  console.log(`.....Fetching pool information.... `);
  const res = await getPoolImmutables(pool, jsonRpcProvider);
  const tickSpacing = res.tickSpacing;
  const token0Address = res.token0;
  const token1Address = res.token1;
  console.log(`.....Fetching tokens information.... `);
  const token0 = await getTokenImmutables(token0Address, jsonRpcProvider);
  const token1 = await getTokenImmutables(token1Address, jsonRpcProvider);
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

/**
 * Function to get nearest usable tick from price,
 * It first computes tick from price based onf the formula that 1.0001 to the power of tick number === price
 * then uses uniswap v3 sdk to return a closest usable tick from a input tick
 * @param price price to be converted to tick
 * @param token0Decimal decimal of token0
 * @param token1Decimal decimal of token1
 * @param tickSpacing tick spacing
 * @returns tick
 */
export function getNearestTickFromPrice(
  price: number,
  token0Decimal: number,
  token1Decimal: number,
  tickSpacing: number,
  floor: boolean
): number {
  const scaledPrice = (price * 10 ** token1Decimal) / 10 ** token0Decimal;
  let tick: number;
  if (floor) {
    tick = Math.floor(logBase(Math.sqrt(scaledPrice), base));
  } else {
    tick = Math.ceil(logBase(Math.sqrt(scaledPrice), base));
  }
  const nearestUsableTick = uniSdk.nearestUsableTick(tick, tickSpacing);
  return nearestUsableTick;
}

/**
 * The major function to get collected fees, it uses eth_log to filter Collect events only emitted from the specified pool
 * and from the starting and ending block, as well as in the specified ticks range
 * @param pool address of pool
 * @param priceLower lower price of the tick range for fee collection
 * @param priceUpper upper price of the tick range for fee collection
 * @param startTime start time of the time window for fee collection
 * @param endTime end time of the time window for fee collection
 */
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

  console.log(`.....Converting price to nearest usable ticks.... `);

  const nearestUsableTickLower = getNearestTickFromPrice(
    priceLower,
    token0Decimal,
    token1Decimal,
    tickSpacing,
    true
  );
  const nearestUsableTickUpper = getNearestTickFromPrice(
    priceUpper,
    token0Decimal,
    token1Decimal,
    tickSpacing,
    false
  );

  // 230280, 264300

  const tickLowerHexPadded = intToPaddedHex(nearestUsableTickLower, tickBytes);
  const tickUpperHexPadded = intToPaddedHex(nearestUsableTickUpper, tickBytes);

  console.log(`.....Converting time windows to ranges of block numbers.... `);

  const startTimeBlockQuery = await blocks.getDate(startTime);
  const endTimeBlockQuery = await blocks.getDate(endTime);
  if (startTimeBlockQuery !== null && endTimeBlockQuery !== null) {
    const fromBlockHex = intToHex(startTimeBlockQuery.block);
    const toBlockHex = intToHex(endTimeBlockQuery.block);

    const logs = await alchemyProvider.core.getLogs({
      address: pool,
      topics: [eventSig, null],
      fromBlock: fromBlockHex,
      toBlock: toBlockHex,
    });

    let token0AmountTotal = 0;
    let token1AmountTotal = 0;

    logs.forEach((log) => {
      const decoded = iface.parseLog(log);
      const tickLower = decoded.args[2]
      const tickUpper = decoded.args[3]
      if (tickLower >= nearestUsableTickLower && tickUpper <= nearestUsableTickUpper) {
          console.log(`Found a matching log`, decoded)
          const token0Amount = ethers.utils.formatUnits(decoded.args[4], 8);
          const token1Amount = ethers.utils.formatUnits(decoded.args[5], 18);
          token0AmountTotal = token0AmountTotal + parseFloat(token0Amount);
          token1AmountTotal = token1AmountTotal + parseFloat(token1Amount);
      }
    });
    console.log(
      `....... RESULTS: Collected ${token0AmountTotal} of ${poolTokenInfo.token0Name} and ${token1AmountTotal} of ${poolTokenInfo.token1Name} in the specified pool, price and time range....`
    );
  }
}
