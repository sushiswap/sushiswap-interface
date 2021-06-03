import React, { FC } from 'react'
import { usePro } from '../../context/Pro/hooks'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { formatNumber, priceFormatter } from '../../functions'
import { OrderDirection } from '../../context/Pro/types'
import withPair, { WithPairProps } from '../../hoc/withPair'
import Lottie from 'lottie-react'
import loadingCircle from '../../animation/loading-circle.json'

interface PriceHeaderStatsProps {}

const PriceHeaderStats: FC<PriceHeaderStatsProps> = () => {
    const { i18n } = useLingui()
    const [{ lastSwap, pairData }] = usePro()

    const volumeUSD = +(pairData?.current?.volumeUSD === '0'
        ? pairData?.current?.untrackedVolumeUSD
        : pairData?.current?.volumeUSD)

    const oneDayVolumeUSD = +(pairData?.oneDay?.volumeUSD === '0'
        ? pairData?.oneDay?.untrackedVolumeUSD
        : pairData?.oneDay?.volumeUSD)

    const twoDayVolumeUSD = +(pairData?.twoDay?.volumeUSD === '0'
        ? pairData?.twoDay?.untrackedVolumeUSD
        : pairData?.twoDay?.volumeUSD)

    const volume = volumeUSD - oneDayVolumeUSD
    const volumeYesterday = oneDayVolumeUSD - twoDayVolumeUSD
    const volumeChange = ((volume - volumeYesterday) / volumeYesterday) * 10
    const fees = volume * 0.003

    return (
        <div className="flex h-full px-4 gap-12 text-sm items-center">
            <div className="flex gap-1 items-baseline">
                <span
                    className={`text-high-emphesis font-bold flex items-baseline font-mono ${
                        lastSwap?.side === OrderDirection.BUY
                            ? 'text-green'
                            : 'text-red'
                    }`}
                >
                    {priceFormatter.format(lastSwap?.price)}
                </span>
                <span className="text-secondary text-xs">
                    {i18n._(t`Last trade price`)}
                </span>
            </div>
            {pairData?.current?.reserveUSD ? (
                <div className="flex gap-1 items-baseline">
                    <span className="text-high-emphesis font-bold font-mono">
                        {formatNumber(pairData.current.reserveUSD, true)}
                    </span>
                    <span className="text-secondary text-xs">
                        {i18n._(t`Liquidity`)}
                    </span>
                </div>
            ) : (
                <Lottie
                    animationData={loadingCircle}
                    autoplay
                    loop
                    className="w-6 h-6"
                />
            )}
            {volume ? (
                <div className="flex gap-1 items-baseline">
                    <span className="text-high-emphesis font-bold font-mono flex items-baseline gap-1">
                        {formatNumber(volume, true)} {/*<span*/}
                        {/*    className={`text-xs font-medium ${*/}
                        {/*        volumeChange > 0 ? 'text-green' : 'text-red'*/}
                        {/*    }`}*/}
                        {/*>*/}
                        {/*    {formatPercent(volumeChange)}*/}
                        {/*</span>*/}
                    </span>
                    <span className="text-secondary text-xs">
                        {i18n._(t`24h volume`)}
                    </span>
                </div>
            ) : (
                <Lottie
                    animationData={loadingCircle}
                    autoplay
                    loop
                    className="w-6 h-6"
                />
            )}
            {fees ? (
                <div className="flex gap-1 items-baseline">
                    <span className="text-high-emphesis font-bold font-mono">
                        {formatNumber(fees, true)}
                    </span>
                    <span className="text-secondary text-xs">
                        {i18n._(t`24h Fees`)}
                    </span>
                </div>
            ) : (
                <Lottie
                    animationData={loadingCircle}
                    autoplay
                    loop
                    className="w-6 h-6"
                />
            )}
            {/*{pairData?.current && lastSwap ? (*/}
            {/*    <div className="flex gap-1 items-baseline">*/}
            {/*        <div className="relative" style={{ top: 4 }}>*/}
            {/*            <CurrencyLogo currency={pair.token0} size={18} />*/}
            {/*        </div>*/}
            {/*        <span className="text-high-emphesis font-bold font-mono">*/}
            {/*            {formatNumber(*/}
            {/*                pairData.pair.totalSupply * lastSwap.price,*/}
            {/*                true*/}
            {/*            )}*/}
            {/*        </span>*/}
            {/*        <span className="text-secondary text-xs">*/}
            {/*            {i18n._(t`Fully diluted market cap`)}*/}
            {/*        </span>*/}
            {/*    </div>*/}
            {/*) : (*/}
            {/*    <Lottie*/}
            {/*        animationData={loadingCircle}*/}
            {/*        autoplay*/}
            {/*        loop*/}
            {/*        className="w-6 h-6"*/}
            {/*    />*/}
            {/*)}*/}
        </div>
    )
}

export default PriceHeaderStats
