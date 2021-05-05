import React from 'react'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useTokenBalance } from 'state/wallet/hooks'

function Position({ pair }: any) {
    const { account, chainId } = useActiveWeb3React()
    const userDefaultPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)

    console.log('Position...')

    return userDefaultPoolBalance ? (
        <div>
            Pair: {pair.liquidityToken.address}
            <br />
            Balance: {userDefaultPoolBalance.toSignificant(4)}
        </div>
    ) : null
}

export default Position
