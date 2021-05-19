import React, { useState, useContext } from 'react'
import PartnerCard from './PartnerCard'
import AmaSignImg from 'assets/images/onsen-ama-sign.png'
import DefiDollarCoverImg from 'assets/images/cover-defi-dollar.png'
import DefiDollarProfileImg from 'assets/images/profile-defi-dollar.png'
import SecretNetworkCoverImg from 'assets/images/cover-secret-network.png'
import SecretNetworkProfileImg from 'assets/images/profile-secret-network.png'
import VesperFinanceCoverImg from 'assets/images/cover-vesper-finance.png'
import VesperFinanceProfileImg from 'assets/images/profile-vesper-finance.png'
import MphCoverImg from 'assets/images/cover-88-mph.png'
import MphProfileImg from 'assets/images/profile-88-mph.png'
import { Button } from 'components'
import { ChevronLeft, ChevronDown } from 'react-feather'
import { useHistory } from 'react-router-dom'
import { ThemeContext } from 'styled-components'
import { ExternalLink } from 'components/Link'

export default function Ama() {
    const history = useHistory()
    const theme = useContext(ThemeContext)

    const handleClickSeeMore = () => {
        // TODO
    }

    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex justify-center w-full h-80 bg-onsen-ama bg-cover">
                <div className="flex flex-col mt-10 w-full max-w-5xl h-full">
                    <div className="self-start">
                        <Button size="small" className="flex items-center pl-0" onClick={() => history.goBack()}>
                            <ChevronLeft strokeWidth={2} size={18} color={theme.white} />
                            <span className="ml-1 text-high-emphesis">Go Back</span>
                        </Button>
                    </div>
                    <div className="self-center" style={{ width: 553 }}>
                        <img src={AmaSignImg} />
                        <p
                            style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}
                            className="text-center text-body text-high-emphesis"
                        >
                            Watch interviews with Onsen projects to learn more about their features, benefits, and plans
                            for the future.
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-5xl">
                <div className="flex justify-center items-center flex-nowrap w-full h-14 mt-10 bg-purple bg-opacity-20 rounded text-xs whitespace-nowrap font-bold text-high-emphesis">
                    <p>Want to tune in live?</p>
                    <ExternalLink className="-mx-2" href="https://twitter.com/sushiswap">
                        <p className="text-cyan-blue hover:underline">&nbsp;Follow us on Twitter</p>
                    </ExternalLink>
                    <p>
                        for the latest updates on Onsen project AMAs, and listen in live in the Onsen AMA voice channel
                        in our
                    </p>
                    <ExternalLink className="-mx-2" href="https://discord.gg/NVPXN4e">
                        <p className="text-cyan-blue hover:underline">discord community.</p>
                    </ExternalLink>
                </div>

                <div className="flex justify-between w-full mt-6">
                    <PartnerCard
                        coverImgSrc={DefiDollarCoverImg}
                        profileImgSrc={DefiDollarProfileImg}
                        symbol="DFD"
                        name="DefiDollar DAO"
                        date="Feb. 2, 2021"
                    />
                    <PartnerCard
                        coverImgSrc={SecretNetworkCoverImg}
                        profileImgSrc={SecretNetworkProfileImg}
                        symbol="SCRT"
                        name="Secret Network"
                        date="Feb. 2, 2021"
                    />
                    <PartnerCard
                        coverImgSrc={VesperFinanceCoverImg}
                        profileImgSrc={VesperFinanceProfileImg}
                        symbol="VSP"
                        name="Vesper Finance"
                        date="Feb. 2, 2021"
                    />
                    <PartnerCard
                        coverImgSrc={MphCoverImg}
                        profileImgSrc={MphProfileImg}
                        symbol="MPH"
                        name="88MPH"
                        date="Feb. 2, 2021"
                    />
                </div>

                <div className="flex justify-center w-full mt-6">
                    <Button size="small" className="flex items-center" onClick={handleClickSeeMore}>
                        <ChevronDown strokeWidth={2} size={18} color={theme.white} />
                        <span className="ml-1 text-high-emphesis font-normal">See More</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
