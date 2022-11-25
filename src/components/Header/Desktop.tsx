import { SIDE_NAV_CLASS } from 'app/components/Header/styles'
import useMenu from 'app/components/Header/useMenu'
import Web3Network from 'app/components/Web3Network'
import Web3Status from 'app/components/Web3Status'
import { useNativeCurrencyBalances } from 'app/lib/hooks/useCurrencyBalance'
import { useActiveWeb3React } from 'app/services/web3'
// import useIsCoinbaseWallet from 'app/hooks/useIsCoinbaseWallet'
// import Image from 'next/image'
import { margin } from 'polished'
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
        {/* TODO (amiller68): Dyanamically size logo + banner !!!*/}
        <nav className={SIDE_NAV_CLASS} aria-label="Sidebar">
          {/* NavBar Contents:  */}
          {/* TODO: #Figma make Web 3 Status look like design */}
          {/*<div className="flex items-center justify-end w-auto shadow select-none whitespace-nowrap">*/}
          {/* Add padding to this div */}

          {/* TODO UNJANK THE HELL OUT OF THIS */}
          <div className="flex flex-col gap-4 px-6 border-b border-b-2 border-b-[#6E6E6E] shadow select-none whitespace-nowrap">
            {/* <div style={{ width: '3%', height: '10%', position: 'fixed', top: 0, left: 10 }}>
              <Image
                alt="FigSwap Logo"
                src="https://raw.githubusercontent.com/banyancomputer/interface/master/.github/logos/figswap/logo.svg"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div style={{ width: '10%', height: '10%', position: 'fixed', top: 5, left: '3.5%' }}>
              <Image
                src="https://raw.githubusercontent.com/banyancomputer/interface/master/.github/logos/figswap/banner.svg"
                alt="FigSwap Banner"
                layout="fill"
                objectFit="contain"
              />
            </div> */}

            <div className="flex absolute top-0 mt-4">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19.384 31.5565C21.8195 29.1001 20.0756 24.9301 16.6736 24.9301H1.39862C-0.0446968 31.5545 3.46571 38.5403 9.90823 41.1136L19.384 31.5565ZM17.167 42.1099C18.3935 42.1214 19.8507 42.1214 21.599 42.1214C24.2966 42.1214 26.2974 42.1213 27.8202 42.0796C29.3544 42.0376 30.3321 41.9543 31.0088 41.8082C40.5653 39.7459 45.1727 28.692 39.9165 20.3528C39.5443 19.7623 38.9167 18.9999 37.8706 17.8672C36.8322 16.7427 35.4291 15.3037 33.5376 13.3639L21.599 1.12043L19.0289 3.75612L35.6646 20.5347C36.4648 21.3417 36.4648 22.6464 35.6646 23.4535L17.167 42.1099ZM19.384 12.4316L14.94 7.94948L9.66027 13.364C9.08319 13.9558 8.497 14.5282 7.91609 15.0954C6.59355 16.3867 5.29837 17.6512 4.20038 19.0581H16.6736C20.0756 19.0581 21.8195 14.8881 19.384 12.4316Z"
                  fill="#F7F7F7"
                  stroke="#F7F7F7"
                  strokeWidth="2.15432"
                />
              </svg>

              <svg width="192" height="54" viewBox="0 0 192 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.197266 43.4992H18.7411V41.9457H16.3142C13.2029 41.9457 11.9583 40.7028 11.9583 37.5957V29.3017C11.9583 25.3246 13.8178 23.0253 17.1159 23.0253C21.5267 23.0253 23.0202 26.381 23.3313 32.3466H24.5759V12.8341H23.3313C23.0202 18.4269 21.5267 21.5961 17.1159 21.5961C13.8178 21.5961 11.9583 19.4211 11.9583 16.4383V5.90347C11.9583 2.79638 13.1406 1.55355 16.252 1.55355H21.7281C29.8799 1.55355 32.929 5.53062 34.0491 13.7955H35.2937V0H0.197266V1.55355H2.62415C5.73553 1.55355 6.98009 2.79638 6.98009 5.90347V37.5957C6.98009 40.7028 5.73553 41.9457 2.62415 41.9457H0.197266V43.4992Z"
                  fill="#F7F7F7"
                />
                <path
                  d="M33.9782 21.5632H35.5339C37.1518 19.0775 39.0808 16.9647 40.4498 16.9647C40.8854 16.9647 41.0099 17.3375 41.0099 17.6483C41.0099 17.8347 40.9477 18.1454 40.8232 18.4561L34.6004 34.3644C33.1692 37.9686 34.1648 44.2449 37.5874 44.2449C39.0186 44.2449 41.8189 42.5671 44.8058 36.6636H43.3123C41.6944 39.7086 39.3297 42.6914 37.8363 42.6914C37.3385 42.6914 36.9651 42.3807 36.9651 41.8214C36.9651 41.4485 37.0896 41.0757 37.3385 40.33L43.499 23.676C43.8724 22.6196 44.1213 21.501 44.1213 20.3825C44.1213 17.7725 43.0634 15.4112 41.0099 15.4112C38.8319 15.4112 36.4673 17.6483 33.9782 21.5632ZM42.4411 7.58129C42.4411 9.07269 43.6857 10.4398 45.3658 10.4398C47.2949 10.4398 48.9128 9.01055 48.9128 7.20844C48.9128 5.71704 47.6683 4.34992 45.9259 4.34992C44.0591 4.34992 42.4411 5.77918 42.4411 7.58129Z"
                  fill="#F7F7F7"
                />
                <path
                  d="M59.4492 53.5662C63.2451 53.5662 66.1076 52.7583 68.2233 51.3912C71.2103 49.4648 72.517 46.9792 72.517 44.8042C72.517 41.5728 69.5301 38.8386 64.4897 38.8386H53.5998C51.8574 38.8386 51.5463 38.2793 51.5463 37.5336C51.5463 36.85 52.4175 35.5451 53.9732 34.5508C55.9645 35.2344 57.5824 35.6072 59.2625 35.6072C65.2364 35.6072 70.6502 29.5795 70.6502 25.5403C70.6502 23.8624 69.4679 22.0603 68.4722 20.5689C68.2233 20.1339 68.0989 19.7611 68.0989 19.3882C68.0989 18.0211 69.4679 17.089 70.3391 17.089C70.7124 17.089 71.0236 17.2754 71.0236 17.6483C71.0236 18.2075 70.4013 18.3318 70.4013 19.4504C70.4013 20.5689 71.5214 21.3768 72.6415 21.3768C73.9483 21.3768 75.3795 20.4446 75.3795 18.4561C75.3795 16.5297 73.6371 15.349 71.8325 15.349C69.4679 15.349 67.85 17.1511 65.9831 17.1511C64.3652 17.1511 62.3117 15.4112 59.2625 15.4112C53.4754 15.4112 47.8126 21.8118 47.8126 25.4781C47.8126 27.6531 49.555 29.9523 50.9863 31.568C51.8574 32.5001 51.9819 32.9351 51.9819 33.5565C51.9819 34.1158 51.733 34.6751 50.9863 35.4208L49.8662 36.6015C48.8083 37.6579 48.5594 38.0929 48.5594 39.0872C48.5594 39.895 49.1194 40.6407 49.9284 41.635C50.2395 42.07 50.4262 42.4428 50.4262 42.8157C50.4262 43.2506 50.2395 43.6856 49.7417 44.1206L48.186 45.5499C47.2526 46.3577 47.0037 46.9792 47.0037 47.7249C47.0037 49.527 50.6751 53.5662 59.4492 53.5662ZM50.6751 47.352C50.6751 46.3577 51.1729 44.6178 51.9819 43.4992H63.9296C67.4766 43.4992 68.9078 44.9906 68.9078 46.9792C68.9078 49.092 66.6054 52.0126 59.6359 52.0126C52.4175 52.0126 50.6751 49.7134 50.6751 47.352ZM53.102 28.0259V23.1789C53.102 18.9532 55.84 16.9647 59.2003 16.9647C62.5606 16.9647 65.3609 18.9532 65.3609 23.1789V28.0259C65.3609 32.003 62.5606 34.0537 59.2625 34.0537C55.9645 34.0537 53.102 31.8787 53.102 28.0259Z"
                  fill="#F7F7F7"
                />
                <path
                  d="M87.704 44.2449C93.5534 44.2449 97.0382 39.7707 97.0382 36.1665C97.0382 30.9466 93.0556 28.8338 89.1353 27.5909L85.4638 26.4102C82.6014 25.4781 80.3612 24.7324 80.3612 21.3768C80.3612 18.8289 82.4769 16.9647 85.5883 16.9647C89.3219 16.9647 93.3045 19.3882 94.3624 25.1674H95.6069V16.1569H94.3624C94.2379 17.0268 93.8023 17.7104 92.8067 17.7104C91.3755 17.7104 89.3219 15.4112 85.5883 15.4112C80.7345 15.4112 77.7476 19.3261 77.7476 23.1167C77.7476 27.4666 79.9256 29.6416 84.406 31.0709L88.2641 32.3137C92.1844 33.5565 94.1135 34.9237 94.1135 37.7822C94.1135 40.33 92.2467 42.6914 87.704 42.6914C81.9791 42.6914 78.4943 38.155 77.8098 32.8108H76.5653V43.4992H77.8721C78.0587 42.5671 78.4321 41.5728 79.6144 41.5728C81.1701 41.5728 83.1614 44.2449 87.704 44.2449Z"
                  fill="#F7F7F7"
                />
                <path
                  d="M105.327 44.2449C108.003 44.2449 110.43 42.8157 113.044 40.5786C114.039 42.8778 115.782 44.2449 118.52 44.2449C127.356 44.2449 135.508 31.3816 135.508 21.6875C135.508 18.3318 133.703 15.4733 130.841 15.4733C128.912 15.4733 126.734 17.2754 126.734 19.5746C126.734 21.2525 128.041 22.8682 129.596 22.8682C131.836 22.8682 131.774 21.501 132.832 21.501C133.33 21.501 133.703 21.8118 133.703 22.8682C133.703 30.0145 127.605 41.2621 120.449 41.2621C118.146 41.2621 116.528 40.33 115.533 38.2172C120.511 32.7487 124.245 25.1674 124.245 19.7611C124.245 17.2133 123.062 15.4112 120.822 15.4112C115.159 15.4112 112.048 27.0317 112.048 34.4887C112.048 36.1665 112.173 37.72 112.546 39.025C110.181 41.4485 108.065 42.6914 105.639 42.6914C103.772 42.6914 102.776 41.635 102.776 39.895C102.776 39.025 103.087 37.9686 103.585 36.7879L108.128 25.2917C108.75 23.676 109.248 21.7496 109.248 20.0718C109.248 17.524 108.314 15.4112 106.074 15.4112C104.581 15.4112 101.656 17.089 98.2957 22.9924H99.7892C101.656 19.9475 104.145 16.9647 105.639 16.9647C106.136 16.9647 106.51 17.1511 106.51 17.7104C106.51 18.0832 106.323 18.5804 106.012 19.3261L101.283 30.8223C100.598 32.5001 100.163 34.5508 100.163 36.4772C100.163 40.5164 101.594 44.2449 105.327 44.2449ZM114.35 31.8166V30.9466C114.35 24.6703 116.155 19.2639 119.266 19.2639C120.884 19.2639 121.693 20.5068 121.693 22.6196C121.693 25.3538 120.76 28.4609 118.644 31.8166C117.524 33.6187 116.28 34.7994 115.533 34.7994C114.724 34.7994 114.35 33.4944 114.35 31.8166Z"
                  fill="#F7F7F7"
                />
                <path
                  d="M145.837 42.1942C145.09 42.1942 144.53 42.0078 144.157 41.5107C143.659 41.0135 143.473 40.0814 143.473 38.8386V35.3586C143.473 31.9409 145.526 30.5737 148.264 29.6416L150.629 28.8338C151.687 28.4609 152.184 28.3988 152.682 28.3988C153.989 28.3988 155.109 29.0823 155.109 31.3194C155.109 36.3529 150.193 42.1942 145.837 42.1942ZM137.872 38.0307C137.872 40.4543 141.108 44.2449 144.904 44.2449C147.828 44.2449 150.691 42.3807 152.869 40.33C153.305 39.895 153.678 39.7086 154.051 39.7086C154.487 39.7086 154.798 40.1436 155.047 40.8271C155.731 43.0021 157.225 44.2449 159.403 44.2449C162.328 44.2449 163.883 42.4428 163.883 39.3357V36.1043H162.514V39.025C162.514 41.0757 161.83 41.7592 160.772 41.7592C160.212 41.7592 159.776 41.5728 159.465 41.1378C159.278 40.8271 159.154 40.33 159.154 39.6464L159.465 27.2802C159.527 25.851 159.278 24.4217 158.781 23.1167C157.1 18.6425 152.558 15.4112 147.455 15.4112C142.539 15.4112 138.059 18.394 138.059 22.4332C138.059 24.6081 139.49 25.9752 141.357 25.9752C143.037 25.9752 144.468 24.6703 144.468 23.1789C144.468 20.8796 142.228 20.5689 142.228 19.3882C142.228 18.1454 144.157 16.9026 147.455 16.9026C151.002 16.9026 154.922 18.8289 154.922 22.9303C154.922 24.9188 153.802 26.0995 152.122 26.7209L146.335 28.958C139.926 31.4437 137.872 35.8558 137.872 38.0307Z"
                  fill="#F7F7F7"
                />
                <path
                  d="M162.627 52.8205H176.317V51.2669H174.575C172.708 51.2669 171.65 49.962 171.65 48.0977V41.3864C171.65 40.6407 172.086 40.2678 172.584 40.2678C173.082 40.2678 173.642 40.765 174.326 41.3864C175.757 42.6914 177.811 44.2449 180.86 44.2449C186.772 44.2449 191.999 36.1665 191.999 29.8902C191.999 23.6139 186.834 15.4112 180.922 15.4112C177.873 15.4112 175.82 16.9647 174.388 18.2697C173.704 18.8911 173.144 19.3882 172.646 19.3882C172.086 19.3882 171.713 19.0154 171.713 18.2697V16.1569H162.627V17.7104H164.37C166.236 17.7104 167.294 18.5804 167.294 20.8796V48.0977C167.294 49.962 166.236 51.2669 164.37 51.2669H162.627V52.8205ZM171.464 29.8902C171.464 23.0546 176.131 16.9647 180.798 16.9647C183.349 16.9647 186.336 18.5804 186.336 24.7946V34.9237C186.336 41.0757 183.349 42.6914 180.798 42.6914C176.131 42.6914 171.464 36.7879 171.464 29.8902Z"
                  fill="#F7F7F7"
                />
              </svg>
            </div>

            <div style={margin(20)}>
              <Web3Status />
            </div>
            {/* Network Logo + Balance */}
            {/* Note (amiller68): #MetamaskOnly - For now the provider is Always Metamask */}
            {/*{library && (library.provider.isMetaMask || isCoinbaseWallet) && (*/}
            {library && account && chainId && (
              // <div className="hidden sm:inline-block">
              // <div className="hidden sm:flex">
              <div className="flex items-center gap-2 justify-center flex-grow w-auto text-sm font-bold cursor-pointer pointer-events-auto select-none whitespace-nowrap border">
                <Typography weight={700} variant="sm" className="font-mono py-5 font-medium text-lg">
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
