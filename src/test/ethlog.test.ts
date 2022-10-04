import { ethers } from "ethers";
import {
  logBase,
  intToHex,
  intToPaddedHex,
  initProvider,
  blocks,
} from "../utils";
import { getNearestTickFromPrice } from "../feeCollector";
import {
  collectEventNameTypes,
  collectEventABI,
  burnEventABI,
  burnEventNameTypes,
} from "../constants";

describe("testing eth router alchemy", () => {
  //const pool = "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8";
  const pool = "0xCBCdF9626bC03E24f779434178A73a0B4bad62eD";
  const eventSig = ethers.utils.id(collectEventNameTypes);
  const burnEventSig = ethers.utils.id(burnEventNameTypes);
  const iburnFace = new ethers.utils.Interface(burnEventABI);
  const iface = new ethers.utils.Interface(collectEventABI);
  const alchemyProvider = initProvider();
  const token0Decimal = 8;
  const token1Decimal = 18;
  const tickSpacing = 60;
  const tickBytes = 32;

  it("should get collect event ", async () => {
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
      console.log(`decoded log`, decoded);
      const tickLower = decoded.args[2];
      const tickUpper = decoded.args[3];
      if (
        tickLower >= nearestUsableTickLower &&
        tickUpper <= nearestUsableTickUpper
      ) {
        const token0Amount = ethers.utils.formatUnits(decoded.args[4], 8);
        const token1Amount = ethers.utils.formatUnits(decoded.args[5], 18);
        token0AmountTotal = token0AmountTotal + parseFloat(token0Amount);
        token1AmountTotal = token1AmountTotal + parseFloat(token1Amount);
      }
    });

    console.log(
      `....... RESULTS: Collected ${token0AmountTotal} and ${token1AmountTotal} in the specified pool, price and time range....`
    );

    const burnLogs = await alchemyProvider.core.getLogs({
      address: pool,
      topics: [burnEventSig, null],
      fromBlock: fromBlockHex,
      toBlock: toBlockHex,
    });
    console.log(`burn event logs`, burnLogs);

    let token0RemovedAmountTotal = 0;
    let token1RemovedAmountTotal = 0;

    burnLogs.forEach((log) => {
      const decoded = iburnFace.parseLog(log);
      console.log(`decoded log`, decoded);
      const tickLower = decoded.args[2];
      const tickUpper = decoded.args[3];
      if (
        tickLower >= nearestUsableTickLower &&
        tickUpper <= nearestUsableTickUpper
      ) {
        const token0Amount = ethers.utils.formatUnits(decoded.args[4], 8);
        const token1Amount = ethers.utils.formatUnits(decoded.args[5], 18);
        token0RemovedAmountTotal =
          token0RemovedAmountTotal + parseFloat(token0Amount);
        token1RemovedAmountTotal =
          token1RemovedAmountTotal + parseFloat(token1Amount);
      }
    });
    console.log(
      `....... RESULTS: Removed ${token0RemovedAmountTotal} and ${token1RemovedAmountTotal} in the specified pool, price and time range....`
    );

    console.log(
      `....... Net FEE COLLECTED: ${
        token0AmountTotal - token0RemovedAmountTotal
      } and ${
        token1AmountTotal - token1RemovedAmountTotal
      } in the specified pool, price and time range....`
    );
  });

  it("should get burn event ", async () => {
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

    console.log(`nearest lower tick`, nearestUsableTickLower);
    console.log(`nearest upper tick`, nearestUsableTickUpper);

    const burnLogs = await alchemyProvider.core.getLogs({
      address: pool,
      topics: [burnEventSig, null],
      fromBlock: fromBlockHex,
      toBlock: toBlockHex,
    });
    console.log(`burn event logs`, burnLogs);

    let token0RemovedAmountTotal = 0;
    let token1RemovedAmountTotal = 0;

    burnLogs.forEach((log) => {
      const decoded = iburnFace.parseLog(log);
      console.log(`decoded log`, decoded);
      const tickLower = decoded.args[1];
      const tickUpper = decoded.args[2];
      if (
        tickLower >= nearestUsableTickLower &&
        tickUpper <= nearestUsableTickUpper
      ) {
        const token0Amount = ethers.utils.formatUnits(decoded.args[4], 8);
        const token1Amount = ethers.utils.formatUnits(decoded.args[5], 18);
        console.log(`removed amount in this tx`, token0Amount, token1Amount);
        token0RemovedAmountTotal =
          token0RemovedAmountTotal + parseFloat(token0Amount);
        token1RemovedAmountTotal =
          token1RemovedAmountTotal + parseFloat(token1Amount);
      }
    });
    console.log(
      `....... RESULTS: Removed ${token0RemovedAmountTotal} and ${token1RemovedAmountTotal} in the specified pool, price and time range....`
    );

    // console.log(
    //   `....... Net FEE COLLECTED: ${
    //     token0AmountTotal - token0RemovedAmountTotal
    //   } and ${
    //     token1AmountTotal - token1RemovedAmountTotal
    //   } in the specified pool, price and time range....`
    // );
  });

  it.only("should get tx receipt ", async () => {
    const burnEventSig = ethers.utils.id(burnEventNameTypes);
    const receipt = await alchemyProvider.core.getTransactionReceipt(
      "0x1b87aa509f61ce9847bd12dec6f71ec13c5ac11e1cf40c3c44d20519cfb4c927"
    );
    const logs = receipt!.logs;
    const burnEvent = logs!.filter((l) => l.topics[0] === burnEventSig);

    const decoded = iburnFace.parseLog(burnEvent[0]);
    const token0Amount = ethers.utils.formatUnits(decoded.args[4], 8);
    const token1Amount = ethers.utils.formatUnits(decoded.args[5], 18);
    console.log(token0Amount, token1Amount);
  });
});
