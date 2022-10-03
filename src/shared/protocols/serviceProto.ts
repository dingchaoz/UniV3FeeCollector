import { ServiceProto } from 'tsrpc-proto';
import { ReqFeeCollector, ResFeeCollector } from './PtlFeeCollector';

export interface ServiceType {
    api: {
        "FeeCollector": {
            req: ReqFeeCollector,
            res: ResFeeCollector
        }
    },
    msg: {

    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "services": [
        {
            "id": 0,
            "name": "FeeCollector",
            "type": "api"
        }
    ],
    "types": {
        "PtlFeeCollector/ReqFeeCollector": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "pool",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "startTime",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "endTime",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 3,
                    "name": "priceLower",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 4,
                    "name": "priceUpper",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "PtlFeeCollector/ResFeeCollector": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "token0",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "token1",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "amount0",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 3,
                    "name": "amount1",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        }
    }
};