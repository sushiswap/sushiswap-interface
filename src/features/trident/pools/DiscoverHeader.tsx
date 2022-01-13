import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Link from 'next/link'
import React, { FC } from 'react'

import Button from '../../../components/Button'
import Typography from '../../../components/Typography'
import { TridentHeader } from '../../../layouts/Trident'

const HeaderButton: FC<{ title: string; linkTo: string; id?: string }> = ({ title, linkTo, id }) => (
  <Link href={linkTo} passHref={true}>
    <Button
      id={id}
      color="gradient"
      variant="outlined"
      className="flex-1 text-sm font-bold text-white sm:flex-none md:flex-1 h-9"
    >
      {title}
    </Button>
  </Link>
)

export const DiscoverHeader: FC = () => {
  const { i18n } = useLingui()

  return (
    <TridentHeader maxWidth="full" pattern="bg-binary-pattern" className="sm:!flex-row justify-between items-center">
      <div>
        <Typography variant="h2" className="text-high-emphesis" weight={700}>
          {i18n._(t`Provide liquidity & earn.`)}
        </Typography>
        <Typography variant="sm" weight={400}>
          {i18n._(t`Earn LP fees by depositing tokens to the platform.`)}
        </Typography>
      </div>
      <div className="flex gap-3 w-80 sm:flex-col md:flex-row">
        <HeaderButton id="btn-create-new-pool" title={i18n._(t`Create New Pool`)} linkTo="/trident/create" />
        <HeaderButton title={i18n._(t`My Positions`)} linkTo="/farm" />
      </div>
    </TridentHeader>
  )
}
