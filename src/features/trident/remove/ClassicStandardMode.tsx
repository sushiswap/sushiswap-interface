import React, { FC, useCallback, useMemo, useState } from 'react'
import { useLingui } from '@lingui/react'
import { useTridentRemoveLiquidityPageContext, useTridentRemoveLiquidityPageState } from './context'
import { ActionType } from '../add/context/types'
import Typography from '../../../components/Typography'
import ListPanel from '../../../components/ListPanel'
import { t } from '@lingui/macro'
import NumericalInput from '../../../components/NumericalInput'
import ToggleButtonGroup from '../../../components/ToggleButton'
import Button from '../../../components/Button'

const ClassicStandardMode: FC = () => {
  const { i18n } = useLingui()
  const { inputAmounts } = useTridentRemoveLiquidityPageState()
  const { pool, dispatch, parsedInputAmounts } = useTridentRemoveLiquidityPageContext()

  // inputAmounts will be balances multiplied by this percentage
  const [percentage, setPercentage] = useState<string>()

  const handleAllInputs = useCallback(
    (percentage: string) => {
      // Need balances of each token in a pool

      dispatch({
        type: ActionType.SET_INPUT_AMOUNTS,
        payload: percentage,
      })

      setPercentage(percentage)
    },
    [dispatch]
  )

  const handleClick = useCallback(() => {
    dispatch({
      type: ActionType.SHOW_ZAP_REVIEW,
      payload: true,
    })
  }, [dispatch])

  return (
    <div className="px-5 mt-5">
      <div className="flex flex-col gap-4">
        <Typography variant="h3" weight={700} className="text-high-emphesis">
          Amount to Remove:
        </Typography>

        {/*TODO GET HOW MUCH TOKENS WE HAVE IN LIQUIDITY*/}
        <ListPanel
          header={<ListPanel.Header title={i18n._(t`Balances`)} value="$16,720.00" subValue="54.32134 SLP" />}
          items={pool.tokens.map((token, index) => (
            <ListPanel.CurrencyAmountItem amount={parsedInputAmounts[token.address]} key={index} />
          ))}
          footer={
            <div className="flex justify-between items-center px-4 py-5 gap-3">
              <NumericalInput
                value={percentage}
                onUserInput={(percentage: string) => handleAllInputs(percentage)}
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
          value={Object.values(inputAmounts)[0]}
          onChange={(amount: string) => handleAllInputs(amount)}
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
  )
}

export default ClassicStandardMode
