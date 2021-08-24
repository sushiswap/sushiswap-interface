import TridentLayout from '../../../../layouts/Trident'
import { TridentPoolPageContextProvider } from '../../../../features/trident/pool/context'
import { PoolType } from '../../../../features/trident/types'
import Header from '../../../../features/trident/pool/Header'
import ConcentratedMarket from '../../../../features/trident/pool/concentrated/ConcentratedMarket'
import PoolStatsChart from '../../../../features/trident/pool/PoolStatsChart'

const Pool = () => {
  return (
    <div className="flex flex-col w-full mt-px mb-5">
      <Header />
      <ConcentratedMarket />
      <PoolStatsChart />
    </div>
  )
}

Pool.Provider = TridentPoolPageContextProvider(PoolType.CONCENTRATED)
Pool.Layout = TridentLayout

export default Pool
