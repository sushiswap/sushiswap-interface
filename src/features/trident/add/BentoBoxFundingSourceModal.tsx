import { QuestionMarkCircleIcon, XIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Switch from 'app/components/Switch'
import Typography from 'app/components/Typography'
import Image from 'next/image'
import React, { FC, useState } from 'react'

const BentoBoxFundingSourceModal: FC = () => {
  const { i18n } = useLingui()
  const [walletSelected, setWalletSelected] = useState(false)

  return (
    <HeadlessUiModal
      trigger={
        <div className="flex items-center justify-center rounded cursor-pointer lg:w-4 lg:h-4">
          <QuestionMarkCircleIcon className="w-4 h-4 text-high-emphesis" />
        </div>
      }
    >
      {({ setOpen }) => (
        <div className="flex flex-col h-full gap-5 pt-5 lg:max-w-lg">
          <div className="absolute w-6 h-6 right-5 top-5" onClick={() => setOpen(false)}>
            <XIcon className="w-6 h-6 cursor-pointer text-high-emphesis" />
          </div>
          <div className="flex justify-center">
            <div className="relative shadow-pink-glow">
              <Image src="/bentobox/logo.png" width={130} height={90} alt="BentoBox Logo" />
            </div>
          </div>
          <Typography variant="lg" weight={400} className="px-5 text-high-emphesis">
            {i18n._(t`SUSHI utilizes a token vault called BentoBox that has balances separate from your wallet.`)}
          </Typography>
          <div className="p-5 mx-5 rounded bg-purple bg-opacity-20">
            <Typography variant="sm" weight={700} className="text-high-emphesis">
              {i18n._(t`You can think of this like having "account balances" for each asset within sushi.com`)}
            </Typography>
          </div>
          <div className="flex flex-col">
            <div className="grid grid-cols-2 flex-grow min-h-[160px]">
              <div className="flex flex-col gap-4 p-3 px-8">
                <div className="flex flex-row gap-8">
                  <div className={walletSelected ? 'text-low-emphesis' : 'text-high-emphesis'}>
                    <svg
                      width="42"
                      height="32"
                      viewBox="0 0 42 32"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M41.2889 30.3349L39.2614 1.09591C39.2232 0.533741 38.7295 0.111781 38.1797 0.149292C37.6465 0.187037 37.2385 0.632858 37.2367 1.1625C37.2343 0.601106 36.7719 0.146973 36.2024 0.146973C35.6314 0.146973 35.168 0.603511 35.168 1.16696V30.406C35.168 30.9694 35.6314 31.426 36.2024 31.426C36.7734 31.426 37.2367 30.9694 37.2367 30.406V1.17169C37.2369 1.19366 37.2377 1.21577 37.2392 1.23801L39.2667 30.477C39.3037 31.0149 39.7492 31.426 40.2765 31.426C40.8692 31.4259 41.3296 30.922 41.2889 30.3349ZM11.9733 0.146973H27.1704C29.4558 0.146973 31.315 2.00617 31.3149 4.29161V17.6465H20.2626V13.5019C20.2626 11.2164 18.4034 9.35723 16.1179 9.35723H11.9733V0.146973ZM16.1179 12.1205H11.9733V17.6467H17.4995V13.5021C17.4995 12.7403 16.8797 12.1205 16.1179 12.1205ZM0 27.3174V20.4097H14.7365V31.462H4.14463C1.8592 31.462 0 29.6028 0 27.3174ZM17.4995 20.4097V31.462H27.1704C29.4558 31.462 31.315 29.6028 31.315 27.3174V20.4097H17.4995ZM0 4.29161C0 2.00617 1.8592 0.146973 4.14463 0.146973H9.21026V17.6465H0V4.29161Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div className={walletSelected ? 'text-high-emphesis' : 'text-low-emphesis'}>
                    <svg
                      width="43"
                      height="32"
                      viewBox="0 0 43 32"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M37.6022 31.099H3.39382C1.97809 31.099 0.827545 29.9484 0.827545 28.5327V2.56627C0.827545 1.15055 1.97809 0 3.39382 0H37.6022C39.018 0 40.1685 1.15055 40.1685 2.56627V8.3575H27.8889C26.9693 8.3575 26.0711 8.54141 25.2285 8.89641C24.4159 9.23859 23.6845 9.73473 23.06 10.3592C22.4356 10.9837 21.9394 11.715 21.5973 12.5277C21.238 13.3703 21.0583 14.2685 21.0583 15.1881V15.9109C21.0583 16.8305 21.2423 17.7287 21.5973 18.5713C21.9394 19.3839 22.4356 20.1153 23.06 20.7398C23.6845 21.3642 24.4159 21.8604 25.2285 22.2025C26.0711 22.5619 26.9693 22.7415 27.8889 22.7415H40.1685V28.5327C40.1685 29.9484 39.018 31.099 37.6022 31.099ZM41.0753 10.924C42.1403 10.924 43 11.7838 43 12.8488V18.2507C43 19.3157 42.1403 20.1754 41.0753 20.1754H40.1685H27.8889C25.5322 20.1754 23.6246 18.2679 23.6246 15.9112V15.1883C23.6246 12.8316 25.5322 10.924 27.8889 10.924H40.1685H41.0753ZM26.3192 15.5476C26.3192 16.8009 27.3329 17.8145 28.5861 17.8145C29.8393 17.8145 30.853 16.8009 30.853 15.5476C30.853 14.2944 29.8393 13.2807 28.5861 13.2807C27.3329 13.2807 26.3192 14.2944 26.3192 15.5476Z"
                        fill="#currentColor"
                      />
                    </svg>
                  </div>
                </div>
                <Typography weight={400} className="text-high-emphesis">
                  {i18n._(t`You’ll see these icons next to your balance in various input fields.`)}
                </Typography>
              </div>
              <div
                className="h-full bg-right bg-no-repeat bg-contain"
                style={{ backgroundImage: `url('/images/trident/AssetInputScreenshot.png')` }}
              />
            </div>
          </div>
          <div className="flex flex-row items-center gap-3 px-8">
            <Typography weight={700} className={walletSelected ? 'text-low-emphesis' : 'text-high-emphesis'}>
              {i18n._(t`BentoBox`)}
            </Typography>
            <Switch checked={walletSelected} onChange={setWalletSelected} />
            <Typography weight={700} className={walletSelected ? 'text-high-emphesis' : 'text-low-emphesis'}>
              {i18n._(t`Wallet`)}
            </Typography>
          </div>
          <div className="flex flex-col flex-grow min-h-[160px]">
            <div className="grid flex-grow grid-cols-2">
              <div
                className="h-full bg-no-repeat bg-contain"
                style={{ backgroundImage: `url('/images/trident/AssetInputScreenshot2.png')` }}
              />
              <div className="flex flex-col gap-4 p-3 px-8">
                <Typography weight={400} className="text-high-emphesis">
                  {i18n._(t`Use the toggle to switch between balances when interacting with our platform.`)}
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex flex-col px-5">
            <Button variant="outlined" className="mb-5 border border-transparent border-gradient-r-blue-pink-dark-900">
              {i18n._(t`Learn more about BentoBox`)}
            </Button>
          </div>
        </div>
      )}
    </HeadlessUiModal>
  )
}

export default BentoBoxFundingSourceModal
