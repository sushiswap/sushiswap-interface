import { QuestionMarkCircleIcon as SolidQuestionMarkCircleIcon } from '@heroicons/react/solid'
import { classNames } from 'app/functions'
import React, { FC, ReactElement, ReactNode, useCallback, useState } from 'react'

import Tooltip from '../Tooltip'

const QuestionHelper: FC<{ text?: any; icon?: ReactNode; children?: ReactElement }> = ({
  children,
  text,
  icon = <SolidQuestionMarkCircleIcon width={16} height={16} />,
}) => {
  const [show, setShow] = useState<boolean>(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  if (children) {
    return (
      <Tooltip text={text} show={show}>
        {React.cloneElement(children, {
          className: classNames(children.props.className, 'flex items-center justify-center w-full outline-none'),
          onClick: open,
          onMouseEnter: open,
          onMouseLeave: close,
        })}
      </Tooltip>
    )
  }

  return (
    <span className="ml-1">
      <Tooltip text={text} show={show}>
        <div
          className="flex items-center justify-center outline-none cursor-help hover:text-primary"
          onClick={open}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          {icon}
        </div>
      </Tooltip>
    </span>
  )
}

export default QuestionHelper
