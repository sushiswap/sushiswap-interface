import { Currency, Percent } from '@figswap/core-sdk'
import { SwapLayout } from 'app/layouts/SwapLayout'
import { Banner as BannerType, fetchBanners } from 'app/lib/api'

import LegacySwap from '../legacy/swap'

export interface SwapProps {
  banners: BannerType[]
  placeholderSlippage?: Percent
  trident?: boolean
  className?: string
  inputCurrency?: Currency
  outputCurrency?: Currency
}

export async function getServerSideProps() {
  try {
    const banners = await fetchBanners()
    return {
      props: { banners: banners || [] },
    }
  } catch (e) {
    return {
      props: { banners: [] },
    }
  }
}

const Swap = ({ banners }: SwapProps) => {
  return <LegacySwap banners={banners} />
}

Swap.Layout = SwapLayout('swap-page')
export default Swap
