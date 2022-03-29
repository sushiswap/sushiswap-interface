import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, NATIVE } from '@sushiswap/core-sdk'
import NumericalInput from 'app/components/Input/Numeric'
import Typography from 'app/components/Typography'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch } from 'app/state/hooks'
import { setFees, setMaxFee, setPriorityFee } from 'app/state/swap/actions'
import { useSwapState } from 'app/state/swap/hooks'
import { useExpertModeManager } from 'app/state/user/hooks'
import React, { FC, useEffect } from 'react'
import { fromWei, toWei } from 'web3-utils'

import useFeeData from '../../../hooks/useFeeData'

const SwapGasFeeInputs: FC = () => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const [expertMode] = useExpertModeManager()
  const { maxFee, maxPriorityFee } = useSwapState()
  const dispatch = useAppDispatch()
  const { maxFeePerGas, maxPriorityFeePerGas } = useFeeData()

  useEffect(() => {
    if (!expertMode) {
      dispatch(setFees({ maxFee: undefined, maxPriorityFee: undefined }))
    }
  }, [dispatch, expertMode])

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-1">
        <Typography variant="sm" className="px-2">
          {i18n._(t`Max Fee`)}
        </Typography>
        <div className="flex items-baseline justify-between px-4 py-1 border rounded bg-dark-900 border-dark-700 hover:border-dark-600">
          <Typography weight={700} className="relative flex items-baseline flex-grow gap-3 overflow-hidden">
            <NumericalInput
              value={maxFee ? fromWei(maxFee, 'gwei') : ''}
              // @ts-expect-error !! FIXME !!
              onUserInput={(val) => dispatch(setMaxFee(val ? toWei(val, 'gwei') : undefined))}
              placeholder={`${
                chainId && maxFeePerGas
                  ? CurrencyAmount.fromRawAmount(
                      NATIVE[chainId],
                      toWei(maxFeePerGas.toString(), 'gwei')
                    )?.toSignificant(6)
                  : '0.00'
              }`}
              className="font-medium leading-[36px] focus:placeholder:text-low-emphesis flex-grow w-full text-left bg-transparent text-inherit disabled:cursor-not-allowed"
              autoFocus
            />
          </Typography>
          <Typography variant="sm">GWEI</Typography>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Typography variant="sm" className="px-2">
          {i18n._(t`Max Priority Fee`)}
        </Typography>
        <div className="flex items-baseline justify-between px-4 py-1 border rounded bg-dark-900 border-dark-700 hover:border-dark-600">
          <Typography weight={700} className="relative flex items-baseline flex-grow gap-3 overflow-hidden">
            <NumericalInput
              value={maxPriorityFee ? fromWei(maxPriorityFee, 'gwei') : ''}
              // @ts-expect-error !! FIXME !!
              onUserInput={(val) => dispatch(setPriorityFee(val ? toWei(val, 'gwei') : undefined))}
              placeholder={`${
                chainId && maxPriorityFeePerGas
                  ? CurrencyAmount.fromRawAmount(
                      NATIVE[chainId],
                      toWei(maxPriorityFeePerGas.toString(), 'gwei')
                    )?.toSignificant(6)
                  : '0.00'
              }`}
              className="font-medium leading-[36px] focus:placeholder:text-low-emphesis flex-grow w-full text-left bg-transparent text-inherit disabled:cursor-not-allowed"
              autoFocus
            />
          </Typography>
          <Typography variant="sm">GWEI</Typography>
        </div>
      </div>
    </div>
  )
}

export default SwapGasFeeInputs
