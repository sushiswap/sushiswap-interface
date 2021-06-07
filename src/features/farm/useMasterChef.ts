import {
    useActiveWeb3React,
    useMasterChefContract,
    useMasterChefV2Contract,
    useMiniChefV2Contract,
    useSushiContract,
} from '../../hooks'

import { ChefId } from './enum'
import ethers from 'ethers'
import { useCallback } from 'react'
import { useTransactionAdder } from '../../state/transactions/hooks'

export default function useMasterChef(chefId: ChefId) {
    const { account } = useActiveWeb3React()
    const addTransaction = useTransactionAdder()
    const sushiTokenContract = useSushiContract()
    const masterChefContract = useMasterChefContract()
    const masterChefV2Contract = useMasterChefV2Contract()
    const miniChefContract = useMiniChefV2Contract()

    const contracts = {
        [ChefId.MASTERCHEF]: masterChefContract,
        [ChefId.MASTERCHEF_V2]: masterChefV2Contract,
        [ChefId.MINICHEF]: miniChefContract,
    }

    const contract = contracts[chefId]

    // Deposit
    const deposit = useCallback(
        async (pid: number, amount: string, name: string, decimals = 18) => {
            // KMP decimals depend on asset, SLP is always 18
            try {
                const tx = await contract?.deposit(
                    pid,
                    ethers.utils.parseUnits(amount, decimals),
                    account
                )
                return addTransaction(tx, { summary: `Deposit ${name}` })
            } catch (e) {
                console.error(e)
                return e
            }
        },
        [account, addTransaction, contract]
    )

    // Withdraw
    const withdraw = useCallback(
        async (pid: number, amount: string, name: string, decimals = 18) => {
            try {
                const tx = await contract?.withdraw(
                    pid,
                    ethers.utils.parseUnits(amount, decimals),
                    account
                )
                return addTransaction(tx, { summary: `Withdraw ${name}` })
            } catch (e) {
                console.error(e)
                return e
            }
        },
        [account, addTransaction, contract]
    )

    const harvest = useCallback(
        async (pid: number, name: string) => {
            try {
                console.log('harvest:', pid, account)
                console.log({ masterChefV2Contract })

                const pendingSushi = await contract?.pendingSushi(pid, account)

                const balanceOf = await sushiTokenContract?.balanceOf(
                    masterChefV2Contract?.address
                )

                const tx =
                    chefId === ChefId.MASTERCHEF_V2 &&
                    pendingSushi.gt(balanceOf)
                        ? await contract?.batch(
                              [
                                  contract?.interface?.encodeFunctionData(
                                      'harvestFromMasterChef'
                                  ),
                                  contract?.interface?.encodeFunctionData(
                                      'harvest',
                                      [pid, account]
                                  ),
                              ],
                              true
                          )
                        : await contract?.harvest(pid, account)

                return addTransaction(tx, { summary: `Harvest ${name}` })
            } catch (e) {
                console.error(e)
                return e
            }
        },
        [account, addTransaction, contract, sushiTokenContract]
    )

    return { deposit, withdraw, harvest }
}
