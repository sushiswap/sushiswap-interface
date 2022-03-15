import { MultiRoute, RouteStatus } from '@sushiswap/tines'

export enum RouteKind {
  Legacy,
  Trident,
}

const TRIDENT_SWAP_GAS = 88_000
const LEGACY_SWAP_GAS = 144_000
const BENTO_DEPOSIT_GAS = 50_000
const BENTO_WITHDRAW_GAS = 113_000

/**
 * Compares trident and legacy routes and returns which is better
 * @param tridentRoute Route through trident pools
 * @param tridentAmountOutput Output amount for Trident Route in Amounts
 * @param legacyRoute Route through legacy pools
 * @param spendFromWallet Input: from wallet(true) or from Bento (false)
 * @param receiveToWallet Output: to wallet(true) or to Bento (false)
 */
export function compareTrades(
  tridentRoute: MultiRoute,
  tridentAmountOutput: number,
  legacyRoute: MultiRoute,
  spendFromWallet: boolean,
  receiveToWallet: boolean
): RouteKind {
  if (tridentRoute.status == RouteStatus.NoWay) return RouteKind.Legacy
  if (legacyRoute.status == RouteStatus.NoWay) return RouteKind.Trident

  let tridentGasSpend = tridentRoute.legs.length * TRIDENT_SWAP_GAS
  let legacyGasSpend = legacyRoute.legs.length * LEGACY_SWAP_GAS
  if (spendFromWallet) tridentGasSpend += BENTO_DEPOSIT_GAS
  else legacyGasSpend += BENTO_WITHDRAW_GAS
  if (receiveToWallet) tridentGasSpend += BENTO_WITHDRAW_GAS
  else legacyGasSpend += BENTO_DEPOSIT_GAS

  const gasUnitInCurrencyOut =
    legacyRoute.gasSpent == 0 ? 0 : (legacyRoute.amountOut - legacyRoute.totalAmountOut) / legacyRoute.gasSpent

  const tridentTotal = tridentAmountOutput - tridentGasSpend * gasUnitInCurrencyOut
  const legacyTotal = legacyRoute.amountOut - legacyGasSpend * gasUnitInCurrencyOut

  return tridentTotal >= legacyTotal ? RouteKind.Trident : RouteKind.Legacy
}
