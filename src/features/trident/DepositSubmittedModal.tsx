import Typography from '../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { getExplorerLink } from '../../functions/explorer'
import { useActiveWeb3React } from '../../hooks'
import Button from '../../components/Button'
import Link from 'next/link'
import HeadlessUiModal from '../../components/Modal/HeadlessUIModal'
import { useTridentState } from './context'
import { PoolContextType, PoolStateType } from './types'

const DepositSubmittedModal = <S extends PoolStateType, C extends PoolContextType>() => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { txHash } = useTridentState<S>()

  return (
    <HeadlessUiModal.Controlled isOpen={!!txHash} onDismiss={() => {}}>
      <div className="flex flex-col items-center justify-center px-8 bg-dark-800/90 h-full gap-3">
        <Typography variant="h3" weight={700} className="text-high-emphesis">
          {i18n._(t`Success! Deposit Submitted`)}
        </Typography>
        <Typography variant="sm" weight={700} className="text-blue">
          <a href={getExplorerLink(chainId, txHash, 'transaction')}>{i18n._(t`View on Explorer`)}</a>
        </Typography>
        <Button variant="filled" color="blue">
          <Link href="/trident/pools">{i18n._(t`Back to Pools`)}</Link>
        </Button>
      </div>
    </HeadlessUiModal.Controlled>
  )
}

export default DepositSubmittedModal
