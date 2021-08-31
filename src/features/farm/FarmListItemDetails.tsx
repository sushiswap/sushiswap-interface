import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { ChainId, MASTERCHEF_ADDRESS, MASTERCHEF_V2_ADDRESS, MINICHEF_ADDRESS, Token, ZERO } from '@sushiswap/sdk'
import { Chef, PairType } from './enum'
import { Disclosure, Transition } from '@headlessui/react'
import React, { useState } from 'react'
import { usePendingSushi, useUserInfo } from './hooks'

import Button from '../../components/Button'
import Dots from '../../components/Dots'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { formatNumber } from '../../functions'
import { getAddress } from '@ethersproject/address'
import { t } from '@lingui/macro'
import { tryParseAmount } from '../../functions/parse'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useLingui } from '@lingui/react'
import useMasterChef from './useMasterChef'
import usePendingReward from './usePendingReward'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'

const FarmListItem = ({ farm }) => {
  const { i18n } = useLingui()

  const { account, chainId } = useActiveWeb3React()
  const [pendingTx, setPendingTx] = useState(false)
  const [depositValue, setDepositValue] = useState('')
  const [withdrawValue, setWithdrawValue] = useState('')

  const addTransaction = useTransactionAdder()

  const liquidityToken = new Token(
    chainId,
    getAddress(farm.pair.id),
    farm.pair.type === PairType.KASHI ? Number(farm.pair.asset.decimals) : 18,
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
    [Chef.MASTERCHEF]: { [ChainId.MAINNET]: MASTERCHEF_ADDRESS[ChainId.MAINNET] },
    [Chef.MASTERCHEF_V2]: { [ChainId.MAINNET]: MASTERCHEF_V2_ADDRESS[ChainId.MAINNET] },
    [Chef.MINICHEF]: {
      [ChainId.MATIC]: MINICHEF_ADDRESS[ChainId.MATIC],
      [ChainId.XDAI]: MINICHEF_ADDRESS[ChainId.XDAI],
      [ChainId.HARMONY]: MINICHEF_ADDRESS[ChainId.HARMONY],
      [ChainId.ARBITRUM]: MINICHEF_ADDRESS[ChainId.ARBITRUM],
    },
  }

  const typedDepositValue = tryParseAmount(depositValue, liquidityToken)
  const typedWithdrawValue = tryParseAmount(withdrawValue, liquidityToken)

  const [approvalState, approve] = useApproveCallback(typedDepositValue, APPROVAL_ADDRESSES[farm.chef][chainId])

  const { deposit, withdraw, harvest } = useMasterChef(farm.chef)

  return (
    <Transition
      show={true}
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
                onUserInput={setDepositValue}
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
                      summary: `Deposit ${farm.pair.token0.name}/${farm.pair.token1.name}`,
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
                    summary: `Withdraw ${farm.pair.token0.name}/${farm.pair.token1.name}`,
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
                    summary: i18n._(t`Harvest ${farm.pair.token0.name}/${farm.pair.token1.name}`),
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
  )
}

export default FarmListItem
