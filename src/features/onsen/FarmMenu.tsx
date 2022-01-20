import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId } from '@sushiswap/core-sdk'
import NavLink from 'app/components/NavLink'
import Typography from 'app/components/Typography'
import { useActiveWeb3React } from 'app/services/web3'
import { useWalletModalToggle } from 'app/state/application/hooks'
import React, { FC, Fragment, ReactNode, useMemo, useState } from 'react'

const MenuLink: FC<{ href?: string; label: string; onClick?(): void }> = ({ href, label, onClick }) => {
  if (onClick) {
    return (
      <Menu.Item>
        {({ active }) => {
          return (
            <Typography variant="sm" weight={700} onClick={onClick} className={active ? 'text-white' : 'text-primary'}>
              {label}
            </Typography>
          )
        }}
      </Menu.Item>
    )
  }

  if (href) {
    return (
      <Menu.Item>
        {({ active }) => {
          return (
            <NavLink exact href={href}>
              <Typography
                variant="sm"
                weight={700}
                onClick={onClick}
                className={active ? 'text-white' : 'text-primary'}
              >
                {label}
              </Typography>
            </NavLink>
          )
        }}
      </Menu.Item>
    )
  }

  return <></>
}

enum FarmFilter {
  All = 'All Farms',
  Portfolio = 'Your Farms',
  Kashi = 'Kashi Farms',
  Sushi = 'Sushi Farms',
  Old = 'Old Farms',
}

const OnsenFilter = () => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const [selected, setSelected] = useState<FarmFilter>(FarmFilter.All)

  const items = useMemo(() => {
    const map: Record<string, ReactNode> = {
      [FarmFilter.All]: <MenuLink href={'/farm'} label={i18n._(t`All Farms`)} />,
      [FarmFilter.Portfolio]: account ? (
        <MenuLink href={'/farm?filter=portfolio'} label={i18n._(t`Your Farms`)} />
      ) : (
        <MenuLink onClick={toggleWalletModal} label={i18n._(t`Your Farms`)} />
      ),
      [FarmFilter.Kashi]:
        chainId === ChainId.ETHEREUM ? (
          <MenuLink href={'/farm?filter=kashi'} label={i18n._(t`Kashi Farms`)} />
        ) : undefined,
      [FarmFilter.Sushi]:
        chainId === ChainId.ETHEREUM ? (
          <MenuLink href={'/farm?filter=sushi'} label={i18n._(t`SushiSwap Farms`)} />
        ) : undefined,
      [FarmFilter.Old]: [ChainId.CELO].includes(chainId) ? (
        <MenuLink href={'/farm?filter=old'} label={i18n._(t`Old Farms`)} />
      ) : undefined,
    }

    return Object.entries(map).reduce<Record<string, ReactNode>>((acc, [k, v]) => {
      if (v && selected !== k) acc[k] = v
      return acc
    }, {})
  }, [account, chainId, i18n, selected, toggleWalletModal])

  return (
    <div className="flex gap-2 items-center w-[180px]">
      <Menu as="div" className="relative inline-block w-full text-left">
        <div>
          <Menu.Button className="w-full px-4 py-2.5 text-sm font-bold bg-transparent border rounded shadow-sm text-primary border-dark-800 hover:bg-dark-900">
            <div className="flex flex-row items-center justify-between">
              <Typography weight={700} variant="sm">
                {selected}
              </Typography>
              <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
            </div>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            static
            className="absolute w-full mt-2 border divide-y rounded shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border-dark-900 bg-dark-1000 divide-dark-900"
          >
            {Object.entries(items).map(([k, v], index) => (
              <div
                key={index}
                onClick={() => setSelected(k as FarmFilter)}
                className="px-3 py-2 cursor-pointer hover:bg-dark-900/40"
              >
                {v}
              </div>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default OnsenFilter
