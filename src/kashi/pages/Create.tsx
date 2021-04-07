import React, { useCallback, useState } from 'react'
import DepositGraphic from 'assets/kashi/deposit-graphic.png'
import { Card, Layout, LendCardHeader, BackButton, ListBox, GradientButton } from '../components'
import { getTokenIcon } from 'kashi/functions'

import {
  CHAINLINK_TOKENS,
  ChainlinkToken,
  CHAINLINK_MAPPING,
  CHAINLINK_ORACLE_ADDRESS,
  KASHI_ADDRESS
} from 'kashi/constants'
import { useActiveWeb3React } from 'hooks'
import { ethers } from 'ethers'
import { e10 } from 'kashi/functions/math'
import { useBentoBoxContract } from 'sushi-hooks/useContract'

const CreatePair = () => {
  const { chainId } = useActiveWeb3React()
  const bentoBoxContract = useBentoBoxContract()

  const tokens: ChainlinkToken[] = CHAINLINK_TOKENS[chainId || 1] || []
  const [selectedCollateral, setSelectedCollateral] = useState({ name: 'Select a token', address: '0', decimals: 0 }) //useState(tokens[0])
  const [selectedAsset, setSelectedAsset] = useState({ name: 'Select a token', address: '0', decimals: 0 }) //useState(tokens[1])

  const collateralTokens = tokens.filter((token: any) => {
    return token !== selectedAsset
  })
  const assetTokens = tokens.filter((token: any) => {
    return token !== selectedCollateral
  })

  const handleCreate = async () => {
    try {
      let mapping = CHAINLINK_MAPPING[chainId || 1] || {}
      for (let address in mapping) {
        mapping[address].address = address
      }

      let multiply = ethers.constants.AddressZero
      let divide = ethers.constants.AddressZero
      let multiplyMatches = Object.values(mapping).filter(
        m => m.from == selectedAsset.address && m.to == selectedCollateral.address
      )
      let oracleData = ''
      let decimals = 0
      if (multiplyMatches.length) {
        const match = multiplyMatches[0]
        multiply = match.address!
        decimals = 18 + match.decimals - match.toDecimals + match.fromDecimals
      } else {
        let divideMatches = Object.values(mapping).filter(
          m => m.from == selectedCollateral.address && m.to == selectedAsset.address
        )
        if (divideMatches.length) {
          const match = divideMatches[0]
          divide = match.address!
          decimals = 36 - match.decimals - match.toDecimals + match.fromDecimals
        } else {
          const mapFrom = Object.values(mapping).filter(m => m.from == selectedAsset.address)
          const mapTo = Object.values(mapping).filter(m => m.from == selectedCollateral.address)
          const match = mapFrom
            .map(mfrom => ({ mfrom: mfrom, mto: mapTo.filter(mto => mfrom.to == mto.to) }))
            .filter(path => path.mto.length)
          if (match.length) {
            console.log('FOUND', match[0].mfrom, match[0].mto[0])
            multiply = match[0].mfrom.address!
            divide = match[0].mto[0].address!
            decimals =
              18 +
              match[0].mfrom.decimals -
              match[0].mto[0].decimals -
              selectedCollateral.decimals +
              selectedAsset.decimals
          } else {
            console.log('No path')
            return
          }
        }
      }
      oracleData = ethers.utils.defaultAbiCoder.encode(
        ['address', 'address', 'uint256'],
        [multiply, divide, e10(decimals)]
      )

      const kashiData = ethers.utils.defaultAbiCoder.encode(
        ['address', 'address', 'address', 'bytes'],
        [selectedCollateral.address, selectedAsset.address, CHAINLINK_ORACLE_ADDRESS, oracleData]
      )
      await bentoBoxContract?.deploy(KASHI_ADDRESS, kashiData, true)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Layout
      left={
        <Card
          className="h-full bg-dark-900"
          backgroundImage={DepositGraphic}
          title={'Create a new Kashi Market'}
          description={
            'If you want to supply to a market that is not listed yet, you can use this tool to create a new pair based on Chainlink oracles.'
          }
        />
      }
    >
      <Card
        className="h-full bg-dark-900"
        header={
          <LendCardHeader>
            <div className="flex items-center">
              <BackButton defaultRoute={'/bento/kashi/lend'} />
              <div className="text-3xl text-high-emphesis">Create a Market</div>
            </div>
          </LendCardHeader>
        }
      >
        <div className="space-y-6">
          <ListBox
            label={'Collateral (LONG)'}
            tokens={collateralTokens}
            selectedToken={selectedCollateral}
            setSelectedToken={setSelectedCollateral}
          />
          <ListBox
            label={'Asset to Borrow (SHORT)'}
            tokens={assetTokens}
            selectedToken={selectedAsset}
            setSelectedToken={setSelectedAsset}
          />
          <GradientButton
            className="w-full rounded text-base text-high-emphesis px-4 py-3"
            onClick={() => handleCreate()}
            disabled={
              selectedCollateral === { name: 'Select a token', address: '0', decimals: 0 } ||
              selectedAsset === { name: 'Select a token', address: '0', decimals: 0 }
            }
          >
            Create Market
          </GradientButton>
        </div>
      </Card>
    </Layout>
  )
}

export default CreatePair
