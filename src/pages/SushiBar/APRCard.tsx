import React, { useEffect, useState } from 'react'
import MoreInfoSymbol from '../../assets/images/more-info.svg'
import sushiData from '@sushiswap/sushi-data'
import { t } from '@lingui/macro'

export default function APRCard({ numSushi }: any) {
    const [Apr, setApr] = useState<any>()
    useEffect(() => {
        const fetchData = async () => {
            const results = await Promise.all([
                sushiData.bar.info(),
                sushiData.exchange.dayData(),
                sushiData.sushi.priceUSD()
            ])
            const APR =
                (((results[1][1].volumeUSD * 0.05) / results[0].totalSupply) * 365) / (results[0].ratio * results[2])

            setApr(APR)
        }
        fetchData()
    }, [])
    return (
        <div className="flex w-full justify-between items-center max-w-xl h-24 p-4 md:pl-5 md:pr-7 rounded bg-light-yellow bg-opacity-40">
            <div className="flex flex-col">
                <div className="flex flex-nowrap justify-center items-center mb-4 md:mb-2">
                    <p className="whitespace-nowrap text-caption2 md:text-lg md:leading-5 font-bold text-high-emphesis">
                        {t`Staking APR`}{' '}
                    </p>
                    {/* <img className="cursor-pointer ml-3" src={MoreInfoSymbol} alt={'more info'} /> */}
                </div>
                <div className="flex">
                    <a
                        href={`https://analytics.sushi.com/bar`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={`
                        py-1 px-4 md:py-1.5 md:px-7 rounded
                        text-xs md:text-sm font-medium md:font-bold text-dark-900
                        bg-light-yellow hover:bg-opacity-90`}
                    >
                        {t`View Stats`}
                    </a>
                </div>
            </div>
            <div className="flex flex-col">
                <p className="text-right text-high-emphesis font-bold text-lg md:text-h4 mb-1">
                    {`${Apr ? Apr.toFixed(2) + '%' : t`Loading...`}`}
                </p>
                <p className="text-right text-primary w-32 md:w-64 text-caption2 md:text-base">{t`Yesterday's APR`}</p>
            </div>
        </div>
    )
}
