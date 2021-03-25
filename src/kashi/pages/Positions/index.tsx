import React, { useState } from 'react'
import { useKashiPairs } from '../../context'
import PositionsToggle from './Toggle'
import SupplyPositions from './Supply'
import BorrowPositions from './Borrow'
import { InfoCard, SectionHeader, Layout } from '../../components'
import DepositGraphic from '../../../assets/kashi/deposit-graphic.png'

export default function Positions() {
  const pairs = useKashiPairs()

  const supplyPositions = pairs.filter(function(pair: any) {
    return pair.user.asset.value.gt(0)
  })
  const borrowPositions = pairs.filter(function(pair: any) {
    return pair.user.borrow.value.gt(0)
  })
  const [selected, setSelected] = useState<'supply' | 'borrow'>('supply')

  return (
    <Layout
      left={
        <InfoCard
          backgroundImage={DepositGraphic}
          title={'Deposit tokens into BentoBox for all the yields.'}
          description={
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
          }
        />
      }
    >
      <div className="flex-col space-y-8" style={{ minHeight: '35rem' }}>
        <div>
          <SectionHeader portfolio={true}>
            <PositionsToggle selected={selected} setSelected={setSelected} />
          </SectionHeader>
          {selected && selected === 'supply' && <SupplyPositions supplyPositions={supplyPositions} />}
          {selected && selected === 'borrow' && <BorrowPositions borrowPositions={borrowPositions} />}
        </div>
      </div>
    </Layout>
  )
}
