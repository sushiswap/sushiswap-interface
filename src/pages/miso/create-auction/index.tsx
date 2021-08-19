import Head from 'next/head'
import React from 'react'

import Layout from '../../../layouts/Miso'
import childrenWithProps from '../../../layouts/Miso/children'

function CreateAuction() {
  return (
    <>
      <Head>
        <title>MISO | Sushi</title>
        <meta key="description" name="description" content="MISO by Sushi, an initial Sushi offering on steroids ..." />
      </Head>
      <div></div>
    </>
  )
}

const CreateAuctionLayout = ({ children }) => {
  return (
    <Layout
      navs={[
        { link: '/miso', name: 'MISO Launchpad' },
        { link: '/miso/create-auction', name: 'Create Auction' },
      ]}
      title={{
        heading: 'Create Auction',
        content: 'Follow the instructions below, and deploy your auction with MISO.',
      }}
    >
      {childrenWithProps(children)}
    </Layout>
  )
}
CreateAuction.Layout = CreateAuctionLayout

export default CreateAuction
