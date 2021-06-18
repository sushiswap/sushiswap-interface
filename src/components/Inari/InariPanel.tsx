import React, { useState } from 'react';
import { useLingui } from '@lingui/react';
import { t } from '@lingui/macro';
import { CurrencyAmount, TokenAmount } from '@sushiswap/sdk';
import styled from 'styled-components';

import { Input as NumericalInput } from '../NumericalInput';
import Button from '../Button';
import Dots from '../Dots';
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import { tryParseAmount } from "../../functions/parse";;
import { useWalletModalToggle } from '../../state/application/hooks';

const INPUT_CHAR_LIMIT = 10;

const sendTx = async (txFunc: () => Promise<any>): Promise<boolean> => {
  let success = true;
  try {
    const ret = await txFunc();
    if (ret?.error) {
      success = false;
    }
  } catch (e) {
    console.error(e);
    success = false;
  }
  return success;
}

const StyledNumericalInput = styled(NumericalInput)`
    caret-color: #e3e3e3;
`;

const tabStyle =
  'flex justify-center items-center h-full w-full rounded-lg cursor-pointer text-caption2 md:text-caption';
const activeTabStyle = `${tabStyle} text-high-emphesis font-bold bg-dark-900`;
const inactiveTabStyle = `${tabStyle} text-secondary`;

const buttonStyle =
  'flex justify-center items-center w-full h-14 rounded font-bold md:font-medium md:text-lg mt-5 text-sm focus:outline-none focus:ring';
const buttonStyleEnabled = `${buttonStyle} text-high-emphesis bg-gradient-to-r from-pink-red to-light-brown hover:opacity-90`;
const buttonStyleInsufficientFunds = `${buttonStyleEnabled} opacity-60`;
const buttonStyleDisabled = `${buttonStyle} text-secondary bg-dark-700`;
const buttonStyleConnectWallet = `${buttonStyle} text-high-emphesis bg-cyan-blue hover:bg-opacity-90`;

interface InariPanelProps {
  APPROVAL_ADDRESS: string,
  stakeApprove: () => Promise<any>,
  stakeAllowance: string | boolean,
  stake: (amount: CurrencyAmount | undefined) => Promise<any>,
  stakeTitle: string,
  srcTokenBalance: TokenAmount,
  unstakeApprove: () => Promise<any>,
  unstakeAllowance: string | boolean,
  unstake: (amount: CurrencyAmount | undefined) => Promise<any>,
  unstakeTitle: string,
  dstTokenBalance: TokenAmount,
  dstTokenSymbol: string,
};

export default function InariPanel({
  APPROVAL_ADDRESS,
  stakeApprove,
  stakeAllowance,
  stake,
  stakeTitle,
  srcTokenBalance,
  unstakeApprove,
  unstakeAllowance,
  unstake,
  unstakeTitle,
  dstTokenBalance,
  dstTokenSymbol,
}: InariPanelProps) {
  const { i18n } = useLingui();
  const { account } = useActiveWeb3React();

  const walletConnected = !!account;
  const toggleWalletModal = useWalletModalToggle();

  const [activeTab, setActiveTab] = useState(0);

  const [input, setInput] = useState<string>('');
  const [usingBalance, setUsingBalance] = useState(false);

  const balance = activeTab === 0 ? srcTokenBalance : dstTokenBalance;

  const formattedBalance = balance?.toSignificant(40).substring(0, 8);

  const parsedAmount = usingBalance
    ? balance
    : tryParseAmount(input, balance?.token);

  const handleInput = (v: string) => {
    if (v.length <= INPUT_CHAR_LIMIT) {
      setUsingBalance(false);
      setInput(v);
    }
  }
  const handleClickMax = () => {
    setInput(parsedAmount ? parsedAmount.toSignificant(balance.token.decimals).substring(0, INPUT_CHAR_LIMIT) : '');
    setUsingBalance(true);
  }

  const insufficientFunds = parsedAmount && balance?.lessThan(parsedAmount);

  const inputError = insufficientFunds;

  const [pendingTx, setPendingTx] = useState(false);

  const buttonDisabled = !input || pendingTx || Number(input) === 0;

  const handleClickButton = async () => {
    if (buttonDisabled) return;

    if (!walletConnected) {
      toggleWalletModal();
    } else {
      setPendingTx(true);

      if (activeTab === 0) {
        if (!stakeAllowance || Number(stakeAllowance) === 0) {
          const success = await sendTx(() => stakeApprove());
          if (!success) {
            setPendingTx(false);
            return;
          }
        }

        const success = await sendTx(() => stake(parsedAmount));
        if (!success) {
          setPendingTx(false);
          return;
        }
      } else if (activeTab === 1) {
        if (!unstakeAllowance || Number(unstakeAllowance) === 0) {
          const success = await sendTx(() => unstakeApprove());
          if (!success) {
            setPendingTx(false);
            return;
          }
        }
        const success = await sendTx(() => unstake(parsedAmount));
        if (!success) {
          setPendingTx(false);
          return;
        }
      }

      handleInput('');
      setPendingTx(false);
    }
  }

  const [approvalState, approve] = useApproveCallback(
    parsedAmount,
    APPROVAL_ADDRESS
  );

  return (
    <>
      <div className="w-full max-w-xl px-3 pt-2 pb-6 rounded bg-dark-900 md:pb-9 md:pt-4 md:px-8">
        <div className="flex w-full rounded h-14 bg-dark-800">
          <div
            className="h-full w-6/12 p-0.5"
            onClick={() => {
              setActiveTab(0)
              handleInput('')
            }}
          >
            <div
              className={
                activeTab === 0
                  ? activeTabStyle
                  : inactiveTabStyle
              }
            >
              <p>{i18n._(t`Deposit`)}</p>
            </div>
          </div>
          <div
            className="h-full w-6/12 p-0.5"
            onClick={() => {
              setActiveTab(1)
              handleInput('')
            }}
          >
            <div
              className={
                activeTab === 1
                  ? activeTabStyle
                  : inactiveTabStyle
              }
            >
              <p>{i18n._(t`Withdraw`)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full mt-6">
          <p className="font-bold text-large text-high-emphesis">
            {activeTab === 0
              ? i18n._(t`${stakeTitle}`)
              : i18n._(t`${unstakeTitle}`)}
          </p>
        </div>

        <StyledNumericalInput
          value={input}
          onUserInput={handleInput}
          className={`w-full h-14 px-3 md:px-5 mt-5 rounded bg-dark-800 text-caption2 md:text-lg font-bold text-dark-800${inputError ? ' pl-9 md:pl-12' : ''
            }`}
          placeholder=" "
        />

        {/* input overlay: */}
        <div className="relative w-full h-0 pointer-events-none bottom-14">
          <div
            className={`flex justify-between items-center h-14 rounded px-3 md:px-5 ${inputError
              ? ' border border-red'
              : ''
              }`}
          >
            <div className="flex">
              {inputError && (
                <img
                  className="w-4 mr-2 md:w-5"
                  src="/error-triangle.svg"
                  alt="error"
                />
              )}
              <p
                className={`text-caption2 md:text-lg font-bold ${input
                  ? 'text-high-emphesis'
                  : 'text-secondary'
                  }`}
              >
                {`${input ? input : '0'} ${activeTab === 0 ? 'SUSHI' : dstTokenSymbol}`}
              </p>
            </div>
            <div className="flex items-center text-secondary text-caption2 md:text-caption">
              <div
                className={
                  input
                    ? 'hidden md:flex md:items-center'
                    : 'flex items-center'
                }
              >
                <p>
                  {i18n._(t`Balance`)}:&nbsp;
                </p>
                <p className="font-bold text-caption">
                  {formattedBalance}
                </p>
              </div>
              <button
                className="px-2 py-1 ml-3 text-xs font-bold border pointer-events-auto focus:outline-none focus:ring hover:bg-opacity-40 md:bg-cyan-blue md:bg-opacity-30 border-secondary md:border-cyan-blue rounded-2xl md:py-1 md:px-3 md:ml-4 md:text-caption2 md:font-normal md:text-cyan-blue"
                onClick={handleClickMax}
              >
                {i18n._(t`MAX`)}
              </button>
            </div>
          </div>
        </div>


        {(approvalState ===
          ApprovalState.NOT_APPROVED ||
          approvalState === ApprovalState.PENDING) &&
          activeTab === 0 ? (
          <Button
            className={`${buttonStyle} text-high-emphesis bg-cyan-blue hover:bg-opacity-90`}
            disabled={
              approvalState ===
              ApprovalState.PENDING
            }
            onClick={approve}
          >
            {approvalState ===
              ApprovalState.PENDING ? (
              <Dots>{i18n._(t`Approving`)} </Dots>
            ) : (
              i18n._(t`Approve`)
            )}
          </Button>
        ) : (
          <button
            className={
              buttonDisabled
                ? buttonStyleDisabled
                : !walletConnected
                  ? buttonStyleConnectWallet
                  : insufficientFunds
                    ? buttonStyleInsufficientFunds
                    : buttonStyleEnabled
            }
            onClick={handleClickButton}
            disabled={buttonDisabled || inputError}
          >
            {!walletConnected
              ? i18n._(t`Connect Wallet`)
              : !input
                ? i18n._(t`Enter Amount`)
                : insufficientFunds
                  ? i18n._(t`Insufficient Balance`)
                  : activeTab === 0
                    ? i18n._(t`Deposit`)
                    : i18n._(t`Withdrawal`)}
          </button>
        )}
      </div>
    </>
  );
}