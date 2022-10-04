export const collectEventABI = [
  "event Collect(address indexed owner,address recipient,int24 indexed tickLower,int24 indexed tickUpper,uint128 amount0,uint128 amount1)",
];
export const collectEventNameTypes =
  "Collect(address,address,int24,int24,uint128,uint128)";

export const poolImmutablesAbi = [
  "function factory() external view returns (address)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)",
  "function fee() external view returns (uint24)",
  "function tickSpacing() external view returns (int24)",
  "function maxLiquidityPerTick() external view returns (uint128)",
];

export const tokenImmutablesAbi = [
  "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)",

]
