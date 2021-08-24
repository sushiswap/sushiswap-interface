import TridentLayout from '../../../../layouts/Trident'
import PoolStats from '../../../../features/trident/pool/PoolStats'
import PoolStatsChart from '../../../../features/trident/pool/PoolStatsChart'
import ClassicMyDeposits from '../../../../features/trident/pool/classic/ClassicMyDeposits'
import ClassicMarket from '../../../../features/trident/pool/classic/ClassicMarket'
import { TridentPoolPageContextProvider } from '../../../../features/trident/pool/context'
import Header from '../../../../features/trident/pool/Header'
import { PoolType } from '../../../../features/trident/types'
import ClassicMyRewards from '../../../../features/trident/pool/classic/ClassicMyRewards'
import Rewards from '../../../../features/trident/pool/Rewards'

const Pool = () => {
  return (
    <div className="flex flex-col w-full mt-px mb-5">
      <Header />
      <ClassicMyDeposits />
      <ClassicMyRewards />
      <ClassicMarket />
      <Rewards />
      <PoolStatsChart />
      <PoolStats />
    </div>
  )
}

Pool.Provider = TridentPoolPageContextProvider(PoolType.CLASSIC)
Pool.Layout = TridentLayout

export default Pool
