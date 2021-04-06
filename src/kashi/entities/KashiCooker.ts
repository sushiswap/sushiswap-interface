import { defaultAbiCoder } from "@ethersproject/abi"
import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
import { ChainId } from "@sushiswap/sdk"
import { Contract, ethers } from "ethers"
import { KASHI_ADDRESS } from "kashi/constants"
import { toShare } from "kashi/functions/bentobox"
import { useBentoBoxContract } from "sushi-hooks/useContract"
import { getContract, getProviderOrSigner, getSigner } from "utils"
import KASHIPAIR_ABI from '../../constants/sushiAbis/kashipair.json'

async function signMasterContractApproval(
    bentoBoxContract: ethers.Contract | null,
    masterContract: string | undefined,
    user: string,
    library: ethers.providers.Web3Provider,
    approved: boolean,
    chainId: ChainId | undefined,
    nonce: any
) {
const warning = approved ? 'Give FULL access to funds in (and approved to) BentoBox?' : 'Revoke access to BentoBox?'
if (!nonce) {
    nonce = await bentoBoxContract?.nonces(user)
}
const message = {
    warning,
    user,
    masterContract,
    approved,
    nonce
}

const typedData = {
    types: {
    // // ethers _signTypedData assumes EIP712
    // EIP712Domain: [
    //   { name: 'name', type: 'string' },
    //   { name: 'chainId', type: 'uint256' },
    //   { name: 'verifyingContract', type: 'address' }
    // ],
    SetMasterContractApproval: [
        { name: 'warning', type: 'string' },
        { name: 'user', type: 'address' },
        { name: 'masterContract', type: 'address' },
        { name: 'approved', type: 'bool' },
        { name: 'nonce', type: 'uint256' }
    ]
    },
    primaryType: 'SetMasterContractApproval',
    domain: {
    name: 'BentoBox V1',
    chainId: chainId,
    verifyingContract: bentoBoxContract?.address
    },
    message: message
}
console.log('typedData:', typedData)
const signer = getSigner(library, user)
return signer._signTypedData(typedData.domain, typedData.types, typedData.message)
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
    CALL = 30
}

export class KashiCooker {
    private pair: any
    private account: string
    private library: ethers.providers.Web3Provider | undefined

    private actions: Action[]
    private values: BigNumber[]
    private datas: string[]

    constructor(pair: any, account: string | null | undefined, library: ethers.providers.Web3Provider | undefined) {
        this.pair = pair
        this.account = account || ethers.constants.AddressZero
        this.library = library

        this.actions = []
        this.values = []
        this.datas = []
    }

    add(action: Action, data: string, value: BigNumberish = 0) {
        this.actions.push(action)
        this.datas.push(data)
        this.values.push(BigNumber.from(value))
    }

    async approve() {
        //const permit = await signMasterContractApproval(this.web3, this.web3.kashipair.address, this.account, true)

        /*this.add(
            Action.BENTO_SETAPPROVAL),
            defaultAbiCoder.encode(["address", "address", "bool", "uint8", "bytes32", "bytes32"], [this.account, KASHI_ADDRESS, true, permit.v, permit.r, permit.s]))
        return this*/
    }

    addCollateral(amount: BigNumber, fromBento: boolean): KashiCooker {
        let share: BigNumber
        if (!fromBento) {
            share = toShare(this.pair.collateral, amount)
        } else {
            this.add(
                Action.BENTO_DEPOSIT,
                defaultAbiCoder.encode(["address", "address", "int256", "int256"], [this.pair.collateral.address, this.account, amount, 0])
            )
            share = BigNumber.from(-2)
        }

        this.add(
            Action.ADD_COLLATERAL,
            defaultAbiCoder.encode(["int256", "address", "bool"], [share, this.account, false])
        )
        return this
    }

    addAsset(amount: BigNumber, fromBento: boolean): KashiCooker {
        // TODO: WETH
        let share: BigNumber
        if (fromBento) {
            share = toShare(this.pair.asset, amount)
        } else {
            this.add(
                Action.BENTO_DEPOSIT,
                defaultAbiCoder.encode(["address", "address", "int256", "int256"], [this.pair.asset.address, this.account, amount, 0])
            )
            share = BigNumber.from(-2)
        }

        this.add(
            Action.ADD_ASSET,
            defaultAbiCoder.encode(["int256", "address", "bool"], [share, this.account, false])
        )
        return this
    }

    removeAsset(fraction: BigNumber, toBento: boolean): KashiCooker {
        this.add(
            Action.REMOVE_ASSET,
            ethers.utils.defaultAbiCoder.encode(['int256', 'address'], [fraction, this.account])
        )
        if (!toBento) {
            this.add(
                Action.BENTO_WITHDRAW,
                ethers.utils.defaultAbiCoder.encode(['address', 'address', 'int256', 'int256'], [this.pair.asset.address, this.account, 0, -1])
            )
        }
        return this
    }

    borrow(amount: BigNumber): KashiCooker {
        this.add(
            Action.BORROW,
            defaultAbiCoder.encode(["uint256", "address"], [amount, this.account])
        )
        return this
    }

    async cook() {
        if (!this.library) {
            return {
                success: false
            }
        }
        const kashiPairCloneContract = new Contract(this.pair.address, KASHIPAIR_ABI, getProviderOrSigner(this.library, this.account) as any)

        try {
            return { success: true,
                tx: await kashiPairCloneContract.cook(
                    this.actions,
                    this.values,
                    this.datas
                ) }
        } catch (error) {
            console.error(error)
            return {
                success: false,
                error: error
            }
        }        
    }
}
