import React from 'react'
import { RowFixed } from '../Row'
import styled from 'styled-components'

export const FilterWrapper = styled(RowFixed)`
  padding: 8px;
  // background-color: ${({ theme }) => theme.bg2};
  // color: ${({ theme }) => theme.text1};
  border-radius: 8px;
  user-select: none;
  & > * {
    user-select: none;
  }
  :hover {
    cursor: pointer;
  }
`

export default function SortButton({
  toggleSortOrder,
  ascending,
}: {
  toggleSortOrder: () => void
  ascending: boolean
}) {
  return (
    <FilterWrapper onClick={toggleSortOrder} className="text-sm bg-dark-800">
      {ascending ? '↑' : '↓'}
    </FilterWrapper>
  )
}
