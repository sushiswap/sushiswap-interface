import { Trade } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'
import React, { Fragment, memo, useContext } from 'react'
import { ChevronRight } from 'react-feather'
import { Flex } from 'rebass'
import { ThemeContext } from 'styled-components'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { TYPE } from '../../theme'

export default memo(function SwapRoute({ trade }: { trade: Trade }) {
    const theme = useContext(ThemeContext)
    const { chainId } = useActiveWeb3React()
    return (
        <Flex flexWrap="wrap" width="100%" justifyContent="flex-end" alignItems="center">
            {trade.route.path.map((token, i, path) => {
                const isLastItem: boolean = i === path.length - 1
                const currency = unwrappedToken(token)
                return (
                    <Fragment key={i}>
                        <div className="flex flex-end space-x-2">
                            <div className="text-sm font-bold  text-high-emphesis">{currency.getSymbol(chainId)}</div>
                        </div>
                        {isLastItem ? null : <ChevronRight size={12} color={theme.text3} />}
                    </Fragment>
                )
            })}
        </Flex>
    )
})
