import { classNames } from 'app/functions'
import { FC } from 'react'
import { isMobile } from 'react-device-detect'

const DoubleGlowShadow: FC<{ className?: string }> = ({ children, className }) => {
  if (isMobile) {
    return <div className="shadow-swap">{children}</div>
  }

  return (
    <div className={classNames(className, 'relative w-full max-w-2xl')}>
      <div className="fixed inset-0 bg-gradient-radial from-pink/5 to-blue/5" />
      <div className="relative filter drop-shadow">{children}</div>
    </div>
  )
}

export default DoubleGlowShadow
