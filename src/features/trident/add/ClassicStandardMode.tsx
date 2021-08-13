import { useTridentAddLiquidityPageContext, useTridentAddLiquidityPageState } from './context'
import AssetInput from '../../../components/AssetInput'
import React from 'react'
import DepositButtons from './DepositButtons'

const ClassicStandardMode = () => {
  const { inputAmounts } = useTridentAddLiquidityPageState()
  const { pool, handleInput } = useTridentAddLiquidityPageContext()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-4 px-5">
        {pool.tokens.map((token) => (
          <AssetInput
            key={token.address}
            value={inputAmounts[token.address]}
            currency={token}
            onChange={(val) => handleInput(val, token.address)}
          />
        ))}
      </div>

      {/*TODO implement max*/}
      <div className="flex flex-col px-5">
        <DepositButtons inputValid={Object.values(inputAmounts).every((el) => +el > 0)} isMaxInput={false} />
      </div>
    </div>
  )
}

export default ClassicStandardMode
