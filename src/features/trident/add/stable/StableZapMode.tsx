import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE } from '@sushiswap/core-sdk'
import loadingCircle from 'app/animation/loading-circle.json'
import Alert from 'app/components/Alert'
import AssetInput from 'app/components/AssetInput'
import Button from 'app/components/Button'
import Dots from 'app/components/Dots'
import ListPanel from 'app/components/ListPanel'
import Typography from 'app/components/Typography'
import { attemptingTxnAtom, noLiquiditySelector, poolAtom, showReviewAtom } from 'app/features/trident/context/atoms'
import { useZapAssetInput } from 'app/features/trident/context/hooks/useZapAssetInput'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { useBentoBoxContract, useTridentRouterContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import Lottie from 'lottie-react'
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import TransactionDetails from '../TransactionDetails'

const StableZapMode = () => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const bentoBox = useBentoBoxContract()
  const router = useTridentRouterContract()

  const { pool } = useRecoilValue(poolAtom)
  const {
    zapInputAmount: [zapInputAmount, setZapInputAmount],
    zapCurrency: [zapCurrency, setZapCurrency],
    error,
    parsedAmount,
    parsedSplitAmounts,
  } = useZapAssetInput()

  const setShowReview = useSetRecoilState(showReviewAtom)
  const noLiquidity = useRecoilValue(noLiquiditySelector)
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)

  return (
    <div className="flex flex-col gap-6 px-5">
      <Alert
        dismissable={false}
        type="information"
        showIcon
        message={i18n._(t`In Zap mode, your selected asset will be split and rebalanced into the corresponding tokens and their weights
          automatically.`)}
      />
      <div className="flex flex-col gap-5">
        <AssetInput
          value={zapInputAmount}
          currency={zapCurrency}
          onChange={(val) => setZapInputAmount(val || '')}
          onSelect={setZapCurrency}
          disabled={noLiquidity}
          currencies={[NATIVE[chainId], pool?.token0, pool?.token1]}
        />
        <div className="flex flex-col gap-3">
          <TridentApproveGate
            inputAmounts={[parsedAmount]}
            tokenApproveOn={bentoBox?.address}
            masterContractAddress={router?.address}
          >
            {({ loading, approved }) => (
              <Button
                {...(loading && {
                  startIcon: (
                    <div className="w-5 h-5 mr-1">
                      <Lottie animationData={loadingCircle} autoplay loop />
                    </div>
                  ),
                })}
                color={zapInputAmount ? 'gradient' : 'gray'}
                disabled={!!error || !approved || attemptingTxn}
                className="font-bold text-sm"
                onClick={() => setShowReview(true)}
              >
                {attemptingTxn ? <Dots>Depositing</Dots> : loading ? '' : !error ? i18n._(t`Confirm Deposit`) : error}
              </Button>
            )}
          </TridentApproveGate>
        </div>
      </div>
      <div className="flex flex-col gap-4 px-5 mt-8">
        <Typography weight={700} className="text-high-emphesis">
          {zapCurrency
            ? i18n._(t`Your ${zapCurrency.symbol} will be split into:`)
            : i18n._(t`Your selected token will be split into:`)}
        </Typography>
        <ListPanel
          items={parsedSplitAmounts.map((amount, index) => (
            <ListPanel.CurrencyAmountItem amount={amount} key={index} />
          ))}
        />
      </div>
      {!error && (
        <div className="mt-6 px-5">
          <TransactionDetails />
        </div>
      )}
    </div>
  )
}

export default StableZapMode
