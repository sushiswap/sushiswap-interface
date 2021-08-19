import TridentLayout from '../../../../layouts/Trident'
import { TridentPoolPageContextProvider } from '../../../../features/trident/pool/context'
import { PoolType } from '../../../../features/trident/types'
import Header from '../../../../features/trident/pool/Header'

const Pool = () => {
  return (
    <div className="flex flex-col w-full mt-px mb-5">
      <Header />
      {/*concentrated features*/}
    </div>
  )
}

Pool.Provider = TridentPoolPageContextProvider(PoolType.CONCENTRATED)
Pool.Layout = TridentLayout

export default Pool
