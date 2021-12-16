import { t } from '@lingui/macro'
import { Trans, useLingui } from '@lingui/react'
import loadingCircle from 'app/animation/loading-circle.json'
import Button from 'app/components/Button'
import AuctionAdminFormTextField from 'app/features/miso/AuctionAdminForm/AuctionAdminFormTextField'
import { isAddressValidator, pipeline } from 'app/features/miso/AuctionAdminForm/validators'
import { Auction } from 'app/features/miso/context/Auction'
import useAuctionEdit from 'app/features/miso/context/hooks/useAuctionEdit'
import { classNames } from 'app/functions'
import Lottie from 'lottie-react'
import React, { FC, Fragment, useCallback, useState } from 'react'
interface ListOperatorProps {
  auction: Auction
}

const ListOperator: FC<ListOperatorProps> = ({ auction }) => {
  const { i18n } = useLingui()
  const [pending, setPending] = useState<boolean>(false)
  const { updatePermissionList } = useAuctionEdit(auction.auctionInfo.addr, auction.template)
  const [operator, setOperator] = useState<string>(auction.whitelist?.[0])
  const [error, setError] = useState<string>()

  const docs = (
    <a
      href="https://instantmiso.gitbook.io/miso/markets/lists"
      target="_blank"
      rel="noreferrer"
      className="text-purple"
    >
      {i18n._(t`here`)}
    </a>
  )

  const link = (
    <a href="https://miso.sushi.com/factory/points-list" target="_blank" rel="noreferrer" className="text-purple">
      {i18n._(t`here`)}
    </a>
  )

  const handlePermissionListOperator = useCallback(
    async (address: string) => {
      try {
        setPending(true)
        const tx = await updatePermissionList(address)

        if (tx.hash) {
          await tx.wait()
        }
      } catch (e) {
        console.error('Changing permission status failed: ', e.message)
      } finally {
        setPending(false)
      }
    },
    [updatePermissionList]
  )

  return (
    <>
      <div
        className={classNames(
          'flex col-span-6 gap-4',
          auction.auctionInfo.usePointList ? '' : 'pointer-events-none opacity-40 filter saturate-[0.1]'
        )}
      >
        <div className="flex flex-col flex-grow">
          <AuctionAdminFormTextField
            error={error}
            label={i18n._(t`Point List Address`)}
            onChange={(e) =>
              pipeline({ value: e.target.value }, [isAddressValidator], () => setOperator(e.target.value), setError)
            }
            placeholder="0x..."
            value={operator}
            helperText={
              <>
                <p className="mt-2 text-sm text-gray-500">
                  <Trans
                    id="An address or contract that contains and controls the list. You can create a point list {link}"
                    values={{ link }}
                    components={Fragment}
                  />
                </p>
                <p className="text-sm text-gray-500">
                  <Trans
                    id="More documentation on point lists can be found {docs}"
                    values={{ docs }}
                    components={Fragment}
                  />
                </p>
              </>
            }
          />
        </div>
      </div>
      <div className="flex col-span-6 justify-end">
        <div>
          <Button
            disabled={pending || auction.whitelist?.[0].toLowerCase() === operator.toLowerCase()}
            {...(pending && {
              startIcon: (
                <div className="w-5 h-5 mr-1">
                  <Lottie animationData={loadingCircle} autoplay loop />
                </div>
              ),
            })}
            color="blue"
            onClick={() => handlePermissionListOperator(operator)}
          >
            {i18n._(t`Update List Operator`)}
          </Button>
        </div>
      </div>
    </>
  )
}

export default ListOperator
