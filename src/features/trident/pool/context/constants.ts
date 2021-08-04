export const SORT_OPTIONS = [
  { title: 'APY Highest to Lowest', desc: true },
  { title: 'APY Lowest to Highest', desc: false },
  { title: 'TVL Highest to Lowest', desc: true },
  { title: 'TVL Lowest to Highest', desc: false },
]

export const POOL_TYPES = [
  { label: 'Classic', color: 'default', description: 'Most common, traditional 50/50 value split between assets' },
  {
    label: 'Concentrated',
    color: 'purple',
    description: 'Same value makeup of a classic pool, but for a specific price range',
  },
  { label: 'Multi-Asset', color: 'blue', description: '3 to 32 assets, with tokens deposited in equal values' },
  {
    label: 'Weighted',
    color: 'yellow',
    description: 'Two asset pools, with the value split skewed higher towards one.',
  },
]

export const FEE_TIERS = [
  { label: '1%', color: 'blue' },
  { label: '0.5%', color: 'blue' },
  { label: '0.1%', color: 'blue' },
  { label: '0.05%', color: 'blue' },
]
