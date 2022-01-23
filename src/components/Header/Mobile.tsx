import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { MenuIcon } from '@heroicons/react/outline'
import { NATIVE } from '@sushiswap/core-sdk'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import useMenu, { MenuItemLeaf, MenuItemNode } from 'app/components/Header/useMenu'
import Typography from 'app/components/Typography'
import Web3Network from 'app/components/Web3Network'
import Web3Status from 'app/components/Web3Status'
import { classNames } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useETHBalances } from 'app/state/wallet/hooks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, Fragment, useState } from 'react'

const Mobile: FC = () => {
  const menu = useMenu()
  const router = useRouter()
  const { account, chainId, library, connector } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [open, setOpen] = useState(true)

  const isCbWallet =
    connector instanceof WalletLinkConnector ||
    (connector instanceof InjectedConnector && window.walletLinkExtension) ||
    window?.ethereum?.isCoinbaseWallet

  return (
    <>
      <header className="fixed z-20 w-full flex items-center" style={{ height: 64 }}>
        <div className="p-2 hover:bg-white/10 rounded-full">
          <MenuIcon
            width={22}
            className="hover:text-white text-high-emphesis cursor-pointer"
            onClick={() => setOpen(true)}
          />
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
        </div>
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 overflow-hidden z-[100]" onClose={setOpen}>
            <div className="absolute inset-0 overflow-hidden">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="absolute inset-0 bg-dark-1000 bg-opacity-80 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-y-0 left-0 pr-10 max-w-full flex">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-[-100%]"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-[-100%]"
                >
                  <div className="w-screen max-w-md">
                    <div className="h-full flex flex-col py-6 bg-dark-900 shadow-xl overflow-y-scroll">
                      <nav className="flex-1 px-2 space-y-1" aria-label="Sidebar">
                        {menu.map((item) => {
                          if (item.hasOwnProperty('link')) {
                            const { link } = item as MenuItemLeaf
                            return (
                              <div key={item.key}>
                                <Typography
                                  weight={700}
                                  className={classNames(
                                    link == router.asPath
                                      ? 'text-gray-900'
                                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                    'group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md'
                                  )}
                                >
                                  {item.title}
                                </Typography>
                              </div>
                            )
                          }

                          return (
                            <Disclosure as="div" key={item.key} className="space-y-1">
                              {({ open }) => (
                                <>
                                  <Disclosure.Button
                                    className={classNames(
                                      'group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                    )}
                                  >
                                    <Typography
                                      weight={700}
                                      className={classNames(
                                        (item as MenuItemLeaf).link == router.asPath
                                          ? 'text-gray-900'
                                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                        'group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md'
                                      )}
                                    >
                                      {item.title}
                                    </Typography>
                                  </Disclosure.Button>
                                  <Disclosure.Panel className="space-y-1 flex flex-col">
                                    {(item as MenuItemNode).items.map((leaf: MenuItemLeaf) => (
                                      <Disclosure.Button key={leaf.key}>
                                        <Typography
                                          weight={700}
                                          className={classNames(
                                            leaf.link == router.asPath
                                              ? 'text-gray-900'
                                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                            'group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md'
                                          )}
                                        >
                                          {leaf.title}
                                        </Typography>
                                      </Disclosure.Button>
                                    ))}
                                  </Disclosure.Panel>
                                </>
                              )}
                            </Disclosure>
                          )
                        })}
                      </nav>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </header>
      <div style={{ height: 64, minHeight: 64 }} />
    </>
  )
}

export default Mobile
