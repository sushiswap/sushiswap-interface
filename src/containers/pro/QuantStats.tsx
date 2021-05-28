import useSWR from 'swr'
import { vesting } from '../../fetchers/graph'
import { FC, useEffect, useMemo, useState } from 'react'
import { formattedNum, formattedPercent } from '../../utils'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'

const MAX_SUSHI_CLAIMABLE_PER_WEEK = [
    2989133, 3000866, 3047466, 3039733, 2772605, 2693560, 2437719, 2428066, 2433933, 2252929, 2126360, 2128927, 2129110,
    2000090, 1825240, 1823200, 1824179, 1817733, 1524646, 1518533, 1517733, 1439266, 1212337, 1209803, 1212123, 1213478,
    772405,
]

const query = `
  query manyUsers($lastID: ID) {
    users(first: 1000, where: { id_gt:$lastID }) {
      id
      totalClaimed
    }
    weeks {
      totalClaimed
    }
  }
`

const Stat: FC<{ label: string; value: any }> = ({ label, value }) => {
    return (
        <div className="flex flex-col">
            <div className="text-secondary font-bold text-sm">{label}</div>
            <div className="font-bold text-lg text-high-emphesis">{value}</div>
        </div>
    )
}

const ProgressBar: FC<{ percentage: number }> = ({ percentage }) => {
    return (
        <div className="grid relative gap-2">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-dark-1000">
                <div
                    style={{ width: `${percentage}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue to-pink"
                />
            </div>
            <div className="text-center font-bold text-xs" style={{ width: `${percentage}%` }}>
                {formattedPercent(percentage)}
            </div>
        </div>
    )
}

const QuantStats = () => {
    const { i18n } = useLingui()
    const [{ lastID, userCount, totalClaimed, totalClaimable }, setState] = useState({
        lastID: '',
        userCount: 0,
        totalClaimed: 0,
        totalClaimable: 0,
    })
    const call = useMemo(() => [query, { lastID }], [lastID])
    const { data } = useSWR(call, vesting)

    useEffect(() => {
        if (!data) return

        const { users, weeks } = data
        setState((prevState) => ({
            lastID: users.length > 0 ? users[users.length - 1].id : prevState.lastID,
            userCount: prevState.userCount + users.length,
            totalClaimed: prevState.totalClaimed + users.reduce((acc, el) => acc + +el.totalClaimed, 0),
            totalClaimable: MAX_SUSHI_CLAIMABLE_PER_WEEK.reduce((a, b, i) => (i < weeks.length ? a + b : a), 0),
        }))
    }, [data])

    return (
        <div className="bg-dark-900 rounded p-4 grid gap-2">
            <div className="h1 text-high-emphesis font-bold pb-2">{i18n._(t`Vested SUSHI statistics`)}</div>
            <div className="font-bold text-sm">{i18n._(t`Percentage of vested SUSHI claimed until now`)}</div>
            <ProgressBar percentage={(totalClaimed / totalClaimable) * 100} />
            <Stat label={i18n._(t`Unique users`)} value={formattedNum(userCount)} />
            <Stat label={i18n._(t`SUSHI claimed until now`)} value={formattedNum(totalClaimed)} />
            <Stat label={i18n._(t`SUSHI claimable until now`)} value={formattedNum(totalClaimable)} />
            <Stat
                label={i18n._(t`Total SUSHI claimable`)}
                value={formattedNum(MAX_SUSHI_CLAIMABLE_PER_WEEK.reduce((a, b) => a + b, 0))}
            />
        </div>
    )
}

export default QuantStats
