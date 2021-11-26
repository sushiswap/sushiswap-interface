import { ChevronDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Popover from 'app/components/Popover'
import Typography from 'app/components/Typography'
import { BREADCRUMBS, BreadcrumbTuple } from 'app/features/trident/Breadcrumb'
import { classNames, shortenAddress } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import Link from 'next/link'
import React, { FC, useState } from 'react'

interface HeaderDropdownProps {
  label: string
}

const HeaderDropdown: FC<HeaderDropdownProps> = ({ label }) => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const [show, setShow] = useState<boolean>(false)

  const items = [
    {
      label: i18n._(t`Wallet`),
      icon: (
        <svg width="20" height="20" viewBox="0 0 43 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M37.6022 31.099H3.39382C1.97809 31.099 0.827545 29.9484 0.827545 28.5327V2.56627C0.827545 1.15055 1.97809 0 3.39382 0H37.6022C39.018 0 40.1685 1.15055 40.1685 2.56627V8.3575H27.8889C26.9693 8.3575 26.0711 8.54141 25.2285 8.89641C24.4159 9.23859 23.6845 9.73473 23.06 10.3592C22.4356 10.9837 21.9394 11.715 21.5973 12.5277C21.238 13.3703 21.0583 14.2685 21.0583 15.1881V15.9109C21.0583 16.8305 21.2423 17.7287 21.5973 18.5713C21.9394 19.3839 22.4356 20.1153 23.06 20.7398C23.6845 21.3642 24.4159 21.8604 25.2285 22.2025C26.0711 22.5619 26.9693 22.7415 27.8889 22.7415H40.1685V28.5327C40.1685 29.9484 39.018 31.099 37.6022 31.099ZM41.0753 10.924C42.1403 10.924 43 11.7838 43 12.8488V18.2507C43 19.3157 42.1403 20.1754 41.0753 20.1754H40.1685H27.8889C25.5322 20.1754 23.6246 18.2679 23.6246 15.9112V15.1883C23.6246 12.8316 25.5322 10.924 27.8889 10.924H40.1685H41.0753ZM26.3192 15.5476C26.3192 16.8009 27.3329 17.8145 28.5861 17.8145C29.8393 17.8145 30.853 16.8009 30.853 15.5476C30.853 14.2944 29.8393 13.2807 28.5861 13.2807C27.3329 13.2807 26.3192 14.2944 26.3192 15.5476Z"
            fill="#currentColor"
          />
        </svg>
      ),
      link: (BREADCRUMBS['wallet'] as BreadcrumbTuple).link,
    },
    {
      label: i18n._(t`BentoBox`),
      icon: (
        <svg width="20" height="20" viewBox="0 0 42 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M41.2889 30.3349L39.2614 1.09591C39.2232 0.533741 38.7295 0.111781 38.1797 0.149292C37.6465 0.187037 37.2385 0.632858 37.2367 1.1625C37.2343 0.601106 36.7719 0.146973 36.2024 0.146973C35.6314 0.146973 35.168 0.603511 35.168 1.16696V30.406C35.168 30.9694 35.6314 31.426 36.2024 31.426C36.7734 31.426 37.2367 30.9694 37.2367 30.406V1.17169C37.2369 1.19366 37.2377 1.21577 37.2392 1.23801L39.2667 30.477C39.3037 31.0149 39.7492 31.426 40.2765 31.426C40.8692 31.4259 41.3296 30.922 41.2889 30.3349ZM11.9733 0.146973H27.1704C29.4558 0.146973 31.315 2.00617 31.3149 4.29161V17.6465H20.2626V13.5019C20.2626 11.2164 18.4034 9.35723 16.1179 9.35723H11.9733V0.146973ZM16.1179 12.1205H11.9733V17.6467H17.4995V13.5021C17.4995 12.7403 16.8797 12.1205 16.1179 12.1205ZM0 27.3174V20.4097H14.7365V31.462H4.14463C1.8592 31.462 0 29.6028 0 27.3174ZM17.4995 20.4097V31.462H27.1704C29.4558 31.462 31.315 29.6028 31.315 27.3174V20.4097H17.4995ZM0 4.29161C0 2.00617 1.8592 0.146973 4.14463 0.146973H9.21026V17.6465H0V4.29161Z"
            fill="currentColor"
          />
        </svg>
      ),
      link: (BREADCRUMBS['bentobox'] as BreadcrumbTuple).link,
    },
    {
      label: i18n._(t`Liquidity Pools`),
      link: (BREADCRUMBS['liquidity'] as BreadcrumbTuple).link,
    },
  ]

  return (
    <>
      {show && <div className="fixed inset-0 top-[106px] bg-black/75 pointer-events-none" />}
      <Popover
        placement="bottom-start"
        show={show}
        content={
          <div className="flex flex-col space-y-3 w-[calc(100vw-40px)] mt-2">
            {items.map((el, index) => (
              <Link href={el.link ?? ''} key={index} passHref={true}>
                <div className="border border-dark-700 bg-dark-900 hover:bg-dark-800 rounded p-3 shadow-lg w-full cursor-pointer">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full border-[3px] border-transparent border-gradient-r-blue-pink-dark-900 flex items-center justify-center">
                      {el.icon}
                    </div>
                    <Typography variant="lg" className="text-high-emphesis" weight={700}>
                      {el.label}
                    </Typography>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        }
      >
        <div className="flex flex-col text-left" onClick={() => setShow(!show)}>
          <div className="flex gap-2 items-center">
            <Typography variant="h2" className="text-high-emphesis z-[2]" weight={700}>
              {label}
            </Typography>
            <ChevronDownIcon
              width={32}
              className={classNames(show ? 'transform rotate-180' : '', 'text-high-emphesis')}
            />
          </div>
          {account && (
            <Typography variant="sm" className="text-secondary z-[2]">
              {shortenAddress(account)}
            </Typography>
          )}
        </div>
      </Popover>
    </>
  )
}

export default HeaderDropdown
