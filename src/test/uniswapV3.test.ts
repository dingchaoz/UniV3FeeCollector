import { getPoolImmutables } from "../v3Methods";
import { jsonRpcProvider } from "../utils";
import { ChainId, Token, Fetcher } from "@uniswap/sdk";
import * as uniSdk from "@uniswap/v3-sdk";

describe("testing uniswap sdk", () => {
  //const pool = "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8";
  const pool = "0xCBCdF9626bC03E24f779434178A73a0B4bad62eD";

  it("should get ticks correctly from price ", async () => {
    expect(60).toBe(60);
  });

  it("should get ticks correctly from price ", async () => {
    const res = await getPoolImmutables(pool, jsonRpcProvider);
    expect(res.tickSpacing).toBe(60);
  });

  it("should get token data", async () => {
    const chainId = ChainId.MAINNET;
    const tokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // must be checksummed
    const token0: Token = await Fetcher.fetchTokenData(chainId, tokenAddress);
    expect(token0.decimals).toBe(18);
  });

  it("should get closest tick", async () => {
    const res = uniSdk.nearestUsableTick(253297, 60);
    expect(res).toBe(253320);
  });
});
