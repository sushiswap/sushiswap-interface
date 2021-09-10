import TridentLayout from '../../../../layouts/Trident'
import Header from '../../../../features/trident/pool/Header'
import MyDeposits from '../../../../features/trident/pool/MyDeposits'
import { RecoilRoot } from 'recoil'

const Pool = () => {
  return (
    <div className="flex flex-col w-full mt-px mb-5">
      <Header />
      <MyDeposits />
    </div>
  )
}

Pool.Provider = RecoilRoot
Pool.Layout = TridentLayout

export default Pool
