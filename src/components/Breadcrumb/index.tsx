import { FC, ReactNode } from 'react'
import Typography from '../Typography'
import { ChevronRight } from 'react-feather'

interface BreadcrumbProps {
  breadcrumbs: string[]
}

const Breadcrumb: FC<BreadcrumbProps> = ({ breadcrumbs = [] }) => {
  return (
    <div className="w-full border-b border-dark-900 px-5 py-2 flex flex-row items-center bg-gradient-to-r from-transparent-blue to-transparent-pink">
      {breadcrumbs
        .map<ReactNode>((el, index) => (
          <Typography
            variant="xs"
            weight={400}
            key={el}
            className={index === breadcrumbs.length - 1 ? 'text-high-emphesis' : 'text-secondary'}
          >
            {el}
          </Typography>
        ))
        .reduce(
          (acc, x) =>
            acc === null ? (
              x
            ) : (
              <>
                {acc}{' '}
                <div className="px-1 text-secondary">
                  <ChevronRight width={12} height={12} strokeWidth={4} />
                </div>{' '}
                {x}
              </>
            ),
          null
        )}
    </div>
  )
}

export default Breadcrumb
