import Head from "next/head";
import { t } from "@lingui/macro";
import TokenWarningModal from "../../components/TokenWarningModal";
import React, { useCallback, useMemo, useState } from "react";
import Layout from "../../layouts/DefaultLayout";
import { useLingui } from "@lingui/react";
import { CurrencyAmount, Token } from "@sushiswap/sdk";
import { useAllTokens, useCurrency } from "../../hooks/Tokens";
import { Field } from "../../state/swap/actions";
import SwapHeader from "../../components/ExchangeHeader";
import { useExpertModeManager } from "../../state/user/hooks";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import DoubleGlowShadow from "../../components/DoubleGlowShadow";
import CurrencyInputPanel, {
  CurrencyInputPanelVariant,
} from "../../components/CurrencyInputPanel";
import {
  formatPercent,
  maxAmountSpend,
  wrappedCurrency,
} from "../../functions";
import Lottie from "lottie-react";
import swapArrowsAnimationData from "../../animation/swap-arrows.json";
import LimitPriceInputPanel from "../../features/limit-orders/LimitPriceInputPanel";
import ExpertModePanel from "../../components/ExpertModePanel";
import PriceRatio from "../../features/limit-orders/PriceRatio";
import OrderExpirationDropdown from "../../features/limit-orders/OrderExpirationDropdown";
import AddressInputPanel from "../../components/AddressInputPanel";
import { ArrowDownIcon } from "@heroicons/react/outline";
import {
  useDefaultsFromURLSearch,
  useDerivedLimitOrderInfo,
  useLimitOrderActionHandlers,
  useLimitOrderState,
} from "../../state/limit-order/hooks";
import LimitOrderButton from "../../features/limit-orders/LimitOrderButton";
import BalancePanel from "../../features/limit-orders/BalancePanel";

export default function LimitOrder() {
  const { i18n } = useLingui();
  const { chainId } = useActiveWeb3React();

  const loadedUrlParams = useDefaultsFromURLSearch();

  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ];

  // token warning stuff
  const [dismissTokenWarning, setDismissTokenWarning] =
    useState<boolean>(false);

  const urlLoadedTokens: Token[] = useMemo(
    () =>
      [loadedInputCurrency, loadedOutputCurrency]?.filter(
        (c): c is Token => c instanceof Token
      ) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  );
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
  }, []);

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens();
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !Boolean(token.address in defaultTokens);
    });

  // for expert mode
  const [isExpertMode, toggleExpertMode] = useExpertModeManager();

  // Limit order state
  const {
    independentField,
    typedValue,
    recipient,
    limitPrice,
    fromBentoBalance,
  } = useLimitOrderState();

  const { currencies, parsedAmounts, currencyBalances, currentPrice } =
    useDerivedLimitOrderInfo();

  const currentPriceAsString = currentPrice?.toSignificant(6);

  const {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  } = useLimitOrderActionHandlers();

  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(
    currencyBalances[Field.INPUT],
    undefined,
    chainId
  );

  const atMaxAmountInput = Boolean(
    fromBentoBalance
      ? parsedAmounts[Field.INPUT]?.equalTo(currencyBalances[Field.INPUT])
      : maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput)
  );

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      onCurrencySelection(Field.INPUT, inputCurrency);
    },
    [onCurrencySelection]
  );

  const handleMaxInput = useCallback(() => {
    if (fromBentoBalance) {
      onUserInput(Field.INPUT, currencyBalances[Field.INPUT].toExact());
    } else {
      maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact());
    }
  }, [currencyBalances, fromBentoBalance, maxAmountInput, onUserInput]);

  const handleOutputSelect = useCallback(
    (outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  );

  const [animateSwapArrows, setAnimateSwapArrows] = useState<boolean>(false);

  const [currencyInputPanelError, setCurrencyInputPanelError] =
    useState<string>();

  const checkLimitPrice = useCallback(() => {
    if (limitPrice === currentPriceAsString) return;
    if (limitPrice && currentPrice && +limitPrice < +currentPriceAsString)
      setCurrencyInputPanelError(
        i18n._(t`This transaction is below market rate`)
      );
    else setCurrencyInputPanelError("");
  }, [limitPrice, currentPriceAsString, currentPrice, i18n]);

  const currencyInputPanelHelperText = useMemo(() => {
    if (limitPrice === currentPriceAsString) return;
    const sign =
      +limitPrice > +currentPriceAsString ? i18n._(t`above`) : i18n._(t`below`);
    if (limitPrice && currentPriceAsString)
      return i18n._(
        t`${formatPercent(
          ((+limitPrice - +currentPriceAsString) / +currentPriceAsString) * 100
        )} ${sign} market rate`
      );
  }, [limitPrice, currentPriceAsString, i18n]);

  const tokenA = wrappedCurrency(currencies[Field.INPUT], chainId);

  return (
    <Layout>
      <Head>
        <title>{i18n._(t`Limit order`)} | Sushi</title>
        <meta
          name="description"
          content="SushiSwap allows for swapping of ERC20 compatible tokens across multiple networks"
        />
      </Head>
      <TokenWarningModal
        isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
        tokens={importTokensNotInDefault}
        onConfirm={handleConfirmTokenWarning}
      />
      <ExpertModePanel
        active={isExpertMode}
        onClose={() => {
          onChangeRecipient(null);
          toggleExpertMode();
        }}
      >
        <DoubleGlowShadow>
          <div
            id="limit-order-page"
            className="flex flex-col w-full max-w-2xl p-6 rounded bg-dark-900 gap-4"
          >
            <SwapHeader
              input={currencies[Field.INPUT]}
              output={currencies[Field.OUTPUT]}
            />
            <div className="flex flex-col gap-4">
              <CurrencyInputPanel
                label={i18n._(t`You pay`)}
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={!atMaxAmountInput}
                currency={currencies[Field.INPUT]}
                onUserInput={(value) => onUserInput(Field.INPUT, value)}
                onMax={handleMaxInput}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                id="swap-currency-input"
                customBalanceComponent={<BalancePanel />}
                variant={CurrencyInputPanelVariant.limit}
              />
              <div className="flex flex-row gap-5">
                <div />
                <div className="flex items-center relative">
                  <div className="z-0 absolute w-[2px] bg-dark-800 h-[calc(100%+32px)] top-[-16px] left-[calc(50%-1px)]" />
                  <button
                    className="rounded-full bg-dark-900 p-3px z-10"
                    onClick={() => {
                      onSwitchTokens();
                    }}
                  >
                    <div
                      className="p-2 rounded-full bg-dark-800 hover:bg-dark-700"
                      onMouseEnter={() => setAnimateSwapArrows(true)}
                      onMouseLeave={() => setAnimateSwapArrows(false)}
                    >
                      <Lottie
                        animationData={swapArrowsAnimationData}
                        autoplay={animateSwapArrows}
                        loop={false}
                        className="w-[32px] h-[32px]"
                      />
                    </div>
                  </button>
                </div>
                <LimitPriceInputPanel onBlur={checkLimitPrice} />
              </div>
              <CurrencyInputPanel
                value={formattedAmounts[Field.OUTPUT]}
                onUserInput={(value) => onUserInput(Field.OUTPUT, value)}
                label={i18n._(t`You receive:`)}
                showMaxButton={false}
                currency={currencies[Field.OUTPUT]}
                onCurrencySelect={handleOutputSelect}
                otherCurrency={currencies[Field.INPUT]}
                id="swap-currency-output"
                error={currencyInputPanelError}
                helperText={currencyInputPanelHelperText}
                variant={CurrencyInputPanelVariant.limit}
              />

              {recipient !== null ? (
                <>
                  <div className="relative left-9">
                    <ArrowDownIcon
                      className="text-high-emphesis"
                      strokeWidth={2}
                      width={16}
                      height={16}
                    />
                  </div>
                  <AddressInputPanel
                    id="recipient"
                    value={recipient}
                    onChange={onChangeRecipient}
                  />
                </>
              ) : null}
            </div>

            <div className="flex justify-between gap-4 items-center w-full">
              {currencies[Field.INPUT] && currencies[Field.OUTPUT] && (
                <div className="flex flex-1">
                  <PriceRatio />
                </div>
              )}
              {isExpertMode && recipient === null && (
                <div className="flex flex-1">
                  <div
                    className="flex text-blue underline cursor-pointer items-center text-sm"
                    onClick={() => onChangeRecipient("")}
                  >
                    {i18n._(t`Change Recipient`)}
                  </div>
                </div>
              )}
              {!(currencies[Field.INPUT] && currencies[Field.OUTPUT]) &&
                !(isExpertMode && recipient === null) && (
                  <div className="flex flex-1" />
                )}

              <OrderExpirationDropdown />
            </div>

            <div className="flex">
              <LimitOrderButton color="gradient" size="lg" token={tokenA} />
            </div>
          </div>
        </DoubleGlowShadow>
      </ExpertModePanel>
    </Layout>
  );
}
