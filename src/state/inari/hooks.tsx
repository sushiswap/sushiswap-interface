import { useAppSelector } from '../hooks'
import { ChainId, CurrencyAmount, Token } from '@sushiswap/sdk'
import { InariState, InaryStrategy } from './reducer'
import { e10, tryParseAmount } from '../../functions'
import { useActiveWeb3React, useZenkoContract } from '../../hooks'
import { useTokenBalancesWithLoadingIndicator } from '../wallet/hooks'
import { AXSUSHI, CREAM, CRXSUSHI, SUSHI, XSUSHI } from '../../constants'
import { t } from '@lingui/macro'
import { useEffect, useMemo, useState } from 'react'
import useSushiPerXSushi from '../../hooks/useXSushiPerSushi'
import CurrencyLogo from '../../components/CurrencyLogo'
import { useBentoBalance } from '../bentobox/hooks'

export function useInariState(): InariState {
  return useAppSelector((state) => state.inari)
}

const TOKENS = [SUSHI[ChainId.MAINNET], XSUSHI, CRXSUSHI, AXSUSHI]

export const useInariStrategies = () => {
  const { account } = useActiveWeb3React()
  const [balances, loading] = useTokenBalancesWithLoadingIndicator(account, TOKENS)
  const zenkoContract = useZenkoContract()
  const xSushiBentoBalance = useBentoBalance(XSUSHI.address)
  const crSushiBentoBalance = useBentoBalance(CRXSUSHI.address)
  const sushiPerXSushi = useSushiPerXSushi(false)
  const [strategies, setStrategies] = useState<InaryStrategy[]>([])

  // TODO needs to have balances in deps but currently results in infinite loop
  useEffect(() => {
    if (loading || !zenkoContract || !sushiPerXSushi) return
    console.log(balances)

    const toXSushi = (zapIn, zapInValue) =>
      (zapIn
        ? zapInValue.toBigNumber(18).mulDiv(e10(18), sushiPerXSushi.toBigNumber(18))
        : zapInValue.toBigNumber(18).mulDiv(sushiPerXSushi.toBigNumber(18), e10(18))
      )?.toFixed(18)

    const main = async () => {
      const strategies = await Promise.all([
        {
          name: 'SUSHI → Bento',
          steps: ['SUSHI', 'xSUSHI', 'BentoBox'],
          zapMethod: 'stakeSushiToBento',
          unzapMethod: 'unstakeSushiFromBento',
          description: t`Stake SUSHI for xSUSHI and deposit into BentoBox in one click. xSUSHI in BentoBox is automatically
                invested into a passive yield strategy, and can be lent or used as collateral for borrowing in Kashi.`,
          inputToken: SUSHI[ChainId.MAINNET],
          outputToken: XSUSHI,
          outputSymbol: 'xSUSHI in BentoBox',
          inputTokenBalance: balances[SUSHI[ChainId.MAINNET].address],
          outputTokenBalance: tryParseAmount(xSushiBentoBalance ? xSushiBentoBalance.value.toFixed(18) : '0', XSUSHI),
          inputLogo: <CurrencyLogo currency={SUSHI[ChainId.MAINNET]} size={40} className="rounded-full" />,
          outputLogo: <CurrencyLogo currency={XSUSHI} size={40} className="rounded-full" />,
          outputValue: toXSushi,
        },
        {
          name: 'SUSHI → Cream',
          steps: ['SUSHI', 'xSUSHI', 'Cream'],
          zapMethod: 'stakeSushiToCream',
          unzapMethod: 'unstakeSushiFromCream',
          description: t`TODO`,
          transformZapInValue: await (async (val) => {
            if (!val) return CurrencyAmount.fromRawAmount(CRXSUSHI, '0')
            const bal = await zenkoContract.toCtoken(CRXSUSHI.address, val.toExact().toBigNumber(XSUSHI.decimals))
            return CurrencyAmount.fromRawAmount(CRXSUSHI, bal.toString())
          }),
          inputToken: SUSHI[ChainId.MAINNET],
          outputToken: CRXSUSHI,
          outputSymbol: 'xSUSHI in Cream',
          inputTokenBalance: balances[SUSHI[ChainId.MAINNET].address],
          outputTokenBalance: await (async () => {
            if (!balances[CRXSUSHI.address]) return tryParseAmount('0', XSUSHI)
            const bal = await zenkoContract.fromCtoken(
              CRXSUSHI.address,
              balances[CRXSUSHI.address].toFixed().toBigNumber(CRXSUSHI.decimals).toString()
            )
            return CurrencyAmount.fromRawAmount(XSUSHI, bal.toString())
          })(),
          inputLogo: <CurrencyLogo currency={SUSHI[ChainId.MAINNET]} size={40} className="rounded-full" />,
          outputLogo: <CurrencyLogo currency={XSUSHI} size={40} className="rounded-full" />,
          outputValue: toXSushi,
        },
        {
          name: 'Cream → Bento',
          steps: ['SUSHI', 'crXSUSHI', 'BentoBox'],
          zapMethod: 'stakeSushiToCreamToBento',
          unzapMethod: 'unstakeSushiFromCreamFromBento',
          description: t`TODO`,
          transformZapInValue: await (async (val) => {
            if (!val) return CurrencyAmount.fromRawAmount(CRXSUSHI, '0')
            const bal = await zenkoContract.toCtoken(CRXSUSHI.address, val.toExact().toBigNumber(XSUSHI.decimals))
            return CurrencyAmount.fromRawAmount(CRXSUSHI, bal.toString())
          }),
          inputToken: SUSHI[ChainId.MAINNET],
          outputToken: CRXSUSHI,
          outputSymbol: 'crXSUSHI in BentoBox',
          inputTokenBalance: balances[SUSHI[ChainId.MAINNET].address],
          outputTokenBalance: await (async () => {
            if (!crSushiBentoBalance) return tryParseAmount('0', XSUSHI)
            const bal = await zenkoContract.fromCtoken(
              CRXSUSHI.address,
              crSushiBentoBalance ? crSushiBentoBalance.value : '0'.toBigNumber(18)
            )
            return tryParseAmount(bal?.toFixed(), XSUSHI)
          })(),
          inputLogo: <CurrencyLogo currency={SUSHI[ChainId.MAINNET]} size={40} className="rounded-full" />,
          outputLogo: <CurrencyLogo currency={XSUSHI} size={40} badgeCurrency={CREAM} className="rounded-full" />,
          outputValue: toXSushi,
        },
        {
          name: 'SUSHI → Aave',
          steps: ['SUSHI', 'xSUSHI', 'Aave'],
          zapMethod: 'stakeSushiToAave',
          unzapMethod: 'unstakeSushiFromAave',
          description: t`TODO`,
          inputToken: SUSHI[ChainId.MAINNET],
          inputTokenBalance: balances[SUSHI[ChainId.MAINNET].address],
          outputToken: AXSUSHI,
          outputSymbol: 'xSUSHI in Aave',
          outputTokenBalance: balances[AXSUSHI.address],
          inputLogo: <CurrencyLogo currency={SUSHI[ChainId.MAINNET]} size={40} className="rounded-full" />,
          outputLogo: <CurrencyLogo currency={XSUSHI} size={40} className="rounded-full" />,
          outputValue: toXSushi,
        },
      ] as InaryStrategy[])

      setStrategies(strategies)
    }

    main()
  }, [loading, sushiPerXSushi, xSushiBentoBalance, crSushiBentoBalance, zenkoContract])

  return strategies
}

export function useDerivedInariState() {
  const { strategy, zapInValue, zapIn } = useInariState()
  const strategies = useInariStrategies()
  const [allowanceValue, setAllowanceValue] = useState<CurrencyAmount<Token>>(null)

  useEffect(() => {
    const main = async () => {
      if (!zapInValue || !strategies[strategy]) return

      let val = tryParseAmount(zapInValue, zapIn ? strategies[strategy].inputToken : XSUSHI)
      if (strategies[strategy].transformZapInValue) {
        val = await strategies[strategy].transformZapInValue(val)
      } else {
        val = tryParseAmount(zapInValue, zapIn ? strategies[strategy].inputToken : strategies[strategy].outputToken)
      }

      setAllowanceValue(val)
    }

    main()
  }, [strategies, strategy, zapIn, zapInValue])

  return useMemo(() => {
    return {
      strategy: strategies[strategy],
      strategies,

      // CurrencyAmount with the inputToken (currently only SUSHI)
      // OutputToken is set to XSUSHI to display the amount of XSUSHI in a strategy
      zapInValue: strategies[strategy]
        ? tryParseAmount(zapInValue, zapIn ? strategies[strategy].inputToken : XSUSHI)
        : null,

      // CurrencyAmount transformed to the token that will be spent
      allowanceValue,
    }
  }, [allowanceValue, strategies, strategy, zapIn, zapInValue])
}
