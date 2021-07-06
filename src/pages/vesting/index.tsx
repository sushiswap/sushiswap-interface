import { Currency, CurrencyAmount, Token } from '@sushiswap/sdk'
import React, { useEffect, useState } from 'react'
import { useClaimCallback, useUserUnclaimedAmount } from '../../state/claim/hooks'
import { useModalOpen, useToggleSelfClaimModal } from '../../state/application/hooks'

import { ApplicationModal } from '../../state/application/actions'
import { BigNumber } from '@ethersproject/bignumber'
import Button from '../../components/Button'
import { ChevronRight } from 'react-feather'
import Dots from '../../components/Dots'
import ExternalLink from '../../components/ExternalLink'
import Fraction from '../../entities/Fraction'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Loader from '../../components/Loader'
import QuestionHelper from '../../components/QuestionHelper'
import { cloudinaryLoader } from '../../functions/cloudinary'
import { formatNumber } from '../../functions/format'
import { isAddress } from 'ethers/lib/utils'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'
import { useUserHasSubmittedClaim } from '../../state/transactions/hooks'

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
  const unclaimedAmount: CurrencyAmount<Currency> | undefined = useUserUnclaimedAmount(account)
  // console.log('unclaimedAmount:', unclaimedAmount)
  const { claimSubmitted } = useUserHasSubmittedClaim(account ?? undefined)
  // const claimConfirmed = Boolean(claimTxn?.receipt)
  const claimConfirmed = false

  function onClaim() {
    setAttempting(true)
    claimCallback()
      // reset modal and log error
      .catch((error) => {
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
          'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-13/merkle-10959148-11550728.json'
        )
          .then((response) => response.json())
          .then((data) => {
            // console.log('vesting:', data)
            const userLockedAmount = data[account.toLowerCase()] ? data[account.toLowerCase()] : '0'
            const userLocked = Fraction.from(BigNumber.from(userLockedAmount), BigNumber.from(10).pow(18)).toString()
            setTotalLocked(userLocked)
            // console.log('userLocked:', userLocked)
          })
          .catch((error) => {
            console.log(error)
          })
      }
      return []
    }
    fetchLockup()
  }, [account])

  // remove once treasury signature passed
  const pendingTreasurySignature = false

  let vault = ''
  if (!pendingTreasurySignature && Number(unclaimedAmount?.toFixed(8)) > 0) {
    vault = 'https://raw.githubusercontent.com/sushiswap/sushi-content/master/images/sushi-vault-reverse.png'
  } else if (!pendingTreasurySignature && Number(unclaimedAmount?.toFixed(8)) <= 0) {
    vault = 'https://raw.githubusercontent.com/sushiswap/sushi-content/master/images/vesting-safe-off.png'
  } else if (pendingTreasurySignature) {
    vault = 'https://raw.githubusercontent.com/sushiswap/sushi-content/master/images/vesting-safe-closed.png'
  }

  return (
    <>
      <Head>
        <title>Vesting | Sushi</title>
        <meta name="description" content="SushiSwap vesting..." />
      </Head>
      <div className="w-full max-w-[900px] m-auto">
        <div className="flex px-0 sm:px-4 md:flex-row md:space-x-10 lg:space-x-20 md:px-10">
          <div className="hidden space-y-10 md:block">
            <Image src={vault} loader={cloudinaryLoader} width={340} height={300} alt="" />
            <div className="relative w-full p-4 overflow-hidden rounded bg-dark-900">
              <div className="font-bold text-white">{i18n._(t`Community Approval`)}</div>
              <div
                className="pt-2 text-sm font-bold text-gray-400"
                style={{
                  maxWidth: '300px',
                  minHeight: '150px',
                }}
              >
                <>
                  {i18n._(t`Vesting is executed within the guidelines selected by the community in`)}{' '}
                  <ExternalLink href="https://snapshot.org/#/sushi/proposal/QmPwBGy98NARoEcUfuWPgzMdJdiaZub1gVic67DcSs6NZQ">
                    SIMP3
                  </ExternalLink>
                  .
                  <br />
                  <br />
                  {i18n._(t`Please refer to the`)}{' '}
                  <ExternalLink href="https://forum.sushiswapclassic.org/t/simp-3-vesting-and-the-future-of-sushiswap/1794">
                    {i18n._(t`forum discussion`)}
                  </ExternalLink>{' '}
                  {i18n._(t`for deliberations on additional points.`)}
                  <br />
                  <br />
                  {i18n._(t`Additional records and weekly merkle updates can be found on`)}{' '}
                  <ExternalLink href="https://github.com/sushiswap/sushi-vesting">Github</ExternalLink>
                </>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 max-w-[400px]">
            <div className="relative w-full overflow-hidden rounded bg-dark-900">
              <div className="flex flex-col gap-3 p-4">
                <div className="flex flex-row justify-between">
                  <div className="font-bold text-white">{i18n._(t`Your Claimable SUSHI this Week`)}</div>
                  <QuestionHelper text="Your Vested SUSHI will be released each week for the next 6 months. The amount released each week is determined by your historical farming rewards. You do not need to harvest each week as unclaimed amounts from each week will continue to accrue onto the next." />
                </div>
                {/* <div style={{ display: 'flex', alignItems: 'baseline' }}> */}
                <div className="flex flex-col items-baseline">
                  <div className="font-bold text-white text-[36px]">
                    {unclaimedAmount?.toFixed(4, { groupSeparator: ',' } ?? {})}
                  </div>
                  {account ? (
                    <div className="text-sm text-secondary">
                      {totalLocked ? (
                        i18n._(t`Historical Total Locked: ${formatNumber(totalLocked)} SUSHI`)
                      ) : (
                        <Dots>{i18n._(t`Historical Total Locked: Fetching Total`)}</Dots>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-secondary">{i18n._(t`Historical Total Locked: Connect Wallet`)}</div>
                  )}
                </div>

                <Button
                  color="gradient"
                  disabled={
                    !isAddress(account ?? '') ||
                    claimConfirmed ||
                    !unclaimedAmount ||
                    Number(unclaimedAmount?.toFixed(8)) <= 0 ||
                    pendingTreasurySignature
                  }
                  size="lg"
                  onClick={onClaim}
                  className="inline-flex items-center justify-center"
                >
                  {pendingTreasurySignature ? (
                    <Dots>{i18n._(t`Pending Treasury Transfer`)}</Dots>
                  ) : (
                    <> {claimConfirmed ? i18n._(t`Claimed`) : i18n._(t`Claim SUSHI`)}</>
                  )}

                  {attempting && (
                    <Loader
                      stroke="white"
                      style={{
                        marginLeft: '10px',
                      }}
                    />
                  )}
                </Button>
              </div>
            </div>
            <div className="relative w-full overflow-hidden rounded bg-dark-900">
              <div className="flex flex-col gap-3 p-4">
                <div className="font-bold text-white">{i18n._(t`Things you can do with your SUSHI`)}</div>
                <div className="p-4 rounded bg-dark-800">
                  <Link href="/stake">
                    <a className="flex items-center justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <div className="font-bold text-white">{i18n._(t`Stake SUSHI for xSUSHI`)}</div>
                        <div className="text-sm text-secondary">
                          {t`Gain governance rights with xSUSHI and earn 5% APR (0.05% of
                                                            all swaps from all chains)`}
                        </div>
                      </div>
                      <div className="min-w-[32px]">
                        <ChevronRight />
                      </div>
                    </a>
                  </Link>
                </div>
                <div className="p-4 rounded bg-dark-800">
                  <Link href={`/saave`}>
                    <a className="flex items-center justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <div className="font-bold text-white">{i18n._(t`Stack Yields with SAAVE`)}</div>
                        <div className="text-sm text-secondary">
                          {t`Stake into xSUSHI add collateral as axSUSHI on Aave all in
                                                            one click`}
                        </div>
                      </div>
                      <div className="min-w-[32px]">
                        <ChevronRight />
                      </div>
                    </a>
                  </Link>
                </div>
                <div className="p-4 rounded bg-dark-800">
                  <div className="flex flex-col gap-1">
                    <div className="font-bold text-white">{i18n._(t`Deposit SUSHI into BentoBox`)}</div>
                    <div className="text-sm text-secondary">
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
    </>
  )
}
