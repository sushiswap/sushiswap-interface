import { i18n } from '@lingui/core'
import classNames from 'classnames'
import { BigNumber } from 'ethers'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'

import TailwindConfig from '../config/tailwind'
import { KashiPairDayDataMap } from '../types/KashiPairDayData'

const PairSupplyAccruedInterestDayDataChart = ({
  containerClass = '',
  title = i18n._('Accrued Interest'),
  data,
}: {
  containerClass?: string
  title?: string
  data?: KashiPairDayDataMap[]
}) => {
  const getSeries = () => {
    let seriesData: any[] = []
    const valueFunc = (item: KashiPairDayDataMap) => ({
      x: moment(item.date).valueOf(),
      y:
        BigNumber.from(item.totalBorrow)
          .mul(BigNumber.from(item.avgInterestPerSecond))
          .mul(3600 * 24)
          .div(BigNumber.from(10).pow(18))
          .toNumber() / 100.0,
    })
    data?.forEach((item) => {
      seriesData.push(valueFunc(item))
    })
    return [
      {
        type: 'line',
        color: TailwindConfig.theme.colors.blue.DEFAULT,
        data: seriesData,
        tooltip: {
          pointFormat: i18n._('Accrued Interest') + '&nbsp;&nbsp; ${point.y}',
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
    <div
      className={classNames({
        [containerClass]: true,
        'bg-dark-900 shadow-lg rounded over overflow-hidden': true,
      })}
    >
      <div className="pt-6 text-lg font-medium text-center">{title}</div>
      {!data || data.length === 0 ? (
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

export default PairSupplyAccruedInterestDayDataChart
