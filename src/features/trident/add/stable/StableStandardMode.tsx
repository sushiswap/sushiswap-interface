import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { plural, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, Token } from '@sushiswap/core-sdk'
import loadingCircle from 'app/animation/loading-circle.json'
import AssetInput from 'app/components/AssetInput'
import Button from 'app/components/Button'
import Checkbox from 'app/components/Checkbox'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Dots from 'app/components/Dots'
import Typography from 'app/components/Typography'
import { attemptingTxnAtom, poolAtom, showReviewAtom } from 'app/features/trident/context/atoms'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { classNames } from 'app/functions/styling'
import { useBentoBoxContract, useTridentRouterContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { useTokenBalances } from 'app/state/wallet/hooks'
import Lottie from 'lottie-react'
import React, { FC, useMemo, useState } from 'react'
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil'

import TransactionDetails from '../TransactionDetails'
import { amountsSelector, parsedAmountsSelector } from './context/atoms'

function toggleArrayItem(arr, item) {
  return arr.includes(item)
    ? arr.filter((i) => i !== item) // remove item
    : [...arr, item] // add item
}

type TokenTileProps =
  | {
      amount: CurrencyAmount<Token>
      token?: never
      onClick?: () => void
      active?: boolean
      horizontal?: false
    }
  | {
      token: Token | undefined
      amount?: never
      onClick?: () => void
      active?: boolean
      horizontal: true
    }

const TokenTile: FC<TokenTileProps> = ({ amount, token, onClick = null, active = false, horizontal = false }) => {
  return (
    <div
      {...(onClick && { onClick })}
      className={classNames(
        onClick ? 'cursor-pointer' : '',
        horizontal ? 'flex-row p-1.5' : 'flex-col p-3',
        active ? 'opacity-100' : 'opacity-50',
        'relative flex border border-dark-700 bg-dark-900 rounded items-center justify-center gap-1'
      )}
    >
      {!horizontal && (
        <div className="absolute z-10 top-2 right-2">
          <Checkbox checked={active} />
        </div>
      )}
      <CurrencyLogo
        currency={amount ? amount.currency : token}
        size={horizontal ? 26 : 38}
        className="rounded-full filter drop-shadow-currencyLogo"
      />
      <div className="flex flex-col justify-center gap-0.5">
        <Typography variant="sm" weight={active ? 700 : 400}>
          {amount ? amount?.currency?.symbol : token?.symbol}
        </Typography>
        {amount && (
          <Typography variant="xs" weight={400} className="text-center">
            {amount.toSignificant(6)}
          </Typography>
        )}
      </div>
    </div>
  )
}

const StableStandardMode: FC = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { pool } = useRecoilValue(poolAtom)
  const amounts = useRecoilValue(amountsSelector)
  const parsedAmounts = useRecoilValue(parsedAmountsSelector)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const [selected, setSelected] = useState<Token[]>([])
  const tokens = useMemo(() => [pool?.token0, pool?.token1], [pool?.token0, pool?.token1])
  const balances = useTokenBalances(account ? account : undefined, tokens)
  const bentoBox = useBentoBoxContract()
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)
  const router = useTridentRouterContract()

  const availableAssets = useMemo(
    () =>
      Object.values(balances)
        .sort((a, b) => (a.lessThan(b.quotient) ? -1 : 1))
        .filter((el) => el.greaterThan('0')),
    [balances]
  )

  const unavailableAssets = useMemo(
    () => tokens.filter((token) => !availableAssets.some((balance) => balance.currency === token)),
    [tokens, availableAssets]
  )

  const validInputs = useMemo(() => {
    return Object.values(parsedAmounts).every((el) => el?.greaterThan(0))
  }, [parsedAmounts])

  const isMax = useMemo(() => {
    return selected.every((el) => parsedAmounts[el.address].equalTo(balances[el.address]))
  }, [balances, parsedAmounts, selected])

  const onMax = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const parsedAmounts = { ...(await snapshot.getPromise(parsedAmountsSelector)) }
        availableAssets.forEach((el) => {
          parsedAmounts[el?.currency.address] = el
        })

        set(parsedAmountsSelector, parsedAmounts)
      },
    [availableAssets]
  )

  const handleInput = useRecoilCallback<[string, string], void>(({ snapshot, set }) => async (value, address) => {
    const amounts = await snapshot.getPromise(amountsSelector)
    set(amountsSelector, {
      ...amounts,
      [address]: value,
    })
  })

  const error = !validInputs

  return (
    <div className="flex flex-col gap-8 px-5">
      <div className="flex flex-col">
        <Disclosure defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex flex-row justify-between">
                <Typography variant="lg" weight={700} className={open ? 'text-high-emphesis' : 'text-secondary'}>
                  {i18n._(t`Available Assets`)}
                </Typography>
                <div className="flex gap-0.5">
                  <Typography variant="lg" weight={700} className="text-high-emphesis">
                    <span className="text-blue">{availableAssets.length}</span>/{tokens.length}
                  </Typography>
                  <ChevronDownIcon className={open ? 'transform rotate-180' : ''} width={24} height={24} />
                </div>
              </Disclosure.Button>
              <Disclosure.Panel>
                <Typography variant="sm" className="mt-3 text-high-emphesis">
                  {i18n._(t`You have balances of each of the following assets, ordered from greatest to least amount. Tap to toggle which
        ones you would like to deposit`)}
                </Typography>
                <div className="grid grid-cols-4 gap-4 mt-6">
                  {availableAssets.map((balance, index) => (
                    <TokenTile
                      amount={balance}
                      key={index}
                      active={selected.includes(balance.currency)}
                      onClick={() => setSelected((prevState) => toggleArrayItem(prevState, balance.currency))}
                    />
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
      <div className="flex flex-col">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex flex-row justify-between">
                <Typography variant="lg" weight={700} className={open ? 'text-high-emphesis' : 'text-secondary'}>
                  {i18n._(t`Unavailable Assets`)}
                </Typography>
                <div className="flex gap-0.5">
                  <Typography variant="lg" weight={700} className="text-high-emphesis">
                    <span className="text-secondary">{unavailableAssets.length}</span>/{tokens.length}
                  </Typography>
                  <ChevronDownIcon className={open ? 'transform rotate-180' : ''} width={24} height={24} />
                </div>
              </Disclosure.Button>
              <Disclosure.Panel>
                <Typography variant="sm" className="mt-3 text-high-emphesis">
                  {i18n._(t`You have no balances of the following assets.`)}
                </Typography>
                <div className="flex flex-row gap-4 mt-6">
                  {unavailableAssets.map((token, index) => (
                    <TokenTile token={token} key={index} horizontal />
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
      {selected.length > 0 && (
        <>
          <div className="flex flex-col">
            <Typography variant="h3" weight={700} className="text-high-emphesis">
              Enter Amounts
            </Typography>
            <Typography variant="xs" className="text-blue">
              {i18n._(t`${selected.length} ${plural(selected.length, { one: 'Asset', other: 'Assets' })} Selected`)}
            </Typography>
          </div>
          <div className="flex flex-col gap-4">
            {selected.map((currency) => (
              <AssetInput
                key={currency.address}
                currency={currency}
                value={amounts[currency.address]}
                onChange={(val) => handleInput(val || '', currency.address)}
              />
            ))}

            <div className="flex flex-col gap-3">
              <TridentApproveGate
                inputAmounts={Object.values(parsedAmounts)}
                tokenApproveOn={bentoBox?.address}
                masterContractAddress={router?.address}
              >
                {({ approved, loading }) => {
                  const disabled = !!error || !approved || loading || attemptingTxn
                  const buttonText = attemptingTxn ? (
                    <Dots>{i18n._(t`Depositing`)}</Dots>
                  ) : loading ? (
                    ''
                  ) : error ? (
                    error
                  ) : (
                    i18n._(t`Confirm Deposit`)
                  )

                  return (
                    <div className={classNames(!isMax ? 'grid grid-cols-2 gap-3' : 'flex')}>
                      {!isMax && (
                        <Button
                          color="gradient"
                          variant={isMax ? 'filled' : 'outlined'}
                          disabled={isMax}
                          onClick={onMax}
                        >
                          <Typography
                            variant="sm"
                            weight={700}
                            className={!isMax ? 'text-high-emphesis' : 'text-low-emphasis'}
                          >
                            {i18n._(t`Max Deposit`)}
                          </Typography>
                        </Button>
                      )}
                      <Button
                        {...(loading && {
                          startIcon: (
                            <div className="w-4 h-4 mr-1">
                              <Lottie animationData={loadingCircle} autoplay loop />
                            </div>
                          ),
                        })}
                        color="gradient"
                        disabled={disabled}
                        onClick={() => setShowReview(true)}
                      >
                        <Typography
                          variant="sm"
                          weight={700}
                          className={!error ? 'text-high-emphesis' : 'text-low-emphasis'}
                        >
                          {buttonText}
                        </Typography>
                      </Button>
                    </div>
                  )
                }}
              </TridentApproveGate>
            </div>
          </div>
        </>
      )}
      {validInputs && <TransactionDetails />}
    </div>
  )
}

export default StableStandardMode
