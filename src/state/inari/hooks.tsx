import { useAppSelector } from '../hooks'
import { ChainId, CurrencyAmount, Token } from '@sushiswap/sdk'
import { InaryStrategy } from './reducer'
import { e10, tryParseAmount } from '../../functions'
import { useActiveWeb3React, useZenkoContract } from '../../hooks'
import { useTokenBalancesWithLoadingIndicator } from '../wallet/hooks'
import { AXSUSHI, CREAM, CRXSUSHI, SUSHI, XSUSHI } from '../../constants'
import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import useSushiPerXSushi from '../../hooks/useXSushiPerSushi'
import CurrencyLogo from '../../components/CurrencyLogo'
import { useBentoBalance } from '../bentobox/hooks'
import useStakeSushiToBentoStrategy from './strategies/useStakeSushiToBentoStrategy'
import { DerivedInariState, InariState } from './types'
import useStakeSushiToCreamStrategy from './strategies/useStakeSushiToCreamStrategy'
import useStakeSushiToCreamToBentoStrategy from './strategies/useStakeSushiToCreamToBentoStrategy'

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

export function useInariState(): InariState {
  return useAppSelector((state) => state.inari)
}

// Redux doesn't allow for non-serializable classes so use a derived state hook
// Derived state may not use any of the strategy hooks
export function useDerivedInariState(): DerivedInariState {
  const { id, zapIn, inputValue, outputValue, tokens, general } = useInariState()

  const inputToken = new Token(
    tokens.inputToken.chainId,
    tokens.inputToken.address,
    tokens.inputToken.decimals,
    tokens.inputToken.symbol
  )

  const outputToken = new Token(
    tokens.outputToken.chainId,
    tokens.outputToken.address,
    tokens.outputToken.decimals,
    tokens.outputToken.symbol
  )

  return {
    zapIn,
    inputValue: tryParseAmount(inputValue, inputToken),
    outputValue: tryParseAmount(outputValue, outputToken),
    id,
    general,
    tokens: {
      inputToken,
      outputToken,
    },
  }
}

export function useSelectedInariStrategy() {
  const { id: selectedStrategy } = useInariState()
  const strategies = useInariStrategies2()
  return strategies[selectedStrategy]
}

export function useInariStrategies2() {
  const stakeSushiToBentoStrategy = useStakeSushiToBentoStrategy()
  const stakeSushiToCreamStrategy = useStakeSushiToCreamStrategy()
  const stakeSushiToCreamToBentoStrategy = useStakeSushiToCreamToBentoStrategy()

  return {
    [stakeSushiToBentoStrategy.id]: stakeSushiToBentoStrategy,
    [stakeSushiToCreamStrategy.id]: stakeSushiToCreamStrategy,
    [stakeSushiToCreamToBentoStrategy.id]: stakeSushiToCreamToBentoStrategy,
  }
}
