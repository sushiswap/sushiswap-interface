import { useContext } from 'react'
import { ProContext } from './index'

export function usePro() {
    return useContext(ProContext)
}

export function useUserSwapHistory() {
    const [{ userHistory }] = useContext(ProContext)
    return userHistory
}

export function useSwapHistory() {
    const [{ swapHistory }] = useContext(ProContext)
    return swapHistory
}
