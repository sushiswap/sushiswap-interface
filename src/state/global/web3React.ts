import { ChainId } from '@sushiswap/core-sdk'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { atom } from 'recoil'

interface Web3AtomProps {
  account?: Web3ReactContextInterface['account']
  chainId?: ChainId
}

export const activeWeb3ReactAtom = atom<Web3AtomProps>({
  key: 'activeWeb3ReactAtom',
  default: {},
})
