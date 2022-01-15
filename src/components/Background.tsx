import Image from 'app/components/Image'
import { classNames } from 'app/functions'
import { FC } from 'react'

export type BackgroundVariant =
  | 'miso-bowl'
  | 'bars'
  | 'bubble'
  | 'dots'
  | 'x-times-y-is-k'
  | 'wavy'
  | 'chevron'
  | 'binary'

enum ImageType {
  REPEAT,
  SINGLE,
}

export interface Background {
  variant: BackgroundVariant
}

const IMAGE_URL = {
  bars: {
    type: ImageType.REPEAT,
    url: '/images/trident/bars-pattern.png',
  },
  binary: {
    type: ImageType.REPEAT,
    url: '/images/trident/binary-pattern.png',
  },
  bubble: {
    type: ImageType.REPEAT,
    url: 'i/mages/trident/bubble-pattern.png',
  },
  dots: {
    type: ImageType.REPEAT,
    url: '/images/trident/dots-pattern.png',
  },
  'x-times-y-is-k': {
    type: ImageType.REPEAT,
    url: '/images/trident/x-times-y-is-k.png',
  },
  wavy: {
    type: ImageType.REPEAT,
    url: '/images/trident/wavy-pattern.png',
  },
  chevron: {
    type: ImageType.REPEAT,
    url: '/images/trident/chevron-pattern.png',
  },
  'miso-bowl': {
    type: ImageType.SINGLE,
    url: '/images/miso/banner.jpg',
  },
}

const Background: FC<Background> = ({ variant }) => {
  if (!variant) return <div className="absolute inset-0 bg-dark-900/30" />

  if (IMAGE_URL[variant].type === ImageType.REPEAT) {
    return (
      <div className={classNames('absolute inset-0 flex flex-col items-center', `bg-${variant}`)}>
        <div className="absolute inset-0 w-full h-full bg-dark-900/30 bg-opacity-80 z-0" />
      </div>
    )
  }

  return (
    <Image
      alt="background image"
      src={IMAGE_URL[variant].url}
      objectFit="cover"
      objectPosition="center"
      layout="fill"
    />
  )
}

export default Background
