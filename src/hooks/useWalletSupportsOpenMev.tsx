import useIsCoinbaseWallet from './useIsCoinbaseWallet'

export default function useWalletSupportsOpenMev() {
  const isCoinbaseWallet = useIsCoinbaseWallet()
  if (isCoinbaseWallet) return false
  return true
}
