import React from 'react'
import { useActiveWeb3React } from 'hooks'
import useTheme from 'hooks/useTheme'
import DepositGraphic from 'assets/kashi/deposit-graphic.png'
import { Card, Layout, LendCardHeader, BackButton, ListBox } from '../components'
import { getTokenIcon } from 'kashi/functions'

const CreatePair = () => {
  const { account, chainId } = useActiveWeb3React()
  const theme = useTheme()
  return (
    <Layout
      left={
        <Card
          backgroundImage={DepositGraphic}
          title={'Create a new Kashi Market'}
          description={
            'If you want to supply to a market that is not listed yet, you can use this tool to create a new pair based on Chainlink oracles.'
          }
        />
      }
    >
      <Card
        header={
          <LendCardHeader>
            <div className="flex items-center">
              <div className="flex space-x-2 mr-4"></div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <BackButton defaultRoute={'/bento/kashi/lend'} />
                  <div className="text-3xl text-high-emphesis">Create a Market</div>
                </div>
              </div>
            </div>
          </LendCardHeader>
        }
      >
        <div className="space-y-6">
          <ListBox label={'Collateral (LONG)'} />
          <label className="block pb-4">
            <span className="text-gray-700 pb-2">Collateral (LONG)</span>
            <select className="form-select block w-full mt-1 rounded bg-background border-none py-4 px-6">
              <option className="flex">
                <img
                  src={getTokenIcon('0x6B3595068778DD592e39A122f4f5a5cF09C90fE2')}
                  className="block w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
                  alt=""
                />
                Option 1
              </option>
              <option>Option 2</option>
            </select>
          </label>
          <label className="block pb-4">
            <span className="text-gray-700 pb-2">Asset to Borrow (SHORT)</span>
            <select className="form-select block w-full mt-1 rounded bg-background border-none py-4 px-6">
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
          </label>
        </div>
      </Card>
    </Layout>
  )
}

export default CreatePair
