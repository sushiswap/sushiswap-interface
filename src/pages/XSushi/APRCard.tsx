import React from 'react'
import MoreInfoSymbol from '../../assets/images/more-info.svg'

export default function APRCard({ apr, numSushi }: any) {
    return (
        <div className="flex w-full justify-between items-center max-w-xl h-24 p-4 md:pl-5 md:pr-7 rounded bg-light-yellow bg-opacity-40">
            <div className="flex flex-col">
                <div className="flex flex-nowrap justify-center items-center mb-4 md:mb-2">
                    <p className="whitespace-nowrap text-caption2 md:text-lg md:leading-5 font-bold text-high-emphesis">
                        Staking APR{' '}
                    </p>
                    <img className="cursor-pointer ml-3" src={MoreInfoSymbol} alt={'more info'} />
                </div>
                <div className="flex">
                    <button
                        className={`
                        py-1 px-4 md:py-1.5 md:px-7 rounded
                        text-xs md:text-sm font-medium md:font-bold text-dark-900
                        bg-light-yellow hover:bg-opacity-90`}
                    >
                        Learn More
                    </button>
                </div>
            </div>
            <div className="flex flex-col">
                <p className="text-right text-high-emphesis font-bold text-lg md:text-h4 mb-1">
                    {`${apr.toFixed(1)}%`}
                </p>
                <p className="text-right text-primary w-32 md:w-64 text-caption2 md:text-base">
                    {`${numSushi.toFixed(1)} SUSHI per $1,000 per day`}
                </p>
            </div>
        </div>
    )
}
