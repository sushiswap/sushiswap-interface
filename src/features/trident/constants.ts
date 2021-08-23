import { ChipColor } from '../../components/Chip'
import { PoolType } from './types'

export const SORT_OPTIONS = [
  { title: 'APY Highest to Lowest', desc: true },
  { title: 'APY Lowest to Highest', desc: false },
  { title: 'TVL Highest to Lowest', desc: true },
  { title: 'TVL Lowest to Highest', desc: false },
]

type PoolTypesInterface = {
  [key in PoolType]: { label: string; color: ChipColor; description: string; long_description: string }
}

export const POOL_TYPES: PoolTypesInterface = {
  [PoolType.CLASSIC]: {
    label: 'Classic',
    color: 'default',
    description: 'Most common, traditional 50/50 value split between assets',
    long_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim bibendum in ut amet, sit fames. Iaculis ultrices sit fermentum commodo nisl eget etiam fusce ac. Risus enim sollicitudin phasellus nibh. Neque turpis amet at scelerisque vitae nibh magna. Aliquet ut natoque quisque eget pellentesque id. Convallis enim.',
  },
  [PoolType.CONCENTRATED]: {
    label: 'Concentrated',
    color: 'purple',
    description: 'Same value makeup of a classic pool, but for a specific price range',
    long_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim bibendum in ut amet, sit fames. Iaculis ultrices sit fermentum commodo nisl eget etiam fusce ac. Risus enim sollicitudin phasellus nibh. Neque turpis amet at scelerisque vitae nibh magna. Aliquet ut natoque quisque eget pellentesque id. Convallis enim.',
  },
  [PoolType.HYBRID]: {
    label: 'Hybrid',
    color: 'blue',
    description: '3 to 32 assets, with tokens deposited in equal values',
    long_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim bibendum in ut amet, sit fames. Iaculis ultrices sit fermentum commodo nisl eget etiam fusce ac. Risus enim sollicitudin phasellus nibh. Neque turpis amet at scelerisque vitae nibh magna. Aliquet ut natoque quisque eget pellentesque id. Convallis enim.',
  },
  [PoolType.WEIGHTED]: {
    label: 'Weighted',
    color: 'yellow',
    description: 'Two asset pools, with the value split skewed higher towards one.',
    long_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim bibendum in ut amet, sit fames. Iaculis ultrices sit fermentum commodo nisl eget etiam fusce ac. Risus enim sollicitudin phasellus nibh. Neque turpis amet at scelerisque vitae nibh magna. Aliquet ut natoque quisque eget pellentesque id. Convallis enim.',
  },
}

export const FEE_TIERS = [
  { label: '1%', color: 'blue' },
  { label: '0.5%', color: 'blue' },
  { label: '0.1%', color: 'blue' },
  { label: '0.05%', color: 'blue' },
]
