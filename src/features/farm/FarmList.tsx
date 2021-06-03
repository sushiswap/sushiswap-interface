import FarmListItem from './FarmListItem'
import React from 'react'

const FarmList = ({ farms, kmp = false }) => {
    return (
        <div className="flex-col space-y-2">
            {farms &&
                farms.map((farm) => <FarmListItem farm={farm} kmp={kmp} />)}
        </div>
    )
}

export default FarmList
