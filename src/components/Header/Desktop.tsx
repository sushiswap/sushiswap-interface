import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { NATIVE } from '@sushiswap/core-sdk'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import Container from 'app/components/Container'
import useMenu, { MenuItem, MenuItemLeaf, MenuItemNode } from 'app/components/Header/useMenu'
import LanguageSwitch from 'app/components/LanguageSwitch'
import Typography from 'app/components/Typography'
import Web3Network from 'app/components/Web3Network'
import Web3Status from 'app/components/Web3Status'
import { classNames } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useETHBalances } from 'app/state/wallet/hooks'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, Fragment, useCallback, useRef } from 'react'

const HEADER_HEIGHT = 64

const Desktop: FC = () => {
  const menu = useMenu()
  const { account, chainId, library, connector } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  const isCbWallet =
    connector instanceof WalletLinkConnector ||
    (connector instanceof InjectedConnector && window.walletLinkExtension) ||
    window?.ethereum?.isCoinbaseWallet

  return (
    <>
      <header className="fixed z-20 w-full hidden lg:block" style={{ height: HEADER_HEIGHT }}>
        <nav
          className={classNames(
            'before:backdrop-blur-[20px] before:z-[-1] before:absolute before:w-full before:h-full bg-white bg-opacity-[0.03] border-b border-[rgba(255,255,255,0.12)]',
            'w-full'
          )}
        >
          <Container maxWidth="7xl" className="mx-auto">
            <div className="flex gap-4 px-6 items-center justify-between">
              <div className="flex gap-4">
                <div className="flex w-6 mr-4 items-center">
                  <Image src="https://app.sushi.com/images/logo.svg" alt="Sushi logo" width="24px" height="24px" />
                </div>
                {menu.map((node) => {
                  return <NavigationItem node={node} key={node.key} />
                })}
              </div>
              <div className="flex items-center justify-end gap-2">
                {library && (library.provider.isMetaMask || isCbWallet) && (
                  <div className="hidden sm:inline-block">
                    <Web3Network />
                  </div>
                )}

                <div className="flex items-center w-auto text-sm font-bold border-2 rounded shadow cursor-pointer pointer-events-auto select-none border-dark-800 hover:border-dark-700 bg-dark-900 whitespace-nowrap">
                  {account && chainId && userEthBalance && (
                    <Link href="/balances" passHref={true}>
                      <a className="hidden px-3 text-high-emphesis text-bold md:block">
                        {/*@ts-ignore*/}
                        {userEthBalance?.toSignificant(4)} {NATIVE[chainId || 1].symbol}
                      </a>
                    </Link>
                  )}
                  <Web3Status />
                </div>
                <div className="hidden lg:flex">
                  <LanguageSwitch />
                </div>
              </div>
            </div>
          </Container>
        </nav>
      </header>
      <div style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }} />
    </>
  )
}

interface NavigationItem {
  node: MenuItem
}

const NavigationItem: FC<NavigationItem> = ({ node }) => {
  const router = useRouter()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleToggle = useCallback((open, type) => {
    if (!open && type === 'enter') {
      buttonRef?.current?.click()
    } else if (open && type === 'leave') {
      buttonRef?.current?.click()
    }
  }, [])

  if (node && node.hasOwnProperty('link')) {
    const { link } = node as MenuItemLeaf
    return (
      <Typography
        onClick={() => router.push(link)}
        weight={700}
        variant="sm"
        className={classNames(
          router.asPath === link ? 'text-white' : '',
          'hover:text-white font-bold py-5 px-2 rounded'
        )}
      >
        {node.title}
      </Typography>
    )
  }

  return (
    <Popover key={node.key} className="flex relative">
      {({ open }) => (
        <div onMouseEnter={() => handleToggle(open, 'enter')} onMouseLeave={() => handleToggle(open, 'leave')}>
          <Popover.Button ref={buttonRef}>
            <Typography
              weight={700}
              variant="sm"
              className={classNames(open ? 'text-white' : '', 'font-bold py-5 px-2 rounded flex gap-1 items-center')}
            >
              {node.title}
              <ChevronDownIcon strokeWidth={5} width={12} />
            </Typography>
          </Popover.Button>
          {node.hasOwnProperty('items') && (
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Popover.Panel className="w-full absolute w-40 translate-y-[-8px] translate-x-[-8px]">
                <div className="shadow-md shadow-black/40 before:z-[-1] border border-dark-700 rounded before:rounded overflow-hidden before:absolute before:w-full before:h-full before:content-[''] before:backdrop-blur-[20px] bg-white bg-opacity-[0.02]">
                  {(node as MenuItemNode).items.map((leaf) => (
                    <Typography
                      variant="sm"
                      weight={700}
                      key={leaf.key}
                      onClick={() => {
                        router.push(leaf.link).then(() => buttonRef?.current?.click())
                      }}
                      className="relative px-3 py-2 hover:cursor-pointer hover:text-white m-1 rounded-lg hover:bg-white/10"
                    >
                      {leaf.title}
                    </Typography>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          )}
        </div>
      )}
    </Popover>
  )
}

export default Desktop
