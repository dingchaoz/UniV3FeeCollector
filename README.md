## How pool and its fees are constructed in V3

The only fee tiers possible in Uniswap v3 at the moment: 1%, 0.3%, 0.05% and 0.01%. (The first three were present by default, the fourth one was voted in through governance.) In the future, more might be added, but it's unlikely there will be many more.

In the code, the fee tiers are expressed in basis points (1/100 of percents) multiplied by 100:

for 1% pools the fee tier is 10000
for 0.3% pools the fee tier is 3000
for 0.05% pools the fee tier is 500
for 0.01% pools the fee tier is 100

# Collect Events

[source code](https://github.com/Uniswap/v3-core/blob/main/contracts/interfaces/pool/IUniswapV3PoolEvents.sol#L38)
