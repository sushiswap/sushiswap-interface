import { getAddress } from '@ethersproject/address'
import { DocumentAddIcon, DocumentDownloadIcon, ExclamationIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Fraction, JSBI } from '@sushiswap/core-sdk'
import loadingCircle from 'app/animation/loading-circle.json'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import WhitelistTable from 'app/features/miso/AuctionAdminForm/AuctionAdminFormWhitelistSection/WhitelistTable'
import { Auction } from 'app/features/miso/context/Auction'
import useAuctionEdit from 'app/features/miso/context/hooks/useAuctionEdit'
import { WhitelistEntry } from 'app/features/miso/context/types'
import { classNames } from 'app/functions'
import Lottie from 'lottie-react'
import React, { FC, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toWei } from 'web3-utils'

interface PointListDragAndDropProps {
  auction: Auction
}

const PointListDragAndDrop: FC<PointListDragAndDropProps> = ({ auction }) => {
  const { i18n } = useLingui()
  const { updatePointList } = useAuctionEdit(
    auction.auctionInfo.addr,
    auction.template,
    auction.marketInfo.liquidityTemplate,
    auction.whitelist?.[0]
  )
  const [wlAddresses, setWlAddresses] = useState<WhitelistEntry[]>([])
  const [pending, setPending] = useState<boolean>(false)

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const { result } = reader
        if (typeof result === 'string') {
          const arr = result.split('\r\n')
          const points = arr.reduce<WhitelistEntry[]>((acc, cur) => {
            if (cur !== '') {
              const [account, amount] = cur.split(',')
              acc.push({ account: getAddress(account), amount })
            }

            return acc
          }, [])

          setWlAddresses((prevState) => [...prevState, ...points])
        }
      }

      reader.readAsText(file)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept:
      '.csv, text/csv, application/vnd.ms-excel, application/csv, text/x-csv, application/x-csv, text/comma-separated-values, text/x-comma-separated-values',
  })

  const handleUpdatePointList = useCallback(async () => {
    try {
      setPending(true)

      const [accounts, amounts] = wlAddresses.reduce<[string[], string[]]>(
        (acc, cur) => {
          acc[0].push(cur.account)
          acc[1].push(
            new Fraction(
              toWei(cur.amount),
              JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18 - auction.paymentToken.decimals))
            ).quotient.toString()
          )
          return acc
        },
        [[], []]
      )

      const tx = await updatePointList(accounts, amounts)

      if (tx?.hash) {
        await tx.wait()
      }
    } catch (e) {
      console.error('Updating point list failed: ', e.message)
    } finally {
      setPending(false)
    }
  }, [auction.paymentToken.decimals, updatePointList, wlAddresses])

  return (
    <>
      <div
        className={classNames(
          wlAddresses.length > 0 ? 'sm:col-span-3' : 'sm:col-span-6',
          auction.auctionInfo.usePointList && auction.whitelist?.[0]
            ? ''
            : 'pointer-events-none opacity-40 filter saturate-[0.1]'
        )}
      >
        <Typography variant="lg" className="text-high-emphesis" weight={700}>
          {i18n._(t`Point List`)}
        </Typography>
        <Typography className="mt-1 text-secondary">{i18n._(t``)}</Typography>
        <div
          {...getRootProps()}
          className={classNames(
            isDragActive ? 'border border-purple' : 'border-dashed border-dark-800',
            'mt-2 flex justify-center px-6 pt-5 pb-6 border-2 rounded-md'
          )}
        >
          <div className="space-y-1 text-center flex flex-col items-center">
            {isDragReject ? (
              <ExclamationIcon width={48} />
            ) : isDragActive ? (
              <DocumentDownloadIcon width={48} />
            ) : (
              <DocumentAddIcon width={48} />
            )}
            <div className="flex text-sm text-gray-600">
              <Typography
                component={'label'}
                variant="sm"
                className={classNames(
                  isDragActive ? '' : 'text-purple',
                  'outline-none relative cursor-pointer rounded-md font-medium hover:purple focus-within:outline-none'
                )}
              >
                <label htmlFor="file-upload" className="cursor-pointer outline-none">
                  {isDragReject
                    ? i18n._(t`Files is not supported`)
                    : isDragActive
                    ? i18n._(t`Drop file to upload`)
                    : i18n._(t`Upload a file`)}
                </label>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only outline-none"
                  {...getInputProps()}
                />
              </Typography>
              {!isDragActive && <p className="pl-1">{i18n._(t`or drag and drop`)}</p>}
            </div>
            <p className="text-xs text-gray-500">{i18n._(t`CSV up to 10MB`)}</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {i18n._(t`Whitelisting must be enabled and an operator must be set before you can use a point list.`)}
        </p>
        <p className="text-sm text-gray-500">
          {i18n._(t`CSV's must use a comma delimiter. Amounts should NOT contain comma's`)}
        </p>
      </div>
      {wlAddresses.length > 0 && <WhitelistTable entries={wlAddresses} />}
      <div className="flex justify-end col-span-6">
        <div>
          <Button
            disabled={pending || wlAddresses.length === 0}
            {...(pending && {
              startIcon: (
                <div className="w-5 h-5 mr-1">
                  <Lottie animationData={loadingCircle} autoplay loop />
                </div>
              ),
            })}
            color="blue"
            onClick={handleUpdatePointList}
          >
            {i18n._(t`Update Point List`)}
          </Button>
        </div>
      </div>
    </>
  )
}

export default PointListDragAndDrop
