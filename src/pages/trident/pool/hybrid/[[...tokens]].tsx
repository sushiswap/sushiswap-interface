import TridentLayout from '../../../../layouts/Trident'
import HybridPoolComposition from '../../../../features/trident/pool/hybrid/HybridPoolComposition'
import Header from '../../../../features/trident/pool/Header'
import { RecoilRoot } from 'recoil'

const Pool = () => {
  return (
    <div className="flex flex-col w-full mt-px mb-5">
      <Header />
      <HybridPoolComposition />
    </div>
  )
}

Pool.Provider = RecoilRoot
Pool.Layout = TridentLayout

export default Pool
