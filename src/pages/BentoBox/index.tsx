import React from 'react'
import KashiCard from './KashiCard'
import { Card } from 'kashi/components'

function BentoBox() {
  return (
    <div className="container mx-auto max-w-xl">
      <div className="flex justify-center">
        <div className="text-3xl font-semibold text-high-emphesis">BentoBox Apps</div>
      </div>
      <div className="text-center text-high-emphesis my-6">
        BentoBox is a revolutionary new way from SUSHI to interact with dapps on L1 in a highly gas efficient manner. In
        order to use any one of the decentralized apps below you&apos;ll need to first enable them and deposit any ERC20
        asset to your BentoBox balance.
      </div>
      {/* List of Apps */}
      <div className="flex justify-center max-w-xs mx-auto">
        <KashiCard />
      </div>
    </div>
  )
}

export default BentoBox
