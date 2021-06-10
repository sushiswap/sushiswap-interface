import { FC } from 'react'

const DoubleGlowShadow = ({ children }) => {
    return (
        <div className="relative">
            <div className="absolute top-1/4 -left-10 bg-blue bottom-4 w-3/5 filter blur-[150px] rounded-full z-0" />
            <div className="absolute bottom-1/4 -right-10 bg-pink top-4 w-3/5 filter blur-[150px] rounded-full z-0" />
            <div className="relative filter drop-shadow">{children}</div>
        </div>
    )
}

export default DoubleGlowShadow
