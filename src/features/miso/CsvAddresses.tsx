import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from '../../components/Typography'
import { CloudUploadIcon } from '@heroicons/react/outline'
import { shortenAddress } from '../../functions'
import Image from '../../components/Image'
import { ExclamationCircleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid'
import { useState } from 'react'

export default function CsvAddresses({ addresses, onManualMode }: any) {
  const { i18n } = useLingui()

  const [status, setStatus] = useState(0)

  return (
    <div className="mb-4 mr-[200px] pr-2">
      <Typography className="text-primary text-xl">{i18n._(t`Import Or Create List`)}*</Typography>
      <Typography className="text-secondary my-1">
        {i18n._(t`Autofill your list by uploading a .csv file below, or create one manually.`)}*
      </Typography>
      <div className="flex space-x-5 my-2">
        {status == 0 && (
          <div
            className="w-[310px] h-[180px] border border-1 border-dashed border-secondary flex flex-col items-center justify-center"
            onClick={() => setStatus(1)}
          >
            <CloudUploadIcon className="w-[30px] h-[30px] text-secondary" aria-hidden="true" />
            <Typography className="text-secondary mt-3">{i18n._(t`Choose or Drop a .csv`)}</Typography>
            <Typography className="text-secondary">{i18n._(t`file here to import list`)}</Typography>
          </div>
        )}
        {status == 1 && (
          <div className="w-[310px] h-[180px] border border-1 border-dashed border-secondary flex flex-col items-center justify-center">
            <CheckCircleIcon className="w-[50px] h-[50px] text-green" aria-hidden="true" />
            <Typography className="text-secondary mt-3">
              {i18n._(t`File test.csv was uploaded successfully.`)}
            </Typography>
            <div className="text-blue underline cursor-pointer text-sm mt-3 mb-5" onClick={() => setStatus(2)}>
              Use a different file
            </div>
          </div>
        )}
        {status == 2 && (
          <div className="w-[310px] h-[180px] border border-1 border-dashed border-secondary flex flex-col items-center justify-center">
            <XCircleIcon className="w-[50px] h-[50px] text-[#F5333B]" aria-hidden="true" />
            <Typography className="text-secondary mt-3">{i18n._(t`Error in processing file test.csv`)}</Typography>
            <div className="text-blue underline cursor-pointer text-sm mt-3 mb-5" onClick={() => setStatus(0)}>
              Use a different file
            </div>
          </div>
        )}
        <Image src="/images/miso/csv_preview.png" width={413} height={180} />
      </div>
      <div className="text-blue underline cursor-pointer text-sm mt-3 mb-5" onClick={() => onManualMode()}>
        Create List Manually
      </div>
      <div className="flex flex-row items-start space-x-2 bg-purple bg-opacity-20 bg- mt-2 p-3 rounded">
        <ExclamationCircleIcon className="w-5 h-5 mr-2 text-purple" aria-hidden="true" />
        <div>
          <Typography>
            {i18n._(
              t`Autofill your list by uploading a .csv file with the format below, or enter list manually in the next step.`
            )}
          </Typography>
          <Typography className="mt-5">{i18n._(t`CSV Formatting`)}</Typography>
          <Typography className="ml-2">
            &bull;&nbsp;
            {i18n._(t`In your spreadsheet, enter the name of your list as the filename and format the following:`)}
          </Typography>
          <Typography className="ml-2">&bull;&nbsp;{i18n._(t`The word “Address” in column 1A`)}</Typography>
          <Typography className="ml-2">&bull;&nbsp;{i18n._(t`The word “Amount” in column 1B`)}</Typography>
          <Typography className="ml-2">
            &bull;&nbsp;{i18n._(t`Addresses and amounts in subsequent A & B columns, respectively`)}
          </Typography>
          <Typography className="ml-2">
            &bull;&nbsp;{i18n._(t`Export from your spreadsheet application as a .CSV file and upload here`)}
          </Typography>
        </div>
      </div>
    </div>
  )
}
