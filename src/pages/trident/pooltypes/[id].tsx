import TridentLayout from '../../../layouts/Trident'
import Typography from '../../../components/Typography'
import { t } from '@lingui/macro'
import Button from '../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { useLingui } from '@lingui/react'
import { POOL_TYPES } from '../../../features/trident/constants'
import { useRouter } from 'next/router'
import { PoolType } from '../../../features/trident/types'
import Image from 'next/image'

const PoolTypePage = () => {
  const { i18n } = useLingui()
  const { query } = useRouter()
  const { id } = query
  const { label_long, image } = POOL_TYPES[(id as string).toUpperCase() as PoolType]

  return (
    <div className="flex flex-col w-full gap-9 mt-px">
      <div className="flex flex-row justify-between bg-dark-800 bg-auto bg-wavy-pattern bg-opacity-98 gap-4 h-[180px]">
        <div className="flex flex-col gap-5 p-5">
          <div className="flex flex-row">
            <Button
              color="blue"
              variant="outlined"
              size="sm"
              className="inline rounded-full py-1 pl-2"
              startIcon={<ChevronLeftIcon width={24} height={24} />}
            >
              <Link href={`/trident/pooltypes`}>{i18n._(t`Back`)}</Link>
            </Button>
          </div>
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {label_long}
          </Typography>
        </div>
        <div className="mt-[30px] relative">
          <Image
            src={image.url}
            width={image.width * 2}
            height={image.height * 2}
            alt="pool image"
            layout="responsive"
          />
        </div>
      </div>
      <div className="px-5 flex flex-col gap-4">
        <Typography variant="h3" className="text-high-emphesis" weight={700}>
          {i18n._(t`Introduction`)}
        </Typography>
        <Typography variant="sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim bibendum in ut amet, sit fames. Iaculis
          ultrices sit fermentum commodo nisl eget etiam fusce ac. Risus enim sollicitudin phasellus nibh. Neque turpis
          amet at scelerisque vitae nibh magna. Aliquet ut natoque quisque eget pellentesque id. Convallis enim.
        </Typography>
      </div>
    </div>
  )
}

PoolTypePage.Layout = TridentLayout

export default PoolTypePage
