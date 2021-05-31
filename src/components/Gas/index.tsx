import useSWR, { SWRResponse } from 'swr'

import React, { FC } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

interface GasProps {
    className?: string
}

const Gas: FC<GasProps> = ({ className = '' }) => {
    const { i18n } = useLingui()
    const { data, error }: SWRResponse<{ average: number }, Error> = useSWR(
        'https://ethgasstation.info/api/ethgasAPI.json?',
        (url) => fetch(url).then((r) => r.json())
    )

    if (error) return <div>{i18n._(t`failed to load`)}</div>
    if (!data) return <div>{i18n._(t`loading...`)}</div>

    return <div className={className}>{data.average / 10}</div>
}

export default Gas
