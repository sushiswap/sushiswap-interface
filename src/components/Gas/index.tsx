import useSWR from 'swr'
import React from 'react'

function Gas() {
    const { data, error }: any = useSWR('https://ethgasstation.info/api/ethgasAPI.json?', url =>
        fetch(url).then(r => r.json())
    )

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>

    return <div>{data.average}</div>
}

export default Gas
