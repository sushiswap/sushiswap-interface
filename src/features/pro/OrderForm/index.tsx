import React, { FC, useState } from 'react'
import { useLingui } from '@lingui/react'
import { OrderType } from '../../../context/Pro/types'
import ToggleButtonGroup from '../../../components/Toggle/ToggleButtonGroup'
import ToggleButton from '../../../components/Toggle/ToggleButton'
import Button from '../../../components/Button'
import { t } from '@lingui/macro'
import Gas from '../../../components/Gas'
import Settings from '../../../components/Settings'

interface OrderFormProps {}

const OrderForm: FC<OrderFormProps> = () => {
    const { i18n } = useLingui()
    const [orderType, setOrderType] = useState<OrderType>(OrderType.MARKET)

    return (
        <div className="grid flex-col items-center p-4 gap-4">
            <div className="flex justify-between">
                <ToggleButtonGroup active={orderType} className="p-4 rounded">
                    <ToggleButton
                        className="rounded w-[50%]"
                        value={OrderType.MARKET}
                        onClick={() => setOrderType(OrderType.MARKET)}
                    >
                        {i18n._(t`Market`)}
                    </ToggleButton>
                    <ToggleButton
                        className="rounded w-[50%]"
                        value={OrderType.LIMIT}
                        onClick={() => setOrderType(OrderType.LIMIT)}
                    >
                        {i18n._(t`Limit`)}
                    </ToggleButton>
                </ToggleButtonGroup>
                <div className="flex gap-2">
                    <Gas className="flex items-center justify-center text-green px-2 h-[30px] bg-dark-900 rounded text-xs font-bold" />
                    <div className="bg-dark-900 rounded">
                        <Settings />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex flex-col">
                    <span className="text-xs">Amount</span>
                    <input />
                </div>
                <div className="flex gap-2">
                    <div>
                        <Button size="tiny" color="gray">
                            <span className="font-bold text-primary">25%</span>
                        </Button>
                    </div>
                    <div>
                        <Button color="gray" size="tiny">
                            <span className="font-bold text-primary">50%</span>
                        </Button>
                    </div>

                    <div>
                        <Button color="gray" size="tiny">
                            <span className="font-bold text-primary">75%</span>
                        </Button>
                    </div>
                    <div>
                        <Button color="gray" size="tiny">
                            <span className="font-bold text-primary">100%</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="gap-4 flex">
                <Button variant="outlined" color="green" className="w-full border border-green">
                    {i18n._(t`Buy`)}
                </Button>
                <Button variant="outlined" color="red" className="w-full border border-red">
                    {i18n._(t`Sell`)}
                </Button>
            </div>
        </div>
    )
}

export default OrderForm
