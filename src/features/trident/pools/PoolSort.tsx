import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { DiscoverPoolsTableColumn } from 'app/features/trident/pools/usePoolsTableData'
import { classNames } from 'app/functions/styling'
import React, { FC, useState } from 'react'
import { useRecoilValue } from 'recoil'

import { sortTableFuncAtom } from './context/atoms'

enum PoolSortOption {
  TVL = 'TVL Highest to Lowest',
  APY = 'APY Highest to Lowest',
}

const sortTitleMapper: Record<PoolSortOption, DiscoverPoolsTableColumn['accessor']> = {
  [PoolSortOption.TVL]: 'liquidityUSD',
  [PoolSortOption.APY]: 'apy',
}

export const PoolSort: FC = () => {
  const [sortBy, setSortBy] = useState<PoolSortOption>(PoolSortOption.TVL)
  const sortTableFunc = useRecoilValue(sortTableFuncAtom)

  return (
    <div className="flex gap-2 items-center">
      <div className="flex-none text-sm text-secondary">Sort by:</div>
      <div>
        <Menu>
          <Menu.Button className="w-full px-4 py-2 text-sm font-bold bg-transparent border rounded shadow-sm text-primary border-dark-800 hover:bg-dark-900">
            <div className="flex flex-row">
              {sortBy}
              <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
            </div>
          </Menu.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
          >
            <Menu.Items
              static
              className="absolute rounded mt-2 shadow-lg bg-dark-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              {Object.values(PoolSortOption)
                .filter((title): title is PoolSortOption => title !== sortBy)
                .map((title, i) => {
                  return (
                    <Menu.Item key={i}>
                      {({ active }) => {
                        return (
                          <div
                            className={classNames(
                              active ? 'bg-dark-700 text-high-emphesis' : 'text-primary',
                              'group flex items-center px-4 py-2 text-sm hover:bg-dark-700 hover:cursor-pointer focus:bg-dark-700 rounded font-bold'
                            )}
                            onClick={() => {
                              setSortBy(title)
                              sortTableFunc(sortTitleMapper[title], true)
                            }}
                          >
                            {title}
                          </div>
                        )
                      }}
                    </Menu.Item>
                  )
                })}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  )
}
