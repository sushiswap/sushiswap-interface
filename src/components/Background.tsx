import Image from 'next/image'
import { FC } from 'react'

interface Background {
  variant: 'miso-bowl' | 'bars' | 'bubble' | 'dots' | 'x-times-y-is-k' | 'wavy' | 'chevron'
}

const IMAGE_URL = {
  'bars-pattern': '/images/trident/bars-pattern.png',
  'binary-pattern': '/images/trident/binary-pattern.png',
  'bubble-pattern': 'i/mages/trident/bubble-pattern.png',
  'dots-pattern': '/images/trident/dots-pattern.png',
  'x-times-y-is-k': '/images/trident/x-times-y-is-k.png',
  'wavy-pattern': '/images/trident/wavy-pattern.png',
  'chevron-pattern': '/images/trident/chevron-pattern.png',
  'miso-bowl': '/images/miso/banner.jpg',
}

const Background: FC<Background> = ({ variant }) => {
  return (
    <Image alt="background image" src={IMAGE_URL[variant]} objectFit="cover" objectPosition="center" layout="fill" />
  )
}

export default Background
