import React, { FC } from 'react'
import AssetInput from '../../../../components/AssetInput'
import DepositButtons from '../DepositButtons'
import TransactionDetails from '../TransactionDetails'
import { ZERO } from '@sushiswap/sdk'
import useSufficientBalances from '../../../../hooks/useSufficientBalances'
import { ConcentratedPoolContext, ConcentratedPoolState } from './context/types'
import { useTridentContext, useTridentState } from '../../context'

const StandardMode: FC = () => {
  const { inputAmounts, spendFromWallet } = useTridentState<ConcentratedPoolState>()
  const { pool, handleInput, parsedInputAmounts, showReview, setSpendFromWallet } =
    useTridentContext<ConcentratedPoolContext>()
  const sufficientBalances = useSufficientBalances(parsedInputAmounts, spendFromWallet)

  // TODO
  const onMax = () => {}
  const isMaxInput = false

  const validInputs = sufficientBalances && Object.values(parsedInputAmounts).every((el) => el?.greaterThan(ZERO))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 px-5">
        <AssetInput
          key={pool.tokens[0].address}
          value={inputAmounts[pool.tokens[0].address]}
          currency={pool.tokens[0]}
          onChange={(val) => handleInput(val, pool.tokens[0].address)}
          headerRight={<AssetInput.WalletSwitch onChange={setSpendFromWallet} checked={spendFromWallet} />}
          spendFromWallet={spendFromWallet}
        />
        <AssetInput
          key={pool.tokens[1].address}
          value={inputAmounts[pool.tokens[1].address]}
          currency={pool.tokens[1]}
          onChange={(val) => handleInput(val, pool.tokens[1].address)}
          spendFromWallet={spendFromWallet}
        />

        <div className="flex flex-col">
          <DepositButtons
            inputValid={validInputs}
            onMax={onMax}
            isMaxInput={isMaxInput}
            onClick={() => showReview(true)}
          />
        </div>
      </div>
      {validInputs && (
        <div className="flex flex-col px-5">
          <TransactionDetails />
        </div>
      )}
    </div>
  )
}

export default StandardMode
