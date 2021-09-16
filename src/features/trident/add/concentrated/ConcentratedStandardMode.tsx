import React, { FC, useMemo } from 'react'
import AssetInput from '../../../../components/AssetInput'
import TransactionDetails from '../TransactionDetails'
import { attemptingTxnAtom, noLiquiditySelector, showReviewAtom, spendFromWalletAtom } from '../../context/atoms'
import { useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { poolAtom } from './context/atoms'
import {
  formattedAmountsSelector,
  mainInputAtom,
  parsedAmountsSelector,
  secondaryInputSelector,
  TypedField,
  typedFieldAtom,
} from '../classic/context/atoms'
import TridentApproveGate from '../../ApproveButton'
import Dots from '../../../../components/Dots'
import { t } from '@lingui/macro'
import { classNames, maxAmountSpend } from '../../../../functions'
import Button from '../../../../components/Button'
import Typography from '../../../../components/Typography'
import Lottie from 'lottie-react'
import loadingCircle from '../../../../animation/loading-circle.json'
import { useActiveWeb3React, useBentoBoxContract } from '../../../../hooks'
import { useLingui } from '@lingui/react'
import { ConstantProductPoolState } from '../../../../hooks/useTridentClassicPools'
import { ZERO } from '@sushiswap/sdk'
import { useCurrencyBalances } from '../../../../state/wallet/hooks'
import { useUSDCValue } from '../../../../hooks/useUSDCPrice'

const ConcentratedStandardMode: FC = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const [poolState, pool] = useRecoilValue(poolAtom)
  const [parsedAmountA, parsedAmountB] = useRecoilValue(parsedAmountsSelector)
  const bentoBox = useBentoBoxContract()

  const setShowReview = useSetRecoilState(showReviewAtom)
  const setMainInput = useSetRecoilState(mainInputAtom)
  const setSecondaryInput = useSetRecoilState(secondaryInputSelector)
  const formattedAmounts = useRecoilValue(formattedAmountsSelector)
  const setTypedField = useSetRecoilState(typedFieldAtom)
  const [spendFromWallet, setSpendFromWallet] = useRecoilState(spendFromWalletAtom)
  const balances = useCurrencyBalances(account ?? undefined, [pool?.token0, pool?.token1])
  const noLiquidity = useRecoilValue(noLiquiditySelector)
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)

  const usdcA = useUSDCValue(balances?.[0])
  const usdcB = useUSDCValue(balances?.[1])

  const onMax = useRecoilCallback(
    ({ set }) =>
      async () => {
        if (!balances || !usdcA || !usdcB) return

        if (!noLiquidity) {
          usdcA?.lessThan(usdcB)
            ? set(mainInputAtom, maxAmountSpend(balances[0])?.toExact())
            : set(secondaryInputSelector, maxAmountSpend(balances[1])?.toExact())
        } else {
          set(mainInputAtom, maxAmountSpend(balances[0])?.toExact())
          set(secondaryInputSelector, maxAmountSpend(balances[1])?.toExact())
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

  // TODO ramin: balances (bentobox) and poolState
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 px-5">
        <AssetInput
          value={formattedAmounts[0]}
          currency={pool?.token0}
          onChange={(val) => {
            setTypedField(TypedField.A)
            setMainInput(val)
          }}
          headerRight={
            <AssetInput.WalletSwitch onChange={() => setSpendFromWallet(!spendFromWallet)} checked={spendFromWallet} />
          }
          spendFromWallet={spendFromWallet}
        />
        <AssetInput
          value={formattedAmounts[1]}
          currency={pool?.token1}
          onChange={(val) => {
            setTypedField(TypedField.B)
            setSecondaryInput(val)
          }}
          spendFromWallet={spendFromWallet}
        />

        <div className="flex flex-col gap-3">
          <TridentApproveGate inputAmounts={[parsedAmountA, parsedAmountB]} tokenApproveOn={bentoBox?.address}>
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
  )
}

export default ConcentratedStandardMode
