import TridentLayout from '../../../../layouts/Trident'
import PoolStats from '../../../../features/trident/pool/PoolStats'
import PoolStatsChart from '../../../../features/trident/pool/PoolStatsChart'
import ClassicMyDeposits from '../../../../features/trident/pool/ClassicMyDeposits'
import ClassicMarket from '../../../../features/trident/pool/ClassicMarket'
import { TridentPoolPageContextProvider } from '../../../../features/trident/pool/context'
import Header from '../../../../features/trident/pool/Header'
import { PoolType } from '../../../../features/trident/types'

const Pool = () => {
  return (
    <div className="flex flex-col w-full mt-px mb-5">
      <Header />
      <ClassicMyDeposits />
      <ClassicMarket />
      <PoolStatsChart />
      <PoolStats />
    </div>
  )
}

Pool.Provider = TridentPoolPageContextProvider(PoolType.CLASSIC)
Pool.Layout = TridentLayout

export default Pool
