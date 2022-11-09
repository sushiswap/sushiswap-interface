import Container from 'app/components/Container'
import { NAV_CLASS } from 'app/components/Header/styles'
import useMenu from 'app/components/Header/useMenu'
import Web3Network from 'app/components/Web3Network'
import Web3Status from 'app/components/Web3Status'
import { useActiveWeb3React } from 'app/services/web3'
import Image from 'next/image'
import React, { FC } from 'react'
// import { useNativeCurrencyBalances } from 'app/state/wallet/hooks'
import { CurrencyAmount, JSBI, NATIVE } from 'sdk'
import useSWR from 'swr'

import Dots from '../Dots'
import Typography from '../Typography'
import { NavigationItem } from './NavigationItem'

const HEADER_HEIGHT = 64

const fetcher =
  (library: any, chainId: any) =>
  (...args: any[]) => {
    const [method, ...params] = args
    console.log(method, params)
    let ret = library[method](...params)
    return ret.then((res: any) => CurrencyAmount.fromRawAmount(NATIVE[chainId], JSBI.BigInt(res.toString())))
  }

const Desktop: FC = () => {
  const menu = useMenu()
  // Note (amiller68): Account: The User's (Eth) Wallet Address | ChainId: The Network ID | Library: The Web3 Provider
  const { account, chainId, library } = useActiveWeb3React()
  // Note (amiller68): #WallbyOnly - Change this back when we learn about MultiContracts on FVM
  // const userEthBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']
  const { data: userFilBalance } = useSWR(['getBalance', account, 'latest'], { fetcher: fetcher(library, chainId) })
  // Note (amiller68): #MetamaskOnly
  // const isCoinbaseWallet = useIsCoinbaseWallet()
  // Note (amiller68): These are unused, but I'm leaving them here for reference
  // const [showBanner, setShowBanner] = React.useState<boolean>(true)

  return (
    <>
      <header className="fixed z-20 hidden w-full lg:block" style={{ height: HEADER_HEIGHT }}>
        <nav className={NAV_CLASS}>
          <Container maxWidth="full" className="mx-auto">
            {/* Header Contents */}
            <div className="flex items-center justify-between gap-4 px-6">
              {/* Menu Items */}
              <div className="flex gap-4">
                <div className="flex items-center w-6 mr-4">
                  {/* TODO (amiller68): Change Icon*/}
                  <Image src="https://app.sushi.com/images/logo.svg" alt="Sushi logo" width="24px" height="24px" />
                </div>
                {menu.map((node) => {
                  return <NavigationItem node={node} key={node.key} />
                })}
              </div>
              {/* Web3 Status  */}
              <div className="flex items-center justify-end w-auto shadow select-none whitespace-nowrap">
                {/* Network Balance */}
                {account && chainId && (
                  <Typography weight={700} variant="sm" className="px-2 py-5 font-bold">
                    {/* TODO (amiller68): #Urgent Need to figure out Research how ABI's work in FVM, and how to make balance calls*/}
                    {/* within the framework laid out in this repo */}
                    {/*{userEthBalance ? (*/}
                    {/*  `${userEthBalance?.toSignificant(4)} ${NATIVE[chainId].symbol}`*/}
                    {/*) : (*/}
                    {/*  <Dots>FETCHING BALANCE</Dots>*/}
                    {/*)}*/}
                    {userFilBalance ? (
                      `${userFilBalance?.toSignificant(4)} ${NATIVE[chainId].symbol}`
                    ) : (
                      <Dots>FETCHING BALANCE</Dots>
                    )}
                  </Typography>
                )}
                {/* Chain Logo */}
                {/* Note (amiller68): #MetamaskOnly - For now the provider is Always Metamask */}
                {/*{library && (library.provider.isMetaMask || isCoinbaseWallet) && (*/}
                {library && library.provider.isMetaMask && (
                  <div className="hidden sm:inline-block">
                    <Web3Network />
                  </div>
                )}
                {/* Connect Wallet Button or Wallet info */}
                <Web3Status />

                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg> */}
              </div>
            </div>
          </Container>
        </nav>
      </header>
      <div style={{ height: HEADER_HEIGHT + 48, minHeight: HEADER_HEIGHT }} />
    </>
  )
}

export default Desktop
