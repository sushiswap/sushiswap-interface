import React, { FC } from 'react'
import Typography from '../../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import AssetSelect from '../../../components/AssetSelect'
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil'
import { feeTierAtom, selectedPoolCurrenciesAtom } from './atoms'
import { Currency } from '@sushiswap/sdk'
import ToggleButtonGroup from '../../../components/ToggleButton'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import { PlusIcon } from '@heroicons/react/solid'

const SetupPoolClassic: FC = () => {
  const { i18n } = useLingui()
  const selectedPoolCurrencies = useRecoilValue(selectedPoolCurrenciesAtom)
  const [feeTier, setFeeTier] = useRecoilState(feeTierAtom)

  const handleSelectedPoolTokens = useRecoilCallback<[Currency, number], void>(
    ({ snapshot, set }) =>
      async (currency, index) => {
        const currencies = [...(await snapshot.getPromise(selectedPoolCurrenciesAtom))]
        currencies[index] = currency
        set(selectedPoolCurrenciesAtom, currencies)
      },
    []
  )

  const error = [
    !selectedPoolCurrencies[0] || !selectedPoolCurrencies[1] ? 'tokens' : null,
    !feeTier ? 'fee tier' : null,
  ].filter((el) => el)

  return (
    <div className="flex flex-col gap-10 p-5">
      <Card.Gradient>
        <Typography variant="sm" className="text-high-emphesis">
          {i18n._(
            t`Classic pools consist of two tokens, weighted equally at 50% each.  This is the original and most common pool type.`
          )}
        </Typography>

        {/*TODO link*/}
        <Typography variant="xs" className="text-blue cursor-pointer" weight={400}>
          {i18n._(t`Learn More about Classic Pools`)}
        </Typography>
      </Card.Gradient>
      <div className="flex flex-col">
        <Typography variant="h3" className="text-high-emphesis mb-1" weight={700}>
          {i18n._(t`Select Pool Tokens`)}
        </Typography>
        <div className="flex flex-col gap-2 relative z-10">
          <AssetSelect
            value={selectedPoolCurrencies[0]}
            onSelect={(cur) => handleSelectedPoolTokens(cur, 0)}
            header={
              <Typography variant="xs" className="text-secondary tracking-[2.04px] mb-2 ml-4" weight={700}>
                {i18n._(t`POOL TOKEN A`)}
              </Typography>
            }
          />
          <div className="absolute top-[calc(50%-12px)] right-2 z-0">
            <div className="border-[3px] border-dark-900 bg-dark-800 rounded-full w-[64px] h-[64px] flex items-center justify-center text-high-emphesis">
              <PlusIcon width={46} height={46} />
            </div>
          </div>
          <AssetSelect
            value={selectedPoolCurrencies[1]}
            onSelect={(cur) => handleSelectedPoolTokens(cur, 1)}
            header={
              <Typography variant="xs" className="text-secondary tracking-[2.04px] mb-2 ml-4" weight={700}>
                {i18n._(t`POOL TOKEN B`)}
              </Typography>
            }
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Typography variant="h3" className="text-high-emphesis mb-2" weight={700}>
          {i18n._(t`Select Fee Tier`)}
        </Typography>
        <ToggleButtonGroup value={feeTier} onChange={setFeeTier} variant="outlined">
          <ToggleButtonGroup.Button value="0.05">0.05%</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button value="0.1">0.1%</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button value="0.5">0.5%</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button value="1">1%</ToggleButtonGroup.Button>
        </ToggleButtonGroup>
        {feeTier === '0.5' && (
          <Typography variant="sm" className="italic text-center">
            * This is suggested for most pairs
          </Typography>
        )}
        <Button color="gradient" disabled={error.length > 0}>
          {error.length > 0 ? `Select ${error.join(' & ')}` : 'Continue'}
        </Button>
      </div>
    </div>
  )
}

export default SetupPoolClassic
