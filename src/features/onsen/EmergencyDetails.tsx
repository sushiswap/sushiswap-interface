import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import { useCurrency } from 'app/hooks/Tokens'
import useActiveWeb3React from 'app/lib/hooks/useActiveWeb3React'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import React, { useState } from 'react'

import useMasterChef from './useMasterChef'

// @ts-ignore TYPE NEEDS FIXING
const EmergencyDetails = ({ farm }) => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const [pendingTx, setPendingTx] = useState(false)
  const token0 = useCurrency(farm.pair.token0.id)
  const token1 = useCurrency(farm.pair.token1.id)
  const { emergency } = useMasterChef(farm.chef)

  async function onEmergency() {
    setPendingTx(true)
    try {
      const tx = await emergency(farm.id)
      addTransaction(tx, {
        summary: `Emergency Withdraw`,
      })
    } catch (error) {
      console.error(error)
    }
    setPendingTx(false)
  }

  return (
    <>
      <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 bg-dark-1000/40">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              {`Emergency Withdraw`}
            </Typography>
          </div>

          <Typography variant="sm" className="text-secondary">
            {`Emergency withdrawal should only be used in the case of SLP tokens being stuck, or in the case of an emergency. When used all SLP tokens will be withdrawn, and accumulated SUSHI rewards will be abandoned.`}
          </Typography>
          <Typography variant="sm" className="text-secondary">
            {`*For Harmony Users: wONE rewards will be harvested but SUSHI will not on emergency withdrawal. At the moment it is unclear if the current earned SUSHI will be able to be harvested in the future.`}
          </Typography>
        </div>
      </HeadlessUiModal.BorderedContent>
      <Button loading={pendingTx} fullWidth color="blue" onClick={onEmergency}>
        {`Emergency Withdraw`}
      </Button>
    </>
  )
}

export default EmergencyDetails
