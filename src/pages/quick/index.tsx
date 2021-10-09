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
  useSiloOracleContract,
} from '../../hooks/useContract';
import { JSBI, WNATIVE } from '@sushiswap/sdk';
import Web3Status from '../../components/Web3Status';
import SiloPosistions from '../../components/SiloPositions';
import { SiloInfo, SiloRouterPosistion, SiloUserInfo } from '../../types/SiloTypes';
import { ethers } from 'ethers';

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
  const siloOracleContract = useSiloOracleContract(true);
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
    console.log('parsedAmt:', parsedAmt);
    console.log('parseOutAmt:', parsedAmtOut);
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

      const oraclePriceForAssetB = await siloOracleContract.callStatic.getPrice(tokenAddressOut);
      // await oraclePriceForAssetB.wait();
      const bnOraclePriceAssetB = JSBI.BigInt(oraclePriceForAssetB);
      console.log(`oracle price for AssetB: ${JSON.stringify(bnOraclePriceAssetB.toString())}`);

      const oraclePriceForNative = await siloOracleContract.callStatic.getPrice(nativeTokenContract.address);
      const bnOraclePriceNativeAsset = JSBI.BigInt(oraclePriceForNative);

      console.log(`oracle price for native: ${JSON.stringify(bnOraclePriceNativeAsset.toString())}`);

      /** critical need oracle values to proceed */
      if (
        !(
          JSBI.greaterThan(bnOraclePriceAssetB, JSBI.BigInt(0)) &&
          JSBI.greaterThan(bnOraclePriceNativeAsset, JSBI.BigInt(0))
        )
      ) {
        console.error('price oracle failed for either assetB or native asset');
        return;
      }

      /**  TODO: just verify the path
            1. - oracled asset a, gives asset b $ equivalent
            2a. - a$ -> b$, you have b$max, you then have bLiquidtymax
            2b. - a$ -> native$, b$ -> native$, gives a$native -> b$native ratio
            2c. - maxout b$native while less than b$max and bLiquiditymax
            3. - pre-load asset b available liquidity (otherwise this is max)
            [DEMO] 1)oracle price A & price A in native * QTY set as [collateral], 2)same for B 
            4) borrow 40% $val for B set as Router[borrow], set as Router[native]
      */

      // uni price * amount (uni price in weth) * 3 (to be save) = (weth equiv link deposit needed)
      // USE DEMO (this is likely wrong)
      const nativeBorrow = JSBI.multiply(JSBI.multiply(bnOraclePriceAssetB, bnOraclePriceNativeAsset), JSBI.BigInt(3));

      // const routerPosistion: SiloRouterPosistion = {};
      // routerPosistion.collateral = currentSilo.assetAddress;
      // routerPosistion.depositAmount = parsedAmt;
      // routerPosistion.borrow = currentOutSilo.assetAddress;
      // routerPosistion.ethSilo = ethers.constants.AddressZero;
      // const halfValue = JSBI.BigInt(parsedAmtOut);
      //TODO: temporarily borrow half of the $ amount equivalent
      // routerPosistion.borrowAmount = JSBI.divide(halfValue, JSBI.BigInt(10)).toString();
      // console.log('routerPosistion:', routerPosistion);

      // const positions: any = [
      //   {
      //     collateral: LINK_ADDRESS,
      //     borrow: WETH_ADDRESS,
      //     ethSilo: ethers.constants.AddressZero,
      //     depositAmount: linkDeposit,
      //     borrowAmount: ethBorrow
      //   },
      //   {
      //     collateral: WETH_ADDRESS,
      //     borrow: RAI_ADDRESS,
      //     ethSilo: raiSilo.address,
      //     depositAmount: ethDeposit,
      //     borrowAmount: raiBorrow
      //   }
      // ];

      const LINK_AMT = JSBI.BigInt('100000000000000000');
      const ETH_BORROW = JSBI.BigInt('10000000000000');
      const UNI_BORROW = JSBI.BigInt('10000000000');

      const rp1: SiloRouterPosistion = {};
      rp1.collateral = currentSilo.assetAddress;
      rp1.depositAmount = LINK_AMT.toString();
      rp1.borrow = nativeTokenContract.address;
      rp1.ethSilo = ethers.constants.AddressZero;
      rp1.borrowAmount = ETH_BORROW.toString();

      const rp2: SiloRouterPosistion = {};
      rp2.collateral = nativeTokenContract.address;
      rp2.depositAmount = ETH_BORROW.toString();
      rp2.borrow = currentOutSilo.assetAddress;
      rp2.ethSilo = currentOutSilo.address;
      rp2.borrowAmount = UNI_BORROW.toString();

      console.log([rp1, rp2]);

      // const result = await siloRouterContract.borrow([rp1, rp2]);

      // addTransaction(result, {
      //   summary: `QuickBorrow collateral - silo market ${currentSilo.symbol} borrow - ${currentOutSilo.symbol}`,
      // });
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
              hideInput={true}
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
                      const result = await tokenContract.approve(siloRouterContract.address, parsedAmt);
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
