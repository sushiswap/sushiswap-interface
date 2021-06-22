import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { ChainId, MASTERCHEF_ADDRESS, Token, ZERO } from '@sushiswap/sdk'
import { Chef, PairType } from './enum'
import { Disclosure, Transition } from '@headlessui/react'
import React, { useState } from 'react'
import { classNames, currencyId, formatNumber, formatPercent } from '../../functions'
import { usePendingSushi, useUserInfo } from './hooks'

import Button from '../../components/Button'
import Dots from '../../components/Dots'
import DoubleLogo from '../../components/DoubleLogo'
import Image from 'next/image'
import Link from 'next/link'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { getAddress } from '@ethersproject/address'
import { t } from '@lingui/macro'
import { tryParseAmount } from '../../functions/parse'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useCurrency } from '../../hooks/Tokens'
import { useLingui } from '@lingui/react'
import useMasterChef from './useMasterChef'
import usePendingReward from './usePendingReward'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'

const FarmListItem = ({ farm }) => {
  const { i18n } = useLingui()
  const [expand, setExpand] = useState<boolean>(false)
  const { account, chainId } = useActiveWeb3React()
  const [pendingTx, setPendingTx] = useState(false)
  const [depositValue, setDepositValue] = useState('')
  const [withdrawValue, setWithdrawValue] = useState('')

  const addTransaction = useTransactionAdder()
  const token0 = useCurrency(farm.pair.token0.id)
  const token1 = useCurrency(farm.pair.token1.id)

  const liquidityToken = new Token(
    chainId,
    getAddress(farm.pair.id),
    farm.pair.decimals,
    farm.pair.symbol,
    farm.pair.name
  )

  // User liquidity token balance
  const balance = useTokenBalance(account, liquidityToken)

  // TODO: Replace these
  const amount = useUserInfo(farm, liquidityToken)
  const pendingSushi = usePendingSushi(farm)

  const reward = usePendingReward(farm)

  const APPROVAL_ADDRESSES = {
    [Chef.MASTERCHEF]: MASTERCHEF_ADDRESS[ChainId.MAINNET],
    [Chef.MASTERCHEF_V2]: '0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d',
    [Chef.MINICHEF]: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
  }

  const typedDepositValue = tryParseAmount(depositValue, liquidityToken)
  const typedWithdrawValue = tryParseAmount(withdrawValue, liquidityToken)

  const [approvalState, approve] = useApproveCallback(typedDepositValue, APPROVAL_ADDRESSES[farm.chef])

  const { deposit, withdraw, harvest } = useMasterChef(farm.chef)

  return (
    <Disclosure as="div">
      {({ open }) => (
        <>
          <Disclosure.Button
            className={classNames(
              open && 'rounded-b-none',
              'w-full px-4 py-6 text-left rounded cursor-pointer select-none bg-dark-900 text-primary text-sm md:text-lg'
            )}
          >
            <div className="grid grid-cols-4">
              <div className="flex col-span-2 space-x-4 md:col-span-1">
                <DoubleLogo currency0={token0} currency1={token1} size={40} />
                <div className="flex flex-col justify-center">
                  <div className="font-bold">
                    {farm?.pair?.token0?.symbol}/{farm?.pair?.token1?.symbol}
                  </div>
                  {farm?.pair?.type === PairType.SWAP && (
                    <div className="text-xs md:text-base text-secondary">SushiSwap Farm</div>
                  )}
                  {farm?.pair?.type === PairType.KASHI && (
                    <div className="text-xs md:text-base text-secondary">Kashi Farm</div>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-center font-bold">{formatNumber(farm.tvl, true)}</div>
              <div className="flex-row items-center hidden space-x-4 md:flex">
                <div className="flex items-center space-x-2">
                  {farm?.rewards?.map((reward, i) => (
                    <div key={i} className="flex items-center">
                      <Image
                        src={reward.icon}
                        width="30px"
                        height="30px"
                        className="rounded-md"
                        layout="fixed"
                        alt={reward.token}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col space-y-1">
                  {farm?.rewards?.map((reward, i) => (
                    <div key={i} className="text-xs md:text-sm whitespace-nowrap">
                      {formatNumber(reward.rewardPerDay)} {reward.token} / DAY
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end justify-center">
                <div className="font-bold text-righttext-high-emphesis">
                  {farm?.roiPerYear > 100 ? '10000%+' : formatPercent(farm?.roiPerYear * 100)}
                </div>
                <div className="text-xs text-right md:text-base text-secondary">annualized</div>
              </div>
            </div>
          </Disclosure.Button>

          <Transition
            show={open}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Disclosure.Panel className="flex flex-col w-full border-t-0 rounded rounded-t-none bg-dark-800" static>
              <div className="grid grid-cols-2 gap-4 p-4">
                <div className="col-span-2 text-center md:col-span-1">
                  {account && (
                    <div className="pr-4 mb-2 text-sm text-right cursor-pointer text-secondary">
                      {i18n._(t`Wallet Balance`)}: {formatNumber(balance?.toSignificant(6) ?? 0)} {farm.type}
                    </div>
                  )}
                  <div className="relative flex items-center w-full mb-4">
                    <NumericalInput
                      className="w-full p-3 pr-20 rounded bg-dark-700 focus:ring focus:ring-blue"
                      value={depositValue}
                      onUserInput={(value) => {
                        setDepositValue(value)
                      }}
                    />
                    {account && (
                      <Button
                        variant="outlined"
                        color="blue"
                        size="xs"
                        onClick={() => {
                          if (!balance.equalTo(ZERO)) {
                            setDepositValue(balance.toFixed(liquidityToken.decimals))
                          }
                        }}
                        className="absolute border-0 right-4 focus:ring focus:ring-blue"
                      >
                        {i18n._(t`MAX`)}
                      </Button>
                    )}
                  </div>
                  {approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING ? (
                    <Button color="blue" disabled={approvalState === ApprovalState.PENDING} onClick={approve}>
                      {approvalState === ApprovalState.PENDING ? <Dots>Approving </Dots> : 'Approve'}
                    </Button>
                  ) : (
                    <Button
                      color="blue"
                      disabled={pendingTx || !typedDepositValue || balance.lessThan(typedDepositValue)}
                      onClick={async () => {
                        setPendingTx(true)
                        try {
                          // KMP decimals depend on asset, SLP is always 18
                          const tx = await deposit(farm.id, depositValue.toBigNumber(liquidityToken?.decimals))

                          addTransaction(tx, {
                            summary: `Deposit ${farm.pair.name}`,
                          })
                        } catch (error) {
                          console.error(error)
                        }
                        setPendingTx(false)
                      }}
                    >
                      {i18n._(t`Stake`)}
                    </Button>
                  )}
                </div>
                <div className="col-span-2 text-center md:col-span-1">
                  {account && (
                    <div className="pr-4 mb-2 text-sm text-right cursor-pointer text-secondary">
                      {i18n._(t`Your Staked`)}: {formatNumber(amount?.toSignificant(6)) ?? 0} {farm.type}
                    </div>
                  )}
                  <div className="relative flex items-center w-full mb-4">
                    <NumericalInput
                      className="w-full p-3 pr-20 rounded bg-dark-700 focus:ring focus:ring-pink"
                      value={withdrawValue}
                      onUserInput={(value) => {
                        setWithdrawValue(value)
                      }}
                    />
                    {account && (
                      <Button
                        variant="outlined"
                        color="pink"
                        size="xs"
                        onClick={() => {
                          if (!amount.equalTo(ZERO)) {
                            setWithdrawValue(amount.toFixed(liquidityToken.decimals))
                          }
                        }}
                        className="absolute border-0 right-4 focus:ring focus:ring-pink"
                      >
                        {i18n._(t`MAX`)}
                      </Button>
                    )}
                  </div>
                  <Button
                    color="pink"
                    className="border-0"
                    disabled={pendingTx || !typedWithdrawValue || amount.lessThan(typedWithdrawValue)}
                    onClick={async () => {
                      setPendingTx(true)
                      try {
                        // KMP decimals depend on asset, SLP is always 18
                        const tx = await withdraw(farm.id, withdrawValue.toBigNumber(liquidityToken?.decimals))
                        addTransaction(tx, {
                          summary: `Withdraw ${farm.pair.name}`,
                        })
                      } catch (error) {
                        console.error(error)
                      }

                      setPendingTx(false)
                    }}
                  >
                    {i18n._(t`Unstake`)}
                  </Button>
                </div>
              </div>
              {pendingSushi && pendingSushi.greaterThan(ZERO) && (
                <div className="px-4 pb-4">
                  <Button
                    color="gradient"
                    onClick={async () => {
                      setPendingTx(true)
                      try {
                        const tx = await harvest(farm.id)
                        addTransaction(tx, {
                          summary: `Harvest ${farm.pair.name}`,
                        })
                      } catch (error) {
                        console.error(error)
                      }
                      setPendingTx(false)
                    }}
                  >
                    {i18n._(t`Harvest ${formatNumber(pendingSushi.toFixed(18))} SUSHI ${
                      farm.rewards.length > 1 ? `& ${formatNumber(reward)} ${farm.rewards[1].token}` : null
                    }
                `)}
                  </Button>
                </div>
              )}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
}

export default FarmListItem
