import React, { useContext, useState } from 'react'
import { Button } from 'components'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { WETH } from '@sushiswap/sdk'
import { e10, ZERO } from 'kashi/functions/math'
import { Direction, TransactionReview } from 'kashi/entities/TransactionReview'
import TransactionReviewView from 'kashi/components/TransactionReview'
import { KashiCooker } from 'kashi/entities/KashiCooker'
import { Warnings } from 'kashi/entities'
import { formattedNum } from 'utils'
import { KashiContext } from 'kashi/context'
import SmartNumberInput from 'kashi/components/SmartNumberInput'
import WarningsView from 'kashi/components/Warnings'
import { KashiApproveButton, TokenApproveButton } from 'kashi/components/Button'
import { useCurrency } from 'hooks/Tokens'

export default function LendDepositAction({ pair }: any): JSX.Element {
    const { chainId } = useActiveWeb3React()
    const assetToken = useCurrency(pair.asset.address) || undefined

    // State
    const [useBento, setUseBento] = useState<boolean>(pair.asset.bentoBalance.gt(0))
    const [value, setValue] = useState('')

    const info = useContext(KashiContext).state.info

    // Calculated
    const assetNative = WETH[chainId || 1].address == pair.asset.address
    const balance = useBento ? pair.asset.bentoBalance : assetNative ? info?.ethBalance : pair.asset.balance

    const max = useBento ? pair.asset.bentoBalance : assetNative ? info?.ethBalance : pair.asset.balance

    const warnings = new Warnings().add(
        balance?.lt(value.toBigNumber(pair.asset.decimals)),
        `Please make sure your ${
            useBento ? 'BentoBox' : 'wallet'
        } balance is sufficient to deposit and then try again.`,
        true
    )

    const transactionReview = new TransactionReview()

    if (value && !warnings.broken) {
        const amount = value.toBigNumber(pair.asset.decimals)
        const newUserAssetAmount = pair.currentUserAssetAmount.value.add(amount)
        transactionReview.addTokenAmount('Balance', pair.currentUserAssetAmount.value, newUserAssetAmount, pair.asset)
        transactionReview.addUSD('Balance USD', pair.currentUserAssetAmount.value, newUserAssetAmount, pair.asset)
        const newUtilization = e10(18).muldiv(pair.currentBorrowAmount.value, pair.currentAllAssets.value.add(amount))
        transactionReview.addPercentage('Borrowed', pair.utilization.value, newUtilization)
        if (pair.currentExchangeRate.isZero()) {
            transactionReview.add(
                'Exchange Rate',
                formattedNum(pair.currentExchangeRate.toFixed(18 + pair.collateral.decimals - pair.asset.decimals)),
                formattedNum(pair.oracleExchangeRate.toFixed(18 + pair.collateral.decimals - pair.asset.decimals)),
                Direction.UP
            )
        }
        transactionReview.addPercentage('Supply APR', pair.supplyAPR.value, pair.currentSupplyAPR.value)
    }

    // Handlers
    async function onExecute(cooker: KashiCooker): Promise<string> {
        if (pair.currentExchangeRate.isZero()) {
            cooker.updateExchangeRate(false, ZERO, ZERO)
        }
        cooker.addAsset(value.toBigNumber(pair.asset.decimals), useBento)
        return `Deposit ${pair.asset.symbol}`
    }

    return (
        <>
            <div className="text-3xl text-high-emphesis mt-6">Deposit {pair.asset.symbol}</div>

            <SmartNumberInput
                color="blue"
                token={pair.asset}
                value={value}
                setValue={setValue}
                useBentoTitleDirection="down"
                useBentoTitle="from"
                useBento={useBento}
                setUseBento={setUseBento}
                maxTitle="Balance"
                max={max}
                showMax={true}
            />

            <WarningsView warnings={warnings}></WarningsView>
            <TransactionReviewView transactionReview={transactionReview}></TransactionReviewView>

            <KashiApproveButton
                color="blue"
                content={(onCook: any) => (
                    <TokenApproveButton value={value} token={assetToken} needed={!useBento}>
                        <Button
                            onClick={() => onCook(pair, onExecute)}
                            disabled={value.toBigNumber(pair.asset.decimals).lte(0) || warnings.broken}
                        >
                            Deposit
                        </Button>
                    </TokenApproveButton>
                )}
            />
        </>
    )
}
