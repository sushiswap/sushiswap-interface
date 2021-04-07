import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { ChainId } from '@sushiswap/sdk'
import { Contract, ethers } from 'ethers'
import { BENTOBOX_ADDRESS, KASHI_ADDRESS } from 'kashi/constants'
import { toShare } from 'kashi/functions/bentobox'
import { getProviderOrSigner, getSigner } from 'utils'
import KASHIPAIR_ABI from '../../constants/sushiAbis/kashipair.json'
import BENTOBOX_ABI from '../../constants/sushiAbis/bentobox.json'
import { KashiPermit } from 'kashi/hooks'

export async function signMasterContractApproval(
  bentoBoxContract: ethers.Contract | null,
  masterContract: string | undefined,
  user: string,
  library: ethers.providers.Web3Provider,
  approved: boolean,
  chainId: ChainId | undefined
): Promise<string> {
  const warning = approved ? 'Give FULL access to funds in (and approved to) BentoBox?' : 'Revoke access to BentoBox?'
  const nonce = await bentoBoxContract?.nonces(user)
  const message = {
    warning,
    user,
    masterContract,
    approved,
    nonce
  }

  const typedData = {
    types: {
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
  private chainId: ChainId

  private actions: Action[]
  private values: BigNumber[]
  private datas: string[]

  constructor(
    pair: any,
    account: string | null | undefined,
    library: ethers.providers.Web3Provider | undefined,
    chainId: ChainId | undefined
  ) {
    this.pair = pair
    this.account = account || ethers.constants.AddressZero
    this.library = library
    this.chainId = chainId || 1

    this.actions = []
    this.values = []
    this.datas = []
  }

  add(action: Action, data: string, value: BigNumberish = 0) {
    this.actions.push(action)
    this.datas.push(data)
    this.values.push(BigNumber.from(value))
  }

  approve(permit: KashiPermit) {
    if (permit) {
      this.add(
        Action.BENTO_SETAPPROVAL,
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'address', 'bool', 'uint8', 'bytes32', 'bytes32'],
          [permit.account, permit.masterContract, true, permit.v, permit.r, permit.s]
        )
      )
    }

    /*const bentoBoxContract = new Contract(
      BENTOBOX_ADDRESS,
      BENTOBOX_ABI,
      getProviderOrSigner(this.library, this.account) as any
    )
    if ((await bentoBoxContract?.masterContractApproved(KASHI_ADDRESS, this.account)) === true) {
      return this
    }

    try {
      const signature = await signMasterContractApproval(
        bentoBoxContract,
        KASHI_ADDRESS,
        this.account!,
        this.library!,
        true,
        this.chainId
      )
      const permit = ethers.utils.splitSignature(signature)

      this.add(
        Action.BENTO_SETAPPROVAL,
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'address', 'bool', 'uint8', 'bytes32', 'bytes32'],
          [this.account, KASHI_ADDRESS, true, permit.v, permit.r, permit.s]
        )
      )
    } catch (e) {
      console.log('Error', e)
      if (e.code && e.code === -32603) {
        console.log(this.account, KASHI_ADDRESS, true, 0, ethers.constants.HashZero, ethers.constants.HashZero)
        const tx = await bentoBoxContract.setMasterContractApproval(
          this.account,
          KASHI_ADDRESS,
          true,
          0,
          ethers.constants.HashZero,
          ethers.constants.HashZero
        )
        await tx.wait()
      }
    }
    return true*/
  }

  addCollateral(amount: BigNumber, fromBento: boolean): KashiCooker {
    let share: BigNumber
    if (!fromBento) {
      share = toShare(this.pair.collateral, amount)
    } else {
      this.add(
        Action.BENTO_DEPOSIT,
        defaultAbiCoder.encode(
          ['address', 'address', 'int256', 'int256'],
          [this.pair.collateral.address, this.account, amount, 0]
        )
      )
      share = BigNumber.from(-2)
    }

    this.add(Action.ADD_COLLATERAL, defaultAbiCoder.encode(['int256', 'address', 'bool'], [share, this.account, false]))
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
        defaultAbiCoder.encode(
          ['address', 'address', 'int256', 'int256'],
          [this.pair.asset.address, this.account, amount, 0]
        )
      )
      share = BigNumber.from(-2)
    }

    this.add(Action.ADD_ASSET, defaultAbiCoder.encode(['int256', 'address', 'bool'], [share, this.account, false]))
    return this
  }

  removeAsset(fraction: BigNumber, toBento: boolean): KashiCooker {
    this.add(Action.REMOVE_ASSET, ethers.utils.defaultAbiCoder.encode(['int256', 'address'], [fraction, this.account]))
    if (!toBento) {
      this.add(
        Action.BENTO_WITHDRAW,
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'address', 'int256', 'int256'],
          [this.pair.asset.address, this.account, 0, -1]
        )
      )
    }
    return this
  }

  borrow(amount: BigNumber): KashiCooker {
    this.add(Action.BORROW, defaultAbiCoder.encode(['uint256', 'address'], [amount, this.account]))
    return this
  }

  async cook() {
    if (!this.library) {
      return {
        success: false
      }
    }
    const kashiPairCloneContract = new Contract(
      this.pair.address,
      KASHIPAIR_ABI,
      getProviderOrSigner(this.library, this.account) as any
    )

    try {
      return { success: true, tx: await kashiPairCloneContract.cook(this.actions, this.values, this.datas) }
    } catch (error) {
      return {
        success: false,
        error: error
      }
    }
  }
}
