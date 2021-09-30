import { ChainId, CurrencyAmount, Ether } from '@sushiswap/sdk'
import {
  useUserArcherETHTip,
  useUserArcherGasPrice,
  useUserArcherTipManualOverride,
  useUserSlippageTolerance,
} from '../../../state/user/hooks'

import React from 'react'
import { StyledSlider } from './styleds'
import Typography from '../../../components/Typography'
import useArcherMinerTips from '../../../hooks/useArcherMinerTips'
import { useToggleSettingsMenu } from '../../../state/application/hooks'

const getMarkLabel = (index: number, length: number): string => {
  switch (index) {
    case 0:
      return 'Slow'
    case length - 1:
      return 'Fast'
    case Math.floor(length / 2):
      return 'Balanced'
    default:
      return ''
  }
}
const getMarkSlippage = (index: number): number => {
  if (index === 6) {
    return 50
  } else if (index === 5) {
    return 10
  } else if (index === 4) {
    return 5
  } else {
    return 0
  }
}

const getMarksFromTips = (tips: Record<string, string>) => {
  const length = Object.values(tips).length
  return Object.values(tips)
    .sort((a, b) => (BigInt(a) < BigInt(b) ? -1 : 1))
    .reduce(
      (acc, price, index) => ({
        ...acc,
        [index]: {
          label: getMarkLabel(index, length),
          price,
          slippage: getMarkSlippage(index),
          style: {
            transform: index !== 0 || index !== length - 1 ? 'translateX(-50%)' : 'none',
          },
          className: 'text-secondary',
        },
      }),
      {}
    )
}

export default function MinerTip() {
  const toggleSettings = useToggleSettingsMenu()
  const [userTipManualOverride] = useUserArcherTipManualOverride()
  const [userETHTip] = useUserArcherETHTip()
  const [, setUserGasPrice] = useUserArcherGasPrice()
  // const [, setUserSlippageTolerance] = useUserSlippageTolerance();
  const { data: tips } = useArcherMinerTips()
  const [value, setValue] = React.useState<number>(0)

  const marks: Record<number, { label: string; price: string; slippage: number; style: unknown }> = React.useMemo(
    () => getMarksFromTips(tips),
    [tips]
  )

  const handleChange = React.useCallback(
    (newValue: number) => {
      setValue(newValue)
      setUserGasPrice(marks[newValue].price)
      // setUserSlippageTolerance(marks[newValue].slippage);
    },
    [marks, setValue, setUserGasPrice]
  )

  React.useEffect(() => {
    if (Object.values(marks).length > 0) {
      const middleIndex = Math.floor(Object.values(marks).length / 2)
      setValue(middleIndex)
      setUserGasPrice(marks[middleIndex].price)
      // setUserSlippageTolerance(marks[middleIndex].slippage);
    }
  }, [
    marks,
    setUserGasPrice,
    setValue,
    userTipManualOverride,
    // setUserSlippageTolerance,
  ])

  const max = Object.values(marks).length - 1
  if (max < 0 && !userTipManualOverride) return null

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <Typography variant="sm" className="text-secondary" onClick={toggleSettings}>
          Miner Tip
        </Typography>
        <Typography variant="sm" className="text-secondary" onClick={toggleSettings}>
          {CurrencyAmount.fromRawAmount(Ether.onChain(ChainId.MAINNET), userETHTip).toFixed(3)} ETH
        </Typography>
      </div>
      {!userTipManualOverride && (
        <StyledSlider defaultValue={0} marks={marks} max={max} onChange={handleChange} value={value} step={null} />
      )}
    </>
  )
}
