import GradientDot from 'app/components/GradientDot'
import { Fraction } from 'app/entities'
import { AssetCell } from 'app/features/account/AssetBalances/AssetCell'
import { CollateralData } from 'app/features/account/AssetBalances/kashi/KashiCollateral'
import { CellProps } from 'app/features/account/AssetBalances/useBasicTableConfig'
import { ValueCell } from 'app/features/account/AssetBalances/ValueCell'
import { formatPercent } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import React, { useMemo } from 'react'

export const useCollateralTableConfig = (data: CollateralData[]) => {
  const { chainId } = useActiveWeb3React()

  const columns = useMemo(
    () =>
      chainId
        ? [
            {
              Header: 'Collateral',
              accessor: 'collateral',
              className: 'text-left',
              Cell: (props: CellProps) => AssetCell(props.cell.value),
            },
            {
              Header: 'Value',
              accessor: 'value',
              className: 'text-left',
              Cell: (props: CellProps) => ValueCell(props.cell.value),
            },
            {
              Header: 'Limit used',
              accessor: 'limit',
              maxWidth: 100,
              className: 'text-left',
              Cell: (props: { cell: { value: Fraction } }) => {
                return (
                  <div className="flex items-center justify-end">
                    {formatPercent(props.cell.value)}
                    <GradientDot percent={props.cell.value} />
                  </div>
                )
              },
            },
          ]
        : [],
    [chainId]
  )

  return useMemo(
    () => ({
      columns,
      data,
    }),
    [columns, data]
  )
}
