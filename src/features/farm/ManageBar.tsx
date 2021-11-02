import React, { useState } from 'react'
import { Switch } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import Button, { ButtonError } from '../../components/Button'
import { classNames, getUSDValue, tryParseAmount } from '../../functions'
import CurrencyInputPanel from './CurrencyInputPanel'
import Web3Connect from '../../components/Web3Connect'
import { ApprovalState, useActiveWeb3React, useApproveCallback } from '../../hooks'
import Dots from '../../components/Dots'
import { BigNumber } from '@ethersproject/bignumber'
import useMasterChef from './useMasterChef'
import { useTransactionAdder } from '../../state/transactions/hooks'
import {
  ChainId,
  CurrencyAmount,
  JSBI,
  MASTERCHEF_ADDRESS,
  MASTERCHEF_V2_ADDRESS,
  MINICHEF_ADDRESS,
  Token,
  USDC,
  USD,
  ZERO,
} from '@sushiswap/sdk'
import { getAddress } from '@ethersproject/address'
import { Chef, PairType } from './enum'
import { useKashiPair } from '../lending/context'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useUserInfo } from './hooks'

const ManageBar = ({ farm }) => {
  const { account, chainId } = useActiveWeb3React()

  const [toggle, setToggle] = useState(true)

  const [depositValue, setDepositValue] = useState('')
  const [withdrawValue, setWithdrawValue] = useState('')

  const { deposit, withdraw } = useMasterChef(farm.chef)

  const addTransaction = useTransactionAdder()

  const liquidityToken = new Token(
    chainId,
    getAddress(farm.pair.id),
    farm.pair.type === PairType.KASHI ? Number(farm.pair.asset.decimals) : 18,
    farm.pair.type === PairType.KASHI ? 'KMP' : 'SLP'
  )

  const kashiPair = useKashiPair(farm.pair.id)

  const balance = useCurrencyBalance(account, liquidityToken)

  const stakedAmount = useUserInfo(farm, liquidityToken)

  const balanceFiatValue = CurrencyAmount.fromRawAmount(
    USD[chainId],
    farm.pair.type === PairType.KASHI
      ? kashiPair && balance
        ? getUSDValue(
            BigNumber.from(balance.quotient.toString()).mulDiv(
              kashiPair.currentAllAssets.value,
              kashiPair.totalAsset.base
            ),
            kashiPair.asset
          ).toString()
        : ZERO
      : JSBI.BigInt(
          ((Number(balance?.toExact() ?? '0') * farm.pair.reserveUSD) / farm.pair.totalSupply)
            .toFixed(USD[chainId].decimals)
            .toBigNumber(USD[chainId].decimals)
        )
  )

  const stakedAmountFiatValue = CurrencyAmount.fromRawAmount(
    USD[chainId],
    farm.pair.type === PairType.KASHI
      ? kashiPair && stakedAmount
        ? getUSDValue(
            BigNumber.from(stakedAmount.quotient.toString()).mulDiv(
              kashiPair.currentAllAssets.value,
              kashiPair.totalAsset.base
            ),
            kashiPair.asset
          ).toString()
        : ZERO
      : JSBI.BigInt(
          ((Number(stakedAmount?.toExact() ?? '0') * farm.pair.reserveUSD) / farm.pair.totalSupply)
            .toFixed(USD[chainId].decimals)
            .toBigNumber(USD[chainId].decimals)
        )
  )

  const parsedDepositValue = tryParseAmount(depositValue, liquidityToken)
  const parsedWithdrawValue = tryParseAmount(withdrawValue, liquidityToken)

  const APPROVAL_ADDRESSES = {
    [Chef.MASTERCHEF]: { [ChainId.MAINNET]: MASTERCHEF_ADDRESS[ChainId.MAINNET] },
    [Chef.MASTERCHEF_V2]: { [ChainId.MAINNET]: MASTERCHEF_V2_ADDRESS[ChainId.MAINNET] },
    [Chef.MINICHEF]: {
      [ChainId.MATIC]: MINICHEF_ADDRESS[ChainId.MATIC],
      [ChainId.XDAI]: MINICHEF_ADDRESS[ChainId.XDAI],
      [ChainId.HARMONY]: MINICHEF_ADDRESS[ChainId.HARMONY],
      [ChainId.ARBITRUM]: MINICHEF_ADDRESS[ChainId.ARBITRUM],
      [ChainId.CELO]: MINICHEF_ADDRESS[ChainId.CELO],
      [ChainId.MOONRIVER]: MINICHEF_ADDRESS[ChainId.MOONRIVER],
    },
  }

  const [approvalState, approve] = useApproveCallback(parsedDepositValue, APPROVAL_ADDRESSES[farm.chef][chainId])

  const depositError = !parsedDepositValue
    ? 'Enter an amount'
    : balance?.lessThan(parsedDepositValue)
    ? 'Insufficient balance'
    : undefined

  const isDepositValid = !depositError

  const withdrawError = !parsedWithdrawValue
    ? 'Enter an amount'
    : stakedAmount.lessThan(parsedWithdrawValue)
    ? 'Insufficient balance'
    : undefined

  const isWithdrawValid = !withdrawError

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between pb-2">
        <Switch.Group>
          <div className="flex items-center">
            <Switch
              checked={toggle}
              onChange={() => setToggle(!toggle)}
              className={`${
                toggle ? 'bg-blue border-blue' : 'bg-pink border-pink'
              } bg-opacity-60 border border-opacity-80 relative inline-flex items-center h-[32px] rounded-full w-[54px] transition-colors focus:outline-none`}
            >
              <span
                className={`${
                  toggle ? 'translate-x-[1px] text-blue' : 'translate-x-[23px] text-pink'
                } inline-block w-7 h-7 transform bg-white rounded-full transition-transform`}
              >
                {toggle ? <PlusIcon /> : <MinusIcon />}
              </span>
            </Switch>
            <Switch.Label className="ml-3">{toggle ? i18n._(t`Deposit`) : i18n._(t`Withdraw`)}</Switch.Label>
          </div>
        </Switch.Group>
        <div className="flex justify-end space-x-4">
          {['25', '50', '75', '100'].map((multipler, i) => (
            <Button
              variant="outlined"
              size="xs"
              color={toggle ? 'blue' : 'pink'}
              key={i}
              onClick={() => {
                toggle
                  ? setDepositValue(balance.multiply(multipler).divide(100).toExact())
                  : setWithdrawValue(stakedAmount.multiply(multipler).divide(100).toExact())
              }}
              className={classNames(
                'text-md border border-opacity-50',
                toggle ? 'focus:ring-blue border-blue' : 'focus:ring-pink border-pink',
                multipler === '25' || multipler === '75' ? 'hidden sm:block' : ''
              )}
            >
              {multipler === '100' ? 'MAX' : multipler + '%'}
            </Button>
          ))}
        </div>
      </div>
      {toggle ? (
        <div className="flex flex-col space-y-4">
          <CurrencyInputPanel
            value={depositValue}
            currency={liquidityToken}
            id="add-liquidity-input-tokenb"
            hideIcon
            onUserInput={(value) => setDepositValue(value)}
            currencyBalance={balance}
            fiatValue={balanceFiatValue}
            showMaxButton={false}
          />
          {!account ? (
            <Web3Connect size="lg" color="blue" className="w-full" />
          ) : isDepositValid &&
            (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) ? (
            <Button
              color="gradient"
              size="lg"
              onClick={approve}
              disabled={approvalState !== ApprovalState.NOT_APPROVED}
            >
              {approvalState === ApprovalState.PENDING ? <Dots>{i18n._(t`Approving`)}</Dots> : i18n._(t`Approve`)}
            </Button>
          ) : (
            <ButtonError
              onClick={async () => {
                try {
                  // KMP decimals depend on asset, SLP is always 18
                  const tx = await deposit(farm.id, BigNumber.from(parsedDepositValue.quotient.toString()))
                  addTransaction(tx, {
                    summary: `Deposit ${farm.pair.token0.name}/${farm.pair.token1.name}`,
                  })
                } catch (error) {
                  console.error(error)
                }
              }}
              disabled={!isDepositValid}
              error={!isDepositValid && !!parsedDepositValue}
            >
              {depositError || i18n._(t`Confirm Deposit`)}
            </ButtonError>
          )}
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          <CurrencyInputPanel
            value={withdrawValue}
            currency={liquidityToken}
            id="add-liquidity-input-tokenb"
            hideIcon
            onUserInput={(value) => setWithdrawValue(value)}
            currencyBalance={stakedAmount}
            fiatValue={stakedAmountFiatValue}
            showMaxButton={false}
          />
          {!account ? (
            <Web3Connect size="lg" color="blue" className="w-full" />
          ) : (
            <ButtonError
              onClick={async () => {
                try {
                  // KMP decimals depend on asset, SLP is always 18
                  const tx = await withdraw(farm.id, BigNumber.from(parsedWithdrawValue.quotient.toString()))
                  addTransaction(tx, {
                    summary: `Withdraw ${farm.pair.token0.name}/${farm.pair.token1.name}`,
                  })
                } catch (error) {
                  console.error(error)
                }
              }}
              disabled={!isWithdrawValid}
              error={!isWithdrawValid && !!parsedWithdrawValue}
            >
              {withdrawError || i18n._(t`Confirm Withdraw`)}
            </ButtonError>
          )}
        </div>
      )}
    </div>
  )
}

export default ManageBar
