import { useEffect } from 'react'

const useAsyncEffect = (cb: () => Promise<void>, deps: any[]) => {
    useEffect(() => {
        const resolve = async () => {
            await cb()
        }

        resolve()
    }, deps)
}

export default useAsyncEffect
