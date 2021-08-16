import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { BENTOBOX_ADDRESS, CurrencyAmount, Token, WNATIVE_ADDRESS } from '@sushiswap/sdk'
import { BentoBalance, useBentoBalances } from '../../state/bentobox/hooks'
import React, { useState } from 'react'
import { useFuse, useSortableData, useUSDCPrice } from '../../hooks'

import Back from '../../components/Back'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Container from '../../components/Container'
import Dots from '../../components/Dots'
import Head from 'next/head'
import Image from '../../components/Image'
import Input from '../../components/Input'
import Layout from '../../layouts/Kashi'
import Paper from '../../components/Paper'
import Search from '../../components/Search'
import { Transition } from '@headlessui/react'
import { cloudinaryLoader } from '../../functions/cloudinary'
import { formatNumber } from '../../functions/format'
import { t } from '@lingui/macro'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import useBentoBox from '../../hooks/useBentoBox'
import { useLingui } from '@lingui/react'

function Balances() {
  const { i18n } = useLingui()
  const balances = useBentoBalances()

  // Search Setup
  const options = { keys: ['symbol', 'name'], threshold: 0.1 }
  const { result, search, term } = useFuse({
    data: balances && balances.length > 0 ? balances : [],
    options,
  })

  // Sorting Setup
  const { items, requestSort, sortConfig } = useSortableData(result)

  return (
    <>
      <Head>
        <title>Balances | Sushi</title>
        <meta key="description" name="description" content="" />
      </Head>
      <Card
        className="h-full bg-dark-900"
        header={
          <Card.Header className="flex items-center justify-between bg-dark-800">
            <div className="flex flex-col items-center justify-between w-full md:flex-row">
              <div className="flex items-baseline">
                <div className="mr-4 text-3xl text-high-emphesis">{i18n._(t`BentoBox`)}</div>
              </div>
              <div className="flex justify-end w-2/3 py-4 md:py-0">
                <Search search={search} term={term} />
              </div>
            </div>
          </Card.Header>
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
            items.map((tokenBalance, i: number) => (
              <TokenBalance key={tokenBalance.token.address + '_' + i} tokenBalance={tokenBalance} />
            ))}
        </div>
      </Card>
    </>
  )
}

const BalancesLayout = ({ children }) => {
  const { i18n } = useLingui()
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
      {children}
    </Layout>
  )
}

Balances.Layout = BalancesLayout

export default Balances

const TokenBalance = ({ tokenBalance }: { tokenBalance: BentoBalance }) => {
  const [expand, setExpand] = useState<boolean>(false)
  const { token, wallet, bento } = tokenBalance
  const tokenPriceUSDC = useUSDCPrice(token)
  const walletBalanceUSDC =
    Number(wallet?.toFixed(token?.tokenInfo ? token.tokenInfo.decimals : token?.decimals)) *
    Number(tokenPriceUSDC?.toFixed(18))
  const bentoBalanceUSDC =
    Number(bento?.toFixed(token?.tokenInfo ? token.tokenInfo.decimals : token?.decimals)) *
    Number(tokenPriceUSDC?.toFixed(18))

  return (
    <Paper className="space-y-4">
      <div
        className="grid grid-cols-3 px-4 py-4 text-sm rounded cursor-pointer select-none bg-dark-800"
        onClick={() => setExpand(!expand)}
      >
        <div className="flex items-center space-x-3">
          <Image
            loader={cloudinaryLoader}
            height={56}
            width={56}
            src={token?.tokenInfo ? token.tokenInfo.logoURI : '/images/tokens/unknown.png'}
            className="w-10 mr-4 rounded-lg sm:w-14"
            alt={token?.tokenInfo ? token.tokenInfo.symbol : token?.symbol}
          />
          <div>{token && token?.tokenInfo ? token.tokenInfo.symbol : token?.symbol}</div>
        </div>
        <div className="flex items-center justify-end">
          <div>
            <div className="text-right">
              {formatNumber(wallet.toFixed(token?.tokenInfo ? token.tokenInfo.decimals : token?.decimals))}
            </div>
            <div className="text-right text-secondary">{formatNumber(walletBalanceUSDC, true)}</div>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <div>
            <div className="text-right">
              {formatNumber(bento.toFixed(token?.tokenInfo ? token.tokenInfo.decimals : token?.decimals))}
            </div>
            <div className="text-right text-secondary">{formatNumber(bentoBalanceUSDC, true)}</div>
          </div>
        </div>
      </div>
      <Transition
        show={expand}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="grid grid-cols-2 gap-4 ">
          <div className="col-span-2 p-4 text-center rounded md:col-span-1 bg-dark-800">
            <Deposit tokenBalance={tokenBalance} />
          </div>
          <div className="col-span-2 p-4 text-center rounded md:col-span-1 bg-dark-800">
            <Withdraw tokenBalance={tokenBalance} />
          </div>
        </div>
      </Transition>
    </Paper>
  )
}

export function Deposit({ tokenBalance }: { tokenBalance: BentoBalance }): JSX.Element {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()

  const { token, wallet } = tokenBalance

  const { deposit } = useBentoBox()

  const [value, setValue] = useState('')

  const [pendingTx, setPendingTx] = useState(false)

  const [approvalState, approve] = useApproveCallback(
    CurrencyAmount.fromRawAmount(
      new Token(
        chainId,
        token.address,
        token?.tokenInfo ? token.tokenInfo.decimals : token?.decimals,
        token?.tokenInfo ? token.tokenInfo.symbol : token?.symbol,
        token?.tokenInfo ? token.tokenInfo.name : token?.name
      ),
      value.toBigNumber(token?.tokenInfo ? token.tokenInfo.decimals : token?.decimals).toString()
    ),
    chainId && BENTOBOX_ADDRESS[chainId]
  )

  const showApprove =
    chainId &&
    token.address !== WNATIVE_ADDRESS[chainId] &&
    (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING)

  return (
    <>
      {account && (
        <div className="pr-4 mb-2 text-sm text-right cursor-pointer text-secondary">
          {i18n._(t`Wallet Balance`)}:{' '}
          {formatNumber(wallet.toFixed(token?.tokenInfo ? token.tokenInfo.decimals : token?.decimals))}
        </div>
      )}
      <div className="relative flex items-center w-full mb-4">
        <Input.Numeric
          className="w-full p-3 rounded bg-dark-700 focus:ring focus:ring-blue"
          value={value}
          onUserInput={(value) => {
            setValue(value)
          }}
        />
        {account && (
          <Button
            variant="outlined"
            color="blue"
            size="xs"
            onClick={() => {
              setValue(wallet.toFixed(token?.tokenInfo ? token.tokenInfo.decimals : token?.decimals))
            }}
            className="absolute right-4 focus:ring focus:ring-blue"
          >
            {i18n._(t`MAX`)}
          </Button>
        )}
      </div>

      {showApprove && (
        <Button color="blue" disabled={approvalState === ApprovalState.PENDING} onClick={approve}>
          {approvalState === ApprovalState.PENDING ? <Dots>{i18n._(t`Approving`)} </Dots> : i18n._(t`Approve`)}
        </Button>
      )}
      {!showApprove && (
        <Button
          color="blue"
          disabled={pendingTx || wallet.lessThan(0) || wallet.equalTo(0)}
          onClick={async () => {
            setPendingTx(true)
            await deposit(
              token.address,
              value.toBigNumber(token?.tokenInfo ? token.tokenInfo.decimals : token?.decimals)
            )
            setPendingTx(false)
          }}
        >
          {i18n._(t`Deposit`)}
        </Button>
      )}
    </>
  )
}

function Withdraw({ tokenBalance }: { tokenBalance: BentoBalance }): JSX.Element {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()

  const { token, bento } = tokenBalance

  const { withdraw } = useBentoBox()

  const [pendingTx, setPendingTx] = useState(false)

  const [value, setValue] = useState('')

  return (
    <>
      {account && (
        <div className="pr-4 mb-2 text-sm text-right cursor-pointer text-secondary">
          {i18n._(
            t`Bento Balance: ${formatNumber(
              bento.toFixed(token?.tokenInfo ? token.tokenInfo.decimals : token?.decimals)
            )}`
          )}
        </div>
      )}
      <div className="relative flex items-center w-full mb-4">
        <Input.Numeric
          className="w-full p-3 rounded bg-dark-700 focus:ring focus:ring-pink"
          value={value}
          onUserInput={(value) => {
            setValue(value)
          }}
        />
        {account && (
          <Button
            variant="outlined"
            color="pink"
            size="xs"
            onClick={() => {
              setValue(bento.toFixed(token?.tokenInfo ? token.tokenInfo.decimals : token?.decimals))
            }}
            className="absolute right-4 focus:ring focus:ring-pink"
          >
            {i18n._(t`MAX`)}
          </Button>
        )}
      </div>
      <Button
        color="pink"
        disabled={pendingTx || bento.lessThan(0) || bento.equalTo(0)}
        onClick={async () => {
          setPendingTx(true)
          await withdraw(
            token.address,
            value.toBigNumber(token?.tokenInfo ? token.tokenInfo.decimals : token?.decimals)
          )
          setPendingTx(false)
        }}
      >
        {i18n._(t`Withdraw`)}
      </Button>
    </>
  )
}
