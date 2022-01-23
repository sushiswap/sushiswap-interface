import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE } from '@sushiswap/core-sdk'
import { BentoboxIcon } from 'app/components/Icon'
import Typography from 'app/components/Typography'
import ActionItem from 'app/features/trident/balances/ActionsModal/ActionItem'
import { setBalancesActiveModal } from 'app/features/trident/balances/balancesSlice'
import { useBalancesSelectedCurrency } from 'app/features/trident/balances/useBalancesDerivedState'
import { ActiveModal } from 'app/features/trident/types'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch } from 'app/state/hooks'
import { useRouter } from 'next/router'
import React, { FC, useCallback } from 'react'

const BentoActions: FC = () => {
  const { chainId } = useActiveWeb3React()
  const isDesktop = useDesktopMediaQuery()
  const dispatch = useAppDispatch()
  const currency = useBalancesSelectedCurrency()
  const { i18n } = useLingui()
  const router = useRouter()

  const swapActionHandler = useCallback(async () => {
    if (currency?.isNative) return router.push('/trident/swap')
    // @ts-ignore TYPE NEEDS FIXING
    return router.push(`/trident/swap?tokens=${NATIVE[chainId || 1].symbol}&tokens=${currency?.wrapped.address}`)
  }, [chainId, currency?.isNative, currency?.wrapped.address, router])

  return (
    <div className="flex flex-col gap-5 p-5 bg-dark-900">
      {/* <div className="flex flex-col gap-1">
        <Typography variant="sm" weight={700} className="text-high-emphesis">
          {i18n._(t`Strategy`)}
        </Typography>
        <div className="flex justify-between">
          <Typography variant={isDesktop ? 'sm' : 'h3'} className="italic text-green" weight={700}>
            coming soon
          </Typography>
          <Typography variant={isDesktop ? 'sm' : 'h3'} className="italic text-high-emphesis" weight={700}>
            coming soon
          </Typography>
        </div>
      </div>
      <Divider /> */}
      <div className="flex flex-col gap-3">
        <Typography variant="lg" weight={700} className="text-high-emphesis lg:mt-2">
          {i18n._(t`Available Actions`)}
        </Typography>
        {/* <ActionItem svg={<SwitchHorizontalIcon width={24} />} label={i18n._(t`Swap`)} onClick={swapActionHandler} /> */}
        <ActionItem
          svg={<BentoboxIcon width={20} height={20} />}
          label={i18n._(t`Withdraw to Wallet`)}
          onClick={() => dispatch(setBalancesActiveModal(ActiveModal.WITHDRAW))}
        />
        {/* <ActionItem svg={<TransferIcon width={24} height={24} />} label={i18n._(t`Transfer`)} /> */}
      </div>
    </div>
  )
}

export default BentoActions
