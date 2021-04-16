import React, { useContext, useEffect, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { BigNumber } from '@ethersproject/bignumber'
import { Link } from 'react-router-dom'
import { TokenAmount } from '@sushiswap/sdk'
import { isAddress } from 'ethers/lib/utils'
import { useActiveWeb3React } from '../../hooks'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleSelfClaimModal } from '../../state/application/hooks'
import { useClaimCallback, useUserClaimData, useUserUnclaimedAmount } from '../../state/claim/hooks'
import { useUserHasSubmittedClaim } from '../../state/transactions/hooks'
import { TYPE } from '../../theme'

import { ButtonPrimary } from 'components/Button'
import { AutoColumn } from 'components/Column'
//import Confetti from 'components/Confetti'
import { CardSection, DataCard } from 'components/earn/styled'
import { RowBetween, AutoRow } from 'components/Row'
import QuestionHelper from 'components/QuestionHelper'
import { LightCard } from 'components/Card'
import Loader from 'components/Loader'

import { ChevronRight } from 'react-feather'
import { transparentize } from 'polished'

import Fraction from '../../constants/Fraction'
import { formattedNum } from 'utils'

const Dots = styled.span`
    &::after {
        display: inline-block;
        animation: ellipsis 1.25s infinite;
        content: '.';
        width: 1em;
        text-align: left;
    }
    @keyframes ellipsis {
        0% {
            content: '.';
        }
        33% {
            content: '..';
        }
        66% {
            content: '...';
        }
    }
`

const PageWrapper = styled(AutoColumn)`
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
`

const VoteCard = styled(DataCard)`
  background: ${({ theme }) => transparentize(0.5, theme.bg1)};
  /* border: 1px solid ${({ theme }) => theme.text4}; */
  overflow: hidden;
`

export default function ClaimModal() {
    const theme = useContext(ThemeContext)

    const isOpen = useModalOpen(ApplicationModal.SELF_CLAIM)
    const toggleClaimModal = useToggleSelfClaimModal()

    const { account, chainId } = useActiveWeb3React()

    // used for UI loading states
    const [attempting, setAttempting] = useState<boolean>(false)

    // get user claim data
    // const userClaimData = useUserClaimData(account)

    // monitor the status of the claim from contracts and txns
    const { claimCallback } = useClaimCallback(account)
    const unclaimedAmount: TokenAmount | undefined = useUserUnclaimedAmount(account)
    //console.log('unclaimedAmount:', unclaimedAmount)
    const { claimSubmitted, claimTxn } = useUserHasSubmittedClaim(account ?? undefined)
    const claimConfirmed = Boolean(claimTxn?.receipt)

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
                fetch('https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/amounts-10959148-12171394.json')
                    .then(response => response.json())
                    .then(data => {
                        //console.log('vesting:', data)
                        const userLockedAmount = data[account.toLowerCase()] ? data[account.toLowerCase()] : '0'
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
    const pendingTreasurySignature = true

    return (
        <PageWrapper>
            {/* <Confetti start={Boolean(isOpen && claimConfirmed)} /> */}
            <>
                <div className="flex px-0 sm:px-4 md:flex-row md:space-x-10 lg:space-x-20 md:px-10">
                    <div className="space-y-10 hidden md:block">
                        <img
                            src="https://raw.githubusercontent.com/sushiswap/sushi-content/master/images/sushi-vault-reverse.png"
                            style={{ width: '340px', height: '300px', maxWidth: 'none' }}
                            alt=""
                        />
                        <VoteCard>
                            <CardSection gap="sm">
                                <RowBetween>
                                    <TYPE.white fontWeight={500} color={theme.text1}>
                                        Community Approval
                                    </TYPE.white>
                                </RowBetween>
                                <div
                                    className="text-sm text-gray-400 pt-2"
                                    style={{ maxWidth: '300px', minHeight: '150px' }}
                                >
                                    Vesting is executed within the guidelines selected by the community in{' '}
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
                                    Additional records and weekly merkle updates can be found on{' '}
                                    <a
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        href="https://github.com/sushiswap/sushi-vesting"
                                    >
                                        Github
                                    </a>
                                </div>
                            </CardSection>
                        </VoteCard>
                    </div>
                    <div>
                        <VoteCard>
                            <CardSection gap="sm">
                                <RowBetween>
                                    <TYPE.white fontWeight={500} color={theme.text1}>
                                        Your Claimable SUSHI this Week
                                    </TYPE.white>
                                    <QuestionHelper text="Your Vested SUSHI will be released each week for the next 6 months. The amount released each week is determined by your historical farming rewards. You do not need to harvest each week as unclaimed amounts from each week will continue to accrue onto the next." />
                                </RowBetween>
                                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                    <TYPE.white fontWeight={700} fontSize={36} color={theme.text1}>
                                        {unclaimedAmount?.toFixed(4, { groupSeparator: ',' } ?? '-')}
                                    </TYPE.white>
                                    {account ? (
                                        <TYPE.white fontWeight={700} fontSize={14} color={theme.text3} marginLeft={10}>
                                            {totalLocked ? (
                                                `/ ${formattedNum(totalLocked)} SUSHI`
                                            ) : (
                                                <Dots>/ Fetching Total</Dots>
                                            )}
                                        </TYPE.white>
                                    ) : (
                                        <TYPE.white fontWeight={700} fontSize={14} color={theme.text3} marginLeft={10}>
                                            / Connect Wallet
                                        </TYPE.white>
                                    )}
                                </div>

                                <ButtonPrimary
                                    disabled={
                                        !isAddress(account ?? '') ||
                                        claimConfirmed ||
                                        !unclaimedAmount ||
                                        Number(unclaimedAmount?.toFixed(8)) <= 0 ||
                                        pendingTreasurySignature
                                    }
                                    padding="16px 16px"
                                    width="100%"
                                    borderRadius="20px"
                                    mt="0.5rem"
                                    onClick={onClaim}
                                >
                                    {pendingTreasurySignature ? (
                                        <Dots>Pending Treasury Transfer</Dots>
                                    ) : (
                                        <> {claimConfirmed ? 'Claimed' : 'Claim SUSHI'}</>
                                    )}

                                    {attempting && <Loader stroke="white" style={{ marginLeft: '10px' }} />}
                                </ButtonPrimary>
                            </CardSection>
                        </VoteCard>
                        <VoteCard style={{ marginTop: '10px' }}>
                            <CardSection gap="md">
                                <RowBetween style={{ marginBottom: '5px' }}>
                                    <TYPE.white fontWeight={500} color={theme.text1}>
                                        Things you can do with your SUSHI
                                    </TYPE.white>
                                </RowBetween>
                                <LightCard as={Link} to={`/stake`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                    <AutoColumn gap="12px">
                                        <RowBetween>
                                            <AutoRow>
                                                <AutoRow marginBottom="2px">
                                                    <TYPE.body fontWeight={500}>Stake SUSHI for xSUSHI</TYPE.body>
                                                </AutoRow>
                                                <AutoRow>
                                                    <TYPE.darkGray fontSize=".75rem">
                                                        Gain governance rights with xSUSHI and earn 5% APR (0.05% of all
                                                        swaps from all chains)
                                                    </TYPE.darkGray>
                                                </AutoRow>
                                            </AutoRow>
                                            <ChevronRight />
                                        </RowBetween>
                                    </AutoColumn>
                                </LightCard>
                                <LightCard as={Link} to={`/saave`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                    <AutoColumn gap="12px">
                                        <RowBetween>
                                            <AutoRow>
                                                <AutoRow marginBottom="2px">
                                                    <TYPE.body fontWeight={500}>Stack Yields with SAAVE</TYPE.body>
                                                </AutoRow>
                                                <AutoRow>
                                                    <TYPE.darkGray fontSize=".75rem">
                                                        Stake into xSUSHI add collateral as axSUSHI on Aave all in one
                                                        click
                                                    </TYPE.darkGray>
                                                </AutoRow>
                                            </AutoRow>
                                            <ChevronRight />
                                        </RowBetween>
                                    </AutoColumn>
                                </LightCard>
                                <LightCard style={{ color: 'inherit', textDecoration: 'none' }}>
                                    <AutoColumn gap="12px">
                                        <RowBetween>
                                            <AutoRow>
                                                <AutoRow marginBottom="2px">
                                                    <TYPE.body fontWeight={500}>Deposit SUSHI into BentoBox</TYPE.body>
                                                </AutoRow>
                                                <AutoRow>
                                                    <TYPE.darkGray fontSize=".75rem">
                                                        (COMING SOON) Accrue automatic yield through flash loans and
                                                        SUSHI strategies
                                                    </TYPE.darkGray>
                                                </AutoRow>
                                            </AutoRow>
                                            {/* <ChevronRight /> */}
                                        </RowBetween>
                                    </AutoColumn>
                                </LightCard>
                            </CardSection>
                        </VoteCard>
                    </div>
                </div>
            </>
        </PageWrapper>
    )
}
