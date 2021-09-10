import TridentLayout from '../../../layouts/Trident'
import Typography from '../../../components/Typography'
import { t } from '@lingui/macro'
import Button from '../../../components/Button'
import { useLingui } from '@lingui/react'
import Link from 'next/link'
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Stepper from '../../../components/Stepper'
import SelectPoolType from '../../../features/trident/create/SelectPoolType'
import { pageAtom, selectedPoolTypeAtom } from '../../../features/trident/create/atoms'
import CreateReviewModal from '../../../features/trident/create/CreateReviewModal'
import ClassicDepositAssets from '../../../features/trident/create/ClassicDepositAssets'
import { PoolType } from '@sushiswap/sdk'
import ClassicSetupPool from '../../../features/trident/create/ClassicSetupPool'

const Pool = () => {
  const { i18n } = useLingui()
  const [page, setPage] = useRecoilState(pageAtom)
  const selectedPoolType = useRecoilValue(selectedPoolTypeAtom)

  return (
    <div className="flex flex-col w-full mt-px mb-5">
      <div className="flex flex-col p-5 bg-dark-800 bg-auto bg-binary-pattern bg-opacity-60 gap-4">
        <div className="flex flex-row justify-between">
          <Button
            color="blue"
            variant="outlined"
            size="sm"
            className="rounded-full py-1 pl-2"
            startIcon={<ChevronLeftIcon width={24} height={24} />}
          >
            <Link href={`/trident/pools`}>{i18n._(t`Pools`)}</Link>
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="h2" weight={700} className="text-high-emphesis">
            {i18n._(t`Create new Pool`)}
          </Typography>
          <Typography variant="sm">
            {i18n._(t`Start by selecting a pool type, tap on each option learn more.`)}
          </Typography>
        </div>

        {/*spacer*/}
        <div className="h-8" />
      </div>

      <Stepper
        onChange={(index) => setPage(index)}
        value={page}
        className="flex flex-col mt-[-53px] border-t border-dark-700"
      >
        <Stepper.List>
          <Stepper.Tab>Select Type</Stepper.Tab>
          <Stepper.Tab>Setup</Stepper.Tab>
          <Stepper.Tab>Deposit</Stepper.Tab>
        </Stepper.List>
        <Stepper.Panels>
          <Stepper.Panel>
            <SelectPoolType />
          </Stepper.Panel>
          <Stepper.Panel>{selectedPoolType === PoolType.ConstantProduct && <ClassicSetupPool />}</Stepper.Panel>
          <Stepper.Panel>
            <ClassicDepositAssets />
          </Stepper.Panel>
        </Stepper.Panels>
      </Stepper>
      <CreateReviewModal />
    </div>
  )
}

Pool.Provider = RecoilRoot
Pool.Layout = TridentLayout

export default Pool
