import Dots from '../../components/Dots'
import React from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

const Loading = ({ term }: any) => {
    const { i18n } = useLingui()
    return (
        <>
            {term ? (
                <div className="w-full py-6 text-center">
                    {i18n._(t`No Results`)}
                </div>
            ) : (
                <div className="w-full py-6 text-center">
                    <Dots>{i18n._(t`Fetching Instruments`)}</Dots>
                </div>
            )}
        </>
    )
}

export default Loading
