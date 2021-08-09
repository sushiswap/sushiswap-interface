import { FC } from 'react'
import PoolCard from './PoolCard'
import Typography from '../../../components/Typography'
import { useTridentPoolPageState } from './context'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import useTridentPools from '../../../hooks/useTridentPools'

interface SearchResultPoolsProps {}

const SearchResultPools: FC<SearchResultPoolsProps> = () => {
  const { i18n } = useLingui()
  const { searchQuery } = useTridentPoolPageState()
  const [pools] = useTridentPools()

  return (
    <div className="flex flex-col gap-2 px-5">
      <Typography variant="h3" weight={700}>
        {searchQuery ? i18n._(t`Results for '${searchQuery}'`) : i18n._(t`Results`)}
      </Typography>
      {pools.map((pool, index) => (
        <PoolCard pool={pool} link={'/trident/pool/'} key={index} />
      ))}
    </div>
  )
}

export default SearchResultPools
