import { Signature } from '@ethersproject/bytes'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import {
  getAllParsedAmountsSelector,
  getAllSelectedAssetsSelector,
  selectedFeeTierAtom,
} from 'app/features/trident/create/context/atoms'
import { useConstantProductPoolFactory, useMasterDeployerContract, useTridentRouterContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useBentoMasterContractAllowed } from 'app/state/bentobox/hooks'
import { useRecoilValue } from 'recoil'

export const useCreatePoolDependencyError = (rebasesLoading: boolean, bentoPermit?: Signature): string | undefined => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const masterDeployer = useMasterDeployerContract()
  const constantProductPoolFactory = useConstantProductPoolFactory()
  const router = useTridentRouterContract()

  const assets = useRecoilValue(getAllSelectedAssetsSelector)
  const parsedAmounts = useRecoilValue(getAllParsedAmountsSelector)
  const feeTier = useRecoilValue(selectedFeeTierAtom)
  const bentoApproved = useBentoMasterContractAllowed(router?.address, account ?? undefined)

  if (!account) {
    return i18n._(t`No account connected`)
  } else if (!masterDeployer) {
    return i18n._(t`No MasterDeployerContract`)
  } else if (!constantProductPoolFactory) {
    return i18n._(t`No ConstantProductPoolFactory`)
  } else if (!router) {
    return i18n._(t`No TridentRouterContract`)
  } else if (!assets[0].currency || !assets[1].currency) {
    return i18n._(t`No all currencies are selected`)
  } else if (!parsedAmounts[0] || !parsedAmounts[1]) {
    return i18n._(t`Could not parse amount of asset`)
  } else if (!parsedAmounts.every((el) => el?.greaterThan(0))) {
    return i18n._(t`Amount selected is not greater than zero`)
  } else if (!feeTier) {
    return i18n._(t`Fee tier not selected`)
  } else if (rebasesLoading) {
    return i18n._(t`Rebases still loading`)
  } else if (!bentoApproved && !bentoPermit) {
    return i18n._(t`Missing bento permit`)
  }
  return undefined
}
