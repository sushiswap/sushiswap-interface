import TridentLayout from '../../../../layouts/Trident'
import Header from '../../../../features/trident/pool/Header'
import ConcentratedMarket from '../../../../features/trident/pool/concentrated/ConcentratedMarket'
import PoolStatsChart from '../../../../features/trident/pool/PoolStatsChart'
import { RecoilRoot } from 'recoil'

const Pool = () => {
  return (
    <div className="flex flex-col w-full mt-px mb-5">
      <Header />
      <ConcentratedMarket />
      <PoolStatsChart />
    </div>
  )
}

Pool.Provider = RecoilRoot
Pool.Layout = TridentLayout

export default Pool
