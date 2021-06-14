import { ApprovalState, useApproveCallback } from "../hooks/useApproveCallback";
import {
  BentoBalance,
  useBentoBalance,
  useBentoBalances,
} from "../state/bentobox/hooks";
import React, { useState } from "react";
import { Token, TokenAmount, WETH } from "@sushiswap/sdk";
import { useFuse, useSortableData } from "../hooks";

import AsyncIcon from "../components/AsyncIcon";
import { BENTOBOX_ADDRESS } from "../constants/kashi";
import Back from "../components/Back";
import Button from "../components/Button";
import Card from "../components/Card";
import CardHeader from "../components/CardHeader";
import Dots from "../components/Dots";
import Head from "next/head";
import Layout from "../layouts/KashiLayout";
import { Input as NumericalInput } from "../components/NumericalInput";
import Paper from "../components/Paper";
import Search from "../components/Search";
import { formatNumber } from "../functions/format";
import { t } from "@lingui/macro";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import useBentoBox from "../hooks/useBentoBox";
import { useLingui } from "@lingui/react";
import useTokenBalance from "../hooks/useTokenBalance";

export default function Balances() {
  const { i18n } = useLingui();
  const balances = useBentoBalances();

  // Search Setup
  const options = { keys: ["symbol", "name"], threshold: 0.1 };
  const { result, search, term } = useFuse({
    data: balances && balances.length > 0 ? balances : [],
    options,
  });

  // Sorting Setup
  const { items, requestSort, sortConfig } = useSortableData(result);
  return (
    <Layout
      left={
        <Card
          className="h-full bg-dark-900"
          backgroundImage="bento-illustration.png"
          title={i18n._(t`Deposit tokens into BentoBox for all the yields`)}
          description={i18n._(
            t`BentoBox provides extra yield on deposits with flash lending, strategies, and fixed, low-gas transfers among integrated dapps, like Kashi markets`
          )}
        />
      }
    >
      <Head>
        <title>Balances | Sushi</title>
        <meta name="description" content="" />
      </Head>
      <Card
        className="h-full bg-dark-900"
        header={
          <CardHeader className="flex items-center justify-between bg-dark-800">
            <div className="flex flex-col items-center justify-between w-full md:flex-row">
              <div className="flex items-baseline">
                <div className="mr-4 text-3xl text-high-emphesis">
                  {i18n._(t`BentoBox`)}
                </div>
              </div>
              <div className="flex justify-end w-full py-4 md:py-0">
                <Search search={search} term={term} />
              </div>
            </div>
          </CardHeader>
        }
      >
        <div className="grid grid-flow-row gap-4 auto-rows-max">
          <div className="grid grid-cols-3 px-4 text-sm select-none text-secondary">
            <div>{i18n._(t`Token`)}</div>
            <div className="text-right">{i18n._(t`Wallet`)}</div>
            <div className="text-right">{i18n._(t`BentoBox`)}</div>
          </div>
          {items &&
            items.length > 0 &&
            items.map((balance: BentoBalance, i: number) => {
              return (
                <TokenBalance
                  key={balance.address + "_" + i}
                  balance={balance}
                />
              );
            })}
        </div>
      </Card>
    </Layout>
  );
}

const TokenBalance = ({ balance }: { balance: any }) => {
  const [expand, setExpand] = useState<boolean>(false);
  return (
    <Paper className="bg-dark-800 ">
      <div
        className="grid grid-cols-3 px-4 py-4 text-sm rounded cursor-pointer select-none "
        onClick={() => setExpand(!expand)}
      >
        <div className="flex items-center">
          <AsyncIcon
            src={balance.tokenInfo.logoURI}
            className="w-10 mr-4 rounded-lg sm:w-14"
          />
          <div>{balance && balance.symbol}</div>
        </div>
        <div className="flex items-center justify-end">
          <div>
            <div className="text-right">
              {formatNumber(balance.wallet.string)}{" "}
            </div>
            <div className="text-right text-secondary">
              {formatNumber(balance.wallet.usd, true)}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <div>
            <div className="text-right">
              {formatNumber(balance.bento.string)}{" "}
            </div>
            <div className="text-right text-secondary">
              {formatNumber(balance.bento.usd, true)}
            </div>
          </div>
        </div>
      </div>
      {expand && (
        <div className="grid grid-cols-2 gap-4 px-4 pb-4">
          <div className="col-span-2 text-center md:col-span-1">
            <Deposit
              tokenAddress={balance.address}
              tokenSymbol={balance.symbol}
            />
          </div>
          <div className="col-span-2 text-center md:col-span-1">
            <Withdraw
              tokenAddress={balance.address}
              tokenSymbol={balance.symbol}
            />
          </div>
        </div>
      )}
    </Paper>
  );
};

export function Deposit({
  tokenAddress,
  tokenSymbol,
}: {
  tokenAddress: string;
  tokenSymbol: string;
}): JSX.Element {
  const { i18n } = useLingui();
  const { account, chainId } = useActiveWeb3React();

  const { deposit } = useBentoBox();

  const balance = useTokenBalance(tokenAddress);

  const [value, setValue] = useState("");

  const [pendingTx, setPendingTx] = useState(false);

  const [approvalState, approve] = useApproveCallback(
    new TokenAmount(
      new Token(chainId || 1, tokenAddress, balance.decimals, tokenSymbol, ""),
      value.toBigNumber(balance.decimals).toString()
    ),
    chainId && BENTOBOX_ADDRESS[chainId]
  );

  const showApprove =
    chainId &&
    tokenAddress !== WETH[chainId].address &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING);

  return (
    <>
      {account && (
        <div className="pr-4 mb-2 text-sm text-right cursor-pointer text-secondary">
          {i18n._(t`Wallet Balance`)}:{" "}
          {formatNumber(balance.value.toFixed(balance.decimals))}
        </div>
      )}
      <div className="relative flex items-center w-full mb-4">
        <NumericalInput
          className="w-full p-3 rounded bg-dark-700 focus:ring focus:ring-blue"
          value={value}
          onUserInput={(value) => {
            setValue(value);
          }}
        />
        {account && (
          <Button
            variant="outlined"
            color="blue"
            size="small"
            onClick={() => {
              setValue(balance.value.toFixed(balance.decimals));
            }}
            className="absolute right-4 focus:ring focus:ring-blue"
          >
            {i18n._(t`MAX`)}
          </Button>
        )}
      </div>

      {showApprove && (
        <Button
          color="blue"
          disabled={approvalState === ApprovalState.PENDING}
          onClick={approve}
        >
          {approvalState === ApprovalState.PENDING ? (
            <Dots>{i18n._(t`Approving`)} </Dots>
          ) : (
            i18n._(t`Approve`)
          )}
        </Button>
      )}
      {!showApprove && (
        <Button
          color="blue"
          disabled={
            pendingTx || !balance || value.toBigNumber(balance.decimals).lte(0)
          }
          onClick={async () => {
            setPendingTx(true);
            await deposit(tokenAddress, value.toBigNumber(balance.decimals));
            setPendingTx(false);
          }}
        >
          {i18n._(t`Deposit`)}
        </Button>
      )}
    </>
  );
}

function Withdraw({
  tokenAddress,
  tokenSymbol,
}: {
  tokenAddress: string;
  tokenSymbol: string;
}): JSX.Element {
  const { i18n } = useLingui();
  const { account } = useActiveWeb3React();

  const { withdraw } = useBentoBox();

  const balance = useBentoBalance(tokenAddress);

  const [pendingTx, setPendingTx] = useState(false);

  const [value, setValue] = useState("");

  return (
    <>
      {account && (
        <div className="pr-4 mb-2 text-sm text-right cursor-pointer text-secondary">
          {i18n._(
            t`Bento Balance: ${formatNumber(
              balance ? balance.value.toFixed(balance.decimals) : 0
            )}`
          )}
        </div>
      )}
      <div className="relative flex items-center w-full mb-4">
        <NumericalInput
          className="w-full p-3 rounded bg-dark-700 focus:ring focus:ring-pink"
          value={value}
          onUserInput={(value) => {
            setValue(value);
          }}
        />
        {account && (
          <Button
            variant="outlined"
            color="pink"
            size="small"
            onClick={() => {
              setValue(balance.value.toFixed(balance.decimals));
            }}
            className="absolute right-4 focus:ring focus:ring-pink"
          >
            {i18n._(t`MAX`)}
          </Button>
        )}
      </div>
      <Button
        color="pink"
        disabled={
          pendingTx || !balance || value.toBigNumber(balance.decimals).lte(0)
        }
        onClick={async () => {
          setPendingTx(true);
          await withdraw(tokenAddress, value.toBigNumber(balance.decimals));
          setPendingTx(false);
        }}
      >
        {i18n._(t`Withdraw`)}
      </Button>
    </>
  );
}
