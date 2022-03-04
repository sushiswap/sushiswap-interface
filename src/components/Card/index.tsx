import { classNames } from 'app/functions/styling'
import React, { FC } from 'react'

// @ts-ignore TYPE NEEDS FIXING
function Header({ className, children }) {
  return (
    <div className={classNames('flex items-center rounded-t px-4 sm:px-8 py-4 sm:py-6', className)}>{children}</div>
  )
}

const Gradient: FC<{ className?: string }> = ({ children, className }) => {
  return (
    <div className="relative">
      <div
        className={classNames(
          'rounded pointer-events-none absolute w-full h-full bg-gradient-to-r from-opaque-blue to-opaque-pink opacity-40',
          className
        )}
      />
      {children}
    </div>
  )
}

type CardProps = {
  header?: React.ReactChild
  footer?: React.ReactChild
  backgroundImage?: string
  title?: string
  description?: string
} & React.HTMLAttributes<HTMLDivElement>

function Card({
  header = undefined,
  footer = undefined,
  backgroundImage = '',
  title = '',
  description = '',
  children,
  className,
}: CardProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        borderRadius: '10px',
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center bottom',
      }}
    >
      {header && <>{header}</>}

      <div className="px-2 py-4 sm:p-8">
        {title && <div className="mb-4 text-2xl text-high-emphesis">{title}</div>}
        {description && <div className="text-base text-secondary">{description}</div>}
        {children}
      </div>

      {footer && <>{footer}</>}
    </div>
  )
}

Card.Header = Header
Card.Gradient = Gradient

export default Card
