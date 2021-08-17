import Alert from '../../../components/Alert'
import { t } from '@lingui/macro'
import Button from '../../../components/Button'
import { useTridentAddLiquidityPageContext, useTridentAddLiquidityPageState } from './context'
import { useLingui } from '@lingui/react'
import Typography from '../../../components/Typography'
import ListPanel from '../../../components/ListPanel'
import AssetInput from '../../../components/AssetInput'
import { Token } from '@sushiswap/sdk'
import ZapModeTransactionDetails from './ZapModeTransactionDetails'
import React, { useState } from 'react'
import { useUSDCValue } from '../../../hooks/useUSDCPrice'

const ClassicZapMode = () => {
  const { i18n } = useLingui()
  const { inputAmounts } = useTridentAddLiquidityPageState()
  const { pool, handleInput, showReview, parsedInputAmounts } = useTridentAddLiquidityPageContext()

  // We can use a local select state here as zap mode is only one input,
  // the modals check for each inputAmount if there's input entered
  // (note the { clear: true } option given to the handleInput)
  const [selected, setSelected] = useState<Token>()
  const usdcValue = useUSDCValue(parsedInputAmounts[selected?.address])

  return (
    <>
      <div className="px-5">
        <Alert
          dismissable={false}
          type="information"
          showIcon
          message={i18n._(t`In Zap mode, your selected asset will be split and rebalanced into the corresponding tokens and their weights
          automatically.`)}
        />
      </div>
      <div className="flex flex-col gap-4 px-5">
        <AssetInput
          value={inputAmounts[selected?.address]}
          currency={selected}
          onChange={(value) => handleInput(value, selected.address, { clear: true })}
          onSelect={setSelected}
        />
        <Button
          color={inputAmounts[selected?.address] ? 'gradient' : 'gray'}
          disabled={!inputAmounts[selected?.address]}
          className="font-bold text-sm"
          onClick={() => showReview(true)}
        >
          {inputAmounts[selected?.address] ? i18n._(t`Confirm Deposit`) : i18n._(t`Select token & enter amount`)}
        </Button>
      </div>
      <div className="flex flex-col gap-4 px-5 mt-10">
        <Typography weight={700} className="text-high-emphesis">
          {selected
            ? i18n._(t`Your ${selected.symbol} will be split into:`)
            : i18n._(t`Your selected token will be split into:`)}
        </Typography>

        {/*TODO output CurrencyAmount*/}
        <ListPanel
          items={pool.tokens.map((token, index) => (
            <ListPanel.Item
              left={<ListPanel.Item.Left amount={parsedInputAmounts[token.address]} />}
              right={<ListPanel.Item.Right>${usdcValue?.divide(pool.tokens.length)?.toFixed(2)}</ListPanel.Item.Right>}
              key={index}
            />
          ))}
        />
      </div>
      <ZapModeTransactionDetails />
    </>
  )
}

export default ClassicZapMode
