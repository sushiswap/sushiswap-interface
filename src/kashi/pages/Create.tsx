import React from 'react'
import DepositGraphic from 'assets/kashi/deposit-graphic.png'
import { Card, Layout, LendCardHeader, BackButton, ListBox, GradientButton } from '../components'
import { getTokenIcon } from 'kashi/functions'

const CreatePair = () => {
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
          <ListBox label={'Collateral (LONG)'} />
          <ListBox label={'Asset to Borrow (SHORT)'} />
          <GradientButton className="w-full rounded text-base text-high-emphesis px-4 py-3">
            Create Market
          </GradientButton>
        </div>
      </Card>
    </Layout>
  )
}

export default CreatePair
