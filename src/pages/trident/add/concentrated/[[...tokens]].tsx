import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import Chart from 'app/features/trident/add/concentrated/Chart'
import ConcentratedStandardMode from 'app/features/trident/add/concentrated/ConcentratedStandardMode'
import PriceRange from 'app/features/trident/add/concentrated/PriceRange'
import RangeBlocks from 'app/features/trident/add/concentrated/RangeBlocks'
import FixedRatioHeader from 'app/features/trident/add/FixedRatioHeader'
import {
  maxPriceAtom,
  minPriceAtom,
  poolAtom,
  poolBalanceAtom,
  totalSupplyAtom,
} from 'app/features/trident/context/atoms'
import { useCurrency } from 'app/hooks/Tokens'
import { useConstantProductPool } from 'app/hooks/useConstantProductPools'
import { useTotalSupply } from 'app/hooks/useTotalSupply'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useActiveWeb3React } from 'app/services/web3'
import { useTokenBalance } from 'app/state/wallet/hooks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { RecoilRoot, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

const AddConcentrated = () => {
  const { account, chainId } = useActiveWeb3React()
  const { query } = useRouter()
  const { i18n } = useLingui()
  const [next, setNext] = useState(false)

  const [{ pool }, setPool] = useRecoilState(poolAtom)
  const setTotalSupply = useSetRecoilState(totalSupplyAtom)
  const setPoolBalance = useSetRecoilState(poolBalanceAtom)
  const minPrice = useRecoilValue(minPriceAtom)
  const maxPrice = useRecoilValue(maxPriceAtom)
  const currencyA = useCurrency(query.tokens?.[0])
  const currencyB = useCurrency(query.tokens?.[1])
  const classicPool = useConstantProductPool(currencyA, currencyB)
  const totalSupply = useTotalSupply(classicPool ? classicPool.pool?.liquidityToken : undefined)
  const poolBalance = useTokenBalance(account ?? undefined, classicPool.pool?.liquidityToken)

  useEffect(() => {
    if (!classicPool.pool) return
    setPool(classicPool)
  }, [chainId, classicPool, setPool])

  useEffect(() => {
    if (!totalSupply) return
    setTotalSupply(totalSupply)
  }, [setTotalSupply, totalSupply])

  useEffect(() => {
    if (!poolBalance) return
    setPoolBalance(poolBalance)
  }, [poolBalance, setPoolBalance])

  return (
    <>
      <TridentHeader>
        <div className="flex flex-row justify-between">
          <Button
            color="blue"
            variant="outlined"
            size="sm"
            className="py-1 pl-2 rounded-full"
            startIcon={<ChevronLeftIcon width={24} height={24} />}
          >
            <Link href={`/trident/pool/classic/${pool?.token0}/${pool?.token1}`}>{i18n._(t`Back`)}</Link>
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="h2" weight={700} className="text-high-emphesis">
            {i18n._(t`Add Liquidity`)}
          </Typography>
          <Typography variant="sm">{i18n._(t`Select a price range for the assets you're providing.`)}</Typography>
        </div>
      </TridentHeader>
      <TridentBody>
        {!next ? (
          <>
            <div className="flex flex-col gap-7">
              <Chart />
              <PriceRange />
              <RangeBlocks />
            </div>
            <div className="flex flex-col px-5 mt-5">
              <Button
                color="gradient"
                disabled={!minPrice || !maxPrice || minPrice >= maxPrice}
                onClick={() => setNext(true)}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-7">
            <FixedRatioHeader margin={false} />
            <RangeBlocks />
            <ConcentratedStandardMode />

            {/*TODO ramin*/}
            {/*<DepositSubmittedModal />*/}
          </div>
        )}
      </TridentBody>
    </>
  )
}

AddConcentrated.Provider = RecoilRoot
AddConcentrated.Layout = TridentLayout

export default AddConcentrated
