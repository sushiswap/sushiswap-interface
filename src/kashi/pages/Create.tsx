import React, { useCallback, useState } from 'react'
import DepositGraphic from 'assets/kashi/deposit-graphic.png'
import { Card, Layout, LendCardHeader, BackButton, ListBox, GradientButton } from '../components'
import { getTokenIcon } from 'kashi/functions'

import { CHAINLINK_TOKENS, ChainlinkToken } from 'kashi/constants'
import { useActiveWeb3React } from 'hooks'

const CreatePair = () => {
  const { chainId } = useActiveWeb3React()
  const tokens: ChainlinkToken[] = CHAINLINK_TOKENS[chainId || 1] || []
  const [selectedCollateral, setSelectedCollateral] = useState({ name: 'Select a token', address: '0' }) //useState(tokens[0])
  const [selectedAsset, setSelectedAsset] = useState({ name: 'Select a token', address: '0' }) //useState(tokens[1])

  const collateralTokens = tokens.filter((token: any) => {
    return token !== selectedAsset
  })
  //console.log('collateralTokens:', collateralTokens)
  const assetTokens = tokens.filter((token: any) => {
    return token !== selectedCollateral
  })
  //console.log('assetTokens:', assetTokens)

  const handleCreate = useCallback(async (collateral, asset) => {
    try {
      console.log('collateral:', collateral)
      console.log('asset:', asset)
      //const txHash = await createMarket(collateral, asset)
    } catch (e) {
      console.log(e)
    }
  }, [])
  //}, [createMarket])

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
            onClick={() => handleCreate(selectedCollateral, selectedAsset)}
            disabled={
              selectedCollateral === { name: 'Select a token', address: '0' } ||
              selectedAsset === { name: 'Select a token', address: '0' }
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
