import { defaultAbiCoder } from '@ethersproject/abi'
import { AddressZero } from '@ethersproject/constants'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CHAINLINK_ORACLE_ADDRESS, Currency, KASHI_ADDRESS } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Card from 'app/components/Card'
import Container from 'app/components/Container'
import CurrencyInputPanel from 'app/components/CurrencyInputPanel'
import { CHAINLINK_PRICE_FEED_MAP } from 'app/config/oracles/chainlink'
import { Feature } from 'app/enums'
import { e10 } from 'app/functions/math'
import NetworkGuard from 'app/guards/Network'
import { useBentoBoxContract } from 'app/hooks/useContract'
import Layout from 'app/layouts/Kashi'
import { useActiveWeb3React } from 'app/services/web3'
import { Field } from 'app/state/create/actions'
import { useCreateActionHandlers, useCreateState, useDerivedCreateInfo } from 'app/state/create/hook'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useCallback } from 'react'

export type ChainlinkToken = {
  symbol: string
  name: string
  address: string
  decimals: number
}

export default function Create() {
  const { chainId } = useActiveWeb3React()

  const bentoBoxContract = useBentoBoxContract()

  const addTransaction = useTransactionAdder()

  const router = useRouter()

  const { independentField, typedValue } = useCreateState()
  const { onSwitchTokens, onCurrencySelection, onUserInput } = useCreateActionHandlers()

  const { currencies, inputError } = useDerivedCreateInfo()

  const handleCollateralSelect = useCallback(
    (collateralCurrency) => {
      onCurrencySelection(Field.COLLATERAL, collateralCurrency)
    },
    [onCurrencySelection]
  )

  const handleAssetSelect = useCallback(
    (assetCurrency) => {
      onCurrencySelection(Field.ASSET, assetCurrency)
    },
    [onCurrencySelection]
  )

  const both = Boolean(currencies[Field.COLLATERAL] && currencies[Field.ASSET])

  const getOracleData = useCallback(
    async (asset: Currency, collateral: Currency) => {
      const oracleData = ''

      // @ts-ignore TYPE NEEDS FIXING
      const mapping = CHAINLINK_PRICE_FEED_MAP[chainId]

      for (const address in mapping) {
        mapping[address].address = address
      }

      let multiply = AddressZero
      let divide = AddressZero

      const multiplyMatches = Object.values(mapping).filter(
        // @ts-ignore TYPE NEEDS FIXING
        (m) => m.from === asset.wrapped.address && m.to === collateral.wrapped.address
      )

      let decimals = 0

      if (multiplyMatches.length) {
        const match = multiplyMatches[0]
        // @ts-ignore TYPE NEEDS FIXING
        multiply = match.address!
        // @ts-ignore TYPE NEEDS FIXING
        decimals = 18 + match.decimals - match.toDecimals + match.fromDecimals
      } else {
        const divideMatches = Object.values(mapping).filter(
          // @ts-ignore TYPE NEEDS FIXING
          (m) => m.from === collateral.wrapped.address && m.to === asset.wrapped.address
        )
        if (divideMatches.length) {
          const match = divideMatches[0]
          // @ts-ignore TYPE NEEDS FIXING
          divide = match.address!
          // @ts-ignore TYPE NEEDS FIXING
          decimals = 36 - match.decimals - match.toDecimals + match.fromDecimals
        } else {
          // @ts-ignore TYPE NEEDS FIXING
          const mapFrom = Object.values(mapping).filter((m) => m.from === asset.wrapped.address)
          // @ts-ignore TYPE NEEDS FIXING
          const mapTo = Object.values(mapping).filter((m) => m.from === collateral.wrapped.address)
          const match = mapFrom
            .map((mfrom) => ({
              mfrom: mfrom,
              // @ts-ignore TYPE NEEDS FIXING
              mto: mapTo.filter((mto) => mfrom.to === mto.to),
            }))
            .filter((path) => path.mto.length)
          if (match.length) {
            // @ts-ignore TYPE NEEDS FIXING
            multiply = match[0].mfrom.address!
            // @ts-ignore TYPE NEEDS FIXING
            divide = match[0].mto[0].address!
            // @ts-ignore TYPE NEEDS FIXING
            decimals = 18 + match[0].mfrom.decimals - match[0].mto[0].decimals - collateral.decimals + asset.decimals
          } else {
            return ''
          }
        }
      }

      return defaultAbiCoder.encode(['address', 'address', 'uint256'], [multiply, divide, e10(decimals)])
    },
    [chainId]
  )

  const handleCreate = async () => {
    try {
      if (!both) return

      // @ts-ignore TYPE NEEDS FIXING
      const oracleData = await getOracleData(currencies[Field.ASSET], currencies[Field.COLLATERAL])

      if (!oracleData) {
        console.log('No path')
        return
      }

      // @ts-ignore TYPE NEEDS FIXING
      if (!(chainId in CHAINLINK_ORACLE_ADDRESS)) {
        console.log('No chainlink oracle address')
        return
      }

      // @ts-ignore TYPE NEEDS FIXING
      if (!(chainId in KASHI_ADDRESS)) {
        console.log('No kashi address')
        return
      }

      // @ts-ignore TYPE NEEDS FIXING
      const oracleAddress = CHAINLINK_ORACLE_ADDRESS[chainId]

      const kashiData = defaultAbiCoder.encode(
        ['address', 'address', 'address', 'bytes'],
        [
          // @ts-ignore TYPE NEEDS FIXING
          currencies[Field.COLLATERAL].wrapped.address,
          // @ts-ignore TYPE NEEDS FIXING
          currencies[Field.ASSET].wrapped.address,
          oracleAddress,
          oracleData,
        ]
      )

      console.log([
        // @ts-ignore TYPE NEEDS FIXING
        currencies[Field.COLLATERAL].wrapped.address,
        // @ts-ignore TYPE NEEDS FIXING
        currencies[Field.ASSET].wrapped.address,
        oracleAddress,
        oracleData,
      ])

      const tx = await bentoBoxContract?.deploy(chainId && KASHI_ADDRESS[chainId], kashiData, true)

      addTransaction(tx, {
        // @ts-ignore TYPE NEEDS FIXING
        summary: `Add Kashi market ${currencies[Field.ASSET].symbol}/${currencies[Field.COLLATERAL].symbol} Chainlink`,
      })

      router.push('/lend')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <CreateLayout>
      <Head>
        <title>Create Lending Pair | Kashi by Sushi</title>
        <meta key="description" name="description" content="Create Lending Pair on Kashi by Sushi" />
        <meta key="twitter:description" name="twitter:description" content="Create Lending Pair on Kashi by Sushi" />
        <meta key="og:description" property="og:description" content="Create Lending Pair on Kashi by Sushi" />
      </Head>
      <Card
        className="h-full bg-dark-900"
        header={
          <Card.Header className="bg-dark-800">
            <div className="text-3xl text-high-emphesis leading-48px">Create a Market</div>
          </Card.Header>
        }
      >
        <Container maxWidth="full" className="space-y-6">
          <div className="grid grid-cols-1 grid-rows-2 gap-4 md:grid-rows-1 md:grid-cols-2">
            <CurrencyInputPanel
              label="Collateral"
              showMaxButton={false}
              hideBalance={true}
              hideInput={true}
              currency={currencies[Field.COLLATERAL]}
              onCurrencySelect={handleCollateralSelect}
              otherCurrency={currencies[Field.ASSET]}
              showCommonBases={false}
              allowManageTokenList={false}
              showSearch={false}
              id="kashi-currency-collateral"
            />

            <CurrencyInputPanel
              label="Asset"
              showMaxButton={false}
              hideBalance={true}
              hideInput={true}
              currency={currencies[Field.ASSET]}
              onCurrencySelect={handleAssetSelect}
              otherCurrency={currencies[Field.COLLATERAL]}
              showCommonBases={false}
              allowManageTokenList={false}
              showSearch={false}
              id="kashi-currency-asset"
            />
          </div>

          <Button
            color="gradient"
            className="w-full px-4 py-3 text-base rounded text-high-emphesis"
            onClick={() => handleCreate()}
            disabled={!both}
          >
            {inputError || 'Create'}
          </Button>
        </Container>
      </Card>
    </CreateLayout>
  )
}

// @ts-ignore TYPE NEEDS FIXING
const CreateLayout = ({ children }) => {
  const { i18n } = useLingui()
  return (
    <Layout
      left={
        <Card
          className="h-full bg-dark-900"
          backgroundImage="/images/kashi/deposit.png"
          title={i18n._(t`Create a new Kashi Market`)}
          description={i18n._(
            t`If you want to supply to a market that is not listed yet, you can use this tool to create a new pair.`
          )}
        />
      }
    >
      {children}
    </Layout>
  )
}

Create.Guard = NetworkGuard(Feature.KASHI)
