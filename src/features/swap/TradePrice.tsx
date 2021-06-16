import { Price } from "@sushiswap/sdk";
import React from "react";
import Typography from "../../components/Typography";
import { t } from "@lingui/macro";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useLingui } from "@lingui/react";

interface TradePriceProps {
  price?: Price;
  showInverted: boolean;
  setShowInverted: (showInverted: boolean) => void;
}

export default function TradePrice({
  price,
  showInverted,
  setShowInverted,
}: TradePriceProps) {
  const { chainId } = useActiveWeb3React();
  const { i18n } = useLingui();
  const formattedPrice = showInverted
    ? price?.toSignificant(6)
    : price?.invert()?.toSignificant(6);

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency);
  const label = showInverted
    ? `${price?.quoteCurrency?.getSymbol(
        chainId
      )} per ${price?.baseCurrency?.getSymbol(chainId)}`
    : `${price?.baseCurrency?.getSymbol(
        chainId
      )} per ${price?.quoteCurrency?.getSymbol(chainId)}`;

  return (
    <div className="p-1 -mt-2 rounded-b-md bg-dark-800">
      {show ? (
        <div className="flex justify-between w-full px-5 py-1 rounded-b-md bg-dark-900 text-secondary">
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Exchange Rate`)}
          </Typography>
          <div className="flex items-center space-x-4">
            <Typography
              variant="sm"
              className="text-secondary"
              onClick={() => setShowInverted(!showInverted)}
            >
              {formattedPrice ?? "-"} {label}
            </Typography>
            <div
              onClick={() => setShowInverted(!showInverted)}
              className="cursor-pointer hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        "-"
      )}
    </div>
  );
}
