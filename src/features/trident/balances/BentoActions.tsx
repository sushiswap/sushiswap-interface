import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE } from '@sushiswap/core-sdk'
import { BentoboxIcon } from 'app/components/Icon'
import Typography from 'app/components/Typography'
import ActionItem from 'app/features/trident/balances/ActionsModal/ActionItem'
import { ActiveModalAtom, SelectedCurrencyAtom } from 'app/features/trident/balances/context/atoms'
import { ActiveModal } from 'app/features/trident/balances/context/types'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import { useActiveWeb3React } from 'app/services/web3'
import { useRouter } from 'next/router'
import React, { FC, useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

const BentoActions: FC = () => {
  const { chainId } = useActiveWeb3React()
  const isDesktop = useDesktopMediaQuery()
  const setActiveModal = useSetRecoilState(ActiveModalAtom)
  const currency = useRecoilValue(SelectedCurrencyAtom)
  const { i18n } = useLingui()
  const router = useRouter()

  const swapActionHandler = useCallback(async () => {
    if (currency?.isNative) return router.push('/trident/swap')
    return router.push(`/trident/swap?tokens=${NATIVE[chainId].symbol}&tokens=${currency?.wrapped.address}`)
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
          onClick={() => setActiveModal(ActiveModal.WITHDRAW)}
        />
        {/* <ActionItem svg={<TransferIcon width={24} height={24} />} label={i18n._(t`Transfer`)} /> */}
      </div>
    </div>
  )
}

export default BentoActions
