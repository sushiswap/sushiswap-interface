import React, { useContext, useState } from 'react'
import { Alert, Dots, Button } from 'kashi/components'
import { Input as NumericalInput } from 'components/NumericalInput'
import { ArrowDownRight } from 'react-feather'
import { useActiveWeb3React } from 'hooks'
import { BENTOBOX_ADDRESS, KASHI_ADDRESS } from 'kashi/constants'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { Token, TokenAmount, WETH } from '@sushiswap/sdk'
import { e10, maximum, minimum, ZERO } from 'kashi/functions/math'
import { Direction, TransactionReview } from 'kashi/entities/TransactionReview'
import TransactionReviewView from 'kashi/components/TransactionReview'
import { KashiCooker } from 'kashi/entities/KashiCooker'
import { useKashiApproveCallback, BentoApprovalState } from 'kashi/hooks'
import { useKashiApprovalPending } from 'state/application/hooks'
import { Warnings } from 'kashi/entities'
import { formattedNum } from 'utils'
import { KashiContext } from 'kashi/context'
import { MaxUint256 } from '@ethersproject/constants'
import { useTokenAllowance } from 'data/Allowances'

export default function LendDepositAction({ pair }: any): JSX.Element {
    const { account, chainId } = useActiveWeb3React()
    const pendingApprovalMessage = useKashiApprovalPending()

    // State
    const [useBento, setUseBento] = useState<boolean>(pair.asset.bentoBalance.gt(0))
    const [value, setValue] = useState('')

    const token = new Token(chainId || 1, pair.asset.address, pair.asset.decimals, pair.asset.symbol, pair.asset.name)

    const currentAllowance = useTokenAllowance(token, account ?? undefined, BENTOBOX_ADDRESS)

    const [approvalState, approve] = useApproveCallback(
        new TokenAmount(
            new Token(chainId || 1, pair.asset.address, pair.asset.decimals, pair.asset.symbol, pair.asset.name),
            currentAllowance?.equalTo('0') ? MaxUint256.toString() : value.toBigNumber(pair.asset.decimals).toString()
        ),
        BENTOBOX_ADDRESS
    )

    const info = useContext(KashiContext).state.info

    const [kashiApprovalState, approveKashiFallback, kashiPermit, onApprove, onCook] = useKashiApproveCallback(
        KASHI_ADDRESS
    )

    // Calculated
    const assetNative = WETH[chainId || 1].address == pair.asset.address
    const balance = useBento ? pair.asset.bentoBalance : assetNative ? info?.ethBalance : pair.asset.balance

    const max = (useBento
        ? pair.asset.bentoBalance
        : assetNative
        ? maximum(info?.ethBalance.sub(e10(17)) || ZERO, ZERO)
        : pair.asset.balance
    ).toFixed(pair.asset.decimals)

    const warnings = new Warnings().add(
        balance?.lt(value.toBigNumber(pair.asset.decimals)),
        `Please make sure your ${
            useBento ? 'BentoBox' : 'wallet'
        } balance is sufficient to deposit and then try again.`,
        true
    )

    const showApprove =
        chainId &&
        pair.asset.address !== WETH[chainId].address &&
        !useBento &&
        value &&
        (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING)

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

            <div className="flex justify-between my-4">
                <div className="text-base text-secondary">
                    <span>
                        <ArrowDownRight size="1rem" style={{ display: 'inline' }} />
                    </span>
                    <span> from </span>
                    <span>
                        <Button
                            variant="outlined"
                            color="blue"
                            className="focus:ring focus:ring-blue"
                            onClick={() => {
                                setUseBento(!useBento)
                            }}
                        >
                            {useBento ? 'BentoBox' : 'Wallet'}
                        </Button>
                    </span>
                </div>
                <div className="text-base text-secondary" style={{ display: 'inline', cursor: 'pointer' }}>
                    Balance: {formattedNum(max)} {pair.asset.symbol}
                </div>
            </div>

            <div className="flex items-center relative w-full mb-4">
                <NumericalInput
                    className="w-full p-3 bg-input rounded focus:ring focus:ring-blue"
                    value={value}
                    onUserInput={setValue}
                />
                {account && (
                    <Button
                        variant="outlined"
                        color="blue"
                        onClick={() => setValue(max)}
                        className="absolute right-4 focus:ring focus:ring-blue"
                    >
                        MAX
                    </Button>
                )}
            </div>

            {warnings.map((warning, i) => (
                <Alert
                    key={i}
                    type={warning.breaking ? 'error' : 'warning'}
                    message={warning.message}
                    className="mb-4"
                />
            ))}

            <TransactionReviewView transactionReview={transactionReview}></TransactionReviewView>

            {approveKashiFallback && (
                <Alert
                    message="Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click again and the fallback method will be used."
                    className="mb-4"
                />
            )}

            {(kashiApprovalState === BentoApprovalState.NOT_APPROVED ||
                kashiApprovalState === BentoApprovalState.PENDING) &&
                !kashiPermit && (
                    <Button color="blue" onClick={onApprove} className="mb-4">
                        {kashiApprovalState === BentoApprovalState.PENDING ? (
                            <Dots>{pendingApprovalMessage}</Dots>
                        ) : (
                            `Approve Kashi`
                        )}
                    </Button>
                )}

            {(kashiApprovalState === BentoApprovalState.APPROVED || kashiPermit) && (
                <>
                    {showApprove && (
                        <Button color="blue" onClick={approve} className="mb-4">
                            {approvalState === ApprovalState.PENDING ? (
                                <Dots>Approving {pair.asset.symbol}</Dots>
                            ) : (
                                `Approve ${pair.asset.symbol}`
                            )}
                        </Button>
                    )}

                    {!showApprove && (
                        <Button
                            color="blue"
                            onClick={() => onCook(pair, onExecute)}
                            disabled={balance.eq(0) || value.toBigNumber(pair.asset.decimals).lte(0) || warnings.broken}
                        >
                            Deposit
                        </Button>
                    )}
                </>
            )}
        </>
    )
}
