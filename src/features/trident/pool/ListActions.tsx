import { ChangeEvent, FC, useCallback } from 'react'
import { ChevronDownIcon, SearchIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import Typography from '../../../components/Typography'
import { RadioGroup } from '@headlessui/react'
import { useLingui } from '@lingui/react'
import { useTridentPoolPageDispatch, useTridentPoolPageState } from './context'
import { ActionType } from './context/types'
import { classNames } from '../../../functions'

interface SortSelectorProps {}

const SORT_OPTIONS = [
  { title: 'APY Highest to Lowest', desc: true },
  { title: 'APY Lowest to Highest', desc: false },
  { title: 'TVL Highest to Lowest', desc: true },
  { title: 'TVL Lowest to Highest', desc: false },
]

const ListActions: FC<SortSelectorProps> = () => {
  const { i18n } = useLingui()
  const dispatch = useTridentPoolPageDispatch()
  const { sortType, searchQuery } = useTridentPoolPageState()

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: ActionType.SEARCH,
        payload: e.target.value,
      })
    },
    [dispatch]
  )

  const handleSortType = useCallback(
    (sortType) => {
      dispatch({
        type: ActionType.SET_SORT_TYPE,
        payload: sortType,
      })
    },
    [dispatch]
  )

  return (
    <div className="flex flex-col gap-4 px-5">
      <div className="flex gap-2 items-center rounded border border-dark-800 bg-dark-900 bg-opacity-50 py-2 px-3">
        <SearchIcon strokeWidth={5} width={20} height={20} />
        <input
          className="bg-transparent text-high-emphesis"
          placeholder={i18n._(t`Search by token`)}
          onChange={handleSearch}
        />
      </div>
      <div className="flex justify-between items-center">
        <Typography weight={400}>{i18n._(t`Sort:`)}</Typography>
        <div className="flex gap-1 items-center" onClick={() => handleSortType((sortType + 1) % SORT_OPTIONS.length)}>
          <Typography weight={700} className="text-high-emphesis">
            {i18n._(t`APY`)} {SORT_OPTIONS[sortType].title}
          </Typography>
          <div className={`text-high-emphesis transform ${SORT_OPTIONS[sortType].desc ? '' : 'rotate-180'}`}>
            <ChevronDownIcon width={20} height={20} />
          </div>
        </div>
      </div>
      {!searchQuery && (
        <RadioGroup value={sortType} onChange={handleSortType} className="space-y-3.5">
          {SORT_OPTIONS.map((option, index) => (
            <RadioGroup.Option value={index} key={index}>
              {({ checked }) => (
                <>
                  <div className="flex items-center text-sm cursor-pointer gap-3.5">
                    <span
                      className={classNames(
                        checked ? '' : 'border border-dark-700 bg-dark-800',
                        'h-6 w-6 rounded-full flex items-center justify-center'
                      )}
                      aria-hidden="true"
                      {...(checked && {
                        style: { background: 'linear-gradient(103.72deg, #0993EC -6.18%, #F338C3 100%)' },
                      })}
                    >
                      {checked && <span className="rounded-full bg-white w-2.5 h-2.5" />}
                    </span>
                    <RadioGroup.Label as="span">
                      <Typography className="text-high-emphesis" weight={checked ? 700 : 400}>
                        {option.title}
                      </Typography>
                    </RadioGroup.Label>
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      )}
    </div>
  )
}

export default ListActions
