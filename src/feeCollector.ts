import {
  logBase,
  intToHex,
  intToPaddedHex,
  initProvider,
  blocks,
} from "./utils";
import { ethers } from "ethers";
import { collectEventABI, collectEventNameTypes } from "./constants";

const alchemyProvider = initProvider();
const iface = new ethers.utils.Interface(collectEventABI);
const eventSig = ethers.utils.id(collectEventNameTypes);
const base = Math.sqrt(1.0001);
const tickBytes = 32;

export async function getFees(
  pool: string,
  priceLower: number,
  priceUpper: number,
  startTime: string,
  endTime: string
) {
  const tickLower = Math.floor(logBase(Math.sqrt(priceLower), base));
  const tickUpper = Math.ceil(logBase(Math.sqrt(priceUpper), base));
  const tickLowerHexPadded = intToPaddedHex(tickLower, tickBytes);
  const tickUpperHexPadded = intToPaddedHex(tickUpper, tickBytes);

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
