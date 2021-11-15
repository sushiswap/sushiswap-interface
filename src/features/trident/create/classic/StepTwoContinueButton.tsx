import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { usePoolAssetInput } from 'app/features/trident/context/hooks/poolAssets/usePoolAssetInput'
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
  const { asset: asset0 } = usePoolAssetInput(0)
  const { asset: asset1 } = usePoolAssetInput(1)

  // TODO: what to do with selectedFee tier afterward? Why is this always INVALID state?
  const [poolState] = useTridentClassicPool(asset0?.currency, asset1?.currency, selectedFeeTier, true)

  const error = !account
    ? i18n._(t`Connect Wallet`)
    : !asset0?.currency || !asset1?.currency
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
