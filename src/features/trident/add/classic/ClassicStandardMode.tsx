import { useActiveWeb3React } from '../../../../hooks'
import React, { useMemo } from 'react'
import { noLiquiditySelector, showReviewAtom, spendFromWalletAtom } from '../../context/atoms'
import {
  formattedAmountsSelector,
  mainInputAtom,
  parsedAmountsSelector,
  poolAtom,
  secondaryInputAtom,
} from './context/atoms'
import { useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import AssetInput from '../../../../components/AssetInput'
import { ConstantProductPoolState } from '../../../../hooks/useTridentClassicPools'
import TransactionDetails from './../TransactionDetails'
import { ZERO } from '@sushiswap/sdk'
import { classNames, maxAmountSpend } from '../../../../functions'
import { t } from '@lingui/macro'
import { useCurrencyBalances } from '../../../../state/wallet/hooks'
import { useLingui } from '@lingui/react'
import { useUSDCValue } from '../../../../hooks/useUSDCPrice'
import TridentApproveGate from '../../ApproveButton'
import Button from '../../../../components/Button'
import Typography from '../../../../components/Typography'
import Lottie from 'lottie-react'
import loadingCircle from '../../../../animation/loading-circle.json'

const ClassicStandardMode = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const [poolState, pool] = useRecoilValue(poolAtom)
  const [parsedAmountA, parsedAmountB] = useRecoilValue(parsedAmountsSelector)
  const formattedAmounts = useRecoilValue(formattedAmountsSelector)

  const setShowReview = useSetRecoilState(showReviewAtom)
  const [mainInput, setMainInput] = useRecoilState(mainInputAtom)
  const [secondaryInput, setSecondaryInput] = useRecoilState(secondaryInputAtom)

  const [spendFromWallet, setSpendFromWallet] = useRecoilState(spendFromWalletAtom)
  const balances = useCurrencyBalances(account ?? undefined, [pool?.token0, pool?.token1])
  const noLiquidity = useRecoilValue(noLiquiditySelector)

  const usdcA = useUSDCValue(balances?.[0])
  const usdcB = useUSDCValue(balances?.[1])

  const onMax = useRecoilCallback(
    ({ set }) =>
      async () => {
        if (!balances || !usdcA || !usdcB) return

        if (!noLiquidity) {
          usdcA?.lessThan(usdcB)
            ? set(mainInputAtom, maxAmountSpend(balances[0])?.toExact())
            : set(secondaryInputAtom, maxAmountSpend(balances[1])?.toExact())
        } else {
          set(mainInputAtom, maxAmountSpend(balances[0])?.toExact())
          set(secondaryInputAtom, maxAmountSpend(balances[1])?.toExact())
        }
      },
    [balances, noLiquidity, usdcA, usdcB]
  )

  const isMax = useMemo(() => {
    if (!balances || !usdcA || !usdcB) return false

    if (!noLiquidity) {
      return usdcA?.lessThan(usdcB)
        ? parsedAmountA?.equalTo(maxAmountSpend(balances[0]))
        : parsedAmountB?.equalTo(maxAmountSpend(balances[1]))
    } else {
      return parsedAmountA?.equalTo(maxAmountSpend(balances[0])) && parsedAmountB?.equalTo(maxAmountSpend(balances[1]))
    }
  }, [balances, noLiquidity, parsedAmountA, parsedAmountB, usdcA, usdcB])

  let error = !account
    ? i18n._(t`Connect Wallet`)
    : poolState === ConstantProductPoolState.INVALID
    ? i18n._(t`Invalid pair`)
    : !parsedAmountA?.greaterThan(ZERO) || !parsedAmountB?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : parsedAmountA && balances[0]?.lessThan(parsedAmountA)
    ? i18n._(t`Insufficient ${pool?.token0?.symbol} balance`)
    : parsedAmountB && balances?.length && balances[1]?.lessThan(parsedAmountB)
    ? i18n._(t`Insufficient ${pool?.token1?.symbol} balance`)
    : ''

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 px-5">
          <AssetInput
            value={parsedAmountA?.greaterThan(0) ? formattedAmounts[0] : mainInput}
            currency={pool?.token0}
            onChange={setMainInput}
            headerRight={
              <AssetInput.WalletSwitch
                onChange={() => setSpendFromWallet(!spendFromWallet)}
                checked={spendFromWallet}
              />
            }
            spendFromWallet={spendFromWallet}
          />
          <AssetInput
            value={parsedAmountB?.greaterThan(0) ? formattedAmounts[1] : secondaryInput}
            currency={pool?.token1}
            onChange={setSecondaryInput}
            spendFromWallet={spendFromWallet}
          />
          <div className="flex flex-col gap-3">
            <TridentApproveGate inputAmounts={[parsedAmountA, parsedAmountB]}>
              {({ approved, loading }) => {
                const disabled = !!error || !approved || loading
                const buttonText = loading ? '' : error ? error : i18n._(t`Confirm Deposit`)

                return (
                  <div className={classNames(onMax && !isMax ? 'grid grid-cols-2 gap-3' : 'flex')}>
                    {!isMax && (
                      <Button color="gradient" variant={isMax ? 'filled' : 'outlined'} disabled={isMax} onClick={onMax}>
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
        {!error && (
          <div className="flex flex-col px-5">
            <TransactionDetails />
          </div>
        )}
      </div>
    </>
  )
}

export default ClassicStandardMode
