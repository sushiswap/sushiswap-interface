import Button from '../../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import TridentLayout, { TridentBody, TridentHeader } from '../../../../layouts/Trident'
import Typography from '../../../../components/Typography'
import React, { useEffect, useState } from 'react'
import Chart from '../../../../features/trident/add/concentrated/Chart'
import PriceRange from '../../../../features/trident/add/concentrated/PriceRange'
import RangeBlocks from '../../../../features/trident/add/concentrated/RangeBlocks'
import FixedRatioHeader from '../../../../features/trident/add/FixedRatioHeader'
import { RecoilRoot, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  maxPriceAtom,
  minPriceAtom,
  poolAtom,
  poolBalanceAtom,
  totalSupplyAtom,
} from '../../../../features/trident/context/atoms'
import { useCurrency } from '../../../../hooks/Tokens'
import { useTridentClassicPool } from '../../../../hooks/useTridentClassicPools'
import { useTotalSupply } from '../../../../hooks/useTotalSupply'
import { useTokenBalance } from '../../../../state/wallet/hooks'
import { useActiveWeb3React } from '../../../../hooks'
import { useRouter } from 'next/router'
import ConcentratedStandardMode from '../../../../features/trident/add/concentrated/ConcentratedStandardMode'
import AddTransactionReviewModal from '../../../../features/trident/create/CreateReviewModal'

const AddConcentrated = () => {
  const { account, chainId } = useActiveWeb3React()
  const { query } = useRouter()
  const { i18n } = useLingui()
  const [next, setNext] = useState(false)

  const [[, pool], setPool] = useRecoilState(poolAtom)
  const setTotalSupply = useSetRecoilState(totalSupplyAtom)
  const setPoolBalance = useSetRecoilState(poolBalanceAtom)
  const minPrice = useRecoilValue(minPriceAtom)
  const maxPrice = useRecoilValue(maxPriceAtom)
  const currencyA = useCurrency(query.tokens?.[0])
  const currencyB = useCurrency(query.tokens?.[1])
  const classicPool = useTridentClassicPool(currencyA, currencyB, 50, true)
  const totalSupply = useTotalSupply(classicPool ? classicPool[1]?.liquidityToken : undefined)
  const poolBalance = useTokenBalance(account ?? undefined, classicPool[1]?.liquidityToken)

  useEffect(() => {
    if (!classicPool[1]) return
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
            className="rounded-full py-1 pl-2"
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
            <AddTransactionReviewModal />

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
