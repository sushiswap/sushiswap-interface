import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Image from '../../components/Image'
import React, { useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { CurrencyAmount, JSBI, Token, USD, ZERO } from '@sushiswap/sdk'
import { getAddress } from '@ethersproject/address'
import { PairType } from './enum'
import { usePendingSushi, useUserInfo } from './hooks'
import { easyAmount, formatNumber } from '../../functions'
import { BigNumber } from '@ethersproject/bignumber'
import usePendingReward from './usePendingReward'
import CurrencyLogo from '../../components/CurrencyLogo'
import useMasterChef from './useMasterChef'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useRouter } from 'next/router'
import Button from '../../components/Button'
import { useCurrency } from '../../hooks/Tokens'
import Typography from '../../components/Typography'
import { useKashiPair } from '../lending/context'

const InvestmentDetails = ({ farm }) => {
  const { i18n } = useLingui()

  const { chainId } = useActiveWeb3React()

  const { harvest } = useMasterChef(farm.chef)

  const router = useRouter()

  const addTransaction = useTransactionAdder()

  const kashiPair = useKashiPair(farm.pair.id)

  const [pendingTx, setPendingTx] = useState(false)

  const token0 = useCurrency(farm.pair.token0.id)
  const token1 = useCurrency(farm.pair.token1.id)

  const liquidityToken = new Token(
    chainId,
    getAddress(farm.pair.id),
    farm.pair.type === PairType.KASHI ? Number(farm.pair.asset.decimals) : 18,
    farm.pair.symbol ?? farm.pair.type === PairType.KASHI ? 'KMP' : 'SLP',
    farm.pair.name
  )

  const stakedAmount = useUserInfo(farm, liquidityToken)

  const kashiAssetAmount =
    kashiPair &&
    stakedAmount &&
    easyAmount(
      BigNumber.from(stakedAmount.quotient.toString()).mulDiv(
        kashiPair.currentAllAssets.value,
        kashiPair.totalAsset.base
      ),
      kashiPair.asset
    )

  const pendingReward = usePendingReward(farm)
  const pendingSushi = usePendingSushi(farm)

  const positionFiatValue = CurrencyAmount.fromRawAmount(
    USD[chainId],
    farm.pair.type === PairType.KASHI
      ? kashiAssetAmount?.usdValue.toString() ?? ZERO
      : JSBI.BigInt(
          ((Number(stakedAmount?.toExact() ?? '0') * farm.pair.reserveUSD) / farm.pair.totalSupply)
            .toFixed(USD[chainId].decimals)
            .toBigNumber(USD[chainId].decimals)
        )
  )

  const rewardValue =
    (farm?.rewards?.[0]?.rewardPrice ?? 0) * Number(pendingSushi?.toExact() ?? 0) +
    (farm?.rewards?.[1]?.rewardPrice ?? 0) * Number(pendingReward ?? 0)

  async function onHarvest() {
    setPendingTx(true)
    try {
      const tx = await harvest(farm.id)
      addTransaction(tx, {
        summary: i18n._(t`Harvest ${farm.pair.token0.name}/${farm.pair.token1.name}`),
      })
    } catch (error) {
      console.error(error)
    }
    setPendingTx(false)
  }

  return (
    <div className="flex flex-col w-full space-y-8">
      <div className="flex flex-col w-full space-y-4">
        <div className="flex items-end justify-between font-bold">
          <div className="text-lg cursor-pointer">{i18n._(t`Your Deposits`)}:</div>
          <Typography className="font-bold">
            {formatNumber(stakedAmount?.toSignificant(6) ?? 0)} {farm.pair.token0.symbol}-{farm.pair.token1.symbol}{' '}
            {liquidityToken.symbol}
          </Typography>
        </div>
        <div className="w-full h-0 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis border-gradient-r-blue-pink-dark-800 opacity-20" />
        <div className="flex justify-between">
          <div className="flex flex-col justify-center space-y-2">
            <div className="flex items-center space-x-2">
              <CurrencyLogo currency={token0} size="30px" />
              {farm.pair.type === PairType.KASHI && (
                <Typography>
                  {formatNumber(kashiAssetAmount?.value.toFixed(kashiPair.asset.tokenInfo.decimals) ?? 0)}
                </Typography>
              )}
              {farm.pair.type === PairType.SWAP && (
                <Typography>
                  {formatNumber((farm.pair.reserve0 * Number(stakedAmount?.toExact() ?? 0)) / farm.pair.totalSupply)}
                </Typography>
              )}
              <Typography>{token0?.symbol}</Typography>
            </div>
            {farm.pair.type === PairType.SWAP && (
              <div className="flex items-center space-x-2">
                <CurrencyLogo currency={token1} size="30px" />
                <Typography>
                  {formatNumber((farm.pair.reserve1 * Number(stakedAmount?.toExact() ?? 0)) / farm.pair.totalSupply)}
                </Typography>
                <Typography>{token1?.symbol}</Typography>
              </div>
            )}
          </div>
          <Typography>{formatNumber(positionFiatValue?.toSignificant(6) ?? 0, true)}</Typography>
        </div>
      </div>
      <div className="flex flex-col w-full space-y-4">
        <div className="flex items-end justify-between">
          <div className="text-lg font-bold cursor-pointer">{i18n._(t`Your Rewards`)}:</div>
          {((pendingSushi && pendingSushi.greaterThan(ZERO)) || (pendingReward && Number(pendingReward) > 0)) && (
            <button
              className="py-0.5 px-4 font-bold bg-transparent border border-transparent rounded cursor-pointer border-gradient-r-blue-pink-dark-800 whitespace-nowrap text-md"
              disabled={pendingTx}
              onClick={onHarvest}
            >
              {i18n._(t`Harvest Rewards`)}
            </button>
          )}
        </div>
        <div className="w-full bg-transparent border border-b-0 border-transparent rounded h-0font-bold text-high-emphesis border-gradient-r-blue-pink-dark-800 opacity-20" />
        <div className="flex justify-between">
          <div className="flex flex-col space-y-2">
            {farm?.rewards?.map((reward, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Image
                  src={reward.icon}
                  width="30px"
                  height="30px"
                  className="rounded-md"
                  layout="fixed"
                  alt={reward.token}
                />
                {i === 0 && <Typography>{formatNumber(pendingSushi?.toSignificant(6) ?? 0)}</Typography>}
                {i === 1 && <Typography>{formatNumber(pendingReward)}</Typography>}
                <Typography>{reward.token}</Typography>
              </div>
            ))}
          </div>
          <Typography>{formatNumber(rewardValue, true)}</Typography>
        </div>
      </div>
      {farm.pair.type === PairType.KASHI && (
        <Button
          size="sm"
          className="font-bold bg-transparent border border-transparent rounded cursor-pointer border-gradient-r-blue-pink-dark-800 whitespace-nowrap text-md"
          onClick={() => router.push(`/lend/${farm.pair.id}`)}
        >
          {i18n._(t`View Details on Kashi`)}
        </Button>
      )}
    </div>
  )
}

export default InvestmentDetails
