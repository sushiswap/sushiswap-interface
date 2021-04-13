import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card } from 'kashi/components'
import { useActiveWeb3React } from 'hooks'
import Web3Status from 'components/Web3Status'
import KashiNeonSign from '../../assets/kashi/kashi-neon.png'
import ComingSoon from '../../assets/kashi/coming-soon.png'
import BentoBoxLogo from '../../assets/kashi/bentobox-logo.svg'
import BentoBoxHero from '../../assets/kashi/bentobox-hero.jpg'
function BentoBox(): JSX.Element {
    const { account } = useActiveWeb3React()

    return (
        <div>
            <div className="absolute bg-dark-1000 top-0 right-0 bottom-0 left-0" />
            <div
                className="absolute -top-32 right-0 left-0"
                style={{
                    height: '700px'
                }}
            >
                <img className="h-full w-full object-cover object-bottom opacity-50" src={BentoBoxHero} alt="" />
            </div>

            <div className="relative flex flex-col items-center pt-36 pt-4 sm:pt-48">
                <img alt="" src={BentoBoxLogo} className="object-scale-down w-40 md:w-60 h-auto -mt-40 md:-mt-52" />

                <div className="container mx-auto max-w-3xl">
                    <div className="font-bold text-center text-3xl md:text-5xl text-high-emphesis">BentoBox Apps</div>
                    <div className="font-medium text-center text-high-emphesis mt-0 md:mt-4 mb-8 p-4">
                        BentoBox is new a way to use dapps gas-efficiently and gain extra yield.
                    </div>
                </div>
            </div>

            <div className="container mx-auto sm:px-6 max-w-5xl">
                <div className="grid gap-4 sm:gap-12 grid-flow-auto grid-cols-4">
                    <Card className="col-span-2 md:col-span-1 w-full bg-dark-800 hover:bg-dark-900 cursor-pointer rounded shadow-pink-glow hover:shadow-pink-glow-hovered">
                        <div className="relative w-full">
                            <img alt="" src={KashiNeonSign} className="block m-auto w-full h-auto mb-4" />
                            {account ? (
                                <Link to={'/bento/kashi/borrow'}>
                                    <Button
                                        color="gradient"
                                        className="w-full rounded text-base text-high-emphesis px-4 py-3"
                                    >
                                        Enter
                                    </Button>
                                </Link>
                            ) : (
                                <Web3Status />
                            )}
                        </div>
                    </Card>
                    <Card className="flex items-center justify-center col-span-2 md:col-span-1  bg-dark-800 hover:bg-dark-900 cursor-pointer shadow-blue-glow hover:shadow-blue-glow-hovered transition-colors">
                        <img src={ComingSoon} alt="Coming Soon" className="block m-auto w-full h-auto mb-4" />
                        <Button
                            color="gradient"
                            className="w-full rounded text-base text-high-emphesis px-4 py-3"
                            disabled
                        >
                            ...
                        </Button>
                    </Card>
                    <Card className="flex items-center justify-center col-span-2 md:col-span-1 bg-dark-800 hover:bg-dark-900 cursor-pointer shadow-pink-glow hover:shadow-pink-glow-hovered transition-colors">
                        <img src={ComingSoon} alt="Coming Soon" className="block m-auto w-full h-auto mb-4" />
                        <Button
                            color="gradient"
                            className="w-full rounded text-base text-high-emphesis px-4 py-3"
                            disabled
                        >
                            ...
                        </Button>
                    </Card>
                    <Card className="flex items-center justify-center col-span-2 md:col-span-1 bg-dark-800 hover:bg-dark-900 cursor-pointer shadow-blue-glow hover:shadow-blue-glow-hovered transition-colors">
                        <img src={ComingSoon} alt="Coming Soon" className="block m-auto w-full h-auto mb-4" />
                        <Button
                            color="gradient"
                            className="w-full rounded text-base text-high-emphesis px-4 py-3"
                            disabled
                        >
                            ...
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default BentoBox
