import Header from 'app/features/trident/pool/Header'
import MyDeposits from 'app/features/trident/pool/MyDeposits'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { RecoilRoot } from 'recoil'

const Pool = () => {
  return (
    <>
      <TridentHeader>
        <Header />
      </TridentHeader>
      <TridentBody>
        <MyDeposits />
      </TridentBody>
    </>
  )
}

Pool.Provider = RecoilRoot
Pool.Layout = TridentLayout

export default Pool
