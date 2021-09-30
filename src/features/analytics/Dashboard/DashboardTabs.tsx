import Tabs from './../Tabs'

const tabs = [
  {
    name: 'Top Farms',
    type: 'pools',
  },
  {
    name: 'Top Pairs',
    type: 'pairs',
  },
  {
    name: 'Top Tokens',
    type: 'tokens',
  },
]

export default function DashboardTabs({ currentType, setType }): JSX.Element {
  return (
    <>
      <Tabs tabs={tabs} currentType={currentType} setType={setType} />
    </>
  )
}
