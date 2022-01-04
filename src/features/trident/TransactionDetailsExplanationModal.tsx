import { XIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Alert from 'app/components/Alert'
import Button from 'app/components/Button'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import React, { FC } from 'react'

const TransactionDetailsExplanationModal: FC = ({ children }) => {
  const { i18n } = useLingui()

  return (
    <HeadlessUiModal trigger={children}>
      {({ setOpen }) => (
        <div className="flex flex-col gap-9 px-7 py-9 lg:max-w-2xl">
          <div className="flex justify-between gap-3">
            <Typography variant="h3" weight={700} className="text-high-emphesis">
              {i18n._(t`Transaction Details`)}
            </Typography>
            <div role="button" className="h-8 w-8 cursor-pointer" onClick={() => setOpen(false)}>
              <XIcon className="text-high-emphesis" />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Typography weight={700} className="text-high-emphesis">
                {i18n._(t`Minimum Received`)}
              </Typography>
              <Typography variant="sm">
                {i18n._(
                  t`The minimum amount you’ll receive from your transaction, or else the transaction will revert.`
                )}
              </Typography>
            </div>
            <div className="flex flex-col gap-2">
              <Typography weight={700} className="text-high-emphesis">
                {i18n._(t`Price Impact`)}
              </Typography>
              <Typography variant="sm">
                {i18n._(
                  t`The difference between market price and estimated price due to the proportional makeup of the assets deposited.`
                )}
              </Typography>
            </div>
          </div>
          <Typography variant="h3" weight={700} className="text-high-emphesis">
            {i18n._(t`Fee Breakdown`)}
          </Typography>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Typography weight={700} className="text-high-emphesis">
                {i18n._(t`Liquidity Provider Fee`)}
              </Typography>
              <Typography variant="sm">{i18n._(t`0.25% of each swap goes to liquidity providers.`)}</Typography>
            </div>
            <div className="flex flex-col gap-2">
              <Typography weight={700} className="text-high-emphesis">
                {i18n._(t`xSUSHI Fee`)}
              </Typography>
              <Typography variant="sm">{i18n._(t`0.055% of each swap goes to xSUSHI holders.`)}</Typography>
            </div>
            <div className="flex flex-col gap-2">
              <Typography weight={700} className="text-high-emphesis">
                {i18n._(t`Estimated network Fee`)}
              </Typography>
              <Typography variant="sm">
                {i18n._(
                  t`This is our estimate of how much the gas cost for your transaction will be. Your wallet will give the true and final gas cost, which may be different from what is quoted.`
                )}
              </Typography>
            </div>
            <Alert
              showIcon
              dismissable={false}
              type="information"
              message={i18n._(
                t`Depositing with Zap Mode involves swapping your asset for the assets in the pool - this makes your transaction subject to swap-related fees.`
              )}
            />
          </div>

          {/*HeadlessUIModals need a focusable element so this is a hack..*/}
          <Button />
        </div>
      )}
    </HeadlessUiModal>
  )
}

export default TransactionDetailsExplanationModal
