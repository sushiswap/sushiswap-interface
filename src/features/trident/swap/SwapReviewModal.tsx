import { BigNumber } from '@ethersproject/bignumber'
import { ArrowDownIcon, ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Pair, Token, TradeVersion } from '@sushiswap/core-sdk'
import { Fee } from '@sushiswap/sdk'
import { ConstantProductPool } from '@sushiswap/trident-sdk'
import { isValidAddress } from '@walletconnect/utils'
import useCurrenciesFromURL from 'app/features/trident/context/hooks/useCurrenciesFromURL'
import SwapSubmittedModalContent from 'app/features/trident/swap/SwapSubmittedModalContent'
import { TridentApproveGateBentoPermitAtom } from 'app/features/trident/TridentApproveGate'
import { getTradeVersion } from 'app/functions/getTradeVersion'
import useBentoRebases from 'app/hooks/useBentoRebases'
import { currentTradeAtom } from 'app/hooks/useBestTridentTrade'
import { useActiveWeb3React } from 'app/services/web3'
import Button from 'components/Button'
import CurrencyLogo from 'components/CurrencyLogo'
import Divider from 'components/Divider'
import HeadlessUIModal from 'components/Modal/HeadlessUIModal'
import Typography from 'components/Typography'
import { shortenAddress, toAmountCurrencyAmount, warningSeverity } from 'functions'
import useENS from 'hooks/useENS'
import { SwapCallbackState, useSwapCallback } from 'hooks/useSwapCallback'
import useSwapSlippageTolerance from 'hooks/useSwapSlippageTollerence'
import useTransactionStatus from 'hooks/useTransactionStatus'
import { FC, useCallback, useMemo, useState } from 'react'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'

import { showReviewAtom } from '../context/atoms'
import useSwapAssetPanelInputs from '../context/hooks/useSwapAssetPanelInputs'
import { PoolUnion } from '../types'
import RecipientPanel from './RecipientPanel'
import SwapRate from './SwapRate'

function serialize(obj: any) {
  return JSON.stringify(
    obj,
    (key, value) => {
      switch (key) {
        case 'fromToken':
        case 'tokenFrom':
        case 'toToken':
        case 'tokenTo':
        case 'tokenInfo':
          return {
            name: value.name,
            address: value.address,
            decimals: value.decimals,
          }
        case 'amountInBN':
        case 'amountOutBN':
        case 'totalAmountOutBN':
          return BigNumber.from(value.hex).toString()
        default:
          return value
      }
    },
    '  '
  )
}

function getTokenInfo(t: Token) {
  return {
    name: t.name,
    address: t.address,
    decimals: t.decimals,
  }
}

function getPoolInfo(pool: PoolUnion | Pair) {
  if (pool instanceof ConstantProductPool) {
    return {
      type: 'ConstantProduct',
      address: pool.liquidityToken.address,
      token0: getTokenInfo(pool.assets[0]),
      token1: getTokenInfo(pool.assets[1]),
      fee: pool.fee / 10000,
      reserve0: pool.reserves[0].quotient.toString(),
      reserve1: pool.reserves[1].quotient.toString(),
    }
  } else if (pool instanceof Pair) {
    return {
      type: 'Legacy',
      address: pool.liquidityToken.address,
      token0: getTokenInfo(pool.token0),
      token1: getTokenInfo(pool.token1),
      fee: Fee.DEFAULT / 10000,
      reserve0: pool.reserve0.quotient.toString(),
      reserve1: pool.reserve1.quotient.toString(),
    }
  } else {
    return 'Unsupported type of pool !!!'
  }
}

const SwapReviewModal: FC = () => {
  const { i18n } = useLingui()
  const { currencies } = useCurrenciesFromURL()
  const [showReview, setShowReview] = useRecoilState(showReviewAtom)
  const { trade, reset } = useSwapAssetPanelInputs()
  const recipient = useRecoilValue(RecipientPanel.atom)
  const { address } = useENS(recipient)
  const [txHash, setTxHash] = useState<string>()
  const allowedSlippage = useSwapSlippageTolerance(trade)
  const tx = useTransactionStatus()
  const bentoPermit = useRecoilValue(TridentApproveGateBentoPermitAtom)
  const resetBentoPermit = useResetRecoilState(TridentApproveGateBentoPermitAtom)
  const [cbError, setCbError] = useState<string>()
  const { rebases } = useBentoRebases(currencies)
  const {
    parsedAmounts: [inputAmount, outputAmount],
    spendFromWallet: [fromWallet],
    receiveToWallet: [receiveToWallet],
    priceImpact,
  } = useSwapAssetPanelInputs()

  const { state, callback, error } = useSwapCallback(trade, allowedSlippage, address, null, {
    bentoPermit,
    resetBentoPermit,
    receiveToWallet,
    fromWallet,
    parsedAmounts: [inputAmount, outputAmount],
  })

  const { chainId } = useActiveWeb3React()
  const currentTradeInfo = useRecoilValue(currentTradeAtom)
  const allowedPools = currentTradeInfo?.allowedPools
  const currentTrade = currentTradeInfo?.trade

  const execute = useCallback(async () => {
    if (!callback) return

    try {
      // console.log(chainId)
      // console.log(allowedPools)
      // console.log(serialize(allowedPools.map(getPoolInfo)))
      // console.log('trade', currentTrade, serialize(currentTrade.route))

      const txHash = await callback()
      //console.log('tr', txHash)

      setTxHash(txHash)

      // Reset inputs
      reset()
    } catch (e) {
      setCbError(e.message)
    }
  }, [callback, reset, setTxHash])

  const minimumAmountOutLegacy = trade ? trade.minimumAmountOut(allowedSlippage) : undefined
  const minimumAmountOutTrident =
    rebases && minimumAmountOutLegacy && rebases[minimumAmountOutLegacy.currency.wrapped.address]
      ? toAmountCurrencyAmount(
          rebases[minimumAmountOutLegacy.currency.wrapped.address],
          minimumAmountOutLegacy?.wrapped
        )
      : undefined
  const minimumAmountOut =
    getTradeVersion(trade) === TradeVersion.V3TRADE ? minimumAmountOutTrident : minimumAmountOutLegacy

  const priceImpactClassName = useMemo(() => {
    if (!priceImpact) return undefined
    if (priceImpact.lessThan('0')) return 'text-green'
    const severity = warningSeverity(priceImpact)
    if (severity < 1) return 'text-green'
    if (severity < 2) return 'text-yellow'
    if (severity < 3) return 'text-red'
    return 'text-red'
  }, [priceImpact])

  // Need to use controlled modal here as open variable comes from the liquidityPageState.
  // In other words, this modal needs to be able to get spawned from anywhere within this context
  return (
    <HeadlessUIModal.Controlled
      isOpen={showReview}
      onDismiss={() => setShowReview(false)}
      afterLeave={() => setTxHash(undefined)}
    >
      {!txHash ? (
        <div className="flex flex-col h-full gap-5 pb-4 lg:max-w-md">
          <div className="relative">
            <div className="absolute w-full h-full pointer-events-none bg-gradient-to-r from-opaque-blue to-opaque-pink opacity-20" />
            <div className="flex flex-col gap-4 px-5 pt-5 pb-8">
              <div className="flex flex-row justify-between">
                <Button
                  color="blue"
                  variant="outlined"
                  size="sm"
                  className="py-1 pl-2 rounded-full cursor-pointer"
                  startIcon={<ChevronLeftIcon width={24} height={24} />}
                  onClick={() => setShowReview(false)}
                >
                  {i18n._(t`Back`)}
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <Typography variant="h2" weight={700} className="text-high-emphesis">
                  {i18n._(t`Confirm Swap`)}
                </Typography>
                <Typography variant="sm" weight={700}>
                  {i18n._(
                    t`Output is estimated. You will receive at least ${minimumAmountOut?.toSignificant(4)} ${
                      currencies[1]?.symbol
                    } or the transaction will revert`
                  )}
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 px-5">
            <div className="flex items-center gap-3">
              <CurrencyLogo currency={inputAmount?.currency} size={48} className="rounded-full" />
              <Typography variant="h3" weight={700} className="text-white">
                {inputAmount?.toSignificant(6)}
              </Typography>
              <Typography variant="h3" weight={700} className="text-secondary">
                {inputAmount?.currency.symbol}
              </Typography>
            </div>
            <div className="flex justify-center w-12 text-secondary">
              <ArrowDownIcon width={20} />
            </div>
            <div className="flex items-center gap-3">
              <CurrencyLogo currency={outputAmount?.currency} size={48} className="rounded-full" />
              <Typography variant="h3" weight={700} className="text-white">
                {outputAmount?.toSignificant(6)}
              </Typography>
              <Typography variant="h3" weight={700} className="text-secondary">
                {currencies[1]?.symbol}
              </Typography>
            </div>
          </div>
          <div className="flex flex-col gap-3 px-5">
            <Divider className="border-dark-800" />
            <div className="flex justify-between">
              <Typography variant="sm" className="text-secondary">
                {i18n._(t`Minimum received`)}
              </Typography>
              <Typography variant="sm" className="text-high-emphesis" weight={700}>
                {minimumAmountOut?.toSignificant(4)} <span className="text-low-emphesis">{currencies[1]?.symbol}</span>
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="sm" className="text-secondary">
                {i18n._(t`Price impact`)}
              </Typography>
              <Typography variant="sm" className={priceImpactClassName} weight={700}>
                {priceImpact?.toSignificant(3)}%
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="sm" className="text-secondary">
                {i18n._(t`Slippage tolerance`)}
              </Typography>
              <Typography variant="sm" className="text-high-emphesis" weight={700}>
                {allowedSlippage?.toSignificant(3)}%
              </Typography>
            </div>
            <SwapRate className="text-secondary" />
            {address && isValidAddress(address) && (
              <div className="flex justify-between">
                <Typography variant="sm" className="text-yellow">
                  {i18n._(t`Recipient`)}
                </Typography>
                <Typography variant="sm" className="text-yellow" weight={700}>
                  {shortenAddress(address)}
                </Typography>
              </div>
            )}
            <Button
              id="review-swap-button"
              disabled={!!tx || state === SwapCallbackState.INVALID}
              color="gradient"
              size="lg"
              onClick={execute}
              className="mt-4 mb-2"
            >
              <Typography variant="sm" weight={700} className="text-high-emphesis">
                {error && !txHash ? error : recipient ? i18n._(t`Swap and send to recipient`) : i18n._(t`Swap`)}
              </Typography>
            </Button>
            {!txHash && (error || cbError) && (
              <Typography variant="xs" weight={700} className="text-center text-red">
                {error || cbError}
              </Typography>
            )}
          </div>
        </div>
      ) : (
        <SwapSubmittedModalContent txHash={txHash} />
      )}
    </HeadlessUIModal.Controlled>
  )
}

export default SwapReviewModal
