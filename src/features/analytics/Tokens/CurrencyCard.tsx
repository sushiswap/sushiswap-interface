import CurrencyLogo from '../../../components/CurrencyLogo'
import { useCurrency } from '../../../hooks/Tokens'

interface CurrencyCardProps {
  token: string
  symbol: string
}

export default function CurrencyCard({ token, symbol }: CurrencyCardProps): JSX.Element {
  const currency = useCurrency(token)

  return (
    <div className="rounded bg-dark-900 w-full p-3">
      <div className="flex flex-row items-center space-x-4">
        <CurrencyLogo currency={currency} size={40} />
        <div className="text-high-emphesis text-lg font-bold">{symbol}</div>
      </div>
    </div>
  )
}
