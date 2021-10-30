import ConcentratedMarket from 'features/trident/pool/concentrated/ConcentratedMarket'
import Header from 'features/trident/pool/Header'
import PoolStatsChart from 'features/trident/pool/PoolStatsChart'
import TridentLayout, { TridentBody, TridentHeader } from 'layouts/Trident'
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
