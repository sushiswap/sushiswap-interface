import Davatar from '@davatar/react'
import { LinkIcon } from '@heroicons/react/outline'
import CopyHelper from 'app/components/AccountDetails/Copy'
import Typography from 'app/components/Typography'
import { BalancesSum } from 'app/features/portfolio/BalancesSum'
import { getExplorerLink, shortenAddress } from 'app/functions'
import useENSName from 'app/hooks/useENSName'
import { useActiveWeb3React } from 'app/services/web3'
import Link from 'next/link'
import React, { FC, useState } from 'react'
import Identicon from 'react-blockies'

interface HeaderDropdownProps {
  hideAccount?: boolean
  account: string
}

const HeaderDropdown: FC<HeaderDropdownProps> = ({ account, hideAccount = false }) => {
  const { library, chainId } = useActiveWeb3React()
  const [show, setShow] = useState<boolean>(false)
  const { ENSName } = useENSName(account ?? undefined)

  return (
    <>
      <div className="flex items-center gap-4" onClick={() => setShow(!show)}>
        {account && (
          <div className="border-2 rounded-full">
            <Davatar
              size={64}
              address={account}
              defaultComponent={<Identicon seed={account} size={16} className="rounded-full" />}
              provider={library}
            />
          </div>
        )}
        <div className="flex flex-col">
          {account && (
            <Link href={getExplorerLink(chainId, account, 'address')} passHref={true}>
              <a target="_blank">
                <Typography
                  variant="h3"
                  className="text-high-emphesis flex gap-1 cursor-pointer hover:text-blue-100"
                  weight={700}
                >
                  {ENSName ? ENSName : account ? shortenAddress(account) : ''} <LinkIcon width={20} />
                </Typography>
              </a>
            </Link>
          )}
          {account && !hideAccount && (
            <CopyHelper toCopy={account} className="opacity-100 text-primary">
              {shortenAddress(account)}
            </CopyHelper>
          )}
        </div>
      </div>
      <BalancesSum account={account} />
    </>
  )
}

export default HeaderDropdown
