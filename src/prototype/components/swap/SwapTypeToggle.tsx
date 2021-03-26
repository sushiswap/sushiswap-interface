import React, { useState } from 'react'
import ToggleButton from '../ToggleButton'
import ToggleButtonGroup from '../ToggleButtonGroup'

const SwapTypeToggle = () => {
  const [type, setType] = useState<string | null>('swap')

  const handleChange = (event: React.MouseEvent<HTMLElement>, newType: string | null) => {
    setType(newType)
  }

  return (
    <ToggleButtonGroup value={type} onChange={handleChange}>
      <ToggleButton value="swap">Swap</ToggleButton>
      <ToggleButton value="limit">Limit</ToggleButton>
      <ToggleButton value="lp">LP</ToggleButton>
    </ToggleButtonGroup>
  )
}

export default SwapTypeToggle
