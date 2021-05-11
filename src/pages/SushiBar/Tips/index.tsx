import React, { useCallback, useContext } from 'react'
import { Helmet } from 'react-helmet'
import { ChevronLeft } from 'react-feather'
import { Link } from 'react-router-dom'

import { Button } from 'components'
import { ThemeContext } from 'styled-components'
import { useHistory } from 'react-router-dom'

import BentoSquare from '../../../assets/images/bento-square.png'
import AaveSquare from '../../../assets/images/aave-square.png'
import Vote from '../../../assets/images/vote.png'
//import BaoSquare from '../../../assets/images/bao-square.png'
import CreamSquare from '../../../assets/images/aave-square.png'

interface Tip {
    title: string
    image: string
    description: JSX.Element | string
    href: string
}

const tips: readonly Tip[] = [
    {
        title: 'Deposit into BentoBox',
        image: BentoSquare,
        description:
            'Deposit your xSUSHI into BentoBox to passively earn yield through an xSUSHI investment strategy, or use as collateral within Kashi and future Bento dapps.',
        href: '#'
    },
    {
        title: 'Make your voice heard',
        image: Vote,
        description:
            'As an xSUSHI holder, your share of the staking pool correlates to the weight of your vote when participating in on-chain governance.',
        href: '#'
    },
    {
        title: 'Stack Yields with Aave',
        image: AaveSquare,
        description:
            'Deposit your xSUSHI into Aave to receive aXSUSHI to earn collateral interest and borrowing power.',
        href: '#'
    },
    {
        title: 'Stack Yields with Cream',
        image: CreamSquare,
        description: (
            <>
                Farm for more yields at{' '}
                <Link to="#" className="underline">
                    cream.finance
                </Link>{' '}
                by depositing xSUSHI or by staking your SUSHI LP tokens from the{' '}
                <Link to="#" className="underline">
                    SUSHI/xSUSHI
                </Link>{' '}
                and/or{' '}
                <Link to="#" className="underline">
                    xSUSHI/ETH
                </Link>{' '}
                pools.
            </>
        ),
        href: '#'
    }
]

export default function SushiBarTips() {
    const theme = useContext(ThemeContext)
    const history = useHistory()

    const goBack = useCallback(() => {
        history.goBack()
    }, [history])

    return (
        <>
            <Helmet>
                <title>xSUSHI | Sushi</title>
            </Helmet>
            <div className="w-full max-w-2xl mb-4">
                <Button size="small" className="flex items-center pl-0 mb-4" onClick={goBack}>
                    <ChevronLeft strokeWidth={2} size={18} color={theme.white} />
                    <span className="ml-1">Go Back</span>
                </Button>
                <div className="text-high-emphesis text-h4">Make the most of your xSUSHI.</div>
                <div className="text-gray-500 py-3">
                    You can leave the bar and exchange your xSUSHI for SUSHI (as well as collect any earned interest) at
                    any time. However, there are more ways to use xSUSHI to maximize your yield potential!
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                    {tips.map(({ title, image, description, href }, i) => (
                        <div className="bg-dark-900 px-6 py-5 rounded-md" key={i}>
                            <div className="md:min-h-cardContent">
                                <div className="flex items-center">
                                    <img
                                        src={image}
                                        alt="BentoBox"
                                        style={{
                                            filter: 'drop-shadow(0px 3px 6px rgba(15, 15, 15, 0.25))'
                                        }}
                                        className="w-14 md:w-16"
                                    />
                                    <div className="text-high-emphesis text-xl md:text-h5 ml-4 leading-6">{title}</div>
                                </div>
                                <div className="text-caption text-gray-500 leading-6 mt-4 mb-3">{description}</div>
                            </div>
                            <Link to={href} className="text-caption md:text-body text-primary font-bold pt-1">
                                Learn More
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
