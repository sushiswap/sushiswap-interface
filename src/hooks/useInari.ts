import { useState } from 'react'

const useInari = () => {
  const [allowance, setAllowance] = useState('0')

  const approve = async () => {}

  const inari = () => {}

  return { allowance, approve, inari }
}

export default useInari
