import { ChainId } from '@figswap/core-sdk'
import ExternalLink from 'app/components/ExternalLink'
import Typography from 'app/components/Typography'
import {
  TABLE_TABLE_CLASSNAME,
  TABLE_TBODY_TR_CLASSNAME,
  TABLE_WRAPPER_DIV_CLASSNAME,
} from 'app/features/trident/constants'
import { classNames, formatDateAgo, formatNumber, formatNumberScale, getExplorerLink } from 'app/functions'
import { useRouter } from 'next/router'

interface SushiInOutProps {
  title: string
  xsushi: any
  transactions: any[]
  sushiIn: boolean
}

export const TABLE_TR_TH_CLASSNAME = (i: number, length: number) =>
  classNames('text-secondary text-sm py-3', i === 0 ? 'pl-8 text-left' : 'text-right', i === length - 1 ? 'pr-8' : '')

export const TABLE_TBODY_TD_CLASSNAME = (i: number, length: number) =>
  classNames('py-3', i === 0 ? 'pl-8 text-left' : 'text-right', i === length - 1 ? 'pr-8' : '')

export default function SushiInOut({ title, xsushi, transactions, sushiIn }: SushiInOutProps) {
  const router = useRouter()
  const chainId = router.query.chainId as string

  return (
    <div className="w-full py-3">
      <Typography variant="h3">{title}</Typography>
      <div className={TABLE_WRAPPER_DIV_CLASSNAME}>
        <table className={TABLE_TABLE_CLASSNAME}>
          <thead>
            <tr className={TABLE_TBODY_TR_CLASSNAME}>
              {sushiIn ? (
                <th className={TABLE_TR_TH_CLASSNAME(0, 3)}>SUSHI</th>
              ) : (
                <th className={TABLE_TR_TH_CLASSNAME(0, 3)}>xSUSHI</th>
              )}
              {sushiIn ? (
                <th className={TABLE_TR_TH_CLASSNAME(1, 3)}>xSUSHI</th>
              ) : (
                <th className={TABLE_TR_TH_CLASSNAME(1, 3)}>SUSHI</th>
              )}
              <th className={TABLE_TR_TH_CLASSNAME(2, 3)}>Ratio</th>
              <th className={TABLE_TR_TH_CLASSNAME(3, 3)}>Type</th>
              <th className={TABLE_TR_TH_CLASSNAME(4, 3)}>Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index} className={TABLE_TBODY_TR_CLASSNAME}>
                {sushiIn ? (
                  <td className={TABLE_TBODY_TD_CLASSNAME(0, 3)}>
                    {formatNumberScale(transaction.amount * transaction.sushiXsushiRatio ?? 0)}
                  </td>
                ) : (
                  <td className={TABLE_TBODY_TD_CLASSNAME(0, 3)}>{formatNumber(transaction.amount ?? 0, false)}</td>
                )}
                {sushiIn ? (
                  <td className={TABLE_TBODY_TD_CLASSNAME(1, 3)}>{formatNumber(transaction.amount ?? 0, false)}</td>
                ) : (
                  <td className={TABLE_TBODY_TD_CLASSNAME(1, 3)}>
                    {formatNumberScale(transaction.amount * transaction.sushiXsushiRatio ?? 0)}
                  </td>
                )}
                <td className={TABLE_TBODY_TD_CLASSNAME(2, 3)}>
                  {formatNumber(transaction.sushiXsushiRatio ?? 0, false)}
                </td>
                <td className={TABLE_TBODY_TD_CLASSNAME(3, 3)}>{transaction.type}</td>
                <td className={TABLE_TBODY_TD_CLASSNAME(4, 3)}>
                  <ExternalLink
                    href={getExplorerLink(Number(chainId) ?? ChainId.ETHEREUM, transaction.id, 'transaction')}
                  >
                    <div className="overflow-hidden cursor-pointer overflow-ellipsis whitespace-nowrap text-purple">
                      {formatDateAgo(new Date(transaction.timestamp * 1000))}
                    </div>
                  </ExternalLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
