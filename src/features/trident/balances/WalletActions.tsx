import { SwitchHorizontalIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE } from '@sushiswap/core-sdk'
import { WalletIcon } from 'app/components/Icon'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums'
import ActionItem from 'app/features/trident/balances/ActionsModal/ActionItem'
import { ActiveModalAtom, SelectedCurrencyAtom } from 'app/features/trident/balances/context/atoms'
import { ActiveModal } from 'app/features/trident/balances/context/types'
import { featureEnabled } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useRouter } from 'next/router'
import React, { FC, useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

const WalletActions: FC = () => {
  const { chainId } = useActiveWeb3React()
  const setActiveModal = useSetRecoilState(ActiveModalAtom)
  const currency = useRecoilValue(SelectedCurrencyAtom)
  const { i18n } = useLingui()
  const router = useRouter()

  const swapActionHandler = useCallback(async () => {
    if (featureEnabled(Feature.TRIDENT, chainId)) {
      if (currency?.isNative) return router.push('/trident/swap')
      return router.push(`/trident/swap?&tokens=${NATIVE[chainId].symbol}&tokens=${currency?.wrapped.address}`)
    }

    if (currency?.isNative) return router.push('/swap')

    return router.push(`/swap?inputCurrency=${currency?.wrapped.address}`)
  }, [chainId, currency?.isNative, currency?.wrapped.address, router])

  return (
    <div className="flex flex-col gap-5 p-5 bg-dark-900 pt-7">
      <div className="flex flex-col gap-3">
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          {i18n._(t`Available Actions`)}
        </Typography>
        <ActionItem svg={<SwitchHorizontalIcon width={24} />} label={i18n._(t`Swap`)} onClick={swapActionHandler} />
        {featureEnabled(Feature.BENTOBOX, chainId) && (
          <>
            <ActionItem
              svg={<WalletIcon width={20} height={20} />}
              label={i18n._(t`Deposit to BentoBox`)}
              onClick={() => setActiveModal(ActiveModal.DEPOSIT)}
            />
            {/* <Typography variant="sm" className="mt-2 mb-5 text-center cursor-pointer text-blue">
              What is BentoBox?
            </Typography> */}
          </>
        )}
      </div>
    </div>
  )
}

export default WalletActions
