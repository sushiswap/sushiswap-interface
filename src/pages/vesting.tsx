import Head from 'next/head'
import Layout from '../layouts/DefaultLayout'

import { BigNumber } from '@ethersproject/bignumber'
import { TokenAmount } from '@sushiswap/sdk'
import Loader from '../components/Loader'
import QuestionHelper from '../components/QuestionHelper'
import { isAddress } from 'ethers/lib/utils'
import React, { useEffect, useState } from 'react'
import { ChevronRight } from 'react-feather'
import { formatNumber } from '../functions'
import Fraction from '../entities/Fraction'
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import { ApplicationModal } from '../state/application/actions'
import {
    useModalOpen,
    useToggleSelfClaimModal
} from '../state/application/hooks'
import { useClaimCallback, useUserUnclaimedAmount } from '../state/claim/hooks'
import { useUserHasSubmittedClaim } from '../state/transactions/hooks'
import { t, Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Image from 'next/image'
import Link from 'next/link'
import { cloudinaryLoader } from '../functions/cloudinary'
import Dots from '../components/Dots'
import Button from '../components/Button'

export default function Vesting() {
    const { i18n } = useLingui()

    const isOpen = useModalOpen(ApplicationModal.SELF_CLAIM)
    const toggleClaimModal = useToggleSelfClaimModal()

    const { account } = useActiveWeb3React()

    // used for UI loading states
    const [attempting, setAttempting] = useState<boolean>(false)

    // get user claim data
    // const userClaimData = useUserClaimData(account)

    // monitor the status of the claim from contracts and txns
    const { claimCallback } = useClaimCallback(account)
    const unclaimedAmount: TokenAmount | undefined = useUserUnclaimedAmount(
        account
    )
    //console.log('unclaimedAmount:', unclaimedAmount)
    const { claimSubmitted } = useUserHasSubmittedClaim(account ?? undefined)
    //const claimConfirmed = Boolean(claimTxn?.receipt)
    const claimConfirmed = false

    function onClaim() {
        setAttempting(true)
        claimCallback()
            // reset modal and log error
            .catch(error => {
                setAttempting(false)
                console.log(error)
            })
    }

    // once confirmed txn is found, if modal is closed open, mark as not attempting regradless
    useEffect(() => {
        if (claimConfirmed && claimSubmitted && attempting) {
            setAttempting(false)
            if (!isOpen) {
                toggleClaimModal()
            }
        }
    }, [attempting, claimConfirmed, claimSubmitted, isOpen, toggleClaimModal])

    const [totalLocked, setTotalLocked] = useState<string>()
    useEffect(() => {
        const fetchLockup = async () => {
            if (account) {
                fetch(
                    'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/amounts-10959148-12171394.json'
                )
                    .then(response => response.json())
                    .then(data => {
                        //console.log('vesting:', data)
                        const userLockedAmount = data[account.toLowerCase()]
                            ? data[account.toLowerCase()]
                            : '0'
                        const userLocked = Fraction.from(
                            BigNumber.from(userLockedAmount),
                            BigNumber.from(10).pow(18)
                        ).toString()
                        setTotalLocked(userLocked)
                        //console.log('userLocked:', userLocked)
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
            return []
        }
        fetchLockup()
    }, [account])

    // remove once treasury signature passed
    const pendingTreasurySignature = false

    let VaultImage
    if (!pendingTreasurySignature && Number(unclaimedAmount?.toFixed(8)) > 0) {
        VaultImage =
            'https://raw.githubusercontent.com/sushiswap/sushi-content/master/images/sushi-vault-reverse.png'
    } else if (
        !pendingTreasurySignature &&
        Number(unclaimedAmount?.toFixed(8)) <= 0
    ) {
        VaultImage =
            'https://raw.githubusercontent.com/sushiswap/sushi-content/master/images/vesting-safe-off.png'
    } else if (pendingTreasurySignature) {
        VaultImage =
            'https://raw.githubusercontent.com/sushiswap/sushi-content/master/images/vesting-safe-closed.png'
    }

    console.log(
        !isAddress(account ?? '') ||
            claimConfirmed ||
            !unclaimedAmount ||
            Number(unclaimedAmount?.toFixed(8)) <= 0 ||
            pendingTreasurySignature
    )

    return (
        <>
            <Layout>
                <Head>
                    <title>Vesting | Sushi</title>
                    <meta name="description" content="SushiSwap vesting..." />
                </Head>
                <div className="max-w-[900px] w-full m-auto">
                    <div className="flex px-0 sm:px-4 md:flex-row md:space-x-10 lg:space-x-20 md:px-10">
                        <div className="space-y-10 hidden md:block">
                            <Image
                                src={cloudinaryLoader({ src: VaultImage })}
                                width={340}
                                height={300}
                                alt=""
                            />
                            <div className="bg-dark-900 rounded w-full relative overflow-hidden p-4">
                                <div className="font-bold text-white">
                                    {i18n._(t`Community Approval`)}
                                </div>
                                <div
                                    className="text-sm text-gray-400 pt-2 font-bold"
                                    style={{
                                        maxWidth: '300px',
                                        minHeight: '150px'
                                    }}
                                >
                                    <Trans>
                                        Vesting is executed within the
                                        guidelines selected by the community in{' '}
                                        <a
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            href="https://snapshot.org/#/sushi/proposal/QmPwBGy98NARoEcUfuWPgzMdJdiaZub1gVic67DcSs6NZQ"
                                        >
                                            SIMP3
                                        </a>
                                        .
                                        <br />
                                        <br />
                                        Please refer to the{' '}
                                        <a
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            href="https://forum.sushiswapclassic.org/t/simp-3-vesting-and-the-future-of-sushiswap/1794"
                                        >
                                            forum discussion
                                        </a>{' '}
                                        for deliberations on additional points.
                                        <br />
                                        <br />
                                        Additional records and weekly merkle
                                        updates can be found on{' '}
                                        <a
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            href="https://github.com/sushiswap/sushi-vesting"
                                        >
                                            Github
                                        </a>
                                    </Trans>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 max-w-[400px]">
                            <div className="bg-dark-900 rounded w-full relative overflow-hidden">
                                <div className="flex flex-col gap-3 p-4">
                                    <div className="flex flex-row justify-between">
                                        <div className="font-bold text-white">
                                            {i18n._(
                                                t`Your Claimable SUSHI this Week`
                                            )}
                                        </div>
                                        <QuestionHelper text="Your Vested SUSHI will be released each week for the next 6 months. The amount released each week is determined by your historical farming rewards. You do not need to harvest each week as unclaimed amounts from each week will continue to accrue onto the next." />
                                    </div>
                                    {/* <div style={{ display: 'flex', alignItems: 'baseline' }}> */}
                                    <div className="flex items-baseline flex-col">
                                        <div className="font-bold text-white text-[36px]">
                                            {unclaimedAmount?.toFixed(
                                                4,
                                                { groupSeparator: ',' } ?? {}
                                            )}
                                        </div>
                                        {account ? (
                                            <div className="text-secondary text-sm">
                                                {totalLocked ? (
                                                    i18n._(
                                                        t`Historical Total Locked: ${formatNumber(
                                                            totalLocked
                                                        )} SUSHI`
                                                    )
                                                ) : (
                                                    <Dots>
                                                        {i18n._(
                                                            t`Historical Total Locked: Fetching Total`
                                                        )}
                                                    </Dots>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-secondary text-sm">
                                                {i18n._(
                                                    t`Historical Total Locked: Connect Wallet`
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        color="gradient"
                                        disabled={
                                            !isAddress(account ?? '') ||
                                            claimConfirmed ||
                                            !unclaimedAmount ||
                                            Number(
                                                unclaimedAmount?.toFixed(8)
                                            ) <= 0 ||
                                            pendingTreasurySignature
                                        }
                                        size="large"
                                        onClick={onClaim}
                                    >
                                        {pendingTreasurySignature ? (
                                            <Dots>
                                                {i18n._(
                                                    t`Pending Treasury Transfer`
                                                )}
                                            </Dots>
                                        ) : (
                                            <>
                                                {' '}
                                                {claimConfirmed
                                                    ? i18n._(t`Claimed`)
                                                    : i18n._(t`Claim SUSHI`)}
                                            </>
                                        )}

                                        {attempting && (
                                            <Loader
                                                stroke="white"
                                                style={{
                                                    marginLeft: '10px'
                                                }}
                                            />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <div className="bg-dark-900 rounded w-full relative overflow-hidden">
                                <div className="flex flex-col gap-3 p-4">
                                    <div className="font-bold text-white">
                                        {i18n._(
                                            t`Things you can do with your SUSHI`
                                        )}
                                    </div>
                                    <div className="bg-dark-800 p-4 rounded">
                                        <Link href={`/stake`}>
                                            <div className="flex gap-3 justify-between items-center">
                                                <div className="flex flex-col gap-1">
                                                    <div className="font-bold text-white">
                                                        {i18n._(
                                                            t`Stake SUSHI for xSUSHI`
                                                        )}
                                                    </div>
                                                    <div className="text-secondary text-sm">
                                                        {t`Gain governance rights with xSUSHI and earn 5% APR (0.05% of
                                                            all swaps from all chains)`}
                                                    </div>
                                                </div>
                                                <div className="min-w-[32px]">
                                                    <ChevronRight />
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="bg-dark-800 p-4 rounded">
                                        <Link href={`/saave`}>
                                            <div className="flex gap-3 justify-between items-center">
                                                <div className="flex flex-col gap-1">
                                                    <div className="font-bold text-white">
                                                        {i18n._(
                                                            t`Stack Yields with SAAVE`
                                                        )}
                                                    </div>
                                                    <div className="text-secondary text-sm">
                                                        {t`Stake into xSUSHI add collateral as axSUSHI on Aave all in
                                                            one click`}
                                                    </div>
                                                </div>
                                                <div className="min-w-[32px]">
                                                    <ChevronRight />
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="bg-dark-800 p-4 rounded">
                                        <div className="flex flex-col gap-1">
                                            <div className="font-bold text-white">
                                                {i18n._(
                                                    t`Deposit SUSHI into BentoBox`
                                                )}
                                            </div>
                                            <div className="text-secondary text-sm">
                                                {t`(COMING SOON) Accrue automatic yield through flash loans and
                                                            SUSHI strategies`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}
