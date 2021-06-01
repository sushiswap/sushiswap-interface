# Oracles

Currently there is two types of oracles which the sushi interface supports, Chainlink & SushiSwap TWAP.

## Chainlink

- Requires a mapping entry added (src/constants/chainlink/mapping.ts).
- Requires one exchange rate update to start.

<!-- ## SushiSwap TWAP

- Requires two exchange rate updates to start.
- On creation both current & oracle exchange rate will be set to zero.
- After first update both will still be zero, after the second both would be non-zero if a liquid pool is backing the oracle. -->