import { CHAINLINK_ORACLE_ADDRESS, KASHI_ADDRESS } from '../../../constants/kashi'
import React, { useCallback } from 'react'
import { useCreateActionHandlers, useCreateState, useDerivedCreateInfo } from '../../../state/create/hook'

import Button from '../../../components/Button'
import { CHAINLINK_MAPPING } from '../../../constants/chainlink'
import Card from '../../../components/Card'
import CardHeader from '../../../components/CardHeader'
import Container from '../../../components/Container'
import { Currency } from '@sushiswap/sdk'
import CurrencyInputPanel from '../../../components/CurrencyInputPanel'
import { Field } from '../../../state/create/actions'
import Head from 'next/head'
import Layout from '../../../layouts/Kashi'
import { e10 } from '../../../functions/math'
import { ethers } from 'ethers'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../../hooks/useActiveWeb3React'
import { useBentoBoxContract } from '../../../hooks/useContract'
import { useLingui } from '@lingui/react'
import { useRouter } from 'next/router'
import { useTransactionAdder } from '../../../state/transactions/hooks'

export type ChainlinkToken = {
  symbol: string
  name: string
  address: string
  decimals: number
}

function Create() {
  const { chainId } = useActiveWeb3React()

  const bentoBoxContract = useBentoBoxContract()

  const addTransaction = useTransactionAdder()

  const router = useRouter()

  // swap state
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

      const mapping = CHAINLINK_MAPPING[chainId]

      for (const address in mapping) {
        mapping[address].address = address
      }

      let multiply = ethers.constants.AddressZero
      let divide = ethers.constants.AddressZero
      const multiplyMatches = Object.values(mapping).filter(
        (m) => m.from === asset.wrapped.address && m.to === collateral.wrapped.address
      )

      let decimals = 0
      if (multiplyMatches.length) {
        const match = multiplyMatches[0]
        multiply = match.address!
        decimals = 18 + match.decimals - match.toDecimals + match.fromDecimals
      } else {
        const divideMatches = Object.values(mapping).filter(
          (m) => m.from === collateral.wrapped.address && m.to === asset.wrapped.address
        )
        if (divideMatches.length) {
          const match = divideMatches[0]
          divide = match.address!
          decimals = 36 - match.decimals - match.toDecimals + match.fromDecimals
        } else {
          const mapFrom = Object.values(mapping).filter((m) => m.from === asset.wrapped.address)
          const mapTo = Object.values(mapping).filter((m) => m.from === collateral.wrapped.address)
          const match = mapFrom
            .map((mfrom) => ({
              mfrom: mfrom,
              mto: mapTo.filter((mto) => mfrom.to === mto.to),
            }))
            .filter((path) => path.mto.length)
          if (match.length) {
            multiply = match[0].mfrom.address!
            divide = match[0].mto[0].address!
            decimals = 18 + match[0].mfrom.decimals - match[0].mto[0].decimals - collateral.decimals + asset.decimals
          } else {
            return ''
          }
        }
      }
      return ethers.utils.defaultAbiCoder.encode(['address', 'address', 'uint256'], [multiply, divide, e10(decimals)])
    },
    [chainId]
  )

  const handleCreate = async () => {
    try {
      if (!both) return

      const oracleData = await getOracleData(currencies[Field.ASSET], currencies[Field.COLLATERAL])

      if (!oracleData) {
        console.log('No path')
        return
      }

      const oracleAddress = CHAINLINK_ORACLE_ADDRESS

      const kashiData = ethers.utils.defaultAbiCoder.encode(
        ['address', 'address', 'address', 'bytes'],
        [
          currencies[Field.COLLATERAL].wrapped.address,
          currencies[Field.ASSET].wrapped.address,
          oracleAddress,
          oracleData,
        ]
      )

      console.log([
        currencies[Field.COLLATERAL].wrapped.address,
        currencies[Field.ASSET].wrapped.address,
        oracleAddress,
        oracleData,
      ])

      addTransaction(await bentoBoxContract?.deploy(chainId && KASHI_ADDRESS[chainId], kashiData, true), {
        summary: `Add Kashi market ${currencies[Field.ASSET].symbol}/${currencies[Field.COLLATERAL].symbol} Chainlink`,
      })

      router.push('/lend')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <Head>
        <title>Create Lending Pair | Kashi by Sushi</title>
        <meta key="description" name="description" content="Create Lending Pair on Kashi by Sushi" />
      </Head>
      <Card
        className="h-full bg-dark-900"
        header={
          <CardHeader className="bg-dark-800">
            <div className="text-3xl text-high-emphesis leading-48px">Create a Market</div>
          </CardHeader>
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
              showCommonBases={true}
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
              showCommonBases={true}
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
    </>
  )
}

const CreateLayout = ({ children }) => {
  const { i18n } = useLingui()
  return (
    <Layout
      left={
        <Card
          className="h-full bg-dark-900"
          backgroundImage="/deposit-graphic.png"
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

Create.Layout = CreateLayout

export default Create
