import { SwitchHorizontalIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { BentoboxIcon } from 'app/components/Icon'
import Typography from 'app/components/Typography'
import ActionItem from 'app/features/portfolio/ActionsModal/ActionItem'
import { setBalancesActiveModal } from 'app/features/portfolio/portfolioSlice'
import { useBalancesSelectedCurrency } from 'app/features/portfolio/useBalancesDerivedState'
import { ActiveModal } from 'app/features/trident/types'
import { useAppDispatch } from 'app/state/hooks'
import { useRouter } from 'next/router'
import React, { FC, useCallback } from 'react'

const WalletActions: FC = () => {
  const dispatch = useAppDispatch()
  const currency = useBalancesSelectedCurrency()
  const { i18n } = useLingui()
  const router = useRouter()

  const swapActionHandler = useCallback(async () => {
    if (currency?.isNative) return router.push('/trident/swap')
    return router.push(`/trident/swap?type=classic&tokens=ETH&tokens=${currency?.wrapped.address}`)
  }, [currency?.isNative, currency?.wrapped.address, router])

  return (
    <div className="flex flex-col bg-dark-900 p-5 pt-7 gap-5">
      <div className="flex flex-col gap-3">
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          {i18n._(t`Available Actions`)}
        </Typography>
        <ActionItem svg={<SwitchHorizontalIcon width={24} />} label={i18n._(t`Swap`)} onClick={swapActionHandler} />
        <ActionItem
          svg={<BentoboxIcon width={20} height={20} />}
          label={i18n._(t`Deposit to BentoBox`)}
          onClick={() => dispatch(setBalancesActiveModal(ActiveModal.DEPOSIT))}
        />
        <Typography variant="sm" className="text-blue text-center mb-5 mt-2 cursor-pointer">
          What is BentoBox?
        </Typography>
      </div>
    </div>
  )
}

export default WalletActions
