import { Dialog, Transition } from '@headlessui/react'
import { MenuIcon } from '@heroicons/react/outline'
import { NATIVE } from '@sushiswap/core-sdk'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import useMenu from 'app/components/Header/useMenu'
import Web3Network from 'app/components/Web3Network'
import Web3Status from 'app/components/Web3Status'
import { useActiveWeb3React } from 'app/services/web3'
import { useETHBalances } from 'app/state/wallet/hooks'
import Image from 'next/image'
import Link from 'next/link'
import React, { FC, Fragment, useState } from 'react'

import { NavigationItem } from './NavigationItem'

const Mobile: FC = () => {
  const menu = useMenu()
  const { account, chainId, library, connector } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [open, setOpen] = useState(false)

  const isCbWallet =
    connector instanceof WalletLinkConnector ||
    (connector instanceof InjectedConnector && window.walletLinkExtension) ||
    window?.ethereum?.isCoinbaseWallet

  return (
    <>
      <header className="w-full flex items-center justify-between min-h-[64px] h-[64px] px-4">
        <div className="flex flex-grow justify-between">
          <div className="p-2 hover:bg-white/10 rounded-full">
            <MenuIcon width={28} className="hover:text-white text-white cursor-pointer" onClick={() => setOpen(true)} />
          </div>
          <div className="flex w-6 mr-1 items-center">
            <Link href="/swap" passHref={true}>
              <Image src="https://app.sushi.com/images/logo.svg" alt="Sushi logo" width="24px" height="24px" />
            </Link>
          </div>
        </div>
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 overflow-hidden z-20" onClose={setOpen}>
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

              <div className="fixed inset-y-0 left-0 pr-10 max-w-[260px] flex">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-[-100%]"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-[-100%]"
                >
                  <div className="w-screen max-w-sm">
                    <div className="h-full flex flex-col py-6 bg-dark-800 shadow-xl overflow-y-scroll overflow-x-hidden">
                      <nav className="flex-1 pl-6" aria-label="Sidebar">
                        {menu.map((node) => {
                          return <NavigationItem node={node} key={node.key} />
                        })}
                      </nav>

                      <div className="px-6 flex flex-col gap-4">
                        {library && (library.provider.isMetaMask || isCbWallet) && (
                          <div className="hidden sm:flex">
                            <Web3Network />
                          </div>
                        )}

                        <div className="flex items-center justify-start gap-2">
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
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </header>
    </>
  )
}

export default Mobile
