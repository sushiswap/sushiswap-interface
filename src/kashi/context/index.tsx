import { useActiveWeb3React } from 'hooks'
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { useBentoBoxContract } from 'sushi-hooks/useContract'
import { Fraction } from '../../entities'
import { WETH, Currency, ChainId } from '@sushiswap/sdk'
import { takeFee, toElastic } from '../functions'
import { ethers } from 'ethers'
import { KASHI_ADDRESS, getCurrency } from '../constants'
import { useBoringHelperContract } from 'hooks/useContract'
import { getOracle } from '../entities'
import { BigNumber } from '@ethersproject/bignumber'
import _ from 'lodash'
import { e10, minimum, ZERO } from 'kashi/functions/math'
import { rpcToObj } from 'kashi/functions/utils'
import { toAmount, toShare } from 'kashi/functions/bentobox'
import { accrue, accrueTotalAssetWithFee, easyAmount, getUSDValue, interestAccrue } from 'kashi/functions/kashi'
import { useBlockNumber } from 'state/application/hooks'
import { bentobox } from '@sushiswap/sushi-data'
import { useAllTokens } from 'hooks/Tokens'

enum ActionType {
    UPDATE = 'UPDATE',
    SYNC = 'SYNC'
}

interface Reducer {
    type: ActionType
    payload: any
}

interface State {
    info:
        | {
              ethBalance: BigNumber
              sushiBalance: BigNumber
              sushiBarBalance: BigNumber
              xsushiBalance: BigNumber
              xsushiSupply: BigNumber
              sushiBarAllowance: BigNumber
              factories: {}[]
              ethRate: BigNumber
              sushiRate: BigNumber
              btcRate: BigNumber
              pendingSushi: BigNumber
              blockTimeStamp: BigNumber
              masterContractApproved: boolean[]
          }
        | undefined
    pairs: any[]
}

const initialState: State = {
    info: {
        ethBalance: ZERO,
        sushiBalance: ZERO,
        sushiBarBalance: ZERO,
        xsushiBalance: ZERO,
        xsushiSupply: ZERO,
        sushiBarAllowance: ZERO,
        factories: [],
        ethRate: ZERO,
        sushiRate: ZERO,
        btcRate: ZERO,
        pendingSushi: ZERO,
        blockTimeStamp: ZERO,
        masterContractApproved: []
    },
    pairs: []
}

export interface KashiContextProps {
    state: State
    dispatch: React.Dispatch<any>
}

type KashiProviderProps = {
    state: State
    dispatch: React.Dispatch<any>
}

export const KashiContext = createContext<{
    state: State
    dispatch: React.Dispatch<any>
}>({
    state: initialState,
    dispatch: () => null
})

const reducer: React.Reducer<State, Reducer> = (state: any, action: any) => {
    switch (action.type) {
        case ActionType.SYNC:
            return {
                ...state
            }
        case ActionType.UPDATE:
            const { info, pairs } = action.payload
            return {
                ...state,
                info,
                pairs
            }
        default:
            return state
    }
}

async function GetPairs(bentoBoxContract: any, chainId: ChainId) {
    let logs = []
    let success = false
    if (chainId != ChainId.BSC && chainId != ChainId.MATIC) {
        logs = await bentoBoxContract.queryFilter(bentoBoxContract.filters.LogDeploy(KASHI_ADDRESS))
        success = true
    }
    if (!success) {
        logs = ((await bentobox.clones({
            masterAddress: '0x2cba6ab6574646badc84f0544d05059e57a5dc42',
            chainId
        })) as any).map((clone: any) => {
            return {
                args: {
                    masterContract: '0x2cba6ab6574646badc84f0544d05059e57a5dc42',
                    cloneAddress: clone.address,
                    data: clone.data
                }
            }
        })
    }

    return logs.map((log: any) => {
        const deployParams = ethers.utils.defaultAbiCoder.decode(
            ['address', 'address', 'address', 'bytes'],
            log.args?.data
        )
        return {
            masterContract: log.args?.masterContract,
            address: log.args?.cloneAddress,
            collateralAddress: deployParams[0],
            assetAddress: deployParams[1],
            oracle: deployParams[2],
            oracleData: deployParams[3]
        }
    })
}

class Tokens extends Array {
    add(address: any) {
        if (!this[address]) {
            this[address] = { address: address }
        }
        return this[address]
    }
}

export function KashiProvider({ children }: { children: JSX.Element }) {
    const [state, dispatch] = useReducer<React.Reducer<State, Reducer>>(reducer, initialState)
    const blockNumber = useBlockNumber()

    const { account, chainId } = useActiveWeb3React()
    const chain: ChainId = chainId || 1
    const weth = WETH[chain].address
    const curreny: any = getCurrency(chain).address

    const boringHelperContract = useBoringHelperContract()
    const bentoBoxContract = useBentoBoxContract()

    // Default token list fine for now, might want to more to the broader collection later.
    const tokens = useAllTokens()

    const updatePairs = useCallback(
        async function() {
            if (!account || !chainId || [ChainId.MAINNET, ChainId.KOVAN, ChainId.BSC].indexOf(chainId) == -1) {
                return
            }
            if (boringHelperContract && bentoBoxContract) {
                const info = rpcToObj(
                    await boringHelperContract.getUIInfo(account, [], getCurrency(chainId).address, [KASHI_ADDRESS])
                )

                // Get the deployed pairs from the logs and decode
                const logPairs = await GetPairs(bentoBoxContract, chainId || 1)

                // Filter all pairs by supported oracles and verify the oracle setup
                const allPairAddresses = logPairs
                    .filter((pair: any) => getOracle(pair, chain, tokens).valid)
                    .map((pair: any) => pair.address)

                // Get full info on all the verified pairs
                const pairs = rpcToObj(await boringHelperContract.pollKashiPairs(account, allPairAddresses))

                // Get a list of all tokens in the pairs
                const pairTokens = new Tokens()
                pairTokens.add(curreny)
                pairs.forEach((pair: any, i: number) => {
                    pair.address = allPairAddresses[i]
                    pair.collateral = pairTokens.add(pair.collateral)
                    pair.asset = pairTokens.add(pair.asset)
                })

                // Get balances, bentobox info and allowences for the tokens
                const pairAddresses = Object.values(pairTokens).map((token: any) => token.address)
                const balances = rpcToObj(await boringHelperContract.getBalances(account, pairAddresses))

                const missingTokens: any[] = []
                balances.forEach((balance: any, i: number) => {
                    if (tokens[balance.token]) {
                        Object.assign(pairTokens[balance.token], tokens[balance.token])
                    } else {
                        missingTokens.push(balance.token)
                    }
                    Object.assign(pairTokens[balance.token], balance)
                })

                // For any tokens that are not on the defaultTokenList, retrieve name, symbol, decimals, etc.
                if (missingTokens.length) {
                    // TODO
                }

                // Calculate the USD price for each token
                Object.values(pairTokens).forEach((token: any) => {
                    token.symbol = token.address === weth ? Currency.getNativeCurrencySymbol(chain) : token.symbol
                    token.usd = e10(token.decimals).muldiv(pairTokens[curreny].rate, token.rate)
                })

                dispatch({
                    type: ActionType.UPDATE,
                    payload: {
                        info,
                        pairs: pairs.map((pair: any, i: number) => {
                            pair.elapsedSeconds = BigNumber.from(Date.now())
                                .div('1000')
                                .sub(pair.accrueInfo.lastAccrued)

                            // Interest per year at last accrue, this will apply during the next accrue
                            pair.interestPerYear = pair.accrueInfo.interestPerSecond
                                .mul('60')
                                .mul('60')
                                .mul('24')
                                .mul('365')

                            // The total collateral in the market (stable, doesn't accrue)
                            pair.totalCollateralAmount = easyAmount(
                                toAmount(pair.collateral, pair.totalCollateralShare),
                                pair.collateral
                            )

                            // The total assets unborrowed in the market (stable, doesn't accrue)
                            pair.totalAssetAmount = easyAmount(
                                toAmount(pair.asset, pair.totalAsset.elastic),
                                pair.asset
                            )

                            // The total assets borrowed in the market right now
                            pair.currentBorrowAmount = easyAmount(
                                accrue(pair, pair.totalBorrow.elastic, true),
                                pair.asset
                            )

                            // The total amount of assets, both borrowed and still available right now
                            pair.currentAllAssets = easyAmount(
                                pair.totalAssetAmount.value.add(pair.currentBorrowAmount.value),
                                pair.asset
                            )

                            pair.currentTotalAsset = accrueTotalAssetWithFee(pair)

                            pair.currentAllAssetShares = toShare(pair.asset, pair.currentAllAssets.value)

                            // Maximum amount of assets available for withdrawal or borrow
                            pair.maxAssetAvailable = minimum(
                                pair.totalAsset.elastic.muldiv(pair.currentAllAssets.value, pair.currentAllAssetShares),
                                toAmount(
                                    pair.asset,
                                    toElastic(pair.currentTotalAsset, pair.totalAsset.base.sub(1000), false)
                                )
                            )

                            pair.maxAssetAvailableFraction = pair.maxAssetAvailable.muldiv(
                                pair.currentTotalAsset.base,
                                pair.currentAllAssets.value
                            )

                            // The percentage of assets that is borrowed out right now
                            pair.utilization = e10(18).muldiv(
                                pair.currentBorrowAmount.value,
                                pair.currentAllAssets.value
                            )

                            // Interest per year received by lenders as of now
                            pair.supplyAPR = takeFee(pair.interestPerYear.muldiv(pair.utilization, e10(18)))

                            // Interest payable by borrowers per year as of now
                            pair.currentInterestPerYear = interestAccrue(pair, pair.interestPerYear)

                            // Interest per year received by lenders as of now
                            pair.currentSupplyAPR = takeFee(
                                pair.currentInterestPerYear.muldiv(pair.utilization, e10(18))
                            )

                            // The user's amount of collateral (stable, doesn't accrue)
                            pair.userCollateralAmount = easyAmount(
                                toAmount(pair.collateral, pair.userCollateralShare),
                                pair.collateral
                            )

                            // The user's amount of assets (stable, doesn't accrue)
                            pair.currentUserAssetAmount = easyAmount(
                                pair.userAssetFraction.muldiv(pair.currentAllAssets.value, pair.totalAsset.base),
                                pair.asset
                            )

                            // The user's amount borrowed right now
                            pair.currentUserBorrowAmount = easyAmount(
                                pair.userBorrowPart.muldiv(pair.currentBorrowAmount.value, pair.totalBorrow.base),
                                pair.asset
                            )

                            // The user's amount of assets that are currently lent
                            pair.currentUserLentAmount = easyAmount(
                                pair.userAssetFraction.muldiv(pair.currentBorrowAmount.value, pair.totalAsset.base),
                                pair.asset
                            )

                            // The user's maximum borrowable amount based on the collateral provided, using all three oracle values
                            pair.maxBorrowable = {
                                oracle: pair.userCollateralAmount.value.muldiv(
                                    e10(16).mul('75'),
                                    pair.oracleExchangeRate
                                ),
                                spot: pair.userCollateralAmount.value.muldiv(e10(16).mul('75'), pair.spotExchangeRate),
                                stored: pair.userCollateralAmount.value.muldiv(
                                    e10(16).mul('75'),
                                    pair.currentExchangeRate
                                )
                            }
                            pair.maxBorrowable.minimum = minimum(
                                pair.maxBorrowable.oracle,
                                pair.maxBorrowable.spot,
                                pair.maxBorrowable.stored
                            )
                            pair.maxBorrowable.safe = pair.maxBorrowable.minimum
                                .muldiv('95', '100')
                                .sub(pair.currentUserBorrowAmount.value)
                            pair.maxBorrowable.possible = minimum(pair.maxBorrowable.safe, pair.maxAssetAvailable)

                            pair.safeMaxRemovable = ZERO

                            pair.health = pair.currentUserBorrowAmount.value.muldiv(e10(18), pair.maxBorrowable.minimum)

                            pair.netWorth = getUSDValue(
                                pair.currentUserAssetAmount.value.sub(pair.currentUserBorrowAmount.value),
                                pair.asset
                            ).add(getUSDValue(pair.userCollateralAmount.value, pair.collateral))
                            pair.search = pair.asset.symbol + '/' + pair.collateral.symbol

                            pair.oracle = getOracle(pair, chain, tokens)

                            pair.interestPerYear = {
                                value: pair.interestPerYear,
                                string: pair.interestPerYear.toFixed(16)
                            }

                            pair.supplyAPR = {
                                value: pair.supplyAPR,
                                string: Fraction.from(pair.supplyAPR, e10(16)).toString()
                            }
                            pair.currentSupplyAPR = {
                                value: pair.currentSupplyAPR,
                                string: Fraction.from(pair.currentSupplyAPR, e10(16)).toString()
                            }
                            pair.currentInterestPerYear = {
                                value: pair.currentInterestPerYear,
                                string: Fraction.from(
                                    pair.currentInterestPerYear,
                                    BigNumber.from(10).pow(16)
                                ).toString()
                            }
                            pair.utilization = {
                                value: pair.utilization,
                                string: Fraction.from(pair.utilization, BigNumber.from(10).pow(16)).toString()
                            }
                            pair.health = {
                                value: pair.health,
                                string: Fraction.from(pair.health, e10(16))
                            }
                            pair.maxBorrowable = {
                                oracle: easyAmount(pair.maxBorrowable.oracle, pair.asset),
                                spot: easyAmount(pair.maxBorrowable.spot, pair.asset),
                                stored: easyAmount(pair.maxBorrowable.stored, pair.asset),
                                minimum: easyAmount(pair.maxBorrowable.minimum, pair.asset),
                                safe: easyAmount(pair.maxBorrowable.safe, pair.asset),
                                possible: easyAmount(pair.maxBorrowable.possible, pair.asset)
                            }
                            pair.safeMaxRemovable = easyAmount(pair.safeMaxRemovable, pair.collateral)

                            return pair
                        })
                    }
                })
            }
        },
        [boringHelperContract, bentoBoxContract, chainId, chain, account, tokens]
    )

    useEffect(() => {
        if (account && chainId && [ChainId.MAINNET, ChainId.KOVAN, ChainId.BSC].indexOf(chainId) != -1) {
            updatePairs()
        }
    }, [blockNumber, chainId, account])

    return (
        <KashiContext.Provider
            value={{
                state,
                dispatch
            }}
        >
            {children}
        </KashiContext.Provider>
    )
}

export function useKashiPairs() {
    const context = useContext(KashiContext)
    if (context === undefined) {
        throw new Error('useKashiPairs must be used within a KashiProvider')
    }
    return context.state.pairs
}

export function useKashiPair(address: string) {
    const context = useContext(KashiContext)
    if (context === undefined) {
        throw new Error('useKashiPair must be used within a KashiProvider')
    }
    return context.state.pairs.find((pair: any) => {
        return ethers.utils.getAddress(pair.address) === ethers.utils.getAddress(address)
    })
}
