import { CurrencyLogo } from 'app/components/CurrencyLogo'
import ListPanel from 'app/components/ListPanel'
import Typography from 'app/components/Typography'
import { poolAtom } from 'app/features/trident/context/atoms'
import { FC } from 'react'
import { useRecoilValue } from 'recoil'

const ClassicTokenPrices: FC = () => {
  const { pool } = useRecoilValue(poolAtom)

  return (
    <div className="lg:grid grid-cols-1 lg:grid-cols-2 gap-2 space-y-2 lg:space-y-0">
      <ListPanel
        items={[
          <div key={0} className="flex items-center w-full px-3 py-2 space-x-2 bg-dark-900">
            <CurrencyLogo currency={pool?.token0} size={20} />
            <Typography variant="sm" weight={700}>
              1 {pool?.token0.symbol} = {pool?.token0Price.toSignificant(6)} {pool?.token1.symbol}
            </Typography>
          </div>,
        ]}
        className="w-full"
      />
      <ListPanel
        items={[
          <div key={0} className="flex items-center w-full px-3 py-2 space-x-2 bg-dark-900">
            <CurrencyLogo currency={pool?.token1} size={20} />
            <Typography variant="sm" weight={700}>
              1 {pool?.token1.symbol} = {pool?.token1Price.toSignificant(6)} {pool?.token0.symbol}
            </Typography>
          </div>,
        ]}
        className="w-full"
      />
    </div>
  )
}

export default ClassicTokenPrices
