import Web3Status from 'components/Web3Status'
import { useActiveWeb3React } from 'hooks'
import { Button, Card } from 'kashi/components'
import React from 'react'
import { Link } from 'react-router-dom'
import BentoBoxHero from '../../assets/kashi/bentobox-hero.jpg'
import BentoBoxLogo from '../../assets/kashi/bentobox-logo.svg'
import ComingSoon from '../../assets/kashi/coming-soon.png'
import KashiNeonSign from '../../assets/kashi/kashi-neon.png'
import { Helmet } from 'react-helmet'
function BentoBox(): JSX.Element {
    const { account } = useActiveWeb3React()

    return (
        <>
            {' '}
            <Helmet>
                <title>BentoBox | Sushi</title>
            </Helmet>
            <div>
                <div
                    className="absolute top-0 right-0 left-0"
                    style={{
                        height: '700px',
                        zIndex: -1
                    }}
                >
                    <img
                        className="h-full w-full object-cover object-bottom opacity-50 -mt-32"
                        src={BentoBoxHero}
                        alt=""
                    />
                </div>

                <div className="relative flex flex-col items-center">
                    <img alt="" src={BentoBoxLogo} className="object-scale-down w-40 md:w-60 h-auto" />

                    <div className="container mx-auto max-w-3xl">
                        <div className="font-bold text-center text-3xl md:text-5xl text-high-emphesis">
                            BentoBox Apps
                        </div>
                        <div className="font-medium text-base md:text-lg lg:text-xl text-center text-high-emphesis mt-0 md:mt-4 mb-8 p-4">
                            BentoBox is an innovative way to use dapps gas-efficiently and gain extra yield.
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
                                            // className="w-full rounded text-lg text-high-emphesis px-4 py-2"
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
                            <img src={ComingSoon} alt="Coming Soon" className="block m-auto w-full h-auto" />
                        </Card>
                        <Card className="flex items-center justify-center col-span-2 md:col-span-1 bg-dark-800 hover:bg-dark-900 cursor-pointer shadow-pink-glow hover:shadow-pink-glow-hovered transition-colors">
                            <img src={ComingSoon} alt="Coming Soon" className="block m-auto w-full h-auto" />
                        </Card>
                        <Card className="flex items-center justify-center col-span-2 md:col-span-1 bg-dark-800 hover:bg-dark-900 cursor-pointer shadow-blue-glow hover:shadow-blue-glow-hovered transition-colors">
                            <img src={ComingSoon} alt="Coming Soon" className="block m-auto w-full h-auto" />
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BentoBox
