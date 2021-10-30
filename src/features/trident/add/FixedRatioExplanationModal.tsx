import { QuestionMarkCircleIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import BottomSlideIn from 'app/components/Dialog/BottomSlideIn'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import { FC, useState } from 'react'

const FixedRatioExplanationModal: FC = () => {
  const isDesktop = useDesktopMediaQuery()
  const [open, setOpen] = useState(false)
  const { i18n } = useLingui()

  const trigger = (
    <div className="flex items-center justify-center w-6 h-6 rounded cursor-pointer" onClick={() => setOpen(true)}>
      <QuestionMarkCircleIcon className="w-6 h-6 lg:w-4 lg:h-4 text-high-emphesis" />
    </div>
  )

  const content = (
    <div className="flex flex-col h-full p-5 gap-8 bg-dark-900 lg:max-w-lg lg:p-8">
      <div className="flex flex-col flex-grow gap-8">
        <div className="flex flex-col gap-6">
          <Typography variant="lg" weight={700} className="text-high-emphesis">
            {i18n._(
              t`Balanced Mode is an optional UI setting to maintain the traditional style of equal-value adds and removes.`
            )}
          </Typography>
          <Typography variant="sm" weight={400} className="text-high-emphesis">
            {i18n._(t`Previously, adding and removing liquidity had to be done with equal amounts of all assets. With the Trident
            update, this is no longer mandatory.`)}
          </Typography>
        </div>
      </div>
      <div className="flex flex-col self-end gap-3">
        <Typography weight={400} className="text-blue">
          {i18n._(t`Why use Balance Mode?`)}
        </Typography>
        <Typography weight={400} className="text-high-emphesis">
          {i18n._(
            t`Lower price impacts. The closer to equilibrium you interact with a pool, the lower price impact there is on your investment.`
          )}
        </Typography>
      </div>
    </div>
  )

  return (
    <>
      {isDesktop ? (
        <HeadlessUiModal trigger={trigger}>{() => content}</HeadlessUiModal>
      ) : (
        <>
          {trigger}
          <BottomSlideIn open={open} onClose={() => setOpen(false)}>
            {content}
          </BottomSlideIn>
        </>
      )}
    </>
  )
}

export default FixedRatioExplanationModal
