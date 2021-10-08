import { ARCHER_RELAY_URI } from '../constants';
import { ApprovalState, useApproveCallbackFromTrade } from './useApproveCallback';
import { ChainId, Currency, CurrencyAmount, JSBI, Token, TradeType, Trade as V2Trade } from '@sushiswap/sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAllTokens, useCurrency } from './Tokens';
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from '../state/swap/hooks';
import {
  useExpertModeManager,
  useUserArcherETHTip,
  useUserArcherGasPrice,
  useUserArcherUseRelay,
  useUserSingleHopOnly,
  useUserTransactionTTL,
} from '../state/user/hooks';
import { useNetworkModalToggle, useToggleSettingsMenu, useWalletModalToggle } from '../state/application/hooks';
import useWrapCallback, { WrapType } from '../hooks/useWrapCallback';
import { Field } from '../state/swap/actions';
import ReactGA from 'react-ga';
import { computeFiatValuePriceImpact } from '../functions/trade';
import confirmPriceImpactWithoutFee from '../features/swap/confirmPriceImpactWithoutFee';
import { maxAmountSpend } from '../functions/currency';
import { useActiveWeb3React } from './useActiveWeb3React';
import useENSAddress from './useENSAddress';
import useIsArgentWallet from './useIsArgentWallet';
import { useIsSwapUnsupported } from './useIsSwapUnsupported';
import usePrevious from './usePrevious';
import { useRouter } from 'next/router';
import { useSwapCallback } from './useSwapCallback';
import { useUSDCValue } from './useUSDCPrice';
import { warningSeverity } from '../functions/prices';

const useTokenSetup = () => {
  const loadedUrlParams = useDefaultsFromURLSearch();

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ];

  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false);
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c?.isToken ?? false) ?? [],
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

  const { account, chainId } = useActiveWeb3React();

  const toggleNetworkModal = useNetworkModalToggle();

  const router = useRouter();

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle();

  // for expert mode
  const [isExpertMode] = useExpertModeManager();
  const toggleSettings = useToggleSettingsMenu();

  // get custom setting values for user
  const [ttl] = useUserTransactionTTL();
  const [useArcher] = useUserArcherUseRelay();
  const [archerETHTip] = useUserArcherETHTip();
  const [archerGasPrice] = useUserArcherGasPrice();

  // archer
  const archerRelay = chainId ? ARCHER_RELAY_URI?.[chainId] : undefined;
  const doArcher = archerRelay !== undefined && useArcher;

  // swap state
  const { independentField, typedValue, recipient } = useSwapState();
  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
    allowedSlippage,
  } = useDerivedSwapInfo(doArcher);

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue);
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  const { address: recipientAddress } = useENSAddress(recipient);

  const trade = showWrap ? undefined : v2Trade;

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount,
          }
        : {
            [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
            [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
          },
    [independentField, parsedAmount, showWrap, trade]
  );

  const fiatValueInput = useUSDCValue(parsedAmounts[Field.INPUT]);
  const fiatValueOutput = useUSDCValue(parsedAmounts[Field.OUTPUT]);
  const priceImpact = computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput);

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers();

  const isValid = !swapInputError;

  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  );

  // reset if they close warning without tokens in params
  const handleDismissTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
    router.push('/swap/');
  }, [router]);

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean;
    tradeToConfirm: V2Trade<Currency, Currency, TradeType> | undefined;
    attemptingTxn: boolean;
    swapErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  });

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  };

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  );

  const routeNotFound = !trade?.route;

  // check whether the user has approved the router on the input token
  const [approvalState, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage, doArcher);

  const signatureData = undefined;

  // const {
  //   state: signatureState,
  //   signatureData,
  //   gatherPermitSignature,
  // } = useERC20PermitFromTrade(trade, allowedSlippage)

  const handleApprove = useCallback(async () => {
    await approveCallback();
    // if (signatureState === UseERC20PermitState.NOT_SIGNED && gatherPermitSignature) {
    //   try {
    //     await gatherPermitSignature()
    //   } catch (error) {
    //     // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
    //     if (error?.code !== 4001) {
    //       await approveCallback()
    //     }
    //   }
    // } else {
    //   await approveCallback()
    // }
  }, [approveCallback]);
  // }, [approveCallback, gatherPermitSignature, signatureState])

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approvalState, approvalSubmitted]);

  const maxInputAmount: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[Field.INPUT]);
  const showMaxButton = Boolean(maxInputAmount?.greaterThan(0) && !parsedAmounts[Field.INPUT]?.equalTo(maxInputAmount));

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    recipient,
    signatureData,
    doArcher ? ttl : undefined
  );

  const [singleHopOnly] = useUserSingleHopOnly();

  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return;
    }
    if (priceImpact && !confirmPriceImpactWithoutFee(priceImpact)) {
      return;
    }
    setSwapState({
      attemptingTxn: true,
      tradeToConfirm,
      showConfirm,
      swapErrorMessage: undefined,
      txHash: undefined,
    });
    swapCallback()
      .then((hash) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: undefined,
          txHash: hash,
        });

        ReactGA.event({
          category: 'Swap',
          action:
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
              ? 'Swap w/o Send + recipient'
              : 'Swap w/ Send',
          label: [
            trade?.inputAmount?.currency?.symbol,
            trade?.outputAmount?.currency?.symbol,
            singleHopOnly ? 'SH' : 'MH',
          ].join('/'),
        });

        ReactGA.event({
          category: 'Routing',
          action: singleHopOnly ? 'Swap with multihop disabled' : 'Swap with multihop enabled',
        });
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        });
      });
  }, [
    swapCallback,
    priceImpact,
    tradeToConfirm,
    showConfirm,
    recipient,
    recipientAddress,
    account,
    trade?.inputAmount?.currency?.symbol,
    trade?.outputAmount?.currency?.symbol,
    singleHopOnly,
  ]);

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false);

  // warnings on slippage
  // const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);
  const priceImpactSeverity = useMemo(() => {
    const executionPriceImpact = trade?.priceImpact;
    return warningSeverity(
      executionPriceImpact && priceImpact
        ? executionPriceImpact.greaterThan(priceImpact)
          ? executionPriceImpact
          : priceImpact
        : executionPriceImpact ?? priceImpact
    );
  }, [priceImpact, trade]);

  const isArgentWallet = useIsArgentWallet();

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !isArgentWallet &&
    !swapInputError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      (approvalSubmitted && approvalState === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode);

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({
      showConfirm: false,
      tradeToConfirm,
      attemptingTxn,
      swapErrorMessage,
      txHash,
    });
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '');
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash]);

  const handleAcceptChanges = useCallback(() => {
    setSwapState({
      tradeToConfirm: trade,
      swapErrorMessage,
      txHash,
      attemptingTxn,
      showConfirm,
    });
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash]);

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false); // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency);
    },
    [onCurrencySelection]
  );

  const handleMaxInput = useCallback(() => {
    maxInputAmount && onUserInput(Field.INPUT, maxInputAmount.toExact());
  }, [maxInputAmount, onUserInput]);

  const handleOutputSelect = useCallback(
    (outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  );

  // useEffect(() => {
  //   if (
  //     doArcher &&
  //     parsedAmounts[Field.INPUT] &&
  //     maxAmountInput &&
  //     parsedAmounts[Field.INPUT]?.greaterThan(maxAmountInput)
  //   ) {
  //     handleMaxInput();
  //   }
  // }, [handleMaxInput, parsedAmounts, maxAmountInput, doArcher]);

  const swapIsUnsupported = useIsSwapUnsupported(currencies?.INPUT, currencies?.OUTPUT);

  const priceImpactTooHigh = priceImpactSeverity > 3 && !isExpertMode;

  const [animateSwapArrows, setAnimateSwapArrows] = useState<boolean>(false);

  const previousChainId = usePrevious<ChainId>(chainId);

  return {
    independentField,
    showWrap,
    formattedAmounts,
    showMaxButton,
    currencies,
    handleTypeInput,
    handleMaxInput,
    fiatValueInput,
    handleInputSelect,
    handleOutputSelect,
  };
};

export default useTokenSetup;
