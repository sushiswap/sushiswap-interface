import { SwitchHorizontalIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE } from '@sushiswap/core-sdk'
import { WalletIcon } from 'app/components/Icon'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums/Feature'
import ActionItem from 'app/features/trident/balances/ActionsModal/ActionItem'
import { setBalancesActiveModal } from 'app/features/trident/balances/balancesSlice'
import { useBalancesSelectedCurrency } from 'app/features/trident/balances/useBalancesDerivedState'
import { ActiveModal } from 'app/features/trident/types'
import { featureEnabled } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch } from 'app/state/hooks'
import { useRouter } from 'next/router'
import React, { FC, useCallback } from 'react'

const WalletActions: FC = () => {
  const { chainId } = useActiveWeb3React()
  const currency = useBalancesSelectedCurrency()
  const dispatch = useAppDispatch()
  const { i18n } = useLingui()
  const router = useRouter()

  const swapActionHandler = useCallback(async () => {
    // @ts-ignore TYPE NEEDS FIXING
    if (featureEnabled(Feature.TRIDENT, chainId)) {
      if (currency?.isNative) return router.push('/trident/swap')
      // @ts-ignore TYPE NEEDS FIXING
      return router.push(`/trident/swap?&tokens=${NATIVE[chainId].symbol}&tokens=${currency?.wrapped.address}`)
    }

    if (currency?.isNative) return router.push('/swap')

    return router.push(`/swap?inputCurrency=${currency?.wrapped.address}`)
  }, [chainId, currency?.isNative, currency?.wrapped.address, router])

  return (
    <div className="flex flex-col bg-dark-900 p-5 pt-7 gap-5">
      <div className="flex flex-col gap-3">
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          {i18n._(t`Available Actions`)}
        </Typography>
        <ActionItem svg={<SwitchHorizontalIcon width={24} />} label={i18n._(t`Swap`)} onClick={swapActionHandler} />
        {/*@ts-ignore TYPE NEEDS FIXING*/}
        {featureEnabled(Feature.BENTOBOX, chainId) && (
          <>
            <ActionItem
              svg={<WalletIcon width={20} height={20} />}
              label={i18n._(t`Deposit to BentoBox`)}
              onClick={() => dispatch(setBalancesActiveModal(ActiveModal.DEPOSIT))}
            />
            {/*<Typography variant="sm" className="text-blue text-center mb-5 mt-2 cursor-pointer">*/}
            {/*  What is BentoBox?*/}
            {/*</Typography>*/}
          </>
        )}
      </div>
    </div>
  )
}

export default WalletActions
