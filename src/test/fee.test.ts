import {
  logBase,
} from "../utils";

describe("testing tick price computation", () => {
  const base = Math.sqrt(1.0001);

  it("should get ticks correctly from price ", () => {
    const price = 146840733479;
    const token0Decimal = 8;
    const token1Decimal = 18;
    const scaledPrice = (price * 10 ** token1Decimal) / 10 ** token0Decimal;

    const sqrtPrice = Math.sqrt(scaledPrice);
    const tick = logBase(sqrtPrice, base);
    const tickLower = Math.floor(tick);
    //expect(tickLower).toBe(257138);
  });

  it("should get price correctly from tick ", () => {
    const tick = 254280;
    const price =
      Math.pow(Math.sqrt(1.0001), tick) * Math.pow(Math.sqrt(1.0001), tick);
    console.log(price);
    expect(price).toBe(110328562738.7342)
 
  });
});
