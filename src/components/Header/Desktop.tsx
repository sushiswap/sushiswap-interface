import { SIDE_NAV_CLASS } from 'app/components/Header/styles'
import useMenu from 'app/components/Header/useMenu'
import Web3Network from 'app/components/Web3Network'
import Web3Status from 'app/components/Web3Status'
import { useNativeCurrencyBalances } from 'app/lib/hooks/useCurrencyBalance'
import { useActiveWeb3React } from 'app/services/web3'
// import useIsCoinbaseWallet from 'app/hooks/useIsCoinbaseWallet'
import Image from 'next/image'
// import { TOP_NAV_CLASS } from 'app/components/Header/styles'
// import Link from 'next/link'
import React, { FC } from 'react'
import { NATIVE } from 'sdk'

import Dots from '../Dots'
import Typography from '../Typography'
import { NavigationItem } from './NavigationItem'

const HEADER_HEIGHT = 64

const Desktop: FC = () => {
  const menu = useMenu()
  // Note (amiller68): Account: The User's (Eth) Wallet Address | ChainId: The Network ID | Library: The Web3 Provider
  const { account, chainId, library } = useActiveWeb3React()
  // Note (amiller68): #WallbyOnly - Change this back when we learn about MultiContracts on FVM
  // const userEthBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']

  // Note (amiller68): Not sure what the right way to do this is, but this works for now
  // const userFilBalance = useNativeCurrencyBalance(account ? account : undefined)
  const userFilBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']
  console.log('userFilBalance', userFilBalance)
  // Note (amiller68): #MetamaskOnly
  // const isCoinbaseWallet = useIsCoinbaseWallet()
  // Note (amiller68): These are unused, but I'm leaving them here for reference
  // const [showBanner, setShowBanner] = React.useState<boolean>(true)

  return (
    <>
      {/* Note (amiller68): These Divs replace the header so we cna have a sidebar*/}
      {/*<div className="absolute left-0 max-w-sm h-screen py-6 overflow-x-hidden overflow-y-scroll bg-[#000000] border-r border-r-2 border-[#6E6E6E]">*/}
      {/* Note (amiller68): Took out the 'overflow-y-scroll' bit - scroll bar doesnt show up anymore :)*/}
      <div className="absolute left-0 max-w-sm h-screen py-6 overflow-x-hidden bg-[#000000] border-r border-r-2 border-[#6E6E6E]">
        {/*<header className="fixed z-20 hidden w-full lg:block" style={{ height: HEADER_HEIGHT }}>*/}
        {/* Note (amiller68): Use our new side nav class */}
        {/*  <nav className={TOP_NAV_CLASS}>*/}
        <nav className={SIDE_NAV_CLASS} aria-label="Sidebar">
          {/* Header Contents:  */}
          {/* TODO (amiller68): Dyanamically size logo + banner !!!*/}
          <div className="flex items-center w-6 mr-4">
            {/* TODO (amiller68): Change Icon Link to Master branch*/}
            <Image
              src="https://raw.githubusercontent.com/banyancomputer/interface/wrap-time/.github/logos/figswap/logo.svg"
              alt="FigSwap Logo"
              width="1000px"
              height="1000px"
            />
            {/*<Image*/}
            {/*  src="https://raw.githubusercontent.com/banyancomputer/interface/wrap-time/.github/logos/figswap/banner.svg"*/}
            {/*  alt="FigSwap Banner"*/}
            {/*  width="1000px"*/}
            {/*  height="500px"*/}
            {/*/>*/}
          </div>
          {/* TODO: #Figma make Web 3 Status look like design */}
          {/*<div className="flex items-center justify-end w-auto shadow select-none whitespace-nowrap">*/}
          <div className="flex flex-col gap-4 px-6 border-b border-b-2 border-b-[#6E6E6E] shadow select-none whitespace-nowrap">
            <Web3Status />
            {/* Network Logo + Balance */}
            {/* Note (amiller68): #MetamaskOnly - For now the provider is Always Metamask */}
            {/*{library && (library.provider.isMetaMask || isCoinbaseWallet) && (*/}
            {library && account && chainId && (
              // <div className="hidden sm:inline-block">
              // <div className="hidden sm:flex">
              <div className="flex items-center gap-2 justify-center flex-grow w-auto text-sm font-bold cursor-pointer pointer-events-auto select-none whitespace-nowrap pb-8">
                <Typography weight={700} variant="sm" className="px-2 py-5 font-bold">
                  {userFilBalance ? (
                    `${userFilBalance?.toSignificant(4)} ${NATIVE[chainId].symbol}`
                  ) : (
                    <Dots>BALANCE</Dots>
                  )}
                </Typography>
                <div className="hidden sm:flex">
                  <Web3Network />
                </div>
              </div>
            )}
          </div>
          {/* Menu Items */}
          {menu.map((node) => {
            return <NavigationItem node={node} key={node.key} />
          })}
        </nav>
        {/*</Container>*/}
      </div>
      <div style={{ height: HEADER_HEIGHT + 48, minHeight: HEADER_HEIGHT }} />
    </>
  )
}

export default Desktop
