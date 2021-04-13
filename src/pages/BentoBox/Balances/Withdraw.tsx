import { Button } from 'kashi/components'
import React, { useState } from 'react'
import useBentoBox from 'hooks/useBentoBox'
import { formattedNum } from 'utils'
import { Input as NumericalInput } from 'components/NumericalInput'
import { useActiveWeb3React } from 'hooks'
import { useBentoBalance } from 'state/bentobox/hooks'

function Withdraw({ tokenAddress, tokenSymbol }: { tokenAddress: string; tokenSymbol: string }): JSX.Element {
    const { account } = useActiveWeb3React()

    const { withdraw } = useBentoBox()

    const balance = useBentoBalance(tokenAddress)

    const [pendingTx, setPendingTx] = useState(false)

    const [value, setValue] = useState('')

    return (
        <>
            {account && (
                <div className="text-sm text-secondary cursor-pointer text-right mb-2 pr-4">
                    Bento Balance: {formattedNum(balance ? balance.value.toFixed(balance.decimals) : 0)}
                </div>
            )}
            <div className="flex items-center relative w-full mb-4">
                <NumericalInput
                    className="w-full p-3 bg-input rounded focus:ring focus:ring-pink"
                    value={value}
                    onUserInput={value => {
                        setValue(value)
                    }}
                />
                {account && (
                    <Button
                        variant="outlined"
                        color="pink"
                        onClick={() => {
                            setValue(balance.value.toFixed(balance.decimals))
                        }}
                        className="absolute right-4 focus:ring focus:ring-pink"
                    >
                        MAX
                    </Button>
                )}
            </div>
            <Button
                color="pink"
                disabled={pendingTx || !balance || value.toBigNumber(balance.decimals).lte(0)}
                onClick={async () => {
                    setPendingTx(true)
                    await withdraw(tokenAddress, value.toBigNumber(balance.decimals))
                    setPendingTx(false)
                }}
            >
                Withdraw
            </Button>
        </>
    )
}

export default Withdraw
