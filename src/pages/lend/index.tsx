import React, { useState } from 'react';
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
import SupportedSilos from '../../components/SupportedSilos';
import { constSelector } from 'recoil';

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

  const { createSiloMarket, tokenInSilo } = useSiloMarkets();
  const addTransaction = useTransactionAdder();
  const { chainId, library, account } = useActiveWeb3React();
  const { i18n } = useLingui();

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

        <div className="flex mt-8 mb-4 ml-5">
          <Button type="button" color="indigo">
            Approve
          </Button>

          <Button
            disabled={true}
            color="gray"
            type="button"
            onClick={async () => {
              console.log('Silo.deposit.click()');
              const selected: any = currencies[Field.INPUT];
              const tokenAddress = selected?.address;

              // have a token address, and this token address exists in a silo
              if (tokenAddress && tokenInSilo(tokenAddress)) {
                console.log('selected:', selected);
                console.log('tokenAddress:', tokenAddress);

                const amount = formattedAmounts.INPUT && formattedAmounts.INPUT;

                if (amount > 0) {
                  console.log('deposit amount:', amount);

                  //TODO: Check balance
                }
              }

              // if (tokenAddress) {
              //   console.log('creating market for:', selected);

              //   const result = await createSiloMarket(tokenAddress);

              //   addTransaction(result, {
              //     summary: `Added silo market ${selected.symbol}-ETH`,
              //   });

              // }
            }}
          >
            Deposit
          </Button>
        </div>
      </div>

      <div className="mt-10 ml-5 text-gray-600">
        <SupportedSilos />
      </div>
    </Container>
  );
}
