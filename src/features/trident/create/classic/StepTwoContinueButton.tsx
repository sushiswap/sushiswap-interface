import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { useIndependentAssetInputs } from 'app/features/trident/context/hooks/useIndependentAssetInputs'
import { ConstantProductPoolState, useTridentClassicPool } from 'app/hooks/useTridentClassicPools'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { currentStepAtom, selectedFeeTierAtom } from '../context/atoms'

export const StepTwoContinueButton: FC = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const setStep = useSetRecoilState(currentStepAtom)
  const selectedFeeTier = useRecoilValue(selectedFeeTierAtom)

  const {
    currencies: [currencies],
  } = useIndependentAssetInputs()

  // TODO: what to do with selectedFee tier afterward? Why is this always INVALID state?
  const [poolState] = useTridentClassicPool(currencies[0], currencies[1], selectedFeeTier, true)

  const error = !account
    ? i18n._(t`Connect Wallet`)
    : !currencies[0] || !currencies[1]
    ? i18n._(t`Select tokens`)
    : !selectedFeeTier
    ? i18n._(t`Select fee tier`)
    : poolState === ConstantProductPoolState.EXISTS
    ? i18n._(t`Pool already exists`)
    : ''

  return (
    <Button disabled={Boolean(error)} className="w-72" color="gradient" variant="filled" onClick={() => setStep(3)}>
      {error ? error : i18n._(t`Continue`)}
    </Button>
  )
}
