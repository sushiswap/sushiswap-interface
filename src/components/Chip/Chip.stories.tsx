import { QuestionMarkCircleIcon } from '@heroicons/react/solid'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import Chip from './index'

export default {
  title: 'SushiSwap/Chip',
  component: Chip,
  argTypes: {
    variant: ['filled'],
    color: ['default', 'purple', 'yellow', 'blue', 'green', 'white', 'pink'],
    size: ['default', 'sm'],
  },
  args: {
    variant: 'filled',
  },
  parameters: {
    zeplinLink: [
      {
        name: 'Classic, Header Tutorial',
        link: 'zpl://components?coids=611ff993a092a45b18fd4bde&pid=611a9a71ba055432b5f4d870',
      },
      {
        name: 'Classic, Descriptor',
        link: 'zpl://components?coids=611ff99448e4fa14320e390b&pid=611a9a71ba055432b5f4d870',
      },
      {
        name: 'Multi-Asset, Header Tutorial',
        link: 'zpl://components?pid=611a9a71ba055432b5f4d870&coids=611ff99426479b5b3e9b0473',
      },
      {
        name: 'Multi-Asset, Descriptor',
        link: 'zpl://components?coids=611ff9931ddc8658f502ac53&pid=611a9a71ba055432b5f4d870',
      },
      {
        name: 'Concentrated, Header Tutorial',
        link: 'zpl://components?coids=611ff99544f103160f4cde3a&pid=611a9a71ba055432b5f4d870',
      },
      {
        name: 'Concentrated, Descriptor',
        link: 'zpl://components?coids=611ff995f6040c15a315a2d2&pid=611a9a71ba055432b5f4d870',
      },
      {
        name: 'Index, Header Tutorial',
        link: 'zpl://components?pid=611a9a71ba055432b5f4d870&coids=611ff9940d904456d2fce07b',
      },
      {
        name: 'Index, Descriptor',
        link: 'zpl://components?pid=611a9a71ba055432b5f4d870&coids=611ff994953fc55bfd16ccd0',
      },
    ],
  },
} as ComponentMeta<typeof Chip>

const Template: ComponentStory<typeof Chip> = (args) => <Chip {...args} />

export const Purple = Template.bind({})
Purple.args = {
  color: 'purple',
  label: 'Classic Pool',
  onClick: null,
}

export const Yellow = Template.bind({})
Yellow.args = {
  color: 'yellow',
  label: 'Multi-Asset Pool',
  endIcon: <QuestionMarkCircleIcon className="text-high-emphesis" width={12} height={12} strokeWidth={5} />,
}

export const Pink = Template.bind({})
Pink.args = {
  color: 'pink',
  label: 'Concentrated Pool',
}

export const Green = Template.bind({})
Green.args = {
  color: 'green',
  label: 'Green Chip',
}

export const Blue = Template.bind({})
Blue.args = {
  color: 'blue',
  label: 'Index Pool',
}

export const White = Template.bind({})
White.args = {
  color: 'white',
  label: '70%',
  onClick: null,
}
