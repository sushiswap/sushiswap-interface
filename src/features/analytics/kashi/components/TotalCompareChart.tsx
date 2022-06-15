import { i18n } from '@lingui/core'
import { BigNumber } from 'ethers'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'

import TailwindConfig from '../config/tailwind'
import { KashiPairDayDataMap } from '../types/KashiPairDayData'

const TotalCompareChart = ({ loading, data }: { loading: boolean; data: KashiPairDayDataMap[] }) => {
  const getSeries = () => {
    let seriesData: any[] = []
    data.forEach((item) => {
      const percent =
        BigNumber.from(item.totalBorrow)
          .mul(BigNumber.from('10000'))
          .div(BigNumber.from(item.totalAsset).add(BigNumber.from(item.totalBorrow)))
          .toNumber() / 100
      seriesData.push({
        x: moment(item.date).valueOf(),
        y: percent,
      })
    })

    return [
      {
        type: 'column',
        color: TailwindConfig.theme.colors.pink.DEFAULT,
        name: 'Ratio',
        data: seriesData,
        tooltip: {
          pointFormat: 'Ratio {point.y}%',
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
    chart: {
      backgroundColor: TailwindConfig.theme.colors['dark-900'],
    },
    yAxis: [
      {
        gridLineColor: TailwindConfig.theme.colors['dark-600'],
      },
    ],
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
    series: getSeries(),
  }

  return (
    <div className="overflow-hidden border rounded shadow-lg bg-dark-900 border-dark-800">
      <div className="pt-6 text-lg font-medium text-center">{i18n._('Borrow vs Supply Ratio')}</div>
      {loading || !data || data.length === 0 ? (
        <div>
          <div className="mx-4 my-12 rounded animate-pulse bg-dark-700" style={{ height: '1px' }}></div>
          <div className="mx-4 my-12 rounded animate-pulse bg-dark-700" style={{ height: '1px' }}></div>
          <div className="mx-4 my-12 rounded animate-pulse bg-dark-700" style={{ height: '1px' }}></div>
          <div className="mx-4 my-12 rounded animate-pulse bg-dark-700" style={{ height: '1px' }}></div>
          <div className="mx-4 my-12 rounded animate-pulse bg-dark-700" style={{ height: '1px' }}></div>
          <div className="mx-4 my-12 rounded animate-pulse bg-dark-700" style={{ height: '1px' }}></div>
        </div>
      ) : (
        <>
          <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={options} />
        </>
      )}
    </div>
  )
}

export default TotalCompareChart
