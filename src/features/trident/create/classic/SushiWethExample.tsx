import Image from 'next/image'
import { FC } from 'react'

const SUSHI_LOGO = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/sushi.jpg'
const WETH_LOGO = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/eth.jpg'

export const SushiWethExample: FC = () => {
  return (
    <div className="p-4 border border-dark-700 bg-dark-900 w-full rounded mt-2 grid grid-cols-5">
      <div className="col-span-2">
        <div>
          <Image alt="sushi logo" className="rounded-full" height="30" width="30" src={SUSHI_LOGO} />
          <div className="-ml-2 inline">
            <Image alt="eth logo" className="rounded-full" height="30" width="30" src={WETH_LOGO} />
          </div>
        </div>
        <div className="font-bold text-high-emphesis">SUSHI-WETH</div>
      </div>
      <div className="flex flex-col justify-center text-sm col-span-3">
        <div className="flex justify-between">
          <div className="flex flex-row items-center gap-2 mb-2">
            <Image alt="sushi logo" className="rounded-full" height="20" width="20" src={SUSHI_LOGO} />
            20,300,000 SUSHI
          </div>
          <div className="text-secondary">≈$219.2m</div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-row items-center gap-2">
            <Image alt="eth logo" className="rounded-full" height="20" width="20" src={WETH_LOGO} />
            62,970 WETH
          </div>
          <div className="text-secondary">≈$219.9m</div>
        </div>
      </div>
    </div>
  )
}
