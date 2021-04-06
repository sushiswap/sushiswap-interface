import React, { useState } from 'react'
import { Alert, Dots, BlueButton, BlueButtonOutlined } from 'kashi/components'
import { Input as NumericalInput } from 'components/NumericalInput'
import { ArrowDownRight } from 'react-feather'
import { useActiveWeb3React } from 'hooks'
import useKashi from 'kashi/hooks/useKashi'
import { formatToBalance, formatFromBalance, formattedNum } from 'utils'
import { BENTOBOX_ADDRESS } from 'kashi/constants'
import { ApprovalState } from 'hooks/useApproveCallback'
import { useApproveCallback } from 'sushi-hooks/useApproveCallback'
import { WETH } from '@sushiswap/sdk'
import { e10 } from 'kashi/functions/math'
import { TransactionReview } from 'kashi/entities/TransactionReview'
import TransactionReviewView from 'kashi/components/TransactionReview'
import { toShare } from 'kashi/functions/bentobox'
import { KashiCooker } from 'kashi/entities/KashiCooker'

export default function LendDepositAction({ pair }: any): JSX.Element {
  const { account, chainId, library } = useActiveWeb3React()
  const { depositAddAsset, addAsset } = useKashi()

  // State
  const [useBento, setUseBento] = useState<boolean>(pair.asset.bentoBalance.gt(0))
  const [value, setValue] = useState('')
  const [approvalState, approve] = useApproveCallback(pair.asset.address, BENTOBOX_ADDRESS)

  // Calculated
  const balance = useBento ? pair.asset.bentoBalance : pair.asset.balance

  const max = balance.toFixed(pair.asset.decimals)

  const warning = pair.oracleExchangeRate.isZero() || balance?.lt(value.toBigNumber(pair.asset.decimals))

  const showApprove =
    chainId &&
    pair.asset.address !== WETH[chainId].address &&
    !useBento &&
    value &&
    (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING)

  const warningMessage = pair.oracleExchangeRate.isZero()
    ? 'Oracle exchange rate has NOT been set'
    : balance?.lt(value.toBigNumber(pair.asset.decimals)) &&
      `Please make sure your ${useBento ? 'BentoBox' : 'wallet'} balance is sufficient to deposit and then try again.`


  const transactionReview = new TransactionReview()
    if (value) {
      const amount = value.toBigNumber(pair.asset.decimals)
      const newUserAssetAmount = pair.currentUserAssetAmount.value.add(amount)
      transactionReview.addTokenAmount('Balance', pair.currentUserAssetAmount.value, newUserAssetAmount, pair.asset)
      const newUtilization = e10(18).muldiv(pair.currentBorrowAmount.value, pair.currentAllAssets.value.add(amount))
      transactionReview.addPercentage('Borrowed', pair.utilization.value, newUtilization)
    }    

  // Handlers
  async function onClick() {
    await new KashiCooker(pair, account, library)
      .addAsset(value.toBigNumber(pair.asset.decimals), useBento)
      .cook()
  }

  return (
    <>
      <div className="text-3xl text-high-emphesis mt-6">Deposit {pair.asset.symbol}</div>

      <div className="flex justify-between my-4">
        <div className="text-base text-secondary">
          <span>
            <ArrowDownRight size="1rem" style={{ display: 'inline' }} />
          </span>
          <span> From </span>
          <span>
            <BlueButtonOutlined
              className="focus:ring focus:ring-blue"
              onClick={() => {
                setUseBento(!useBento)
              }}
            >
              {useBento ? 'BentoBox' : 'Wallet'}
            </BlueButtonOutlined>
          </span>
        </div>
        <div className="text-base text-secondary" style={{ display: 'inline', cursor: 'pointer' }}>
          Balance: {max}
        </div>
      </div>

      <div className="flex items-center relative w-full mb-4">
        <NumericalInput
          className="w-full p-3 bg-input rounded focus:ring focus:ring-blue"
          value={value}
          onUserInput={setValue}
        />
        {account && (
          <BlueButtonOutlined onClick={() => setValue(max)} className="absolute right-4 focus:ring focus:ring-blue">
            MAX
          </BlueButtonOutlined>
        )}
      </div>

      <Alert predicate={warningMessage.length > 0} message={warningMessage} className="mb-4" />

      {showApprove && (
        <BlueButton onClick={approve} className="mb-4">
          {approvalState === ApprovalState.PENDING ? (
            <Dots>Approving {pair.asset.symbol}</Dots>
          ) : (
            `Approve ${pair.asset.symbol}`
          )}
        </BlueButton>
      )}

      <TransactionReviewView transactionReview={transactionReview}></TransactionReviewView>
      <BlueButton
        onClick={onClick}
        disabled={balance.eq(0) || value.toBigNumber(0).lte(0) || warning}
      >
        Deposit
      </BlueButton>
    </>
  )
}
