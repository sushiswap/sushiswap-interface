import React from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { SimpleDots as Dots } from 'kashi/components'

const Loading = ({ term }: any) => {
    const { i18n } = useLingui()
    return (
        <>
            {term ? (
                <div className="w-full text-center py-6">{i18n._(t`No Results`)}</div>
            ) : (
                <div className="w-full text-center py-6">
                    <Dots>{i18n._(t`Fetching Instruments`)}</Dots>
                </div>
            )}
        </>
    )
}

export default Loading
