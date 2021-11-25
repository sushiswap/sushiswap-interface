import CurrencyLogo from 'app/components/CurrencyLogo'
import ListPanel from 'app/components/ListPanel'
import { poolAtom } from 'features/trident/context/atoms'
import { FC } from 'react'
import { useRecoilValue } from 'recoil'

const ClassicTokenPrices: FC = () => {
  const { pool } = useRecoilValue(poolAtom)

  return (
    <div className="flex flex-col space-y-2 text-sm font-bold lg:space-x-2 lg:flex-row">
      <ListPanel
        items={[
          <div key={0} className="flex items-center w-full p-2 space-x-2">
            <CurrencyLogo currency={pool?.token0} size={20} />
            <div>
              1 {pool?.token0.symbol} = {pool?.token0Price.toSignificant(6)} {pool?.token1.symbol}
            </div>
          </div>,
        ]}
        className="w-full"
      />
      <ListPanel
        items={[
          <div key={0} className="flex items-center w-full p-2 space-x-2">
            <CurrencyLogo currency={pool?.token1} size={20} />
            <div>
              1 {pool?.token1.symbol} = {pool?.token1Price.toSignificant(6)} {pool?.token0.symbol}
            </div>
          </div>,
        ]}
        className="w-full"
      />
    </div>
  )
}

export default ClassicTokenPrices
