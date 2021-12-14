import { EmojiSadIcon } from '@heroicons/react/outline'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import {
  DiscordIcon,
  GithubIcon,
  MediumIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  WechatIcon,
} from 'app/components/Icon'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums'
import useAuction from 'app/features/miso/context/hooks/useAuction'
import NetworkGuard from 'app/guards/Network'
import MisoLayout from 'app/layouts/Miso'
import { useActiveWeb3React } from 'app/services/web3'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const MisoAuction = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const router = useRouter()
  const { auction: address } = router.query
  const auction = useAuction(address as string, account ?? undefined)

  const header = (
    <div className="flex flex-col gap-4">
      <div>
        <Button
          color="blue"
          variant="outlined"
          size="sm"
          className="rounded-full !pl-2 !py-1.5"
          startIcon={<ChevronLeftIcon width={24} height={24} />}
        >
          <Link href={`/miso/${address}`}>{i18n._(t`Auction`)}</Link>
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <Typography variant="h2" className="text-high-emphesis" weight={700}>
          {i18n._(t`Edit Auction`)}
        </Typography>
        <Typography variant="sm" weight={400}>
          {i18n._(t`Only the Auction admin and approved operators for this auction are able to edit any of the details below.
Do not waste your gas.`)}
        </Typography>
      </div>
    </div>
  )

  console.log(auction?.isOwner)
  if (!auction?.isOwner) {
    return (
      <div className="flex flex-col my-12 gap-12 px-6">
        {header}
        <div className="flex gap-4 items-center">
          <EmojiSadIcon width={40} />
          <Typography weight={700}>
            {i18n._(t`Oops! You're not allowed to edit this page.`)}{' '}
            <span className="text-blue">
              <Link href={`/miso/${address}`}>{i18n._(t`Go back to auction`)}</Link>
            </span>
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col my-12 gap-12 px-6">
      {header}
      <form className="space-y-8 divide-y divide-dark-700 bg-dark-900 p-10 rounded shadow-xl shadow-red/5">
        <div className="space-y-8 divide-y divide-dark-700">
          <div>
            <div className="flex flex-col gap-1">
              <Typography variant="lg" className="text-high-emphesis" weight={700}>
                {i18n._(t`Project Details`)}
              </Typography>
              {/*<Typography variant="sm" weight={400}>*/}
              {/*  Description has a limit of 300 characters.*/}
              {/*</Typography>*/}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <Typography weight={700}>{i18n._(t`Website`)}</Typography>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="bg-dark-1000 rounded px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-1/2 min-w-0 border border-dark-800"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">{i18n._(t`Please note that the URL must use https.`)}</p>
              </div>

              <div className="sm:col-span-4">
                <Typography weight={700}>{i18n._(t`Icon`)}</Typography>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="bg-dark-1000 rounded px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-1/2 min-w-0 border border-dark-800"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {i18n._(
                    t`Enter the URL of your hosted icon. Icon must be of 256x256 dimensions and is preferably a PNG.`
                  )}
                </p>
              </div>

              <div className="sm:col-span-6">
                <Typography weight={700}>{i18n._(t`Description`)}</Typography>
                <div className="mt-2">
                  <textarea
                    rows={6}
                    name="description"
                    id="description"
                    autoComplete="description"
                    className="bg-dark-1000 rounded px-3 outline-none py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 border border-dark-800"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {i18n._(t`Give a summary of your project in at most 300 characters`)}.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <div className="flex flex-col gap-1">
              <Typography variant="lg" className="text-high-emphesis" weight={700}>
                {i18n._(t`Socials`)}
              </Typography>
              <Typography variant="sm" weight={400}>
                Please note that all social links must use https. Each social link will be displayed with their
                corresponding brand icon
              </Typography>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <Typography weight={700}>{i18n._(t`Twitter`)}</Typography>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-dark-800 text-gray-500 sm:text-sm">
                    <TwitterIcon width={20} />
                  </span>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="bg-dark-1000 rounded-none rounded-r-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-1/2 min-w-0 border border-dark-800"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">{i18n._(t`Enter your Twitter account profile link`)}</p>
              </div>

              <div className="sm:col-span-6">
                <Typography weight={700}>{i18n._(t`Github`)}</Typography>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-dark-800 text-gray-500 sm:text-sm">
                    <GithubIcon width={20} />
                  </span>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="bg-dark-1000 rounded-none rounded-r-md  px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-1/2 min-w-0 border border-dark-800"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">{i18n._(t`Enter your Github organization link`)}</p>
              </div>

              <div className="sm:col-span-6">
                <Typography weight={700}>{i18n._(t`Telegram`)}</Typography>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-dark-800 text-gray-500 sm:text-sm">
                    <TelegramIcon width={20} />
                  </span>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="bg-dark-1000 rounded-none rounded-r-md  px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-1/2 min-w-0 border border-dark-800"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">{i18n._(t`Enter your Telegram invite link`)}</p>
              </div>

              <div className="sm:col-span-6">
                <Typography weight={700}>{i18n._(t`WeChat`)}</Typography>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-dark-800 text-gray-500 sm:text-sm">
                    <WechatIcon width={20} />
                  </span>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="bg-dark-1000 rounded-none rounded-r-md  px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-1/2 min-w-0 border border-dark-800"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">{i18n._(t`Enter your WeChat group link`)}</p>
              </div>

              <div className="sm:col-span-6">
                <Typography weight={700}>{i18n._(t`Discord`)}</Typography>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-dark-800 text-gray-500 sm:text-sm">
                    <DiscordIcon width={20} />
                  </span>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="bg-dark-1000 rounded-none rounded-r-md  px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-1/2 min-w-0 border border-dark-800"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">{i18n._(t`Enter your Discord invite link`)}</p>
              </div>

              <div className="sm:col-span-6">
                <Typography weight={700}>{i18n._(t`Reddit`)}</Typography>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-dark-800 text-gray-500 sm:text-sm">
                    <RedditIcon width={20} />
                  </span>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="bg-dark-1000 rounded-none rounded-r-md  px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-1/2 min-w-0 border border-dark-800"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">{i18n._(t`Enter your Reddit board link`)}</p>
              </div>

              <div className="sm:col-span-6">
                <Typography weight={700}>{i18n._(t`Medium`)}</Typography>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-dark-800 text-gray-500 sm:text-sm">
                    <MediumIcon width={20} />
                  </span>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="bg-dark-1000 rounded-none rounded-r-md  px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-1/2 min-w-0 border border-dark-800"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">{i18n._(t`Enter your Medium link`)}</p>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <div className="flex flex-col gap-1">
              <Typography variant="lg" className="text-high-emphesis" weight={700}>
                {i18n._(t`Whitelisting`)}
              </Typography>
              <Typography variant="sm" weight={400}>
                {i18n._(
                  t`Auctions are open by default. You can add a smart contract with approval logic to your auction. This will restrict users participating in your auction if enabled. Please refer to our developer documentation and sample list in our Github Repo.`
                )}
              </Typography>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <Typography variant="lg" className="text-high-emphesis" weight={700}>
                  {i18n._(t`Point List`)}
                </Typography>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dark-800 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <Typography
                        variant="sm"
                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        {i18n._(t`Upload a file`)}
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </Typography>
                      <p className="pl-1">{i18n._(t`or drag and drop`)}</p>
                    </div>
                    <p className="text-xs text-gray-500">{i18n._(t`CSV up to 10MB`)}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">{i18n._(t`CSV must use a comma delimiter`)}</p>
              </div>
            </div>
          </div>
          <div className="pt-8">
            <div className="flex flex-col gap-1">
              <Typography variant="lg" className="text-high-emphesis" weight={700}>
                {i18n._(t`Settings`)}
              </Typography>
              {/*<Typography variant="sm" weight={400}>*/}
              {/*  Please note that all social links must use https. Each social link will be displayed with their*/}
              {/*  corresponding brand icon*/}
              {/*</Typography>*/}
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <Typography weight={700}>{i18n._(t`Country Ban`)}</Typography>
                <div className="mt-2">
                  <select
                    id="country"
                    name="country"
                    autoComplete="country-name"
                    className="after:pr-2 bg-dark-1000 pr-10 rounded pl-3 py-2 outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-1/2 min-w-0 border border-dark-800"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6">
                <Typography weight={700}>{i18n._(t`Warning Message`)}</Typography>
                <div className="mt-2">
                  <textarea
                    rows={6}
                    name="description"
                    id="description"
                    autoComplete="description"
                    placeholder="The content contained in this website does not constitute an offer or sale of securities in or into the United States, or to or for the account or benefit of U.S. persons, or in any other jurisdictions where it is unlawful to do so. Transfer of BIT tokens may be subject to legal restrictions under applicable laws. Under no circumstances shall BIT tokens be reoffered, resold or transferred within the United States or to, or for the account or benefit of, U.S. persons, except pursuant to an exemption from, or in a transaction not subject to, the registration requirements of the U.S. Securities Act of 1933, as amended."
                    className="placeholder:text-low-emphesis bg-dark-1000 rounded px-3 outline-none py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 border border-dark-800"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {i18n._(t`Give a legal warning for your project in at most 300 characters`)}
                </p>
              </div>
            </div>
          </div>
          <div className="pt-8">
            <div className="flex flex-col gap-1">
              <Typography variant="lg" className="text-high-emphesis" weight={700}>
                {i18n._(t`Danger Zone`)}
              </Typography>
            </div>
            <div className="mt-6 w-1/3 border border-red/50 hover:border-red/100 rounded p-5">
              <div className="sm:col-span-2">
                <Typography weight={700} role="button" className="text-red">
                  {i18n._(t`Cancel this auction`)}
                </Typography>
                <p className="mt-2 text-sm text-red">
                  {i18n._(t`Once you cancel an auction, there is no going back. Please be certain.`)}
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {i18n._(t`The auction can only be cancelled by the admin before the start date`)}
            </p>
          </div>
        </div>

        <div className="pt-8">
          <div className="flex justify-end">
            <div>
              <Button
                color="gradient"
                className="!shadow-md inline-flex justify-center py-2 !px-10 !opacity-100 !text-high-emphesis hover:scale-[1.05] transform-all"
              >
                {i18n._(t`Save`)}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

MisoAuction.Layout = MisoLayout
MisoAuction.Guard = NetworkGuard(Feature.MISO)

export default MisoAuction
