import { ApiCall } from "tsrpc";
import { ReqFeeCollector, ResFeeCollector } from "../shared/protocols/PtlFeeCollector";
import {getFees} from '../feeCollector'

export default async function (call: ApiCall<ReqFeeCollector, ResFeeCollector>) {
    const pool = call.req.pool
    const startTime = call.req.startTime
    const endTime = call.req.endTime
    const priceLower = call.req.priceLower
    const priceUpper = call.req.priceUpper
    const res = getFees(pool,priceLower,priceUpper,startTime,endTime)
    if (res !== undefined) {
      call.succ({
        token0: "wbtc",
        token1: "weth",
        amount0: 0,
        amount1: 1
      })
    } else {
      call.error('Invalid tokens')
    }
}