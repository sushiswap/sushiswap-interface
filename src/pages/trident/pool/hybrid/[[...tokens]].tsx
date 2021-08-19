import TridentLayout from '../../../../layouts/Trident'
import { TridentPoolPageContextProvider } from '../../../../features/trident/pool/context'
import { PoolType } from '../../../../features/trident/types'
import HybridPoolComposition from '../../../../features/trident/pool/HybridPoolComposition'
import Header from '../../../../features/trident/pool/Header'

const Pool = () => {
  return (
    <div className="flex flex-col w-full mt-px mb-5">
      <Header />
      <HybridPoolComposition />
    </div>
  )
}

Pool.Provider = TridentPoolPageContextProvider(PoolType.HYBRID)
Pool.Layout = TridentLayout

export default Pool
