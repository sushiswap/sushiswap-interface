import React, { useMemo } from "react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { darken, lighten } from "polished";
import {
  fortmatic,
  injected,
  lattice,
  portis,
  walletconnect,
  walletlink,
} from "../../connectors";
import {
  isTransactionRecent,
  useAllTransactions,
} from "../../state/transactions/hooks";
import styled, { css } from "styled-components";

import { AbstractConnector } from "@web3-react/abstract-connector";
import { Activity } from "react-feather";
import Button from "../Button";
import Image from "next/image";
import Loader from "../Loader";
import { NetworkContextName } from "../../constants";
import { TransactionDetails } from "../../state/transactions/reducer";
import WalletModal from "../WalletModal";
import { shortenAddress } from "../../functions/format";
import { t } from "@lingui/macro";
import useENSName from "../../hooks/useENSName";
import { useLingui } from "@lingui/react";
import { useWalletModalToggle } from "../../state/application/hooks";

const IconWrapper = styled.div<{ size?: number }>`
  // ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + "px" : "32px")};
    width: ${({ size }) => (size ? size + "px" : "32px")};
  }
`;

const Web3StatusGeneric = styled(Button)`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`;

const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};
  // color: ${({ theme }) => theme.white};
  font-weight: 500;
  :hover,
  :focus {
    // background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
`;

const Web3StatusConnect = styled(Web3StatusGeneric)<{ faded?: boolean }>`
  background-color: ${({ theme }) => theme.primary4};
  border: none;
  // color: ${({ theme }) => theme.primaryText1};
  font-weight: 500;

  :hover,
  :focus {
    // border: 1px solid ${({ theme }) => darken(0.05, theme.primary4)};
    // color: ${({ theme }) => theme.primaryText1};
  }

  ${({ faded }) =>
    faded &&
    css`
      // background-color: ${({ theme }) => theme.primary5};
      // border: 1px solid ${({ theme }) => theme.primary5};
      // color: ${({ theme }) => theme.primaryText1};

      :hover,
      :focus {
        // border: 1px solid ${({ theme }) => darken(0.05, theme.primary4)};
        // color: ${({ theme }) => darken(0.05, theme.primaryText1)};
      }
    `}
`;

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
    // background-color: ${({ pending, theme }) =>
      pending ? theme.primary1 : theme.bg2};
    // border: 1px solid ${({ pending, theme }) =>
      pending ? theme.primary1 : theme.bg3};
    // color: ${({ pending, theme }) => (pending ? theme.white : theme.text1)};
    font-weight: 500;
    :hover,
    :focus {
        // background-color: ${({ pending, theme }) =>
          pending ? darken(0.05, theme.primary1) : lighten(0.05, theme.bg2)};

        // :focus {
            border: 1px solid
                ${({ pending, theme }) =>
                  pending
                    ? darken(0.1, theme.primary1)
                    : darken(0.1, theme.bg3)};
        }
    }
`;

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`;

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime;
}

const SOCK = (
  <span
    role="img"
    aria-label="has socks emoji"
    style={{ marginTop: -4, marginBottom: -4 }}
  >
    🧦
  </span>
);

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: AbstractConnector }) {
  if (connector === injected) {
    return <Image src="/chef.svg" width={20} height={20} />;
    // return <Identicon />
  } else if (connector === walletconnect) {
    return (
      <IconWrapper size={16}>
        <Image
          src="/images/wallets/wallet-connect.png"
          alt={"Wallet Connect"}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  } else if (connector === lattice) {
    return (
      <IconWrapper size={16}>
        <Image
          src="/images/wallets/lattice.png"
          alt={"Lattice"}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  } else if (connector === walletlink) {
    return (
      <IconWrapper size={16}>
        <Image
          src="/images/wallets/coinbase.svg"
          alt={"Coinbase Wallet"}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  } else if (connector === fortmatic) {
    return (
      <IconWrapper size={16}>
        <Image
          src="/images/wallets/fortmatic.png"
          alt={"Fortmatic"}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  } else if (connector === portis) {
    return (
      <IconWrapper size={16}>
        <Image
          src="/images/wallets/portis.png"
          alt={"Portis"}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  }
  return null;
}

function Web3StatusInner() {
  const { i18n } = useLingui();
  const { account, connector, error, deactivate } = useWeb3React();

  const { ENSName } = useENSName(account ?? undefined);

  const allTransactions = useAllTransactions();

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx) => {
      if (tx.receipt) {
        return false;
      } else if (tx.archer && tx.archer.deadline * 1000 - Date.now() < 0) {
        return false;
      } else {
        return true;
      }
    })
    .map((tx) => tx.hash);

  const hasPendingTransactions = !!pending.length;

  const toggleWalletModal = useWalletModalToggle();

  if (account) {
    return (
      <div
        id="web3-status-connected"
        className="flex items-center px-3 py-2 text-sm rounded-lg bg-dark-1000 text-secondary"
        onClick={toggleWalletModal}
      >
        {hasPendingTransactions ? (
          <div className="flex items-center justify-between">
            <div className="pr-2">
              {pending?.length} {i18n._(t`Pending`)}
            </div>{" "}
            <Loader stroke="white" />
          </div>
        ) : (
          <div className="mr-2">{ENSName || shortenAddress(account)}</div>
        )}
        {!hasPendingTransactions && connector && (
          <StatusIcon connector={connector} />
        )}
      </div>
    );
  } else if (error) {
    return (
      <Web3StatusError onClick={toggleWalletModal}>
        <NetworkIcon />
        {error instanceof UnsupportedChainIdError
          ? i18n._(t`You are on the wrong network`)
          : i18n._(t`Error`)}
      </Web3StatusError>
    );
  } else {
    return (
      <Web3StatusConnect
        id="connect-wallet"
        onClick={toggleWalletModal}
        faded={!account}
      >
        {i18n._(t`Connect to a wallet`)}
      </Web3StatusConnect>
    );
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React();
  const contextNetwork = useWeb3React(NetworkContextName);

  const { ENSName } = useENSName(account ?? undefined);

  const allTransactions = useAllTransactions();

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash);
  const confirmed = sortedRecentTransactions
    .filter((tx) => tx.receipt)
    .map((tx) => tx.hash);

  if (!contextNetwork.active && !active) {
    return null;
  }

  return (
    <>
      <Web3StatusInner />
      <WalletModal
        ENSName={ENSName ?? undefined}
        pendingTransactions={pending}
        confirmedTransactions={confirmed}
      />
    </>
  );
}
