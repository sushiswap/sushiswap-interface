import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import React, { useState } from 'react';
import Container from '../../components/Container';
import { APP_NAME_URL, APP_SHORT_BLURB } from '../../constants';
import useTokenSetup from '../../hooks/useTokenSetup';
import { Field } from '../tools/meowshi';
import Head from 'next/head';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import Button from '../../components/Button';
import { useActiveWeb3React } from '../../hooks';
import Web3Status from '../../components/Web3Status';
import { Currency } from '@sushiswap/sdk';
import { CurrencySearch } from '../../modals/SearchModal/CurrencySearch';

export default function Sandbox() {
  const { i18n } = useLingui();
  const { account, chainId } = useActiveWeb3React();

  // temp state
  const [deposited, setDeposited] = useState(false);
  const [deposit, setDeposit] = useState(null);
  //

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

  console.log('deposited:', deposited);
  console.log('deposit:', deposit);

  if (!deposited)
    return (
      <Container id="supply-page" className="py-12 md:py-14 lg:py-16">
        <Head>
          <title>{APP_NAME_URL}</title>
          <meta key="description" name="description" content={APP_SHORT_BLURB} />
        </Head>
        <div className="p-4 rounded-lg shadow-lg bg-dark-900 text-secondary">
          <h1 className="text-lg font-semibold">Lend</h1>
          <div className="mt-6">
            <CurrencyInputPanel
              // priceImpact={priceImpact}
              label={independentField === Field.OUTPUT && !showWrap ? i18n._(t`Deposit`) : i18n._(t`Deposit:`)}
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
            />
          </div>
          <div className="mt-6">
            <DepositButton
              setDeposit={setDeposit}
              setDeposited={setDeposited}
              value={formattedAmounts[Field.INPUT]}
              currency={currencies[Field.INPUT]}
              account={account}
            />
          </div>
        </div>
      </Container>
    );

  return (
    <>
      <Container id="supply-page" className="py-12 md:py-14 lg:py-16">
        <Head>
          <title>{APP_NAME_URL}</title>
          <meta key="description" name="description" content={APP_SHORT_BLURB} />
        </Head>
        <div className="p-4 rounded-lg shadow-lg bg-dark-900 text-secondary">
          <div className="flex justify-between">
            <h1 className="mt-2 text-lg font-semibold text-high-emphesis">Allowances</h1>
            <p>
              <Button
                className="hover:text-indigo-400"
                onClick={() => {
                  console.log('back.clicked()');
                  setDeposited(false);
                }}
              >
                x
              </Button>
            </p>
          </div>
          <div className="mt-6">
            You are lending {formattedAmounts[Field.INPUT]} {currencies[Field.INPUT].name}
          </div>
        </div>
      </Container>
      <AllowancesSelect currencies={currencies} />
    </>
  );
}

const AllowancesSelect = ({ currencies }: { currencies: any }) => {
  console.log('currencies:', currencies);

  return (
    <Container id="supply-page" className="py-2 md:py-4 lg:py-6">
      <div className="p-4 rounded-lg shadow-lg bg-dark-900 text-secondary"></div>
    </Container>
  );
};

const DepositButton = ({
  account,
  currency,
  value,
  setDeposit,
  setDeposited,
}: {
  account: string;
  currency: any;
  value: any;
  setDeposit: Function;
  setDeposited: Function;
}) => {
  return (
    <>
      {account ? (
        <Button
          color="gray"
          onClick={() => {
            // console.log('deposit.action');
            // console.log('account:', account);
            // console.log('currency input:', currency);
            // console.log('input value:', value);

            if (value < 1) {
              console.warn('deposited value is < 1');
            }

            if (value >= 1) {
              console.log('deposit value:', value);
              console.log('depositing currency:', currency.name);

              setDeposited(true);
              setDeposit({
                currency,
                value,
              });
            }
          }}
        >
          Deposit
        </Button>
      ) : (
        <Web3Status />
      )}
    </>
  );
};
