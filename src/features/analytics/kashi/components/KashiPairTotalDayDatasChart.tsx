import { useLingui } from '@lingui/react'
import TailwindConfig from 'app/features/analytics/kashi/config/tailwind'
import { BigNumber } from 'ethers'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'

import { KashiPairDayDataMap } from '../types/KashiPairDayData'

const KashiPairTotalDayDatasChart = ({ loading, data }: { loading: boolean; data: KashiPairDayDataMap[] }) => {
  const { i18n } = useLingui()
  const getSeries = () => {
    let supplyData: any[] = []
    let borrowData: any[] = []
    data.forEach((item) => {
      supplyData.push({
        x: moment(item.date).valueOf(),
        y: BigNumber.from(item.totalAsset).add(BigNumber.from(item.totalBorrow)).toNumber() / 100.0,
      })
      borrowData.push({
        x: moment(item.date).valueOf(),
        y: BigNumber.from(item.totalBorrow).toNumber() / 100.0,
      })
    })
    return [
      {
        type: 'line',
        color: TailwindConfig.theme.colors.green.DEFAULT,
        name: i18n._('Supply'),
        data: supplyData,
        tooltip: {
          pointFormat: i18n._('Supply') + '&nbsp;&nbsp; ${point.y}',
        },
      },
      {
        type: 'line',
        color: TailwindConfig.theme.colors.pink.DEFAULT,
        name: i18n._('Borrow'),
        data: borrowData,
        tooltip: {
          pointFormat: i18n._('Borrow') + '&nbsp;&nbsp; ${point.y}',
        },
      },
    ]
  }

  const options = {
    title: {
      style: {
        height: '50px',
        padding: '24px',
        fontWeight: 'bold',
        fontSize: '18px',
      },
    },
    scrollbar: {
      enabled: false,
    },
    series: getSeries(),
    rangeSelector: {
      buttons: [
        {
          type: 'week',
          count: 1,
          text: '1w',
          title: i18n._('View 1 week'),
        },
        {
          type: 'month',
          count: 1,
          text: '1m',
          title: i18n._('View 1 month'),
        },
        {
          type: 'month',
          count: 3,
          text: '3m',
          title: i18n._('View 3 months'),
        },
        {
          type: 'month',
          count: 6,
          text: '6m',
          title: i18n._('View 6 months'),
        },
      ],
      selected: 1,
    },
  }

  return (
    <div className="overflow-hidden rounded shadow-lg bg-dark-700">
      <div className="pt-6 text-lg font-medium text-center">{i18n._('Total Supply & Total Borrow')}</div>
      {loading || !data || data.length === 0 ? (
        <div>
          <div className="mx-4 my-12 rounded animate-pulse" style={{ height: '1px' }}></div>
          <div className="mx-4 my-12 rounded animate-pulse" style={{ height: '1px' }}></div>
          <div className="mx-4 my-12 rounded animate-pulse" style={{ height: '1px' }}></div>
          <div className="mx-4 my-12 rounded animate-pulse" style={{ height: '1px' }}></div>
          <div className="mx-4 my-12 rounded animate-pulse" style={{ height: '1px' }}></div>
          <div className="mx-4 my-12 rounded animate-pulse" style={{ height: '1px' }}></div>
        </div>
      ) : (
        <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={options} />
      )}
    </div>
  )
}

export default KashiPairTotalDayDatasChart
