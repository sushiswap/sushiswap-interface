import { i18n } from '@lingui/core'
import classNames from 'classnames'
import { BigNumber } from 'ethers'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'

import TailwindConfig from '../config/tailwind'
import { KashiPairDayDataMap } from '../types/KashiPairDayData'

const AttributesByType = {
  supply: {
    color: TailwindConfig.theme.colors.green.DEFAULT,
    valueFunc: (item: KashiPairDayDataMap) => ({
      x: moment(item.date).valueOf(),
      y: BigNumber.from(item.totalAsset).add(BigNumber.from(item.totalBorrow)).toNumber() / 100.0,
    }),
    tooltip: {
      pointFormat: i18n._('Supply') + '&nbsp;&nbsp; ${point.y}',
    },
  },
  borrow: {
    color: TailwindConfig.theme.colors.pink.DEFAULT,
    valueFunc: (item: KashiPairDayDataMap) => ({
      x: moment(item.date).valueOf(),
      y: BigNumber.from(item.totalBorrow).toNumber() / 100.0,
    }),
    tooltip: {
      pointFormat: i18n._('Borrow') + '&nbsp;&nbsp; ${point.y}',
    },
  },
}

const PairSupplyBorrowMonthDataChart = ({
  containerClass = '',
  title = i18n._('Monthly Net Supply & Borrow'),
  data,
}: {
  // type?: "supply" | "borrow";
  containerClass?: string
  title?: string
  data?: KashiPairDayDataMap[]
}) => {
  const getSeries = () => {
    let borrowSeriesData: any[] = []
    const borrowAttribute = AttributesByType['borrow']

    let supplySeriesData: any[] = []
    const supplyAttribute = AttributesByType['supply']
    data?.forEach((item) => {
      borrowSeriesData.push(borrowAttribute.valueFunc(item))
      supplySeriesData.push(supplyAttribute.valueFunc(item))
    })
    return [
      {
        type: 'area',
        color: supplyAttribute.color,
        data: supplySeriesData,
        pointIntervalUnit: 'month',
        tooltip: supplyAttribute.tooltip,
      },
      {
        type: 'area',
        color: borrowAttribute.color,
        data: borrowSeriesData,
        pointIntervalUnit: 'month',
        tooltip: borrowAttribute.tooltip,
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
          type: 'month',
          count: 5,
          text: '5m',
          title: i18n._('View 5 months'),
        },
        {
          type: 'month',
          count: 6,
          text: '6m',
          title: i18n._('View 6 months'),
        },
        {
          type: 'ytd',
          text: 'YTD',
          title: i18n._('View year to date'),
        },
        {
          type: 'year',
          count: 1,
          text: '1y',
          title: i18n._('View 1 year'),
        },
        {
          type: 'all',
          text: 'All',
          title: i18n._('View all'),
        },
      ],
      selected: 0,
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

export default PairSupplyBorrowMonthDataChart
