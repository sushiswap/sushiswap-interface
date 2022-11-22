import useMenu from 'app/components/Header/useMenu'
import Web3Network from 'app/components/Web3Network'
import Web3Status from 'app/components/Web3Status'
import useIsCoinbaseWallet from 'app/hooks/useIsCoinbaseWallet'
import { useNativeCurrencyBalance } from 'app/lib/hooks/useCurrencyBalance'
import { useActiveWeb3React } from 'app/services/web3'
import { useNativeCurrencyBalances } from 'app/state/wallet/hooks'
import Link from 'next/link'
import React, { FC } from 'react'
import { NATIVE } from 'sdk'

import { NavigationItem } from './NavigationItem'

const HEADER_HEIGHT = 64

const Desktop: FC = () => {
  const menu = useMenu()
  // Note (amiller68): Account: The User's (Eth) Wallet Address | ChainId: The Network ID | Library: The Web3 Provider
  const { account, chainId, library } = useActiveWeb3React()
  // Note (amiller68): #WallbyOnly - Change this back when we learn about MultiContracts on FVM
  // const userEthBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']

  // Note (amiller68): Not sure what the right way to do this is, but this works for now
  const userFilBalance = useNativeCurrencyBalance(account ? account : undefined)
  // Note (amiller68): #MetamaskOnly
  // const isCoinbaseWallet = useIsCoinbaseWallet()
  // Note (amiller68): These are unused, but I'm leaving them here for reference
  // const [showBanner, setShowBanner] = React.useState<boolean>(true)

  const userEthBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']
  const isCoinbaseWallet = useIsCoinbaseWallet()

  return (
    // <>
    //   <header className="fixed z-20 hidden w-full lg:block" style={{ height: HEADER_HEIGHT }}>
    //     <nav className={NAV_CLASS}>
    //       <Container maxWidth="full" className="mx-auto">
    //         {/* Header Contents */}
    //         <div className="flex items-center justify-between gap-4 px-6">
    //           {/* Menu Items */}
    //           <div className="flex gap-4">
    //             <div className="flex items-center w-6 mr-4">
    //               {/* TODO (amiller68): Change Icon*/}
    //               <Image src="https://app.sushi.com/images/logo.svg" alt="Sushi logo" width="24px" height="24px" />
    //             </div>
    //             {menu.map((node) => {
    //               return <NavigationItem node={node} key={node.key} />
    //             })}
    //           </div>
    //           {/* Web3 Status  */}
    //           <div className="flex items-center justify-end w-auto shadow select-none whitespace-nowrap">
    //             {/* Network Balance */}
    //             {account && chainId && (
    //               <Typography weight={700} variant="sm" className="px-2 py-5 font-bold">
    //                 {/* TODO (amiller68): #Urgent Need to figure out Research how ABI's work in FVM, and how to make balance calls*/}
    //                 {/* within the framework laid out in this repo */}
    //                 {/*{userEthBalance ? (*/}
    //                 {/*  `${userEthBalance?.toSignificant(4)} ${NATIVE[chainId].symbol}`*/}
    //                 {/*) : (*/}
    //                 {/*  <Dots>FETCHING BALANCE</Dots>*/}
    //                 {/*)}*/}
    //                 {userFilBalance ? (
    //                   // TODO (amiller68): For some reason the symbol is returning as WFIL, but it should be FIL for Mainnet and tFIL for Wallaby
    //                   `${userFilBalance?.toSignificant(4)} ${NATIVE[chainId].symbol}`
    //                 ) : (
    //                   <Dots>FETCHING BALANCE</Dots>
    //                 )}
    //               </Typography>
    //             )}
    //             {/* Chain Logo */}
    //             {/* Note (amiller68): #MetamaskOnly - For now the provider is Always Metamask */}
    //             {/*{library && (library.provider.isMetaMask || isCoinbaseWallet) && (*/}
    //             {library && library.provider.isMetaMask && (
    //               <div className="hidden sm:inline-block">
    //                 <Web3Network />
    //               </div>
    //             )}
    //             {/* Connect Wallet Button or Wallet info */}
    //             <Web3Status />

    //             {/* <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               className="w-6 h-6"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //               stroke="currentColor"
    //               strokeWidth="2"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    //               />
    //               <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    //             </svg> */}
    //           </div>
    //         </div>
    //       </Container>
    //     </nav>
    //   </header>
    //   <div style={{ height: HEADER_HEIGHT + 48, minHeight: HEADER_HEIGHT }} />
    // </>
    <div className="absolute left-0 max-w-sm">
      <div className="h-screen py-6 overflow-x-hidden overflow-y-scroll bg-[#000000] border-r border-r-2 border-[#6E6E6E]">
        <nav
          className="grid grid-cols-1 divide-y divide-y-reverse divide-[#6E6E6E] divide-y-[2px] border-none mt-56"
          aria-label="Sidebar"
        >
          {/* TODO: Add figswap logo */}
          <div className="flex flex-col gap-4 px-6 border-b border-b-2 border-b-[#6E6E6E]">
            {library && (library.provider.isMetaMask || isCoinbaseWallet) && (
              <div className="hidden sm:flex">
                <Web3Network />
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center flex-grow w-auto text-sm font-bold cursor-pointer pointer-events-auto select-none whitespace-nowrap pb-8">
                {account && chainId && userEthBalance && (
                  <Link href={`/account/${account}`} passHref={true}>
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
          {menu.map((node) => {
            return <NavigationItem node={node} key={node.key} />
          })}
        </nav>
      </div>
    </div>
  )
}

export default Desktop
