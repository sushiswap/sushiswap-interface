import React, { FC } from 'react'

const MyOrders: FC = () => {
    return (
        <div className="md:flex hidden gap-3 items-center text-secondary hover:text-high-emphesis">
            <div>My Orders</div>
            <span className="bg-blue bg-opacity-30 hover:bg-opacity-40 text-blue rounded-2xl px-3 py-0.5">
                0
            </span>
        </div>
    )
}

export default MyOrders
