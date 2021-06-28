import React, { FC, memo, useCallback } from 'react'
import { LottieOptions, useLottie } from 'lottie-react'

const HoverLottie: FC<LottieOptions> = ({ autoplay, ...props }) => {
  const { View, play, setDirection } = useLottie({ autoplay: false, loop: false, ...props })

  const onMouseEnter = useCallback(() => {
    setDirection(1)
    play()
  }, [setDirection, play])

  const onMouseLeave = useCallback(() => {
    setDirection(-1)
    play()
  }, [play, setDirection])

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {View}
    </div>
  )
}

export default memo(HoverLottie)
