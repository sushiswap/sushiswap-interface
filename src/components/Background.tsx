import Image from 'app/components/Image'
import { FC } from 'react'

interface Background {
  variant: 'miso-bowl' | 'bars' | 'bubble' | 'dots' | 'x-times-y-is-k' | 'wavy' | 'chevron'
}

const IMAGE_URL = {
  bars: '/images/trident/bars-pattern.png',
  binary: '/images/trident/binary-pattern.png',
  bubble: 'i/mages/trident/bubble-pattern.png',
  dots: '/images/trident/dots-pattern.png',
  'x-times-y-is-k': '/images/trident/x-times-y-is-k.png',
  wavy: '/images/trident/wavy-pattern.png',
  chevron: '/images/trident/chevron-pattern.png',
  'miso-bowl': '/images/miso/banner.jpg',
}

const Background: FC<Background> = ({ variant }) => {
  return (
    <Image alt="background image" src={IMAGE_URL[variant]} objectFit="cover" objectPosition="center" layout="fill" />
  )
}

export default Background
