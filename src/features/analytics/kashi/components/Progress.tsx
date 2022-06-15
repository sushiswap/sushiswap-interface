import { formatPercent } from 'app/functions'
import classNames from 'classnames'

const classByColor = {
  blue: {
    title: 'text-gray-500',
    percent: 'text-blue-500',
    progressContainer: 'bg-blue-300',
    progressActive: 'bg-blue-500',
  },
  pink: {
    title: 'text-gray-500',
    percent: 'text-pink-500',
    progressContainer: 'bg-pink-300',
    progressActive: 'bg-pink-500',
  },
  green: {
    title: 'text-gray-500',
    percent: 'text-green-500',
    progressContainer: 'bg-green-300',
    progressActive: 'bg-green-500',
  },
}

const Progress = ({
  loading = false,
  color = 'green',
  progress = 0,
  title = '',
  containerClass = '',
}: {
  loading?: boolean
  color?: 'blue' | 'pink' | 'green'
  progress?: number
  title?: string
  containerClass?: string
}) => {
  const byColor = classByColor[color]
  return (
    <div className={classNames({ [containerClass]: true })}>
      <div className="flex justify-between text-sm">
        <div
          className={classNames({
            [byColor.title]: true,
            'font-semibold': true,
          })}
        >
          {loading ? <div className="inline-block w-16 h-4 rounded animate-pulse bg-dark-700"></div> : title}
        </div>
        <div
          className={classNames({
            [byColor.percent]: true,
            'font-medium': true,
          })}
        >
          {loading ? (
            <div className="inline-block w-16 h-4 rounded animate-pulse bg-dark-700"></div>
          ) : (
            formatPercent(progress * 100)
          )}
        </div>
      </div>
      <div className="relative h-1 mt-2">
        {loading ? (
          <div className="h-1 rounded animate-pulse bg-dark-700"></div>
        ) : (
          <>
            <span
              className={classNames({
                [byColor.progressContainer]: true,
                'absolute left-0 top-0 w-full h-full rounded': true,
              })}
            />
            <span
              className={classNames({
                [byColor.progressActive]: true,
                'absolute left-0 top-0 h-full rounded': true,
              })}
              style={{ width: `${progress * 100}%` }}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default Progress
