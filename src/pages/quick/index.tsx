import React, { useCallback, useEffect, useState } from 'react';
import Container from '../../components/Container';
import { APP_NAME_URL, APP_SHORT_BLURB } from '../../constants';
import Head from 'next/head';
import Button from '../../components/Button';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import useSiloMarkets from '../../hooks/useSiloMarkets';
import { useTransactionAdder } from '../../state/transactions/hooks';
import useTokenSetup from '../../hooks/useTokenSetup';
import { useActiveWeb3React } from '../../hooks';
import { Field } from '../../state/swap/actions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { tryParseAmountToString } from '../../functions';
import {
  useSiloBridgePoolContract,
  useSiloContract,
  useTokenContract,
  useSiloRouterContract,
} from '../../hooks/useContract';
import { JSBI, WNATIVE } from '@sushiswap/sdk';
import Web3Status from '../../components/Web3Status';
import SiloPosistions from '../../components/SiloPositions';
import { SiloInfo, SiloRouterPosistion, SiloUserInfo } from '../../types/SiloTypes';

/**
 * TODO:
 * 1) check output is a silo
 * 2) calculate output amount from oracle and display
 * 3) this and borrow + lend should be checking collateral level, and that there is liquidity
 *    on both sides of the silo(s)
 */
export default function Lending() {
  const {
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
  } = useTokenSetup();

  const { createSiloMarket, tokenInSilo, currentSilo, currentOutSilo } = useSiloMarkets();
  const addTransaction = useTransactionAdder();
  const { chainId, account } = useActiveWeb3React();
  const { i18n } = useLingui();

  //TODO: memo all this, with the parse
  const selected: any = currencies[Field.INPUT];
  const selectedOut: any = currencies[Field.OUTPUT];
  const tokenAddress = selected?.address;
  const tokenAddressOut = selectedOut?.address;
  const amount = formattedAmounts.INPUT;
  const amountOut = formattedAmounts.OUTPUT;
  const siloBridgePool = useSiloBridgePoolContract(true);
  const tokenContract = useTokenContract(currentSilo && currentSilo.assetAddress, true);
  const siloContract = useSiloContract(currentSilo && currentSilo.address, true);
  // const siloAssetContract = useTokenContract(currentSilo && currentSilo.address, true);
  const siloRouterContract = useSiloRouterContract(true);
  // const [approvalState, approve] = useApproveCallback(amount, currentSilo && currentSilo.address);
  const wrappedNative = WNATIVE[chainId];
  const nativeTokenContract = useTokenContract(wrappedNative.address, true);
  const [currentSiloInfo, setCurrentSiloInfo] = useState<SiloInfo | null>(null);
  const [currentSiloUserInfo, setCurrentSiloUserInfo] = useState<SiloUserInfo | null>(null);

  // if a token is selected, lets check if in a silo, and set the current silo
  useEffect(() => {
    if (tokenAddress) tokenInSilo(tokenAddress);
  }, [tokenAddress, tokenInSilo]);

  useEffect(() => {
    if (tokenAddressOut) tokenInSilo(tokenAddressOut, true);
  }, [tokenAddressOut, tokenInSilo]);

  // uint256 public lastUpdateTimestamp;
  // uint256 public totalDeposits;
  // uint256 public totalBorrowShare;
  // uint256 public totalBorrowAmount;
  // uint256 public interestRate;
  // uint256 public protocolFees;

  //TODO: batch this with promise.all() or use lib to batch
  //TODO: should pull stale'ish values from the graph, then after interval fetch to be efficent
  //      or graph values are always up to date
  // for the current silo, pickup the current contract data values
  const fetchCurrentSiloData = useCallback(async () => {
    const siloInfo: SiloInfo = {};
    siloInfo.lastUpdateTimestamp = await siloContract.lastUpdateTimestamp();
    siloInfo.interestRate = await siloContract.interestRate();
    siloInfo.protocolFees = await siloContract.protocolFees();
    siloInfo.totalBorrowAmount = await siloContract.totalBorrowAmount();
    siloInfo.totalBorrowShare = await siloContract.totalBorrowShare();
    siloInfo.totalDeposits = await siloContract.totalDeposits();
    siloInfo.liquidity = await siloContract.liquidity();
    setCurrentSiloInfo(siloInfo);
  }, [siloContract]);

  //   function isSolvent(address _user) public override returns (bool) {
  //   /// @ev ratio between value borrowed by user in this silo to collateral value provided in bridge pool for this silo
  //   function getCollateralization(address _user) public returns (uint256) {
  //   /// @dev value of collateral (asset) provided by user
  //   function getCollateralValue(address _user) public override returns (uint256)
  //   /// @dev value of asset borrowed by user
  //   function getDebtValue(address _user) public returns (uint256) {

  const fetchCurrentSiloUserData = useCallback(async () => {
    if (currentSilo) {
      const userInfo: SiloUserInfo = {};
      console.log('getting current user silo data');
      console.log('user address:', account);
      userInfo.address = account;
      userInfo.underlyingBalance = await siloContract.balanceOfUnderlaying(account);
      userInfo.underlyingBridgeBalance = await siloBridgePool.balanceOfUnderlaying(currentSilo.address, account);
      // userInfo.isSolvent = await siloContract.isSolvent(account);
      // userInfo.collaterilizationLevel = await siloContract.getCollateralization(account);
      // userInfo.debtLevel = await siloContract.getDebtValue(account);
      setCurrentSiloUserInfo(userInfo);
    }
  }, [account, currentSilo, siloBridgePool, siloContract]);

  // if we have a silo, lets get the current data off the silo
  useEffect(() => {
    if (currentSilo) {
      console.log('getting silo data and silo user data');
      fetchCurrentSiloData();
      fetchCurrentSiloUserData();
    }
  }, [currentSilo, fetchCurrentSiloData, fetchCurrentSiloUserData]);

  const consoleState = () => {
    console.log('selected:', selected);
    console.log('selectedOut', selectedOut);
    console.log('tokenAddress:', tokenAddress);
    console.log('amount:', amount);
    console.log('parsedAmt:', parsedAmt);
    console.log('current silo:', currentSilo);
    console.log('current Out silo:', currentOutSilo);
    console.log('native asset on this chain is:', wrappedNative);
  };

  //TODO: parsed amounts should be in a memo
  const parsedAmt = amount && selected && tryParseAmountToString(amount, selected);
  const parsedAmtOut = amountOut && selectedOut && tryParseAmountToString(amountOut, selectedOut);

  const doQuickBorrow = async () => {
    console.log('doQuickBorrow()');

    if (currentSilo && selected && selectedOut && parsedAmt) {
      console.log('doing quick borrow...');
      consoleState();

      const routerPosistion: SiloRouterPosistion = {};
      routerPosistion.collateral = currentSilo.address;
      routerPosistion.depositAmount = parsedAmt;
      routerPosistion.borrow = currentOutSilo.address;
      routerPosistion.ethSilo = currentOutSilo.address;
      const halfValue = JSBI.BigInt(parsedAmtOut);

      //TODO: temporarily borrow half of the $ amount equivalent
      routerPosistion.borrowAmount = JSBI.divide(halfValue, JSBI.BigInt(2)).toString();
      console.log('routerPosistion:', routerPosistion);

      const result = await siloRouterContract.borrow([routerPosistion]);

      addTransaction(result, {
        summary: `QuickBorrow collateral - silo market ${currentSilo.symbol} borrow - ${currentOutSilo.symbol}`,
      });
    } else {
      console.warn('both silos are not selected or amount not entered');
    }
  };

  // no chain, no page
  if (!chainId) return null;

  return (
    <>
      <Container id="supply-page" className="pt-12 md:pt-14 lg:pt-16">
        <Head>
          <title>{APP_NAME_URL}</title>
          <meta key="description" name="description" content={APP_SHORT_BLURB} />
        </Head>
        <div className="p-4 pb-6 rounded-lg shadow-lg bg-dark-900 text-secondary">
          <h1 className="text-xl font-semibold">
            Quick Borrow{' '}
            <span className="text-sm font-thin ">
              (deposit - silo A - borrow bridge asset {'-->'} deposit silo B - borrow silo B asset)
            </span>
          </h1>

          <div className="mt-8">
            <CurrencyInputPanel
              // priceImpact={priceImpact}
              label={
                independentField === Field.OUTPUT && !showWrap
                  ? i18n._(t`Select Collateral Silo:`)
                  : i18n._(t`Select Collateral Silo:`)
              }
              value={formattedAmounts[Field.INPUT]}
              showMaxButton={showMaxButton}
              currency={currencies[Field.INPUT]}
              onUserInput={handleTypeInput}
              onMax={handleMaxInput}
              fiatValue={fiatValueInput ?? undefined}
              onCurrencySelect={handleInputSelect}
              //otherCurrency={currencies[Field.OUTPUT]}
              showCommonBases={false}
              id="swap-currency-input"
              hideBalance={false}
              hideInput={false}
            />
          </div>
          <div className="mt-2">
            <CurrencyInputPanel
              // priceImpact={priceImpact}
              label={
                independentField === Field.OUTPUT && !showWrap
                  ? i18n._(t`Select Borrow Silo:`)
                  : i18n._(t`Select Borrow Silo:`)
              }
              value={formattedAmounts[Field.OUTPUT]}
              showMaxButton={false}
              currency={currencies[Field.OUTPUT]}
              onUserInput={handleTypeInput}
              onMax={handleMaxInput}
              fiatValue={fiatValueInput ?? undefined}
              onCurrencySelect={handleOutputSelect}
              // otherCurrency={currencies[Field.INPUT]}
              showCommonBases={false}
              id="swap-currency-output"
              hideBalance={false}
              hideInput={false}
            />
          </div>

          <div className="mt-2">
            {account ? (
              <div className="flex space-x-2">
                <Button
                  type="button"
                  color="gray"
                  variant="outlined"
                  onClick={async () => {
                    console.log('Silo.approve()');

                    if (tokenAddress && currentSilo && amount) {
                      const result = await tokenContract.approve(currentSilo.address, parsedAmt);
                    } else {
                      console.warn('no current silo');
                    }
                  }}
                >
                  Approve
                </Button>
                <Button onClick={doQuickBorrow} color="darkindigo">
                  Quick Borrow
                </Button>
              </div>
            ) : (
              <Web3Status />
            )}
          </div>
        </div>
      </Container>
      <Container className="py-2 md:py-4 lg:py-6">
        {currentSilo && wrappedNative && currentSiloUserInfo && (
          <SiloPosistions
            currentSilo={currentSilo}
            wrappedNative={wrappedNative}
            currentSiloUserInfo={currentSiloUserInfo}
          />
        )}
      </Container>
    </>
  );
}
