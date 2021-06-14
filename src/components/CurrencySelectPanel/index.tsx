import React, { useCallback, useState } from "react";

import { ChevronDownIcon } from "@heroicons/react/outline";
import { Currency } from "@sushiswap/sdk";
import CurrencyLogo from "../CurrencyLogo";
import CurrencySearchModal from "../SearchModal/CurrencySearchModal";
import Lottie from "lottie-react";
import selectCoinAnimation from "../../animation/select-coin.json";
import styled from "styled-components";
import { t } from "@lingui/macro";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useLingui } from "@lingui/react";

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 100%;
  font-size: 20px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
`;

const StyledDropDown = styled(ChevronDownIcon)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;
  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`;

interface CurrencySelectPanelProps {
  onClick?: () => void;
  onCurrencySelect?: (currency: Currency) => void;
  currency?: Currency | null;
  disableCurrencySelect?: boolean;
  otherCurrency?: Currency | null;
  id: string;
  showCommonBases?: boolean;
}

export default function CurrencySelectPanel({
  onClick,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  otherCurrency,
  id,
  showCommonBases,
}: CurrencySelectPanelProps) {
  const { i18n } = useLingui();

  const [modalOpen, setModalOpen] = useState(false);
  const { chainId } = useActiveWeb3React();

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  return (
    <div id={id} className="p-5 rounded bg-dark-800">
      <div className="flex flex-col justify-between space-y-3 sm:space-y-0 sm:flex-row">
        <div className="w-full" onClick={onClick}>
          <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true);
              }
            }}
          >
            <div className="flex">
              {currency ? (
                <CurrencyLogo currency={currency} size={"54px"} />
              ) : (
                <div
                  className="rounded bg-dark-700"
                  style={{ maxWidth: 54, maxHeight: 54 }}
                >
                  <div style={{ width: 54, height: 54 }}>
                    <Lottie animationData={selectCoinAnimation} autoplay loop />
                  </div>
                </div>
              )}

              <div className="flex flex-col items-start justify-center mx-3.5">
                <div className="flex items-center">
                  <div className="mr-1 text-lg font-bold md:text-2xl">
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? currency.symbol.slice(0, 4) +
                        "..." +
                        currency.symbol.slice(
                          currency.symbol.length - 5,
                          currency.symbol.length
                        )
                      : currency?.getSymbol(chainId)) || (
                      <div className="px-2 py-1 mt-1 text-xs font-medium bg-transparent border rounded-full hover:bg-primary border-low-emphesis text-secondary whitespace-nowrap">
                        {i18n._(t`Select a token`)}
                      </div>
                    )}
                  </div>
                  {!disableCurrencySelect && currency && (
                    <ChevronDownIcon
                      className={`${
                        currency ? "text-primary" : "text-high-emphesis"
                      } stroke-current`}
                      width={16}
                      height={16}
                    />
                  )}
                </div>
              </div>
            </div>
          </CurrencySelect>
        </div>
      </div>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </div>
  );
}
