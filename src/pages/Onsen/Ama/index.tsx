import React, { useContext } from 'react'
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
import { Helmet } from 'react-helmet'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

const BackButton = () => {
    const history = useHistory()
    const theme = useContext(ThemeContext)
    const { i18n } = useLingui()

    return (
        <Button size="small" className="flex items-center pl-0 -ml-1" onClick={() => history.goBack()}>
            <ChevronLeft strokeWidth={2} size={18} color={theme.white} />
            <span className="ml-1 text-high-emphesis">{i18n._(t`Go Back`)}</span>
        </Button>
    )
}

const CardSpacer = () => <div className="h-4 w-3" />

export default function Ama() {
    const { i18n } = useLingui()
    const theme = useContext(ThemeContext)

    const handleClickSeeMore = () => {
        // TODO
    }

    return (
        <>
            <Helmet>
                <title>Onsen | Sushi</title>
            </Helmet>
            <div className="flex flex-col items-center w-full -mt-4 sm:-mt-8 md:-mt-10">
                <div className="flex justify-center w-screen md:h-80 px-4 py-4 sm:py-8 md:py-10 bg-onsen-ama bg-cover">
                    <div className="flex flex-col justify-start w-full max-w-5xl">
                        <div className="self-start">
                            <BackButton />
                        </div>
                        <div className="self-center w-full px-4 pt-1 pb-5 max-w-lg">
                            <img src={AmaSignImg} />
                            <p className="text-center text-caption2 md:text-body text-high-emphesis">
                                {i18n._(t`Watch interviews with Onsen projects to learn more about their features, benefits, and plans
                                for the future.`)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-5xl mb-16 md:mb-0">
                    <div className="flex justify-center items-center flex-nowrap w-full h-14 mt-10 bg-purple bg-opacity-20 rounded text-xs whitespace-nowrap font-bold text-high-emphesis">
                        <p className="hidden lg:block">{i18n._(t`Want to tune in live?`)}</p>
                        <ExternalLink className="-mx-2" href="https://twitter.com/sushiswap">
                            <p className="text-cyan-blue hover:underline">&nbsp;{i18n._(t`Follow us on Twitter`)}</p>
                        </ExternalLink>
                        <p className="hidden lg:block">
                            {i18n._(t`for the latest updates on Onsen project AMAs, and listen in live in the Onsen AMA voice channel
                            in our`)}
                        </p>
                        <p className="block lg:hidden">&nbsp;{i18n._(t`and`)}&nbsp;</p>
                        <ExternalLink className="-mx-2 hidden lg:block" href="https://discord.gg/NVPXN4e">
                            <p className="text-cyan-blue hover:underline">{i18n._(t`discord community.`)}</p>
                        </ExternalLink>
                        <ExternalLink className="-mx-2 block lg:hidden" href="https://discord.gg/NVPXN4e">
                            <p className="text-cyan-blue hover:underline">{i18n._(t`join our discord.`)}</p>
                        </ExternalLink>
                    </div>

                    <div className="flex flex-col md:flex-row md:justify-between items-center w-full mt-6">
                        <PartnerCard
                            coverImgSrc={DefiDollarCoverImg}
                            profileImgSrc={DefiDollarProfileImg}
                            symbol="DFD"
                            name="DefiDollar DAO"
                            date="Feb. 2, 2021"
                        />
                        <CardSpacer />
                        <PartnerCard
                            coverImgSrc={SecretNetworkCoverImg}
                            profileImgSrc={SecretNetworkProfileImg}
                            symbol="SCRT"
                            name="Secret Network"
                            date="Feb. 2, 2021"
                        />
                        <CardSpacer />
                        <PartnerCard
                            coverImgSrc={VesperFinanceCoverImg}
                            profileImgSrc={VesperFinanceProfileImg}
                            symbol="VSP"
                            name="Vesper Finance"
                            date="Feb. 2, 2021"
                        />
                        <CardSpacer />
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
                            <span className="ml-1 text-high-emphesis font-normal">{i18n._(t`See More`)}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
