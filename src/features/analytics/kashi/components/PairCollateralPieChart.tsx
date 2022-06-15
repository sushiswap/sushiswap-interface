import classNames from 'classnames'
import { BigNumber } from 'ethers'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useRouter } from 'next/router'

import TailwindConfig from '../config/tailwind'
import { useAppContext } from '../context/AppContext'
import { KashiPair } from '../types/KashiPair'

const PairCollateralPieChart = ({
  containerClass = '',
  type = 'supply',
  title = 'Supply',
  data,
}: {
  type?: 'supply' | 'asset' | 'borrow'
  containerClass?: string
  title?: string
  data?: KashiPair[]
}) => {
  const router = useRouter()
  const { tokenUtilService } = useAppContext()
  const valueFuncs = {
    supply: (kashiPair: KashiPair) =>
      BigNumber.from(kashiPair.totalAsset).add(BigNumber.from(kashiPair.totalBorrow)).toNumber() / 100.0,
    asset: (kashiPair: KashiPair) => BigNumber.from(kashiPair.totalAsset).toNumber() / 100.0,
    borrow: (kashiPair: KashiPair) => BigNumber.from(kashiPair.totalBorrow).toNumber() / 100.0,
  }

  const getSeries = () => {
    let seriesData: any[] = []
    data?.forEach((item) => {
      seriesData.push({
        id: item.id,
        name: tokenUtilService.pairSymbol(item.asset?.symbol, item.collateral?.symbol),
        y: valueFuncs[type](item),
      })
    })
    return [
      {
        name: title,
        data: seriesData,
        innerSize: '50%',
        tooltip: {
          headerFormat: "<b style='font-size: 14px'>{point.key}</b><br/>",
          pointFormat: "<span style='font-size: 14px'>${point.y}</span>",
        },
      },
    ]
  }

  const options = {
    title: {
      text: '',
    },
    chart: {
      type: 'pie',
      backgroundColor: TailwindConfig.theme.colors['dark-900'],
    },
    colors: ['#10b981', '#2085ec', '#72b4eb', '#0a417a', '#8464a0', '#cea9bc', '#a855f7', '#323232'],
    series: getSeries(),
    plotOptions: {
      pie: {
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
        },
        // showInLegend: true,
        events: {
          click: (event: Highcharts.SeriesClickEventObject) => {
            router.push(`/pair/${(event.point as any).id}`)
          },
        },
      },
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
          <div className="mx-auto my-12 rounded-full loading w-72 h-72"></div>
        </div>
      ) : (
        <>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </>
      )}
    </div>
  )
}

export default PairCollateralPieChart
