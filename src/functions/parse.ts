import { Currency, CurrencyAmount, JSBI } from '@sushiswap/sdk';

import { parseUnits } from '@ethersproject/units';
import { BigNumber, ethers } from 'ethers';

export const parseBalance = (value: string, decimals = 18) => {
  return parseUnits(value || '0', decimals);
};

// try to parse a user entered amount for a given token
export function tryParseAmount<T extends Currency>(value?: string, currency?: T): CurrencyAmount<T> | undefined {
  if (!value || !currency) {
    return undefined;
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString();
    if (typedValueParsed !== '0') {
      return CurrencyAmount.fromRawAmount(currency, JSBI.BigInt(typedValueParsed));
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return undefined;
}

// SILO - skipped sushi currency and just get JSBI like string
export function tryParseAmountToString<T extends Currency>(value?: string, currency?: T): string | undefined {
  if (!value || !currency) {
    return undefined;
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString();
    if (typedValueParsed !== '0') return typedValueParsed;
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return undefined;
}

export const bigNumberFormat = (valueStr: string) => {
  const value = BigNumber.from(valueStr);
  return ethers.utils.formatEther(value);
};

export const deDecimal = (val, precision = 18) => {
  return JSBI.divide(val, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(precision)));
};

export function tryParseBorrowToString<T extends Currency>(inValue?: string, currency?: T): string | undefined {
  // console.log('incoming value:', inValue?.toString());

  if (!inValue) {
    return '0';
  }

  const value = inValue.toString();
  // console.log('value:', value);
  // console.log('currency decimals:', currency?.decimals);

  try {
    // const typedValueParsed = parseUnits(value, currency.decimals).toString();
    const typedValueParsed = bigNumberFormat(value);
    if (typedValueParsed !== '0') return typedValueParsed;
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return undefined;
}
