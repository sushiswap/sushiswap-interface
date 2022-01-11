import { CheckIcon } from '@heroicons/react/outline'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import Button from './index'

export default {
  title: 'SushiSwap/Button',
  component: Button,
  argTypes: {
    variant: ['filled', 'outlined', 'empty', 'link'],
    color: ['blue', 'pink', 'gradient', 'gray', 'default', 'red', 'green', 'white'],
    size: ['xs', 'sm', 'lg', 'default', 'none'],
    startIcon: <CheckIcon width={24} height={24} />,
    endIcon: <CheckIcon width={24} height={24} />,
  },
  args: {
    color: 'gradient',
  },
  parameters: {
    zeplinLink: [
      {
        name: 'Filled',
        link: 'zpl://components?coids=611ff993a092a45b18fd4bde&pid=611a9a71ba055432b5f4d870',
      },
      {
        name: 'Outlined',
        link: 'zpl://components?pid=611a9a71ba055432b5f4d870&coids=611ff99448e4fa14320e390b',
      },
    ],
  },
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args}>Button</Button>

export const Filled = Template.bind({})
Filled.args = {
  variant: 'filled',
}

export const Outlined = Template.bind({})
Outlined.args = {
  variant: 'outlined',
}

export const Empty = Template.bind({})
Empty.args = {
  variant: 'empty',
}

export const Link = Template.bind({})
Link.args = {
  variant: 'link',
}
