import { NamedDeclaration } from "typescript";

export interface ReqFeeCollector {
  pool: string;
  startTime: string;
  endTime: string;
  priceLower: number;
  priceUpper: number;
}

export interface ResFeeCollector {
  token0: string;
  token1: string;
  amount0: number;
  amount1: number;
}
