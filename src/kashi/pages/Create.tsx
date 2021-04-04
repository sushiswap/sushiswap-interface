import React, { useCallback, useState } from 'react'
import DepositGraphic from 'assets/kashi/deposit-graphic.png'
import { Card, Layout, LendCardHeader, BackButton, ListBox, GradientButton } from '../components'
import { getTokenIcon } from 'kashi/functions'

import { CHAINLINK_TOKENS, ChainlinkToken } from 'kashi/constants'
import { useActiveWeb3React } from 'hooks'

const CreatePair = () => {
  const { chainId } = useActiveWeb3React()
  const tokens: ChainlinkToken[] = CHAINLINK_TOKENS[chainId || 1] || []
  const [selectedCollateral, setSelectedCollateral] = useState(tokens[0])
  const [selectedAsset, setSelectedAsset] = useState(tokens[0])

  const handleCreate = useCallback(async () => {
    try {
      console.log('selectedCollateral:', selectedCollateral)
      console.log('selectedAsset:', selectedAsset)
      //const txHash = await createMarket()
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
            tokens={tokens}
            selectedToken={selectedCollateral}
            setSelectedToken={setSelectedCollateral}
          />
          <ListBox
            label={'Asset to Borrow (SHORT)'}
            tokens={tokens}
            selectedToken={selectedAsset}
            setSelectedToken={setSelectedAsset}
          />
          <GradientButton className="w-full rounded text-base text-high-emphesis px-4 py-3" onClick={handleCreate}>
            Create Market
          </GradientButton>
        </div>
      </Card>
    </Layout>
  )
}

export default CreatePair
