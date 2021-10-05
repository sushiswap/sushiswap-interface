import React, { useEffect, useState } from 'react';
import Container from '../../components/Container';
import { APP_NAME_URL, APP_SHORT_BLURB } from '../../constants';
import Head from 'next/head';
import Button from '../../components/Button';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import useSiloMarkets from '../../hooks/useSiloMarkets';
import { useTransactionAdder } from '../../state/transactions/hooks';
import useTokenSetup from '../../hooks/useTokenSetup';
import { useActiveWeb3React, useApproveCallback } from '../../hooks';
import { Field } from '../../state/swap/actions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import SupportedSilos from '../../components/SupportedSilos';
import { tryParseAmount } from '../../functions';
import { useSiloBridgePoolContract, useSiloContract, useTokenContract } from '../../hooks/useContract';

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
  } = useTokenSetup();

  const { createSiloMarket, tokenInSilo, currentSilo } = useSiloMarkets();
  const addTransaction = useTransactionAdder();
  const { chainId, library, account } = useActiveWeb3React();
  const { i18n } = useLingui();

  const selected: any = currencies[Field.INPUT];
  const tokenAddress = selected?.address;
  const amount = formattedAmounts.INPUT;
  const siloBridgePool = useSiloBridgePoolContract(true);
  const tokenContract = useTokenContract(currentSilo && currentSilo.assetAddress, true);
  const siloContract = useSiloContract(currentSilo && currentSilo.address, true);
  // const [approvalState, approve] = useApproveCallback(amount, currentSilo && currentSilo.address);

  // if a token is selected, lets check if in a silo, and set the current silo
  useEffect(() => {
    if (tokenAddress) tokenInSilo(tokenAddress);
  }, [tokenAddress]);

  if (!chainId) return null;

  return (
    <Container id="supply-page" className="py-12 md:py-14 lg:py-16">
      <Head>
        <title>{APP_NAME_URL}</title>
        <meta key="description" name="description" content={APP_SHORT_BLURB} />
      </Head>
      <div className="p-4 rounded-lg shadow-lg bg-dark-900 text-secondary">
        <h1 className="text-lg font-semibold">Deposit</h1>

        <div className="mt-8">
          <CurrencyInputPanel
            // priceImpact={priceImpact}
            label={independentField === Field.OUTPUT && !showWrap ? i18n._(t`Select:`) : i18n._(t`Select:`)}
            value={formattedAmounts[Field.INPUT]}
            showMaxButton={showMaxButton}
            currency={currencies[Field.INPUT]}
            onUserInput={handleTypeInput}
            onMax={handleMaxInput}
            fiatValue={fiatValueInput ?? undefined}
            onCurrencySelect={handleInputSelect}
            otherCurrency={currencies[Field.OUTPUT]}
            showCommonBases={true}
            id="swap-currency-input"
            hideBalance={false}
            hideInput={false}
          />
        </div>

        <div className="flex space-x-2 mt-8 mb-4 ml-5">
          <Button
            type="button"
            color="gray"
            variant="outlined"
            onClick={async () => {
              console.log('Silo.approve()');

              if (tokenAddress && currentSilo) {
                if (amount > 0) {
                  console.log('selected:', selected);
                  console.log('tokenAddress:', tokenAddress);
                  console.log('amount:', amount);
                  console.log('current silo:', currentSilo);

                  if (currentSilo) {
                    const result = await tokenContract.approve(currentSilo.address, amount);
                  } else {
                    console.warn('no current silo');
                  }
                }
              }
            }}
          >
            Approve
          </Button>

          <Button
            color="darkindigo"
            type="button"
            onClick={async () => {
              console.log('Silo.deposit.deposit()');

              //have a token address, and this token address exists in a silo
              if (tokenAddress && currentSilo) {
                if (amount > 0) {
                  console.log('selected:', selected);
                  console.log('tokenAddress:', tokenAddress);
                  console.log('amount:', amount);
                  console.log('current silo:', currentSilo);

                  if (currentSilo) {
                    const result = await siloContract.deposit(amount);

                    addTransaction(result, {
                      summary: `Deposit ${amount} ${selected.symbol} into ${currentSilo.name}`,
                    });
                  } else {
                    console.warn('no current silo');
                  }
                }
              }
            }}
          >
            Deposit
          </Button>
          <Button
            type="button"
            color="gray"
            onClick={async () => {
              console.log('Silo.deposit.withdraw()');

              // have a token address, and this token address exists in a silo
              if (tokenAddress && tokenInSilo(tokenAddress)) {
                console.log('selected:', selected);
                console.log('tokenAddress:', tokenAddress);

                if (amount > 0) {
                  console.log('withdraw amount:', amount);

                  const result = await siloContract.withdraw(amount);

                  addTransaction(result, {
                    summary: `Withdraw ${amount} ${selected.symbol} from ${currentSilo.name}`,
                  });
                }
              }
            }}
          >
            Withdraw
          </Button>
        </div>
      </div>

      <div className="mt-10 ml-5 text-gray-600">
        <SupportedSilos />
      </div>
    </Container>
  );
}
