import TridentLayout, { TridentBody, TridentHeader } from '../../../../layouts/Trident'
import Header from '../../../../features/trident/pool/Header'
import MyDeposits from '../../../../features/trident/pool/MyDeposits'
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
