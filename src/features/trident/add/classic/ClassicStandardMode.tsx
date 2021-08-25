import AssetInput from '../../../../components/AssetInput'
import React from 'react'
import DepositButtons from './../DepositButtons'
import useSufficientBalances from '../../../../hooks/useSufficientBalances'
import { ZERO } from '@sushiswap/sdk'
import TransactionDetails from './../TransactionDetails'
import { Field } from '../../../../state/mint/actions'
import { useTridentAddClassicContext, useTridentAddClassicState } from './context'

const ClassicStandardMode = () => {
  const { inputAmounts, spendFromWallet } = useTridentAddClassicState()
  const { currencies, handleInput, parsedInputAmounts, showReview, setSpendFromWallet } = useTridentAddClassicContext()
  const sufficientBalances = useSufficientBalances(parsedInputAmounts, spendFromWallet)
  const validInputs = sufficientBalances && Object.values(parsedInputAmounts).every((el) => el?.greaterThan(ZERO))

  // TODO
  const onMax = () => {}
  const isMaxInput = false

  const [addressA, addressB] = Object.keys(currencies)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 px-5">
        <AssetInput
          value={inputAmounts[addressA]}
          currency={currencies[addressA]}
          onChange={(val) => handleInput(val, addressA, { typedField: Field.CURRENCY_A })}
          headerRight={<AssetInput.WalletSwitch onChange={setSpendFromWallet} checked={spendFromWallet} />}
          spendFromWallet={spendFromWallet}
        />
        <AssetInput
          value={inputAmounts[addressB]}
          currency={currencies[addressB]}
          onChange={(val) => handleInput(val, addressB, { typedField: Field.CURRENCY_B })}
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

export default ClassicStandardMode
