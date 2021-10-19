import { FC, useState } from 'react'
import { SearchIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import Typography from '../../../components/Typography'
import RadioGroup from '../../../components/RadioGroup'
import { useLingui } from '@lingui/react'
import { PoolFilterType } from './context/types'
import BottomSlideIn from '../../../components/Dialog/BottomSlideIn'
import Checkbox from '../../../components/Checkbox'
import Chip from '../../../components/Chip'
import { FeeFilterType, POOL_TYPES, SORT_OPTIONS } from '../constants'
import Divider from '../../../components/Divider'
import Button from '../../../components/Button'
import { farmsOnlyAtom, feeTiersAtom, poolTypesAtom, searchQueryAtom, sortTypeAtom } from './context/atoms'
import { useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

interface SortSelectorProps {}

const PoolListActions: FC<SortSelectorProps> = () => {
  const { i18n } = useLingui()
  const setSearchQuery = useSetRecoilState(searchQueryAtom)
  const [sortType, setSortType] = useRecoilState(sortTypeAtom)
  const feeTiers = useRecoilValue(feeTiersAtom)
  const poolTypes = useRecoilValue(poolTypesAtom)
  const [hideSortTypes, setHideSortTypes] = useState(true)
  const [open, setOpen] = useState(false)
  const [farmsOnly, setFarmsOnly] = useRecoilState(farmsOnlyAtom)

  const handleAddOrDeletePoolTypeFilter = useRecoilCallback<[PoolFilterType, boolean], void>(
    ({ snapshot, set }) =>
      async (poolType, add) => {
        const poolTypes = await snapshot.getPromise(poolTypesAtom)
        add
          ? set(poolTypesAtom, [poolType, ...poolTypes])
          : set(
              poolTypesAtom,
              poolTypes.filter((el) => el.label !== poolType.label)
            )
      },
    []
  )

  const handleAddOrDeleteFeeTierFilter = useRecoilCallback<[FeeFilterType, boolean], void>(
    ({ snapshot, set }) =>
      async (feeTier, add) => {
        const feeTiers = await snapshot.getPromise(feeTiersAtom)
        add
          ? set(feeTiersAtom, [feeTier, ...feeTiers])
          : set(
              feeTiersAtom,
              feeTiers.filter((el) => el.label !== feeTier.label)
            )
      },
    []
  )

  return (
    <div className="flex flex-col gap-5 px-5">
      <div className="flex flex-row items-center gap-5">
        <div className="flex gap-2 items-center rounded border border-dark-800 bg-dark-900 bg-opacity-50 py-2 px-3 flex-grow">
          <SearchIcon strokeWidth={5} width={20} height={20} />
          <input
            className="bg-transparent text-high-emphesis w-full"
            placeholder={i18n._(t`Search by token or pair`)}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {poolTypes.length + feeTiers.length > 0 && (
        <>
          <div className="flex justify-between items-start gap-3">
            <Typography weight={400}>{i18n._(t`Filters:`)}</Typography>
            <div className="flex gap-2 items-center flex-wrap">
              {poolTypes.map((type) => (
                <Chip
                  label={type.label}
                  color={type.color}
                  key={type.label}
                  onClick={() => handleAddOrDeletePoolTypeFilter(type, false)}
                />
              ))}
              {feeTiers.map((type) => (
                <Chip
                  label={type.label}
                  color={type.color}
                  {...type}
                  key={type.label}
                  onClick={() => handleAddOrDeleteFeeTierFilter(type, false)}
                />
              ))}
            </div>
          </div>
          <Divider />
        </>
      )}
      {/* TBD if this will be in final design */}
      {/*<div*/}
      {/*  className="flex justify-between items-center cursor-pointer"*/}
      {/*  onClick={() => setHideSortTypes(!hideSortTypes)}*/}
      {/*>*/}
      {/*  <Typography weight={400}>{i18n._(t`Sort:`)}</Typography>*/}
      {/*  <div className="flex gap-1 items-center">*/}
      {/*    <Typography weight={700} className="text-high-emphesis">*/}
      {/*      {SORT_OPTIONS[sortType].title}*/}
      {/*    </Typography>*/}
      {/*    <div className={`text-high-emphesis transform ${hideSortTypes ? '' : 'rotate-180'}`}>*/}
      {/*      <ChevronDownIcon width={20} height={20} />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*<Divider />*/}
      {!hideSortTypes && (
        <RadioGroup value={sortType} onChange={(sortType: number) => setSortType(sortType)} className="space-y-3.5">
          {SORT_OPTIONS.map((option, index) => (
            <RadioGroup.Option value={index} key={index}>
              {option.title}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      )}
      <BottomSlideIn
        title={i18n._(t`Select Filters`)}
        open={open}
        onClose={() => setOpen(false)}
        closeTrigger={
          <Button color="white" size="sm" onClick={() => setOpen(false)} className="h-[32px]">
            <span className="px-3">{i18n._(t`Save & Close`)}</span>
          </Button>
        }
      >
        <div className="bg-dark-700 rounded-t">
          {/* DESIGN TBD */}
          {/*<div className="flex flex-row gap-3 items-center p-5" onClick={() => setFarmsOnly(!farmsOnly)}>*/}
          {/*  <Checkbox checked={farmsOnly} color="blue" />*/}
          {/*  <Typography weight={700}>{i18n._(t`Farms only`)}</Typography>*/}
          {/*</div>*/}
          <div className="bg-dark-800 rounded-t">
            <div className="flex flex-col gap-5 p-5">
              <div className="flex items-center justify-between gap-3">
                <Typography variant="lg" weight={700} className="text-high-emphesis">
                  By Pool Types:
                </Typography>
              </div>
              {Object.values(POOL_TYPES).map((poolType) => {
                const checked = !!poolTypes.find((el) => el.label === poolType.label)
                return (
                  <div
                    className="flex flex-row gap-3 items-center"
                    key={poolType.label}
                    onClick={() => handleAddOrDeletePoolTypeFilter(poolType, !checked)}
                  >
                    <Checkbox checked={checked} color="blue" />
                    <Typography className="text-secondary">{poolType.label}</Typography>
                  </div>
                )
              })}
            </div>
            {/* DESIGN TBD */}
            {/*<div className="relative bg-dark-900 rounded-t">*/}
            {/*  <div className="flex flex-col gap-5 p-5">*/}
            {/*    <div className="flex items-center justify-between gap-3">*/}
            {/*      <Typography variant="lg" weight={700} className="text-high-emphesis">*/}
            {/*        By Fee Tier:*/}
            {/*      </Typography>*/}
            {/*    </div>*/}
            {/*    {FEE_TIERS.map((feeTier) => {*/}
            {/*      const checked = !!feeTiers.find((el) => el.label === feeTier.label)*/}
            {/*      return (*/}
            {/*        <div*/}
            {/*          className="flex flex-row gap-3 items-center"*/}
            {/*          key={feeTier.label}*/}
            {/*          onClick={() => handleAddOrDeleteFeeTierFilter(feeTier, !checked)}*/}
            {/*        >*/}
            {/*          <Checkbox checked={checked} color="blue" />*/}
            {/*          <Typography className="text-secondary">{feeTier.label}</Typography>*/}
            {/*        </div>*/}
            {/*      )*/}
            {/*    })}*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
        </div>
      </BottomSlideIn>
    </div>
  )
}

export default PoolListActions
