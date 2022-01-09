import ConcentratedMarket from 'app/features/trident/pool/concentrated/ConcentratedMarket'
import Header from 'app/features/trident/pool/Header'
import PoolStatsChart from 'app/features/trident/pool/PoolStatsChart'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { RecoilRoot } from 'recoil'

const Pool = () => {
  return (
    <>
      <TridentHeader>
        <Header />
      </TridentHeader>
      <TridentBody>
        <ConcentratedMarket />
        <PoolStatsChart />
      </TridentBody>
    </>
  )
}

Pool.Provider = RecoilRoot
Pool.Layout = TridentLayout

export default Pool
