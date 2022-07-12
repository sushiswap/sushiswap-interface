import Typography from 'app/components/Typography'
import {
  TABLE_TABLE_CLASSNAME,
  TABLE_TBODY_TR_CLASSNAME,
  TABLE_WRAPPER_DIV_CLASSNAME,
} from 'app/features/trident/constants'
import { classNames, formatDateAgo, formatNumber, formatNumberScale } from 'app/functions'

interface SushiInOutProps {
  title: string
  xsushi: any
  transactions: any[]
}

export const TABLE_TR_TH_CLASSNAME = (i: number, length: number) =>
  classNames('text-secondary text-sm py-3', i === 0 ? 'pl-8 text-left' : 'text-right', i === length - 1 ? 'pr-8' : '')

export const TABLE_TBODY_TD_CLASSNAME = (i: number, length: number) =>
  classNames('py-3', i === 0 ? 'pl-8 text-left' : 'text-right', i === length - 1 ? 'pr-8' : '')

export default function SushiInOut({ title, xsushi, transactions }: SushiInOutProps) {
  return (
    <div className="w-full py-3">
      <Typography variant="h3">{title}</Typography>
      <div className={TABLE_WRAPPER_DIV_CLASSNAME}>
        <table className={TABLE_TABLE_CLASSNAME}>
          <thead>
            <tr className={TABLE_TBODY_TR_CLASSNAME}>
              <th className={TABLE_TR_TH_CLASSNAME(0, 3)}>SUSHI</th>
              <th className={TABLE_TR_TH_CLASSNAME(1, 3)}>xSUSHI</th>
              <th className={TABLE_TR_TH_CLASSNAME(2, 3)}>TIME</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index} className={TABLE_TBODY_TR_CLASSNAME}>
                <td className={TABLE_TBODY_TD_CLASSNAME(0, 3)}>{formatNumber(transaction.amount ?? 0, false)}</td>
                <td className={TABLE_TBODY_TD_CLASSNAME(1, 3)}>
                  {formatNumberScale(transaction.amount * xsushi.xSushiSushiRatio ?? 0)}
                </td>
                <td className={TABLE_TBODY_TD_CLASSNAME(2, 3)}>
                  {formatDateAgo(new Date(transaction.timestamp * 1000))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
