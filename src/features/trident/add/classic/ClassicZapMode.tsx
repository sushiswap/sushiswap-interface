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
import {
  attemptingTxnAtom,
  noLiquiditySelector,
  poolAtom,
  showReviewAtom,
  spendFromWalletSelector,
} from 'app/features/trident/context/atoms'
import { useZapAssetInput } from 'app/features/trident/context/hooks/useZapAssetInput'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { useBentoBoxContract, useTridentRouterContract } from 'app/hooks/useContract'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import { useActiveWeb3React } from 'app/services/web3'
import Lottie from 'lottie-react'
import React from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import TransactionDetails from '../TransactionDetails'

const ClassicZapMode = () => {
  const isDesktop = useDesktopMediaQuery()
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const bentoBox = useBentoBoxContract()

  const router = useTridentRouterContract()
  const { pool } = useRecoilValue(poolAtom)
  const {
    zapInputAmount: [zapInputAmount, setZapInputAmount],
    parsedAmount,
    zapCurrency: [zapCurrency, setZapCurrency],
    parsedSplitAmounts,
    error,
  } = useZapAssetInput()
  const setShowReview = useSetRecoilState(showReviewAtom)
  const noLiquidity = useRecoilValue(noLiquiditySelector)
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)
  const [spendFromWallet, setSpendFromWallet] = useRecoilState(spendFromWalletSelector(0))

  return (
    <>
      {noLiquidity ? (
        <div className="mb-2">
          <Alert
            dismissable={false}
            type="error"
            showIcon
            message={i18n._(t`Zap mode is unavailable when there is no liquidity in the pool`)}
          />
        </div>
      ) : (
        <div className="mb-2">
          <Alert
            dismissable={false}
            type="information"
            showIcon
            message={i18n._(t`In Zap mode, your selected asset will be split and rebalanced into the corresponding tokens and their weights
          automatically.`)}
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <AssetInput
          value={zapInputAmount}
          currency={zapCurrency}
          onChange={(val) => setZapInputAmount(val || '')}
          onSelect={setZapCurrency}
          disabled={noLiquidity}
          currencies={[NATIVE[chainId], pool?.token0, pool?.token1]}
          headerRight={
            <AssetInput.WalletSwitch onChange={() => setSpendFromWallet(!spendFromWallet)} checked={spendFromWallet} />
          }
          spendFromWallet={spendFromWallet}
        />
        <div className="flex flex-col gap-3">
          <TridentApproveGate
            inputAmounts={[parsedAmount]}
            tokenApproveOn={bentoBox?.address}
            masterContractAddress={router?.address}
            withPermit={true}
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
                className="text-sm font-bold"
                onClick={() => setShowReview(true)}
              >
                {attemptingTxn ? <Dots>Depositing</Dots> : loading ? '' : !error ? i18n._(t`Confirm Deposit`) : error}
              </Button>
            )}
          </TridentApproveGate>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-8">
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
      {!error && !isDesktop && (
        <div className="px-5 mt-6">
          <TransactionDetails />
        </div>
      )}
    </>
  )
}

export default ClassicZapMode
