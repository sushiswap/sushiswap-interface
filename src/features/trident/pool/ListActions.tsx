import { ChangeEvent, FC, useCallback, useState } from 'react'
import { ChevronDownIcon, SearchIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import Typography from '../../../components/Typography'
import RadioGroup from '../../../components/RadioGroup'
import { useLingui } from '@lingui/react'
import { useTridentPoolPageDispatch, useTridentPoolPageState } from './context'
import { ActionType } from './context/types'
import BottomSlideIn from '../../../components/Dialog/BottomSlideIn'
import { XIcon } from '@heroicons/react/outline'
import Checkbox from '../../../components/Checkbox'
import Chip from '../../../components/Chip'
import { FEE_TIERS, POOL_TYPES, SORT_OPTIONS } from './context/constants'

interface SortSelectorProps {}

const ListActions: FC<SortSelectorProps> = () => {
  const { i18n } = useLingui()
  const dispatch = useTridentPoolPageDispatch()
  const { sortType, filters } = useTridentPoolPageState()
  const [hideSortTypes, setHideSortTypes] = useState(false)
  const [open, setOpen] = useState(false)

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

  const handleAddOrDeletePoolTypeFilter = useCallback(
    (poolType, add) => {
      dispatch({
        type: add ? ActionType.ADD_POOL_TYPE_FILTER : ActionType.DELETE_POOL_TYPE_FILTER,
        payload: poolType,
      })
    },
    [dispatch]
  )

  const handleAddOrDeleteFeeTierFilter = useCallback(
    (feeTier, add) => {
      dispatch({
        type: add ? ActionType.ADD_FEE_TIER_FILTER : ActionType.DELETE_FEE_TIER_FILTER,
        payload: feeTier,
      })
    },
    [dispatch]
  )

  return (
    <div className="flex flex-col gap-4 px-5">
      <div className="flex flex-row items-center gap-5">
        <div className="flex gap-2 items-center rounded border border-dark-800 bg-dark-900 bg-opacity-50 py-2 px-3 flex-grow">
          <SearchIcon strokeWidth={5} width={20} height={20} />
          <input
            className="bg-transparent text-high-emphesis"
            placeholder={i18n._(t`Search by token`)}
            onChange={handleSearch}
          />
        </div>
        <div onClick={() => setOpen(true)}>
          <svg width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 0C10.8284 0 11.5 0.671573 11.5 1.5V2.99994L23.5 2.99988C24.3284 2.99987 25 3.67144 25 4.49987C25 5.3283 24.3284 5.99987 23.5 5.99988L11.5 5.99994V7.5C11.5 8.32843 10.8284 9 10 9C9.17157 9 8.5 8.32843 8.5 7.5V4.49996V1.5C8.5 0.671573 9.17157 0 10 0ZM3.29088e-10 4.49985C1.71665e-05 3.67142 0.671604 2.99986 1.50003 2.99988L5.00003 2.99995C5.82846 2.99997 6.50002 3.67155 6.5 4.49998C6.49998 5.32841 5.8284 5.99997 4.99997 5.99995L1.49997 5.99988C0.671542 5.99986 -1.71658e-05 5.32827 3.29088e-10 4.49985ZM13 14L1.5 14C0.671571 14 3.29088e-10 14.6716 3.29088e-10 15.5C3.29088e-10 16.3284 0.671575 17 1.5 17L13 17C13.8284 17 14.5 16.3284 14.5 15.5C14.5 14.6716 13.8284 14 13 14ZM16.5 15.5V12.5C16.5 11.6716 17.1716 11 18 11C18.8284 11 19.5 11.6716 19.5 12.5V14L23.5 14C24.3284 14 25 14.6716 25 15.5C25 16.3284 24.3284 17 23.5 17L19.5 17V18.5C19.5 19.3284 18.8284 20 18 20C17.1716 20 16.5 19.3284 16.5 18.5V15.5Z"
              fill="#E3E3E3"
            />
          </svg>
        </div>
      </div>
      {filters.poolTypes.length + filters.feeTiers.length > 0 && (
        <div className="flex justify-between items-start gap-3">
          <Typography weight={400}>{i18n._(t`Filters:`)}</Typography>
          <div className="flex gap-2 items-center flex-wrap">
            {filters.poolTypes.map((type) => (
              <Chip {...type} key={type.label} onDelete={() => handleAddOrDeletePoolTypeFilter(type, false)} />
            ))}
            {filters.feeTiers.map((type) => (
              <Chip {...type} key={type.label} onDelete={() => handleAddOrDeleteFeeTierFilter(type, false)} />
            ))}
          </div>
        </div>
      )}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setHideSortTypes(!hideSortTypes)}
      >
        <Typography weight={400}>{i18n._(t`Sort:`)}</Typography>
        <div className="flex gap-1 items-center">
          <Typography weight={700} className="text-high-emphesis">
            {i18n._(t`APY`)} {SORT_OPTIONS[sortType].title}
          </Typography>
          <div className={`text-high-emphesis transform ${hideSortTypes ? '' : 'rotate-180'}`}>
            <ChevronDownIcon width={20} height={20} />
          </div>
        </div>
      </div>
      {!hideSortTypes && (
        <RadioGroup value={sortType} onChange={handleSortType} className="space-y-3.5">
          {SORT_OPTIONS.map((option, index) => (
            <RadioGroup.Option value={index} key={index}>
              {option.title}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      )}
      <BottomSlideIn title={i18n._(t`Apply Pool Filters`)} open={open} onClose={() => setOpen(false)}>
        <div className="bg-dark-800 rounded-t">
          <div className="flex flex-col gap-5 p-5">
            <div className="flex items-center justify-between gap-3">
              <Typography variant="lg" weight={700} className="text-high-emphesis">
                By Pool Types:
              </Typography>
              <button onClick={() => setOpen(false)}>
                <span className="sr-only">Close panel</span>
                <XIcon className="h-6 w-6 text-high-emphesis" aria-hidden="true" />
              </button>
            </div>
            {POOL_TYPES.map((poolType) => {
              const checked = !!filters.poolTypes.find((el) => el.label === poolType.label)
              return (
                <div className="flex flex-row gap-3 items-center" key={poolType.label}>
                  <Checkbox
                    checked={checked}
                    color="blue"
                    set={() => handleAddOrDeletePoolTypeFilter(poolType, !checked)}
                  />
                  <Typography className="text-secondary">{poolType.label}</Typography>
                </div>
              )
            })}
          </div>
          <div className="relative bg-dark-900 rounded-t">
            <div className="flex flex-col gap-5 p-5">
              <div className="flex items-center justify-between gap-3">
                <Typography variant="lg" weight={700} className="text-high-emphesis">
                  By Fee Tier:
                </Typography>
                <button onClick={() => setOpen(false)}>
                  <span className="sr-only">Close panel</span>
                  <XIcon className="h-6 w-6 text-high-emphesis" aria-hidden="true" />
                </button>
              </div>
              {FEE_TIERS.map((feeTier) => {
                const checked = !!filters.feeTiers.find((el) => el.label === feeTier.label)
                return (
                  <div className="flex flex-row gap-3 items-center" key={feeTier.label}>
                    <Checkbox
                      checked={checked}
                      color="blue"
                      set={() => handleAddOrDeleteFeeTierFilter(feeTier, !checked)}
                    />
                    <Typography className="text-secondary">{feeTier.label}</Typography>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </BottomSlideIn>
    </div>
  )
}

export default ListActions
