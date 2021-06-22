import { MEOW, SUSHI } from "../../constants";

import Head from "next/head";
import Layout from "../../layouts/DefaultLayout";
import { useLingui } from "@lingui/react";
import React, { useCallback, useMemo, useState } from "react";
import { ChainId, Currency, Token } from "@sushiswap/sdk";
import CurrencyInputPanel from "../../features/tools/meowshi/CurrencyInputPanel";
import HeaderToggle from "../../features/tools/meowshi/HeaderToggle";
import { tryParseAmount } from "../../functions";
import useSWR from "swr";
import { request } from "graphql-request";
import MeowshiButton from "../../features/tools/meowshi/MeowshiButton";
import Image from "next/image";
import Typography from "../../components/Typography";
import { ArrowDownIcon, InformationCircleIcon } from "@heroicons/react/solid";
import { t } from "@lingui/macro";

const QUERY = `{
    bar(id: "0x8798249c2e607446efb7ad49ec89dd1865ff4272") {
      ratio
    }
}`;

const fetcher = (query) =>
  request("https://api.thegraph.com/subgraphs/name/matthewlilley/bar", query);

export enum Field {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
}

export interface MeowshiState {
  currencies: {
    [Field.INPUT]: Token;
    [Field.OUTPUT]: Token;
  };
  setCurrency: (x: Token, field: Field) => void;
  fields: {
    [Field.INPUT]: string | null;
    [Field.OUTPUT]: string | null;
  };
  handleInput: (x: string, field: Field) => void;
  switchCurrencies: () => void;
  meow: boolean;
}

export default function Meowshi() {
  const { i18n } = useLingui();
  const { data } = useSWR(QUERY, fetcher);
  const MeowPerSushi = parseFloat(data?.bar?.ratio);
  const [fields, setFields] = useState({
    [Field.INPUT]: "",
    [Field.OUTPUT]: "",
  });

  const [currencies, setCurrencies] = useState({
    [Field.INPUT]: SUSHI[ChainId.MAINNET],
    [Field.OUTPUT]: MEOW,
  });

  const handleInput = useCallback(
    (val, field) => {
      const inputCurrency = currencies[Field.INPUT];
      const outputCurrency = currencies[Field.OUTPUT];
      const inputRate =
        inputCurrency === SUSHI[ChainId.MAINNET]
          ? (100000 / MeowPerSushi).toFixed(0)
          : "100000";
      const outputRate =
        outputCurrency === SUSHI[ChainId.MAINNET]
          ? (100000 / MeowPerSushi).toFixed(0)
          : "100000";

      if (field === Field.INPUT) {
        if (currencies[Field.OUTPUT] === MEOW) {
          setFields({
            [Field.INPUT]: val,
            [Field.OUTPUT]:
              tryParseAmount(val, outputCurrency)
                ?.multiply(inputRate)
                .toFixed(6) || "0",
          });
        } else {
          setFields({
            [Field.INPUT]: val,
            [Field.OUTPUT]:
              tryParseAmount(val, outputCurrency)
                ?.divide(inputRate)
                .toFixed(6) || "0",
          });
        }
      } else {
        if (currencies[Field.OUTPUT] === MEOW) {
          setFields({
            [Field.INPUT]:
              tryParseAmount(val, inputCurrency)
                ?.divide(outputRate)
                .toFixed(6) || "0",
            [Field.OUTPUT]: val,
          });
        } else {
          setFields({
            [Field.INPUT]:
              tryParseAmount(val, inputCurrency)
                ?.multiply(outputRate)
                .toFixed(6) || "0",
            [Field.OUTPUT]: val,
          });
        }
      }
    },
    [MeowPerSushi, currencies]
  );

  const setCurrency = useCallback((currency: Currency, field: Field) => {
    setCurrencies((prevState) => ({
      ...prevState,
      [field]: currency,
    }));
  }, []);

  const switchCurrencies = useCallback(() => {
    setCurrencies((prevState) => ({
      [Field.INPUT]: prevState[Field.OUTPUT],
      [Field.OUTPUT]: prevState[Field.INPUT],
    }));
  }, []);

  const meowshiState = useMemo<MeowshiState>(
    () => ({
      currencies,
      setCurrency,
      switchCurrencies,
      fields,
      meow: currencies[Field.OUTPUT]?.symbol === "MEOW",
      handleInput,
    }),
    [currencies, fields, handleInput, setCurrency, switchCurrencies]
  );

  return (
    <Layout>
      <Head>
        <title>Meowshi | Sushi</title>
        <meta name="description" content="SushiSwap Meowshi..." />
      </Head>

      <div className="w-full max-w-2xl">
        <div className="z-0 relative mb-[-54px] ml-4 flex justify-between gap-6 items-center">
          <div className="min-w-[168px]">
            <Image
              src="/neon-cat.png"
              alt="neon-cat"
              width="168px"
              height="168px"
            />
          </div>

          <div className="bg-[rgba(255,255,255,0.04)] p-4 rounded flex flex-row items-center gap-4 h-[58px] mb-[54px]">
            <InformationCircleIcon width={48} height={48} color="pink" />
            <Typography variant="xs" weight={700}>
              {i18n._(t`MEOW tokens wrap xSUSHI into BentoBox for double yields and can be
              used to vote in special MEOW governor contracts.`)}
            </Typography>
          </div>
        </div>
        <div className="z-1 p-4 relative rounded bg-dark-900 shadow-swap grid gap-4 border-dark-800 border-2">
          <HeaderToggle meowshiState={meowshiState} />
          <CurrencyInputPanel
            field={Field.INPUT}
            showMax={true}
            meowshiState={meowshiState}
          />
          <div className="relative mt-[-24px] mb-[-24px] ml-[28px] flex items-center">
            <div
              className="inline-flex rounded-full border-dark-900 border-2 bg-dark-800 p-2 cursor-pointer"
              onClick={switchCurrencies}
            >
              <ArrowDownIcon width={24} height={24} />
            </div>
            <Typography variant="sm" className="text-secondary ml-[26px]">
              {currencies[Field.INPUT]?.symbol} →{" "}
              {(currencies[Field.INPUT] === SUSHI[ChainId.MAINNET] ||
                currencies[Field.OUTPUT] === SUSHI[ChainId.MAINNET]) &&
                " xSUSHI → "}
              {currencies[Field.OUTPUT]?.symbol}
            </Typography>
          </div>
          <CurrencyInputPanel
            field={Field.OUTPUT}
            showMax={false}
            meowshiState={meowshiState}
          />
          <MeowshiButton meowshiState={meowshiState} />
        </div>
      </div>
    </Layout>
  );
}
