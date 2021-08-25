import AssetInput from '../../../../components/AssetInput'
import React from 'react'
import DepositButtons from './../DepositButtons'
import useSufficientBalances from '../../../../hooks/useSufficientBalances'
import { ZERO } from '@sushiswap/sdk'
import TransactionDetails from './../TransactionDetails'
import { useTridentAddWeightedContext, useTridentAddWeightedState } from './context'

const WeightedStandardMode = () => {
  const { inputAmounts, spendFromWallet } = useTridentAddWeightedState()
  const { currencies, handleInput, parsedInputAmounts, showReview, setSpendFromWallet } = useTridentAddWeightedContext()
  const sufficientBalances = useSufficientBalances(parsedInputAmounts, spendFromWallet)
  const validInputs = sufficientBalances && Object.values(parsedInputAmounts).every((el) => el?.greaterThan(ZERO))

  // TODO
  const onMax = () => {}
  const isMaxInput = false

  // TODO Fixture
  const [addressA, addressB] = Object.keys(currencies)
  const weights = {
    [addressA]: '70%',
    [addressB]: '30%',
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 px-5">
        <AssetInput
          value={inputAmounts[addressA]}
          currency={currencies[addressA]}
          onChange={(val) => handleInput(val, addressA)}
          headerRight={<AssetInput.WalletSwitch onChange={setSpendFromWallet} checked={spendFromWallet} />}
          spendFromWallet={spendFromWallet}
          chip={weights[addressA]}
        />
        <AssetInput
          value={inputAmounts[addressB]}
          currency={currencies[addressB]}
          onChange={(val) => handleInput(val, addressB)}
          spendFromWallet={spendFromWallet}
          chip={weights[addressB]}
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

export default WeightedStandardMode
