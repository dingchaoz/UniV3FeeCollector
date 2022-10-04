import { getFees } from "./feeCollector";
const prompt = require("prompt-sync")({ sigint: true });

// Entry function
async function main() {
  // const pool = prompt('Enter a pool address to check collected fees: ')
  // const priceLower = prompt('Enter the lower price for the collected fees liquidity range : ')
  // const priceUpper = prompt('Enter upper price for the collected fees liquidity range: ')
  // const startTime = prompt('Enter start timestamp in epoch unix time for the collected fees time window: ')
  // const endTime = prompt('Enter end timefor in epoch unix time for the collected fees time window : ')

  // Example below
  const pool = "0xCBCdF9626bC03E24f779434178A73a0B4bad62eD"; // WBTC-WETH
  const priceLower = 7;
  const priceUpper = 28;
  const startTime = "1664788264";
  const endTime = "1664874664";

  getFees(pool, priceLower, priceUpper, startTime, endTime);
}

main().catch((e) => {
  // Exit if any error during the startup
  console.error(e);
  process.exit(-1);
});
