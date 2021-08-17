import React, { FC, useCallback, useState } from 'react'
import Typography from '../../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { Token } from '@sushiswap/sdk'
import { useTridentRemoveLiquidityPageContext, useTridentRemoveLiquidityPageState } from './context'
import ListPanel from '../../../components/ListPanel'
import NumericalInput from '../../../components/NumericalInput'
import { tryParseAmount } from '../../../functions'
import Button from '../../../components/Button'
import ToggleButtonGroup from '../../../components/ToggleButton'
import AssetSelect from '../../../components/AssetSelect'
import { ActionType } from '../add/context/types'
import { useUSDCValue } from '../../../hooks/useUSDCPrice'

const ClassicUnzapMode: FC = () => {
  const { i18n } = useLingui()
  const { inputAmounts } = useTridentRemoveLiquidityPageState()
  const { pool, dispatch, handleInput, parsedInputAmounts } = useTridentRemoveLiquidityPageContext()

  // We can use a local select state here as zap mode is only one input,
  // the modals check for each inputAmount if there's input entered
  // (note the { clear: true } option given to the handleInput)
  const [selected, setSelected] = useState<Token>(pool.tokens[0])
  const usdcValue = useUSDCValue(parsedInputAmounts[selected?.address])

  const handleClick = useCallback(() => {
    dispatch({
      type: ActionType.SHOW_ZAP_REVIEW,
      payload: true,
    })
  }, [dispatch])

  return (
    <div className="px-5 mt-5">
      <div className="flex flex-col gap-8">
        <AssetSelect value={selected} onSelect={setSelected} />
        <div className="flex flex-col gap-4">
          <Typography variant="h3" weight={700} className="text-high-emphesis">
            Amount to Remove:
          </Typography>

          {/*TODO GET HOW MUCH TOKENS WE HAVE IN LIQUIDITY*/}
          <ListPanel
            header={<ListPanel.Header title={i18n._(t`Balances`)} value="$16,720.00" subValue="54.32134 SLP" />}
            items={pool.tokens.map((token, index) => (
              <ListPanel.Item
                left={<ListPanel.Item.Left amount={tryParseAmount('1', token)} />}
                right={<ListPanel.Item.Right>$8,360.00</ListPanel.Item.Right>}
                key={index}
              />
            ))}
            footer={
              <div className="flex justify-between items-center px-4 py-5 gap-3">
                <NumericalInput
                  value={inputAmounts[selected?.address]}
                  onUserInput={(value: string) => handleInput(value, selected?.address, { clear: true })}
                  placeholder="0%"
                  className="bg-transparent text-3xl leading-7 tracking-[-0.01em] flex-grow"
                />
                <Typography variant="sm" className="text-low-emphesis">
                  ≈${usdcValue?.greaterThan('0') ? usdcValue?.toSignificant(6) : '0.0000'}
                </Typography>
              </div>
            }
          />
          <ToggleButtonGroup
            value={inputAmounts[selected?.address]}
            onChange={(value: string) => handleInput(value, selected?.address, { clear: true })}
          >
            <ToggleButtonGroup.Button value="100">Max</ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button value="75">75%</ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button value="50">50%</ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button value="25">25%</ToggleButtonGroup.Button>
          </ToggleButtonGroup>
          <Button color="gradient" disabled={!inputAmounts[selected?.address]} onClick={handleClick}>
            {inputAmounts[selected?.address]
              ? i18n._(t`Confirm Withdrawal`)
              : i18n._(t`Tap amount or type amount to continue`)}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ClassicUnzapMode
