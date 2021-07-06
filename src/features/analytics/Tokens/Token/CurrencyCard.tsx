import CurrencyLogo from '../../../../components/CurrencyLogo'
import { useCurrency } from '../../../../hooks/Tokens'

interface CurrencyCardProps {
  token: string
  symbol: string
}

export default function CurrencyCard({ token, symbol }: CurrencyCardProps): JSX.Element {
  const currency = useCurrency(token)

  return (
    <div className="p-3 rounded w-min sm:w-full bg-dark-900">
      <div className="flex flex-row items-center space-x-4">
        <CurrencyLogo currency={currency} size={40} />
        <div className="hidden text-lg font-bold whitespace-nowrap sm:block text-high-emphesis">{symbol}</div>
      </div>
    </div>
  )
}
