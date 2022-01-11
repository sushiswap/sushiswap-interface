import { ChevronDownIcon } from '@heroicons/react/solid'
import Popover from 'app/components/Popover'
import Typography from 'app/components/Typography'
import useBalancesMenuItems from 'app/features/trident/balances/context/useBalancesMenuItems'
import { classNames, shortenAddress } from 'app/functions'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import { useActiveWeb3React } from 'app/services/web3'
import Link from 'next/link'
import React, { FC, useState } from 'react'

interface HeaderDropdownProps {
  label: string
  hideAccount?: boolean
}

const HeaderDropdown: FC<HeaderDropdownProps> = ({ label, hideAccount = false }) => {
  const isDesktop = useDesktopMediaQuery()
  const { account } = useActiveWeb3React()
  const [show, setShow] = useState<boolean>(false)
  const items = useBalancesMenuItems()

  const content = (
    <div className="flex flex-col lg:flex-row text-left lg:items-baseline lg:gap-4" onClick={() => setShow(!show)}>
      <div className="flex gap-2 items-center">
        <Typography variant={isDesktop ? 'h1' : 'h2'} className="text-high-emphesis z-[2] py-4" weight={700}>
          {label}
        </Typography>
        <ChevronDownIcon
          width={32}
          className={classNames(show ? 'transform rotate-180' : '', 'text-high-emphesis', 'block lg:hidden')}
        />
      </div>
      {account && !hideAccount && (
        <Typography variant="sm" className="hidden lg:block text-secondary z-[2]">
          {shortenAddress(account)}
        </Typography>
      )}
    </div>
  )

  if (isDesktop) {
    return content
  }

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
        {content}
      </Popover>
    </>
  )
}

export default HeaderDropdown
