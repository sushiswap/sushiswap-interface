import { FC, useEffect, useState } from 'react'
import { ChevronRight } from 'react-feather'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Typography from '../../components/Typography'
import { useRecoilValue } from 'recoil'
import { poolAtom } from './context/atoms'
import { useLingui } from '@lingui/react'
import classNames from 'classnames'

// TODO: WIP
const Breadcrumb: FC = () => {
  const [breadcrumbs, setBreadcrumbs] = useState(null)
  const { i18n } = useLingui()
  const router = useRouter()
  const [, pool] = useRecoilValue(poolAtom)

  const routeMapping = {
    add: 'Add Liquidity',
    remove: 'Remove Liquidity',
  }

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split('/')
      linkPath.shift()
      linkPath.shift()

      const pathArray = linkPath.map((path, i) => {
        return { breadcrumb: path, href: '/' + linkPath.slice(0, i + 1).join('/') }
      })

      setBreadcrumbs(pathArray)
    }
  }, [router])

  if (!breadcrumbs) {
    return null
  }

  return (
    <div className="w-full border-b border-dark-900 px-5 py-2 flex flex-row items-center bg-gradient-to-r from-transparent-blue to-transparent-pink">
      {breadcrumbs
        .map((el, index) => (
          <Typography
            variant="xs"
            weight={400}
            key={el.breadcrumb}
            className={classNames(
              'capitalize',
              index === breadcrumbs.length - 1 ? 'text-high-emphesis' : 'text-secondary'
            )}
          >
            <Link href={el.href}>{routeMapping[el.breadcrumb] || el.breadcrumb}</Link>
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
