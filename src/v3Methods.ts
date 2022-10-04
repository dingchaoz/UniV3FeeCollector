import { poolImmutablesAbi,tokenImmutablesAbi } from "./constants";
import { ethers } from "ethers";
import { Address } from "cluster";

export interface Immutables {
  factory: Address;
  token0: Address;
  token1: Address;
  fee: number;
  tickSpacing: number;
  maxLiquidityPerTick: number;
}

export async function getPoolImmutables(poolAddress: string, provider) {
  const poolContract = new ethers.Contract(
    poolAddress,
    poolImmutablesAbi,
    provider
  );
  const PoolImmutables = {
    token0: await poolContract.token0(),
    token1: await poolContract.token1(),
    tickSpacing: await poolContract.tickSpacing(),
  };
  return PoolImmutables;
}

export async function getTokenImmutables(tokenAddress: string, provider) {
  const tokenContract = new ethers.Contract(
    tokenAddress,
    tokenImmutablesAbi,
    provider
  );
  const TokenImmutables = {
    name: await tokenContract.name(),
    symbol: await tokenContract.symbol(),
    decimals: await tokenContract.decimals(),
  };
  return TokenImmutables;
}
