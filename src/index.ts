import { ethers } from "ethers";
import * as path from 'path'
import {
  logBase,
  intToHex,
  intToPaddedHex,
  initProvider,
  blocks,
} from "./utils";
import yargs from "yargs";
import { collectEventABI, collectEventNameTypes } from "./constants";
import { HttpServer } from 'tsrpc'
import { serviceProto } from './shared/protocols/serviceProto'

// Create the Server
const server = new HttpServer(serviceProto, {
    port: 3000,
    json: true,
  })

// const argv = yargs(process.argv.slice(5))
//   .option('pool', {
//     alias: 'p',
//     description: 'Tell the pool to check',
//     type: 'string'
//   })
//   .option('startTime', {
//     alias: 's',
//     description: 'Tell the start time',
//     type: 'string'
//   })
//   .option('endTime', {
//     alias: 'e',
//     description: 'Tell the end time',
//     type: 'string'
//   })
//   .option('priceLower', {
//     alias: 'l',
//     description: 'Specify the lower price',
//     type: 'string'
//   })
//   .option('priceUpper', {
//     alias: 'u',
//     description: 'Specif the upper price',
//     type: 'string'
//   })
//   .demandOption(["pool","startTime","endTime","priceLower","priceUpper"], "Please specify the given price range during a given period period time for a given pool address")
//   .help()
//   .alias('help', 'h').argv;

const alchemyProvider = initProvider();

const pool = "0xCBCdF9626bC03E24f779434178A73a0B4bad62eD"; // WBTC-WETH
const price = 14.84;
const sqrtPrice = Math.sqrt(price);
const base = Math.sqrt(1.0001);
const tick = logBase(sqrtPrice, base); // i=Log(sqrt(price), sqrt(1.0001)) according to white paper
const iface = new ethers.utils.Interface(collectEventABI);
const eventSig = ethers.utils.id(collectEventNameTypes); // 0x70935338e69775456a85ddef226c395fb668b63fa0115f5f20610b388e6ca9c0 ,Collect() signiture
const tickBytes = 32;
const tickLower = intToPaddedHex(254280, tickBytes);
const tickUpper = intToPaddedHex(257100, tickBytes);
const fromBlock = 15664840;
const fromBlockHex = intToHex(fromBlock);
const toBlock = 15664845;
const toBlockHex = intToHex(toBlock);

// Entry function
async function main() {

      // Auto implement APIs
  await server.autoImplementApi(path.resolve(__dirname, 'api'))

  // update market and tokens reference data on every new block
  // _throttle implements a queue to store new block events and set a delay to assure each new ref data is completed
//   alchemyProvider.ws.on('block', _.throttle(updateRefData, 50000))

  await server.start()
//   const logs = await alchemyProvider.core.getLogs({
//     address: pool,
//     topics: [eventSig, null, tickLower, tickUpper],
//     fromBlock: fromBlockHex,
//     toBlock: toBlockHex,
//   });

//   logs.forEach((log) => {
//     const decoded = iface.parseLog(log);
//     const token0Amount = ethers.utils.formatUnits(decoded.args[4], 8);
//     const token1Amount = ethers.utils.formatUnits(decoded.args[5], 18);
//     const tickLower = decoded.args[2];
//     const tickUpper = decoded.args[3];
//     console.log(tickLower, token0Amount, tickUpper, token1Amount);
//   });

//   const res = await blocks.getDate("03/20/2020 03:10:00 AM");
//   if (res !== null) {
//     console.log(res.block, res.timestamp);
//   }
}

main().catch((e) => {

    server.logger.error(e)
  // Exit if any error during the startup
  process.exit(-1);
});
