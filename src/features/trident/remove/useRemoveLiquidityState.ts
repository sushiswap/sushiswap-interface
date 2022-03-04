import { selectTridentAdd, setAddNormalInput } from 'app/features/trident/add/addSlice'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { useMemo } from 'react'

import { useDependentAssetInputs } from '../useDependentAssetInputs'

export const useAddLiquidityState = () => {
  const dispatch = useAppDispatch()
  const tridentAddState = useAppSelector(selectTridentAdd)
  const { fixedRatio, spendFromWallet, normalInput } = tridentAddState

  // Similar to setState(prevState => newState) if a function is passed as value to setInputs, pass previous state
  const setInputs = useMemo(
    // @ts-ignore TYPE NEEDS FIXING
    () => (values) => dispatch(setAddNormalInput(typeof values === 'function' ? values(normalInput) : values)),
    [dispatch, normalInput]
  )

  const inputState = useDependentAssetInputs({
    fixedRatio,
    spendFromWallet,
    inputs: normalInput,
    setInputs,
  })

  return useMemo(() => {
    return {
      ...tridentAddState,
      ...inputState,
    }
  }, [inputState, tridentAddState])
}
