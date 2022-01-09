import { useLingui } from '@lingui/react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ChainId, SUSHI, WETH9 } from '@sushiswap/core-sdk'
import { PoolType } from '@sushiswap/tines'
import { tryParseAmount } from 'app/functions'
import React from 'react'

import { Header } from './Header'

export default {
  title: 'SushiSwap/PoolLandingHeader',
  component: Header,
  parameters: {
    zeplinLink: [
      {
        name: 'Farm',
        link: 'zpl://components?coids=611ff995a7a01a14699d936c&pid=611a9a71ba055432b5f4d870',
      },
      {
        name: 'Pool',
        link: 'zpl://components?pid=611a9a71ba055432b5f4d870&coids=611ff995e80314559426ffdb',
      },
    ],
  },
} as ComponentMeta<typeof Header>

const Template: ComponentStory<typeof Header> = (args) => {
  const { i18n } = useLingui()
  return <Header {...args} i18n={i18n} />
}

export const Pool = Template.bind({})
Pool.args = {
  pool: {
    type: PoolType.ConstantProduct,
    amounts: [tryParseAmount('1000', SUSHI[ChainId.ETHEREUM]), tryParseAmount('3.66', WETH9[ChainId.ETHEREUM])],
    tokens: [SUSHI[ChainId.ETHEREUM], WETH9[ChainId.ETHEREUM]],
    apy: '37.8',
    tvl: '$1,534,443.08',
    fee: '0.3%',
    isFarm: false,
  },
}

export const Farm = Template.bind({})
Farm.args = {
  pool: {
    type: PoolType.ConstantProduct,
    amounts: [tryParseAmount('1000', SUSHI[ChainId.ETHEREUM]), tryParseAmount('3.66', WETH9[ChainId.ETHEREUM])],
    tokens: [SUSHI[ChainId.ETHEREUM], WETH9[ChainId.ETHEREUM]],
    apy: '37.8',
    tvl: '$1,534,443.08',
    fee: '0.3%',
    isFarm: true,
  },
}
