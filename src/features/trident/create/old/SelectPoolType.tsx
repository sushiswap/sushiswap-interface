import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { PoolType } from '@sushiswap/tines'
import Button from 'components/Button'
import RadioGroup from 'components/RadioGroup'
import Typography from 'components/Typography'
import { classNames } from 'functions'
import { FC } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'

import { poolCreationPageAtom } from '../../context/atoms'
import { selectedPoolTypeAtom } from '../context/atoms'

const RadioOption = ({ value, title, description }) => {
  return (
    <HeadlessRadioGroup.Option value={value} className={classNames('outline-non py-4 border-dark-800')}>
      {({ checked }) => (
        <>
          <div className={classNames(checked ? '' : 'items-center', 'flex text-sm cursor-pointer gap-3.5')}>
            <div className="min-h-6 min-w-6">
              <span
                className={classNames(
                  checked ? 'bg-gradient-to-r from-blue to-pink' : 'border border-dark-700 bg-dark-800',
                  'h-6 w-6 rounded-full flex items-center justify-center'
                )}
                aria-hidden="true"
              >
                {checked && <span className="rounded-full bg-white w-2.5 h-2.5" />}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <HeadlessRadioGroup.Label as="span">
                <Typography
                  className={classNames(checked ? 'mt-[2px]' : '', 'text-high-emphesis')}
                  weight={checked ? 700 : 400}
                >
                  {title}
                </Typography>
              </HeadlessRadioGroup.Label>
              {checked && (
                <Typography variant="sm" className="text-secondary">
                  {description}
                </Typography>
              )}
            </div>
          </div>
        </>
      )}
    </HeadlessRadioGroup.Option>
  )
}

const SelectPoolType: FC = () => {
  const { i18n } = useLingui()
  const setPage = useSetRecoilState(poolCreationPageAtom)
  const [selectedPoolType, setSelectedPoolType] = useRecoilState(selectedPoolTypeAtom)

  return (
    <div className="flex flex-col gap-5 p-5 pt-8">
      <Typography variant="h3" weight={700} className="text-high-emphesis">
        {i18n._(t`Select Pool Type`)}
      </Typography>
      <div className="px-5 rounded bg-dark-900">
        <RadioGroup value={selectedPoolType} onChange={setSelectedPoolType} className="divide-y">
          <RadioOption
            value={PoolType.ConstantProduct}
            title={i18n._(t`Classic`)}
            description={i18n._(t`This type of pool consists of 2 tokens, 50% each.  This is currently most common.`)}
          />
          <RadioOption
            value={PoolType.ConcentratedLiquidity}
            title={i18n._(t`Concentrated Price Range`)}
            description={i18n._(
              t`This is like a traditional 50/50 pool but within specified price ranges, to maximize exposure to swap fees.`
            )}
          />
          <RadioOption
            value={PoolType.Weighted}
            title={i18n._(t`Index`)}
            description={i18n._(
              t`This type of pool consists of 2 tokens, assigned weights for each token by the pool creator.`
            )}
          />
          <RadioOption
            value={PoolType.Hybrid}
            title={i18n._(t`Multi-Asset`)}
            description={i18n._(
              t`This type of pool consists of up to 10 tokens, equal weight each. It is best utilized for swapping likekind assets.`
            )}
          />
        </RadioGroup>
      </div>
      <Button color="gradient" onClick={() => setPage(1)}>
        {i18n._(t`Continue`)}
      </Button>
    </div>
  )
}

export default SelectPoolType
