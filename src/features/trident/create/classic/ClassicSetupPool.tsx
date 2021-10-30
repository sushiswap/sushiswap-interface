import { PlusIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import AssetSelect from 'app/components/AssetSelect'
import Button from 'app/components/Button'
import Card from 'app/components/Card'
import ToggleButtonGroup from 'app/components/ToggleButton'
import Typography from 'app/components/Typography'
import { poolCreationPageAtom } from 'app/features/trident/context/atoms'
import { useIndependentAssetInputs } from 'app/features/trident/context/hooks/useIndependentAssetInputs'
import { ConstantProductPoolState, useTridentClassicPool } from 'app/hooks/useTridentClassicPools'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, useCallback } from 'react'
import { useRecoilState } from 'recoil'

import { selectedFeeTierAtom } from '../context/atoms'

const ClassicSetupPool: FC = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const [page, setPage] = useRecoilState(poolCreationPageAtom)
  const {
    currencies: [currencies, setCurrencies],
  } = useIndependentAssetInputs()
  const [feeTier, setFeeTier] = useRecoilState(selectedFeeTierAtom)

  const [poolState] = useTridentClassicPool(currencies[0], currencies[1], feeTier, true)

  const handleSelectedPoolTokens = useCallback(
    (currency, index) => {
      const copy = [...currencies]
      copy[index] = currency
      setCurrencies(copy)
    },
    [currencies, setCurrencies]
  )

  const error = !account
    ? i18n._(t`Connect Wallet`)
    : !currencies[0] || !currencies[1]
    ? i18n._(t`Select tokens`)
    : !feeTier
    ? i18n._(t`Select fee tier`)
    : poolState === ConstantProductPoolState.EXISTS
    ? i18n._(t`Pool already exists`)
    : ''

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
            value={currencies[0]}
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
            value={currencies[1]}
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
          <ToggleButtonGroup.Button value={10}>0.1%</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button value={30}>0.3%</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button value={50}>0.5%</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button value={100}>1%</ToggleButtonGroup.Button>
        </ToggleButtonGroup>
        {feeTier === 50 && (
          <Typography variant="sm" className="italic text-center">
            {i18n._(t`* This is suggested for most pairs`)}
          </Typography>
        )}

        <Button disabled={error.length > 0} color="gradient" onClick={() => setPage(page + 1)}>
          {error ? error : i18n._(t`Continue`)}
        </Button>
      </div>
    </div>
  )
}

export default ClassicSetupPool
