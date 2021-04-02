import React, { useState, useCallback } from 'react'
import { WETH } from '@sushiswap/sdk'
import { Alert, Dots, BlueButton, BlueButtonOutlined } from '.'
import { Input as NumericalInput } from 'components/NumericalInput'
import { ArrowDownRight } from 'react-feather'
import { useActiveWeb3React } from 'hooks'
import { ApprovalState, useApproveCallback } from 'sushi-hooks/useApproveCallback'
import useTokenBalance from 'sushi-hooks/useTokenBalance'
import useBentoBalance from 'sushi-hooks/useBentoBalance'
import useKashi from 'kashi/hooks/useKashi'
import { useBentoBoxContract } from 'sushi-hooks/useContract'
import { formatToBalance, formatFromBalance, formattedNum } from 'utils'
import isEmpty from 'lodash/isEmpty'

interface LendActionProps {
  pair: any
  action: 'Deposit' | 'Withdraw'
  direction: string
}

export default function LendAction({ pair, action, direction }: LendActionProps): JSX.Element {
  const { account, chainId } = useActiveWeb3React()
  const bentoBoxContract = useBentoBoxContract()

  const token = pair.asset

  const [approvalState, approve] = useApproveCallback(token.address, bentoBoxContract?.address)

  const { depositAddAsset, addAsset, removeAsset, removeWithdrawAsset } = useKashi()

  const [sourceOrDestination, setSourceOrDestination] = useState<'BentoBox' | 'Wallet'>('BentoBox')

  const bentoAssetBalance = useBentoBalance(pair.asset.address)

  const walletAssetBalance = useTokenBalance(pair.asset.address)

  const assetBalance = sourceOrDestination === 'BentoBox' ? bentoAssetBalance : walletAssetBalance

  const [value, setValue] = useState('')

  const [max, setMax] = useState(false)

  const [pendingTx, setPendingTx] = useState(false)

  const getMax = useCallback(() => {
    if (action === 'Deposit') {
      return formatFromBalance(assetBalance?.value, assetBalance?.decimals)
    } else if (action === 'Withdraw') {
      return pair.userTotalSupply.string
    }
  }, [action, pair, assetBalance])

  const onMax = useCallback(() => {
    setMax(true)
    setValue(getMax())
  }, [getMax])

  const getTransactionReview = useCallback(() => {
    if (action === 'Deposit') {
      return `${formattedNum(pair.userTotalSupply.string)} ${pair.asset.symbol} → ${formattedNum(
        Number(pair.userTotalSupply.string) + Number(value)
      )} ${pair.asset.symbol}`
    } else if (action === 'Withdraw') {
      return `${formattedNum(pair.userTotalSupply.string)} ${pair.asset.symbol} → ${formattedNum(
        Number(pair.userTotalSupply.string) - Number(value)
      )} ${pair.asset.symbol}`
    }

    return null
  }, [action, pair, value])

  const getWarningMessage = useCallback(() => {
    if (action === 'Deposit') {
      return `Please make sure your ${sourceOrDestination} balance is sufficient to ${action.toLowerCase()} and then try again.`
    } else if (action === 'Withdraw') {
      return `Please make sure your supply balance is sufficient to withdraw and then try again.`
    }
    return null
  }, [action, sourceOrDestination])

  const getWarningPredicate = useCallback<() => boolean>(() => {
    if (action === 'Deposit') {
      return assetBalance?.value.lt(formatToBalance(value, pair.asset.decimals).value)
    } else if (action === 'Withdraw') {
      return pair.userTotalSupply.value.lt(formatToBalance(value, pair.asset.decimals).value)
    }
    return false
  }, [action, assetBalance, value, pair])

  const onClick = async function() {
    setPendingTx(true)
    if (sourceOrDestination === 'Wallet') {
      if (action === 'Deposit') {
        await depositAddAsset(pair.address, pair.asset.address, formatToBalance(value, pair.asset.decimals))
      } else if (action === 'Withdraw') {
        await removeWithdrawAsset(pair.address, pair.asset.address, formatToBalance(value, pair.asset.decimals), max)
      }
    } else if (sourceOrDestination === 'BentoBox') {
      if (action === 'Deposit') {
        await addAsset(pair.address, pair.asset.address, formatToBalance(value, pair.asset.decimals))
      } else if (action === 'Withdraw') {
        await removeAsset(pair.address, pair.asset.address, formatToBalance(value, pair.asset.decimals), max)
      }
    }
    setPendingTx(false)
  }

  const showApprove =
    (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) &&
    action === 'Deposit' &&
    ((direction === 'From' && sourceOrDestination !== 'BentoBox') || direction === 'To') &&
    direction === 'From' &&
    sourceOrDestination === 'Wallet' &&
    token.address !== WETH[chainId || 1].address

  const limit = getMax()

  const warning = getWarningPredicate()

  return (
    <>
      <div className="text-3xl text-high-emphesis mt-6">
        {action} {token.symbol}
      </div>

      <div className="flex justify-between my-4">
        <div className="text-base text-secondary">
          <span>
            <ArrowDownRight size="1rem" style={{ display: 'inline' }} />
          </span>
          <span> {direction} </span>
          <span>
            <BlueButtonOutlined
              onClick={() => {
                setValue('')
                setSourceOrDestination(sourceOrDestination === 'BentoBox' ? 'Wallet' : 'BentoBox')
              }}
            >
              {sourceOrDestination}
            </BlueButtonOutlined>
          </span>
        </div>
        <div className="text-base text-secondary" style={{ display: 'inline', cursor: 'pointer' }}>
          Balance: {Math.max(0, limit)}
        </div>
      </div>

      <div className="flex items-center relative w-full mb-4">
        <NumericalInput className="w-full p-3 bg-input rounded" value={value} onUserInput={setValue} />
        {account && (
          <BlueButtonOutlined onClick={onMax} className="absolute right-4">
            MAX
          </BlueButtonOutlined>
        )}
      </div>

      <Alert predicate={warning} message={getWarningMessage()} className="mb-4" />

      {showApprove && (
        <BlueButton onClick={approve} className="mb-4">
          {approvalState === ApprovalState.PENDING ? <Dots>Approving {token.symbol}</Dots> : `Approve ${token.symbol}`}
        </BlueButton>
      )}

      {!warning && Math.sign(Number(value)) > 0 && (
        <div className="py-4 mb-4">
          <div className="text-xl text-high-emphesis">Transaction Review</div>
          <div className="flex items-center justify-between">
            <div className="text-lg text-secondary">Balance:</div>
            <div className="text-lg">{getTransactionReview()}</div>
          </div>
        </div>
      )}

      {approvalState === ApprovalState.APPROVED && (
        <BlueButton onClick={onClick} disabled={pendingTx || isEmpty(limit) || Math.sign(Number(value)) < 0 || warning}>
          {action}
        </BlueButton>
      )}
    </>
  )
}
