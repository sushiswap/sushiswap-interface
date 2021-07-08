import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { BentoBalance, useBentoBalances } from '../../state/bentobox/hooks'
import { CurrencyAmount, Token, WNATIVE } from '@sushiswap/sdk'
import React, { useState } from 'react'
import { useFuse, useSortableData } from '../../hooks'

import { BENTOBOX_ADDRESS } from '../../constants/kashi'
import Back from '../../components/Back'
import Button from '../../components/Button'
import Card from '../../components/Card'
import CardHeader from '../../components/CardHeader'
import Dots from '../../components/Dots'
import Head from 'next/head'
import Image from '../../components/Image'
import Layout from '../../layouts/Kashi'
import { Input as NumericalInput } from '../../components/NumericalInput'
import Paper from '../../components/Paper'
import Search from '../../components/Search'
import { Transition } from '@headlessui/react'
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo'
import { cloudinaryLoader } from '../../functions/cloudinary'
import { formatNumber } from '../../functions/format'
import { t } from '@lingui/macro'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import useBentoBox from '../../hooks/useBentoBox'
import { useLingui } from '@lingui/react'
import useTokenBalance from '../../hooks/useTokenBalance'

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
          <CardHeader className="flex items-center justify-between bg-dark-800">
            <div className="flex flex-col items-center justify-between w-full md:flex-row">
              <div className="flex items-baseline">
                <div className="mr-4 text-3xl text-high-emphesis">{i18n._(t`BentoBox`)}</div>
              </div>
              <div className="flex justify-end w-2/3 py-4 md:py-0">
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
            items.map((token, i: number) => <TokenBalance key={token.address + '_' + i} token={token} />)}
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

const TokenBalance = ({ token }: { token: BentoBalance & WrappedTokenInfo }) => {
  const [expand, setExpand] = useState<boolean>(false)
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
            src={token.tokenInfo.logoURI}
            className="w-10 mr-4 rounded-lg sm:w-14"
            alt={token.tokenInfo.symbol}
          />
          <div>{token && token.symbol}</div>
        </div>
        <div className="flex items-center justify-end">
          <div>
            <div className="text-right">{formatNumber(token.wallet.string)} </div>
            <div className="text-right text-secondary">{formatNumber(token.wallet.usd, true)}</div>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <div>
            <div className="text-right">{formatNumber(token.bento.string)} </div>
            <div className="text-right text-secondary">{formatNumber(token.bento.usd, true)}</div>
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
            <Deposit token={token} />
          </div>
          <div className="col-span-2 p-4 text-center rounded md:col-span-1 bg-dark-800">
            <Withdraw token={token} />
          </div>
        </div>
      </Transition>
    </Paper>
  )
}

export function Deposit({ token }: { token: BentoBalance & WrappedTokenInfo }): JSX.Element {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()

  const { deposit } = useBentoBox()

  const [value, setValue] = useState('')

  const [pendingTx, setPendingTx] = useState(false)

  const [approvalState, approve] = useApproveCallback(
    CurrencyAmount.fromRawAmount(
      new Token(chainId || 1, token.address, token.decimals, token.symbol, token.name),
      value.toBigNumber(token.decimals).toString()
    ),
    chainId && BENTOBOX_ADDRESS[chainId]
  )

  const showApprove =
    chainId &&
    token.address !== WNATIVE[chainId].address &&
    (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING)

  return (
    <>
      {account && (
        <div className="pr-4 mb-2 text-sm text-right cursor-pointer text-secondary">
          {i18n._(t`Wallet Balance`)}: {formatNumber(token.balance.toFixed(token.decimals))}
        </div>
      )}
      <div className="relative flex items-center w-full mb-4">
        <NumericalInput
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
              setValue(token.balance.toFixed(token.decimals))
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
          disabled={pendingTx || !token || token.balance.lte(0)}
          onClick={async () => {
            setPendingTx(true)
            await deposit(token.address, token.balance)
            setPendingTx(false)
          }}
        >
          {i18n._(t`Deposit`)}
        </Button>
      )}
    </>
  )
}

function Withdraw({ token }: { token: BentoBalance & WrappedTokenInfo }): JSX.Element {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()

  const { withdraw } = useBentoBox()

  const [pendingTx, setPendingTx] = useState(false)

  const [value, setValue] = useState('')

  return (
    <>
      {account && (
        <div className="pr-4 mb-2 text-sm text-right cursor-pointer text-secondary">
          {i18n._(
            t`Bento Balance: ${formatNumber(token.bentoBalance ? token.bentoBalance.toFixed(token.decimals) : 0)}`
          )}
        </div>
      )}
      <div className="relative flex items-center w-full mb-4">
        <NumericalInput
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
              setValue(token.bentoBalance.toFixed(token.decimals))
            }}
            className="absolute right-4 focus:ring focus:ring-pink"
          >
            {i18n._(t`MAX`)}
          </Button>
        )}
      </div>
      <Button
        color="pink"
        disabled={pendingTx || !token || token.bentoBalance.lte(0)}
        onClick={async () => {
          setPendingTx(true)
          await withdraw(token.address, token.bentoBalance)
          setPendingTx(false)
        }}
      >
        {i18n._(t`Withdraw`)}
      </Button>
    </>
  )
}
