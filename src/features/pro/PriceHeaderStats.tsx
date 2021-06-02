import React, { FC, useMemo, useState } from 'react'
import { useSwapHistory } from '../../context/Pro/hooks'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { formatNumber, priceFormatter } from '../../functions'
import { OrderDirection } from '../../context/Pro/types'
import withPair, { WithPairProps } from '../../hoc/withPair'
import { usePairContract } from '../../hooks/useContract'
import useAsyncEffect from '../../hooks/useAsyncEffect'
import CurrencyLogo from '../../components/CurrencyLogo'
import { useTotalSupply } from '../../hooks/useTotalSupply'
import useSWR from 'swr'
import { exchange } from '../../fetchers/graph'
import Lottie, { LottiePlayer } from 'lottie-react'
import loadingCircle from '../../animation/loading-circle.json'

const query = `
    query pairTimeTravelQuery($id: String!, $block: Block_height!) {
        pair(id: $id, block: $block) {
            id
            reserveUSD
            trackedReserveETH
            volumeUSD
            untrackedVolumeUSD
            txCount
        }
    }
`

interface PriceHeaderStatsProps extends WithPairProps {}

const PriceHeaderStats: FC<PriceHeaderStatsProps> = ({ pair }) => {
    const { i18n } = useLingui()
    const swapHistory = useSwapHistory()
    const tokenState = useTotalSupply(pair.token0)

    const call = useMemo(() => [query, { id: pair.liquidityToken.address }], [pair.liquidityToken.address])
    const { data: pairData } = useSWR(call, exchange)

    const [pairState, setPairState] = useState<[number, number]>([0, 0])
    const lastSwap = swapHistory.length > 0 ? swapHistory[swapHistory.length - 1] : null

    const pairContract = usePairContract(pair.liquidityToken.address)

    useAsyncEffect(async () => {
        const [reserveA, reserveB] = await pairContract.getReserves()
        const decimals = await pairContract.decimals()
        setPairState([+reserveA.toFixed(decimals), +reserveB.toFixed(decimals)])
    }, [pairContract])

    const liquidity = pairState[0] * lastSwap?.price + pairState[1] * (+lastSwap?.volumeUSD / +lastSwap?.amountQuote)

    return (
        <div className="flex h-full px-4 gap-12 text-sm items-center">
            <div className="flex gap-1 items-baseline">
                <span
                    className={`text-high-emphesis font-bold flex items-baseline font-mono ${
                        lastSwap?.side === OrderDirection.BUY ? 'text-green' : 'text-red'
                    }`}
                >
                    {priceFormatter.format(lastSwap?.price)}
                </span>
                <span className="text-secondary text-xs">{i18n._(t`Last trade price`)}</span>
            </div>
            <div className="flex gap-1 items-baseline">
                <span className="text-high-emphesis font-bold font-mono">$158,014,358.38</span>
                <span className="text-secondary text-xs">{i18n._(t`24h volume`)}</span>
            </div>
            <div className="flex gap-1 items-baseline">
                <span className="text-high-emphesis font-bold font-mono">{formatNumber(liquidity, true)}</span>
                <span className="text-secondary text-xs">{i18n._(t`Liquidity`)}</span>
            </div>
            {lastSwap && tokenState ? (
                <div className="flex gap-1 items-baseline">
                    <div className="relative" style={{ top: 4 }}>
                        <CurrencyLogo currency={pair.token0} size={18} />
                    </div>
                    <span className="text-high-emphesis font-bold font-mono">
                        {formatNumber(+tokenState.toExact() * lastSwap.price, true)}
                    </span>
                    <span className="text-secondary text-xs">{i18n._(t`Fully diluted market cap`)}</span>
                </div>
            ) : (
                <Lottie animationData={loadingCircle} autoplay loop className="w-6 h-6" />
            )}
        </div>
    )
}

export default withPair(PriceHeaderStats)
