import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import QuestionHelper from 'app/components/QuestionHelper'
import NeonSelect, { NeonSelectItem } from 'app/components/Select'
import { AppDispatch } from 'app/state'
import { setOrderExpiration } from 'app/state/limit-order/actions'
import { useLimitOrderState } from 'app/state/limit-order/hooks'
import { OrderExpiration } from 'app/state/limit-order/reducer'
import { FC, useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'

const OrderExpirationDropdown: FC = () => {
  const { i18n } = useLingui()
  const dispatch = useDispatch<AppDispatch>()
  const { orderExpiration } = useLimitOrderState()
  const items = useMemo(
    () => ({
      [OrderExpiration.never]: i18n._(t`Never`),
      [OrderExpiration.hour]: i18n._(t`1 Hour`),
      [OrderExpiration.day]: i18n._(t`24 Hours`),
      [OrderExpiration.week]: i18n._(t`1 Week`),
      [OrderExpiration.month]: i18n._(t`30 Days`),
    }),
    [i18n]
  )

  const handler = useCallback(
    (e, item) => {
      dispatch(
        setOrderExpiration({
          // @ts-ignore TYPE NEEDS FIXING
          label: items[item],
          value: item,
        })
      )
    },
    [dispatch, items]
  )

  return (
    <>
      <div className="flex items-center gap-3 cursor-pointer text-secondary">
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
