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

export default function Lending() {
  return (
    <Container id="supply-page" className="py-12 md:py-14 lg:py-16">
      <Head>
        <title>{APP_NAME_URL}</title>
        <meta key="description" name="description" content={APP_SHORT_BLURB} />
      </Head>
      <div className="p-4 rounded-lg shadow-lg bg-dark-900 text-secondary">
        <h1 className="text-lg font-semibold">Deposit</h1>
      </div>
    </Container>
  );
}
