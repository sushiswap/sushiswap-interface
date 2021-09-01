import { FC } from 'react'
import Typography from '../../../components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import PoolCard from './PoolCard'
import { useRecoilValue } from 'recoil'
import { searchQueryAtom } from './context/atoms'

interface SearchResultPoolsProps {}

const SearchResultPools: FC<SearchResultPoolsProps> = () => {
  const { i18n } = useLingui()
  const searchQuery = useRecoilValue(searchQueryAtom)
  const pools = []

  return (
    <div className="flex flex-col gap-2 px-5">
      <Typography variant="h3" weight={700}>
        {searchQuery ? i18n._(t`Results for ${`'${searchQuery}'`}`) : i18n._(t`Results`)}
      </Typography>
      {pools.reduce((acc, cur, index) => {
        const name = cur.tokens
          .map((el) => el.symbol)
          .join('-')
          .toLowerCase()

        if ((searchQuery && name.includes(searchQuery.toLowerCase())) || !searchQuery) {
          acc.push(<PoolCard pool={cur} link={'/trident/pool'} key={index} />)
        }

        return acc
      }, [])}
    </div>
  )
}

export default SearchResultPools
