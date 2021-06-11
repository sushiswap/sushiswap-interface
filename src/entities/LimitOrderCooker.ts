import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { ChainId, Token, WETH } from '@sushiswap/sdk'
import { Contract, ethers } from 'ethers'
import { toShare, ZERO } from '../functions'
import { getProviderOrSigner, getSigner } from '../functions'

import KASHIPAIR_ABI from '../constants/abis/kashipair.json'
import { defaultAbiCoder } from '@ethersproject/abi'
import { LimitOrderPermit } from '../hooks/useLimitOrderApproveCallback'
import { LimitOrder } from 'limitorderv2-sdk'

export async function signMasterContractApproval(
    bentoBoxContract: ethers.Contract | null,
    masterContract: string | undefined,
    user: string,
    library: ethers.providers.Web3Provider,
    approved: boolean,
    chainId: ChainId | undefined
): Promise<string> {
    const warning = approved
        ? 'Give FULL access to funds in (and approved to) BentoBox?'
        : 'Revoke access to BentoBox?'
    const nonce = await bentoBoxContract?.nonces(user)
    const message = {
        warning,
        user,
        masterContract,
        approved,
        nonce,
    }

    const typedData = {
        types: {
            SetMasterContractApproval: [
                { name: 'warning', type: 'string' },
                { name: 'user', type: 'address' },
                { name: 'masterContract', type: 'address' },
                { name: 'approved', type: 'bool' },
                { name: 'nonce', type: 'uint256' },
            ],
        },
        primaryType: 'SetMasterContractApproval',
        domain: {
            name: 'BentoBox V1',
            chainId: chainId,
            verifyingContract: bentoBoxContract?.address,
        },
        message: message,
    }
    const signer = getSigner(library, user)
    return signer._signTypedData(
        typedData.domain,
        typedData.types,
        typedData.message
    )
}

enum Action {
    ADD_ASSET = 1,
    REPAY = 2,
    REMOVE_ASSET = 3,
    REMOVE_COLLATERAL = 4,
    BORROW = 5,
    GET_REPAY_SHARE = 6,
    GET_REPAY_PART = 7,
    ACCRUE = 8,

    // Functions that don't need accrue to be called
    ADD_COLLATERAL = 10,
    UPDATE_EXCHANGE_RATE = 11,

    // Function on BentoBox
    BENTO_DEPOSIT = 20,
    BENTO_WITHDRAW = 21,
    BENTO_TRANSFER = 22,
    BENTO_TRANSFER_MULTIPLE = 23,
    BENTO_SETAPPROVAL = 24,

    // Any external call (except to BentoBox)
    CALL = 30,
}

export default class LimitOrderCooker {
    private token: Token
    private account: string
    private library: ethers.providers.Web3Provider | undefined
    private chainId: ChainId

    private actions: Action[]
    private values: BigNumber[]
    private datas: string[]

    constructor(
        token: Token,
        account: string | null | undefined,
        library: ethers.providers.Web3Provider | undefined,
        chainId: ChainId | undefined
    ) {
        this.token = token
        this.account = account || ethers.constants.AddressZero
        this.library = library
        this.chainId = chainId || 1

        this.actions = []
        this.values = []
        this.datas = []
    }

    add(action: Action, data: string, value: BigNumberish = 0): void {
        this.actions.push(action)
        this.datas.push(data)
        this.values.push(BigNumber.from(value))
    }

    approve(permit: LimitOrderPermit): void {
        if (permit) {
            this.add(
                Action.BENTO_SETAPPROVAL,
                ethers.utils.defaultAbiCoder.encode(
                    [
                        'address',
                        'address',
                        'bool',
                        'uint8',
                        'bytes32',
                        'bytes32',
                    ],
                    [
                        permit.account,
                        permit.masterContract,
                        true,
                        permit.v,
                        permit.r,
                        permit.s,
                    ]
                )
            )
        }
    }

    createLimitOrder(): LimitOrderCooker {
        const order = new LimitOrder()
    }

    bentoDepositCollateral(amount: BigNumber): LimitOrderCooker {
        const useNative = this.token.address === WETH[this.chainId].address

        this.add(
            Action.BENTO_DEPOSIT,
            defaultAbiCoder.encode(
                ['address', 'address', 'int256', 'int256'],
                [
                    useNative
                        ? ethers.constants.AddressZero
                        : this.token.address,
                    this.account,
                    amount,
                    0,
                ]
            ),
            useNative ? amount : ZERO
        )

        return this
    }

    action(
        address: string,
        value: BigNumberish,
        data: string,
        useValue1: boolean,
        useValue2: boolean,
        returnValues: number
    ): void {
        this.add(
            Action.CALL,
            defaultAbiCoder.encode(
                ['address', 'bytes', 'bool', 'bool', 'uint8'],
                [address, data, useValue1, useValue2, returnValues]
            ),
            value
        )
    }

    addAsset(amount: BigNumber, fromBento: boolean): LimitOrderCooker {
        let share: BigNumber
        if (fromBento) {
            share = toShare(this.token, amount)
        } else {
            const useNative = this.token.address === WETH[this.chainId].address

            this.add(
                Action.BENTO_DEPOSIT,
                defaultAbiCoder.encode(
                    ['address', 'address', 'int256', 'int256'],
                    [
                        useNative
                            ? ethers.constants.AddressZero
                            : this.token.address,
                        this.account,
                        amount,
                        0,
                    ]
                ),
                useNative ? amount : ZERO
            )
            share = BigNumber.from(-2)
        }

        this.add(
            Action.ADD_ASSET,
            defaultAbiCoder.encode(
                ['int256', 'address', 'bool'],
                [share, this.account, false]
            )
        )
        return this
    }

    // TODO
    async cook() {
        if (!this.library) {
            return {
                success: false,
            }
        }

        const kashiPairCloneContract = new Contract(
            this.pair.address,
            KASHIPAIR_ABI,
            getProviderOrSigner(this.library, this.account)
        )

        try {
            return {
                success: true,
                tx: await kashiPairCloneContract.cook(
                    this.actions,
                    this.values,
                    this.datas,
                    {
                        value: this.values.reduce((a, b) => a.add(b), ZERO),
                    }
                ),
            }
        } catch (error) {
            console.error('KashiCooker Error: ', error)
            return {
                success: false,
                error: error,
            }
        }
    }
}
