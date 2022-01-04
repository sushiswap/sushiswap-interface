import { PoolType } from '@sushiswap/tines'
import { ChipColor } from 'app/components/Chip'

type PoolTypesInterface = Record<
  PoolType,
  {
    label: string
    label_long: string
    color: ChipColor
    description: string
    long_description: string
    image: { url: string; width: number; height: number }
  }
>

export const POOL_TYPES: PoolTypesInterface = {
  ConstantProduct: {
    label: 'Classic',
    label_long: 'Classic Pool',
    color: 'default',
    description: 'Most common, traditional 50/50 value split between assets',
    long_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim bibendum in ut amet, sit fames. Iaculis ultrices sit fermentum commodo nisl eget etiam fusce ac. Risus enim sollicitudin phasellus nibh. Neque turpis amet at scelerisque vitae nibh magna. Aliquet ut natoque quisque eget pellentesque id. Convallis enim.',
    image: {
      url: '/images/trident/a-b-pool.png',
      width: 121,
      height: 95,
    },
  },
  Weighted: {
    label: 'Index',
    label_long: 'Index Pool',
    color: 'yellow',
    description: 'Two asset pools, with the value split skewed higher towards one.',
    long_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim bibendum in ut amet, sit fames. Iaculis ultrices sit fermentum commodo nisl eget etiam fusce ac. Risus enim sollicitudin phasellus nibh. Neque turpis amet at scelerisque vitae nibh magna. Aliquet ut natoque quisque eget pellentesque id. Convallis enim.',
    image: {
      url: '/images/trident/index-pool-scale.png',
      width: 151,
      height: 95,
    },
  },
  ConcentratedLiquidity: {
    label: 'Concentrated',
    label_long: 'Concentrated Range',
    color: 'purple',
    description: 'Same value makeup of a classic pool, but for a specific price range',
    long_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim bibendum in ut amet, sit fames. Iaculis ultrices sit fermentum commodo nisl eget etiam fusce ac. Risus enim sollicitudin phasellus nibh. Neque turpis amet at scelerisque vitae nibh magna. Aliquet ut natoque quisque eget pellentesque id. Convallis enim.',
    image: {
      url: '/images/trident/a-b-pool.png',
      width: 151,
      height: 95,
    },
  },
  Hybrid: {
    label: 'Stable',
    label_long: 'Stable Pool',
    color: 'blue',
    description: '3 to 32 assets, with tokens deposited in equal values',
    long_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim bibendum in ut amet, sit fames. Iaculis ultrices sit fermentum commodo nisl eget etiam fusce ac. Risus enim sollicitudin phasellus nibh. Neque turpis amet at scelerisque vitae nibh magna. Aliquet ut natoque quisque eget pellentesque id. Convallis enim.',
    image: {
      url: '/images/trident/a-b-pool.png',
      width: 121,
      height: 95,
    },
  },
}
