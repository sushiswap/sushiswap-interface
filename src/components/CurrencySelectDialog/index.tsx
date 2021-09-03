import { FC, useCallback } from 'react'
import { ChainId, Currency, NATIVE, USDC, WETH9, WNATIVE } from '@sushiswap/sdk'
import Button from '../Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import Typography from '../Typography'
import { useLingui } from '@lingui/react'
import CurrencyLogo from '../CurrencyLogo'
import { SUSHI } from '../../config/tokens'
import { useActiveWeb3React } from '../../hooks'
import { useAllTokenBalances } from '../../state/wallet/hooks'

interface CurrencySelectDialogProps {
  currency: Currency
  onChange: (x: Currency) => void
  onDismiss: () => void
}

const CurrencySelectDialog: FC<CurrencySelectDialogProps> = ({ currency, onChange, onDismiss }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const balances = useAllTokenBalances()

  const handleSelect = useCallback(
    (x: Currency) => {
      onChange(x)
      onDismiss()
    },
    [onChange, onDismiss]
  )

  const tokens = [NATIVE[chainId], SUSHI[chainId], USDC[chainId]]

  return (
    <div className="bg-dark-900 h-full">
      <div className="relative">
        <div className="pointer-events-none absolute w-full h-full bg-gradient-to-r from-opaque-blue to-opaque-pink opacity-20" />
        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <Button
              color="blue"
              variant="outlined"
              size="sm"
              className="rounded-full py-1 pl-2 cursor-pointer"
              startIcon={<ChevronLeftIcon width={24} height={24} />}
              onClick={onDismiss}
            >
              {i18n._(t`Back`)}
            </Button>
          </div>
          <Typography variant="h2" weight={700} className="text-high-emphesis">
            {i18n._(t`Select a Token`)}
          </Typography>
        </div>
      </div>
      {tokens.map((token, index) => (
        <div
          className="flex justify-between items-center p-5 cursor-pointer"
          onClick={() => handleSelect(token)}
          key={index}
        >
          <div className="flex items-center gap-1.5">
            <div className="rounded-full overflow-hidden">
              <CurrencyLogo currency={token} size={24} />
            </div>
            <Typography variant="sm" className="text-high-emphesis" weight={700}>
              {token.symbol}
            </Typography>
          </div>
          <Typography variant="sm" className="text-high-emphesis" weight={700}>
            {balances[token]?.toSignificant(6)}
          </Typography>
        </div>
      ))}
    </div>
  )
}

export default CurrencySelectDialog
