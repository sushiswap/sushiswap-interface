import { Currency, CurrencyAmount, Fraction, Percent } from "@sushiswap/sdk";

import Button from "../../components/Button";
import { Field } from "../../state/mint/actions";
import React from "react";
import { t } from "@lingui/macro";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useLingui } from "@lingui/react";

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
}: {
  noLiquidity?: boolean;
  price?: Fraction;
  currencies: { [field in Field]?: Currency };
  parsedAmounts: { [field in Field]?: CurrencyAmount };
  poolTokenPercentage?: Percent;
  onAdd: () => void;
}) {
  const { i18n } = useLingui();
  const { chainId } = useActiveWeb3React();
  return (
    <div className="p-6 mt-0 -m-6 rounded bg-dark-800">
      <div className="grid gap-1">
        <div className="flex items-center justify-between">
          <div className="text-sm text-high-emphesis">{i18n._(t`Rates`)}</div>
          <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphesis">
            {`1 ${parsedAmounts[Field.CURRENCY_A]?.currency.getSymbol(
              chainId
            )} = ${price?.invert().toSignificant(4)} ${parsedAmounts[
              Field.CURRENCY_B
            ]?.currency.getSymbol(chainId)}`}
          </div>
        </div>
        <div className="flex items-center justify-end">
          <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphesis">
            {`1 ${parsedAmounts[Field.CURRENCY_B]?.currency.getSymbol(
              chainId
            )} = ${price?.toSignificant(4)} ${parsedAmounts[
              Field.CURRENCY_A
            ]?.currency.getSymbol(chainId)}`}
          </div>
        </div>
      </div>
      <div className="h-px my-6 bg-gray-700" />
      <div className="grid gap-1 pb-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-secondary">
            {i18n._(
              t`${currencies[Field.CURRENCY_A]?.getSymbol(chainId)} Deposited`
            )}
          </div>
          <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphesis">
            <div>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</div>
            <span className="ml-1">
              {parsedAmounts[Field.CURRENCY_A]?.currency.getSymbol(chainId)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-secondary">
            {i18n._(
              t`${currencies[Field.CURRENCY_B]?.getSymbol(chainId)} Deposited`
            )}
          </div>
          <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphesis">
            <div>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</div>
            <span className="ml-1">
              {parsedAmounts[Field.CURRENCY_B]?.currency.getSymbol(chainId)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-secondary">
            {i18n._(t`Share of Pool:`)}
          </div>
          <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphesis">
            {noLiquidity ? "100" : poolTokenPercentage?.toSignificant(4)}%
          </div>
        </div>
      </div>

      <Button color="gradient" size="lg" onClick={onAdd}>
        {noLiquidity
          ? i18n._(t`Create Pool & Supply`)
          : i18n._(t`Confirm Supply`)}
      </Button>
    </div>
  );
}

export default ConfirmAddModalBottom;
