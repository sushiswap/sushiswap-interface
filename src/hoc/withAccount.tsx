import Lottie from 'lottie-react'
import loadingCircle from '../animation/loading-circle.json'
import useActiveWeb3React from '../hooks/useActiveWeb3React'

const withAccount = Component => ({ ...props }) => {
    const { account } = useActiveWeb3React()

    if (!account)
        return (
            <div className="h-full flex justify-center items-center">
                <div className="w-10 h-10">
                    <Lottie animationData={loadingCircle} autoplay loop />
                </div>
            </div>
        )

    return <Component account={account} {...props} />
}

export default withAccount
