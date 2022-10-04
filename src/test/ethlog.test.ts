import { ethers } from "ethers";
import {
  logBase,
  intToHex,
  intToPaddedHex,
  initProvider,
  blocks,
} from "../utils";
import { getNearestTickFromPrice } from "../feeCollector";
import { collectEventNameTypes,collectEventABI } from "../constants";

describe("testing eth router alchemy", () => {
  //const pool = "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8";
  const pool = "0xCBCdF9626bC03E24f779434178A73a0B4bad62eD";
  const eventSig = ethers.utils.id(collectEventNameTypes);
  const alchemyProvider = initProvider();
  const token0Decimal = 8;
  const token1Decimal = 18;
  const tickSpacing = 60;
  const tickBytes = 32;
  const iface = new ethers.utils.Interface(collectEventABI);
  it.only("should get ticks correctly from price ", async () => {
    const priceLower = 1;
    const priceUpper = 30;
    const fromBlockHex = "0xeefe33";
    const toBlockHex = "0xef1459";

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



    // not working ticks
    // 230280, 264300  (1,30)
    // 252240 257340 (9,15)

    // working ticks
    // 253320 257340 (10,15)

    
    // const nearestUsableTickLower = 253320
    // const nearestUsableTickUpper = 257340

    console.log(`nearest lower tick`, nearestUsableTickLower);
    console.log(`nearest upper tick`, nearestUsableTickUpper);

    const tickLowerHexPadded = intToPaddedHex(
      nearestUsableTickLower,
      tickBytes
    );
    const tickUpperHexPadded = intToPaddedHex(
      nearestUsableTickUpper,
      tickBytes
    );
    const logs = await alchemyProvider.core.getLogs({
      address: pool,
      topics: [eventSig, null],
      fromBlock: fromBlockHex,
      toBlock: toBlockHex,
    });
    //console.log(`returned logs`, logs);
    let token0AmountTotal = 0;
    let token1AmountTotal = 0;

    logs.forEach((log) => {
        const decoded = iface.parseLog(log);
        console.log(`decoded log`,decoded)
        const tickLower = decoded.args[2]
        const tickUpper = decoded.args[3]
        if (tickLower >= nearestUsableTickLower && tickUpper <= nearestUsableTickUpper) {
            const token0Amount = ethers.utils.formatUnits(decoded.args[4], 8);
            const token1Amount = ethers.utils.formatUnits(decoded.args[5], 18);
            token0AmountTotal = token0AmountTotal + parseFloat(token0Amount);
            token1AmountTotal = token1AmountTotal + parseFloat(token1Amount);
        }
      });

      console.log(
        `....... RESULTS: Collected ${token0AmountTotal} and ${token1AmountTotal} in the specified pool, price and time range....`
      );
  });
});
