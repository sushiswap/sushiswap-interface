import { ChipStateProps } from '../../../../components/Chip'

export const SORT_OPTIONS = [
  { title: 'APY Highest to Lowest', desc: true },
  { title: 'APY Lowest to Highest', desc: false },
  { title: 'TVL Highest to Lowest', desc: true },
  { title: 'TVL Lowest to Highest', desc: false },
]

export const POOL_TYPES: ChipStateProps[] = [
  { label: 'Classic', color: 'default' },
  { label: 'Concentrated', color: 'purple' },
  { label: 'Multi-Asset', color: 'blue' },
  { label: 'Weighted', color: 'yellow' },
]

export const FEE_TIERS: ChipStateProps[] = [
  { label: '1%', color: 'blue' },
  { label: '0.5%', color: 'blue' },
  { label: '0.1%', color: 'blue' },
  { label: '0.05%', color: 'blue' },
]
