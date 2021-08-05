import { isMobile } from 'react-device-detect'
import { FC } from 'react'
import { classNames } from '../../functions'

const DoubleGlowShadow: FC<{ className?: string }> = ({ children, className }) => {
  if (isMobile) {
    return <div className="shadow-swap">{children}</div>
  }

  return (
    <div className={classNames(className, 'relative w-full max-w-2xl')}>
      <div className="absolute top-1/4 -left-10 bg-blue bottom-4 w-3/5 rounded-full z-0 filter blur-[150px]" />
      <div className="absolute bottom-1/4 -right-10 bg-pink top-4 w-3/5 rounded-full z-0  filter blur-[150px]" />
      <div className="relative filter drop-shadow">{children}</div>
    </div>
  )
}

export default DoubleGlowShadow
