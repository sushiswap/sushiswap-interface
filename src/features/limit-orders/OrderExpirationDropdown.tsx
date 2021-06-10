import { FC, useState } from 'react'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import QuestionHelper from '../../components/QuestionHelper'
import { ChevronDownIcon } from '@heroicons/react/outline'

const items = ['Never']

interface OrderExpirationDropdownProps {}

const OrderExpirationDropdown: FC<OrderExpirationDropdownProps> = () => {
    const { i18n } = useLingui()
    const [selected, setSelected] = useState('Never')

    // TODO
    return (
        <div
            className="flex items-center text-secondary gap-3 cursor-pointer"
            onClick={() => {}}
        >
            <div className="flex flex-row items-center">
                <span className="">{i18n._(t`Order Expiration`)}:</span>
                <QuestionHelper text="test" className="flex" />
            </div>
            <div className="flex border border-dark-800 rounded divide-x divide-dark-800">
                <div className="text-sm text-primary flex h-10 items-center pl-3 min-w-[80px]">
                    {selected}
                </div>
                <div className="flex h-10 items-center justify-center w-9 font-bold">
                    <ChevronDownIcon width={16} height={16} strokeWidth={2} />
                </div>
            </div>
        </div>
    )
}

export default OrderExpirationDropdown
