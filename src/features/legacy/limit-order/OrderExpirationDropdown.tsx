import { FC, useCallback } from 'react'
import NeonSelect, { NeonSelectItem } from '../../../components/Select'

import { AppDispatch } from '../../../state'
import { OrderExpiration } from '../../../state/limit-order/reducer'
import QuestionHelper from '../../../components/QuestionHelper'
import { setOrderExpiration } from '../../../state/limit-order/actions'
import { t } from '@lingui/macro'
import { useDispatch } from 'react-redux'
import { useLimitOrderState } from '../../../state/limit-order/hooks'
import { useLingui } from '@lingui/react'

const OrderExpirationDropdown: FC = () => {
  const { i18n } = useLingui()
  const dispatch = useDispatch<AppDispatch>()
  const { orderExpiration } = useLimitOrderState()
  const items = {
    [OrderExpiration.never]: i18n._(t`Never`),
    [OrderExpiration.hour]: i18n._(t`1 Hour`),
    [OrderExpiration.day]: i18n._(t`24 Hours`),
    [OrderExpiration.week]: i18n._(t`1 Week`),
    [OrderExpiration.month]: i18n._(t`30 Days`),
  }

  const handler = useCallback(
    (e, item) => {
      dispatch(
        setOrderExpiration({
          label: items[item],
          value: item,
        })
      )
    },
    [dispatch, items]
  )

  return (
    <>
      <div className="flex items-center text-secondary gap-3 cursor-pointer">
        <div className="flex flex-row items-center">
          <span className="text-sm">{i18n._(t`Order Expiration`)}:</span>
          <QuestionHelper text={i18n._(t`Expiration is the time at which the order will become invalid`)} />
        </div>
        <NeonSelect value={orderExpiration.label}>
          {Object.entries(items).map(([k, v]) => (
            <NeonSelectItem key={k} value={k} onClick={handler}>
              {v}
            </NeonSelectItem>
          ))}
        </NeonSelect>
      </div>
    </>
  )
}

export default OrderExpirationDropdown
