import CurrencyLogo from '../../../../components/CurrencyLogo'
import { useCurrency } from '../../../../hooks/Tokens'

interface CurrencyCardProps {
  token: string
  symbol: string
}

export default function CurrencyCard({ token, symbol }: CurrencyCardProps): JSX.Element {
  const currency = useCurrency(token)

  return (
    <div className="w-full p-3 rounded bg-dark-900">
      <div className="flex flex-row items-center space-x-4">
        <CurrencyLogo currency={currency} size={40} />
        <div className="text-lg font-bold text-high-emphesis">{symbol}</div>
      </div>
    </div>
  )
}
