import ExternalLink from 'app/components/ExternalLink'
import { formatNumber, formatPercent, getExplorerLink } from 'app/functions'
import { useAllTokens } from 'app/hooks/Tokens'
import { useMemo } from 'react'
import { ExternalLink as ExternalLinkIcon } from 'react-feather'

export const useTableConfig = (chainId: number, users: any) => {
  const allTokens = useAllTokens()
  const data = useMemo(() => {
    return (
      users
        // @ts-ignore
        ?.map((user: any) => ({
          id: user.id,
          address: user.address,
          share: user.share,
          amount: user.amount,
          amountUSD: user.amountUSD,
        }))
    )
  }, [users])

  const columns = useMemo(
    () => [
      {
        Header: 'Liquidity Provider',
        accessor: 'address',
        Cell: (props: any) => (
          <div className="flex items-center gap-2">
            <ExternalLink
              href={getExplorerLink(chainId, props.value, 'address')}
              endIcon={
                <>
                  &nbsp;
                  <ExternalLinkIcon size={18} />
                </>
              }
            >
              {props.value}
            </ExternalLink>
          </div>
        ),
      },
      {
        Header: 'Pool Share',
        accessor: 'share',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatPercent(props.value, '0'),
        align: 'right',
      },
      {
        Header: 'Liquidity Token Staked',
        accessor: 'amountUSD',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatNumber(props.value, true, false, 2),
        align: 'right',
      },
    ],
    [chainId]
  )

  return useMemo(
    () => ({
      config: {
        columns,
        data: data ?? [],
        initialState: {
          sortBy: [{ id: 'amountUSD', desc: true }],
        },
        autoResetFilters: false,
      },
      // loading: isValidating,
      // error,
    }),
    [columns, data]
  )
}
