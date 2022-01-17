import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Checkbox from 'app/components/Checkbox'
import Typography from 'app/components/Typography'
import { selectTridentCreate, setCreateAnOracle } from 'app/features/trident/create/createSlice'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { FC } from 'react'

export const CreateOracleOption: FC = () => {
  const { i18n } = useLingui()
  const { createAnOracle } = useAppSelector(selectTridentCreate)
  const dispatch = useAppDispatch()

  return (
    <div>
      <Typography variant="h3" weight={700} className="text-high-emphesis">
        {i18n._(t`Create Oracle for this Pair?`)}
      </Typography>
      <div className="mt-2 text-secondary">
        {i18n._(t`Creating oracle enables the pool to store its price data and provides more accurate swap rate. However, the swap
        gas fee will be higher.`)}
      </div>
      <div
        className="flex items-center gap-2 mt-8 hover:cursor-pointer"
        onClick={() => dispatch(setCreateAnOracle(!createAnOracle))}
      >
        <Checkbox checked={createAnOracle} />
        <span className="text-xs">{i18n._(t`Yes create an oracle`)}</span>
      </div>
    </div>
  )
}
