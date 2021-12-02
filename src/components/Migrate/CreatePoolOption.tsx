import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Checkbox from 'app/components/Checkbox'
import { AvailablePoolConfig, deDupe } from 'app/components/Migrate/migrate-utils'
import { classNames } from 'app/functions'
import { FeeTier } from 'app/services/graph'
import React, { Dispatch, FC, SetStateAction, useState } from 'react'

interface OptionProps {
  active: boolean
  poolConfigs: AvailablePoolConfig[]
  onClick: (poolToCreate: AvailablePoolConfig) => void
}

function availableTwapsForFee(configs: AvailablePoolConfig[], fee: FeeTier) {
  return configs
    .filter((config) => config.fee === fee)
    .map((config) => config.twap)
    .filter(deDupe)
}

const setTwapOption = (
  configs: AvailablePoolConfig[],
  selected: AvailablePoolConfig,
  setter: Dispatch<SetStateAction<AvailablePoolConfig>>
) => {
  const bools = availableTwapsForFee(configs, selected.fee)
  if (bools.length === 2) setter({ ...selected, twap: !selected.twap })
}

const setFeeTier = (
  enable: boolean,
  fee: FeeTier,
  currentlySetTwap: boolean,
  configs: AvailablePoolConfig[],
  setter: Dispatch<SetStateAction<AvailablePoolConfig>>
) => {
  /* Like a radio button, cannot disable only choose other options */
  if (!enable) return
  const bools = availableTwapsForFee(configs, fee)
  if (bools.length === 2) setter({ fee, twap: currentlySetTwap })
  if (bools.length === 1) setter({ fee, twap: bools[0] })
}

export const CreatePoolOption: FC<OptionProps> = ({ active, poolConfigs, onClick: setFunc }) => {
  const { i18n } = useLingui()
  const [selectedPoolConfig, setSelectedPoolConfig] = useState(poolConfigs[0])

  return (
    <div
      className={classNames(
        'flex flex-col gap-3 bg-dark-800 rounded p-4 m-3',
        !active && 'hover:bg-dark-700 hover:cursor-pointer',
        active && 'border-2 border-blue p-3.5'
      )}
      onClick={() => setFunc(selectedPoolConfig)}
    >
      <div>
        {i18n._(t`Create New Pool`)} {!active && '→'}
      </div>
      {active && (
        <>
          <div>{i18n._(t`Fee tier`)}</div>
          {poolConfigs
            .map((pool) => pool.fee)
            .filter(deDupe)
            .map((fee, i) => (
              <div className="flex gap-2 items-center" key={i}>
                <Checkbox
                  checked={fee == selectedPoolConfig.fee}
                  set={(enable) => setFeeTier(enable, fee, selectedPoolConfig.twap, poolConfigs, setSelectedPoolConfig)}
                />
                <span className="text-xs">{fee}%</span>
              </div>
            ))}
          <div>{i18n._(t`TWAP`)}</div>
          <div className="flex gap-2 items-center">
            <Checkbox
              checked={selectedPoolConfig.twap}
              set={() => setTwapOption(poolConfigs, selectedPoolConfig, setSelectedPoolConfig)}
            />
            <span className="text-xs">{i18n._(t`Yes create an oracle`)}</span>
          </div>
        </>
      )}
    </div>
  )
}
