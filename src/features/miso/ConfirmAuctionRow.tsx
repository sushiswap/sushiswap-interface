import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import useCopyClipboard from '../../hooks/useCopyClipboard'
import Typography from '../../components/Typography'
import { DuplicateIcon, ArrowSmRightIcon } from '@heroicons/react/outline'
import { shortenAddress } from '../../functions'

export default function ConfirmAuctionRow({ title, content, showCopy, toCopy }: any) {
  const { i18n } = useLingui()
  const [isCopied, setCopied] = useCopyClipboard()

  return (
    <div className="mb-4">
      <Typography className="text-secondary font-bold my-1">{i18n._(`${title}`)}*</Typography>
      <div className="px-4 py-1.5 rounded bg-dark-900 flex space-x-2 items-center">
        <div className="flex space-x-5">
          {content && <Typography className="text-primary">{i18n._(`${content}`)}</Typography>}
          {toCopy && <Typography className="text-primary">{i18n._(`${shortenAddress(toCopy)}`)}</Typography>}
        </div>
        {showCopy && <DuplicateIcon className="cursor-pointer w-[20px] h-[20px]" onClick={() => setCopied(toCopy)} />}
      </div>
    </div>
  )
}
