import React, { useCallback, useContext } from "react";
import {
  fortmatic,
  injected,
  portis,
  torus,
  walletconnect,
  walletlink,
} from "../../connectors";
import styled, { ThemeContext } from "styled-components";

import { AppDispatch } from "../../state";
import Button from "../Button";
import Copy from "./Copy";
import ExternalLink from "../ExternalLink";
import Identicon from "../Identicon";
import Image from "next/image";
import { ExternalLink as LinkIcon } from "react-feather";
import LinkStyledButton from "../LinkStyledButton";
import ModalHeader from "../ModalHeader";
import { SUPPORTED_WALLETS } from "../../constants";
import Transaction from "./Transaction";
import { clearAllTransactions } from "../../state/transactions/actions";
import { getExplorerLink } from "../../functions/explorer";
import { shortenAddress } from "../../functions/format";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useDispatch } from "react-redux";

const AddressLink = styled(ExternalLink)<{ hasENS: boolean; isENS: boolean }>`
  font-size: 0.825rem;
  // color: ${({ theme }) => theme.text3};
  margin-left: 1rem;
  font-size: 0.825rem;
  display: flex;
  :hover {
    // color: ${({ theme }) => theme.text2};
  }
`;

const WalletName = styled.div`
  width: initial;
  font-size: 0.825rem;
  font-weight: 500;
  // color: ${({ theme }) => theme.text3};
`;

const IconWrapper = styled.div<{ size?: number }>`
  // ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + "px" : "32px")};
    width: ${({ size }) => (size ? size + "px" : "32px")};
  }
  // ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`;

const TransactionListWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
`;

function renderTransactions(transactions: string[]) {
  return (
    <TransactionListWrapper>
      {transactions.map((hash, i) => {
        return <Transaction key={i} hash={hash} />;
      })}
    </TransactionListWrapper>
  );
}

interface AccountDetailsProps {
  toggleWalletModal: () => void;
  pendingTransactions: string[];
  confirmedTransactions: string[];
  ENSName?: string;
  openOptions: () => void;
}

export default function AccountDetails({
  toggleWalletModal,
  pendingTransactions,
  confirmedTransactions,
  ENSName,
  openOptions,
}: AccountDetailsProps): any {
  const { chainId, account, connector } = useActiveWeb3React();
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch<AppDispatch>();

  function formatConnectorName() {
    const { ethereum } = window;
    const isMetaMask = !!(ethereum && ethereum.isMetaMask);
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        (k) =>
          SUPPORTED_WALLETS[k].connector === connector &&
          (connector !== injected || isMetaMask === (k === "METAMASK"))
      )
      .map((k) => SUPPORTED_WALLETS[k].name)[0];
    return <WalletName>Connected with {name}</WalletName>;
  }

  function getStatusIcon() {
    if (connector === injected) {
      return (
        <IconWrapper size={16}>
          <Identicon />
        </IconWrapper>
      );
    } else if (connector === walletconnect) {
      return (
        <IconWrapper size={16}>
          <Image
            src="/wallet-connect.png"
            alt={"Wallet Connect"}
            width="16px"
            height="16px"
          />
        </IconWrapper>
      );
    } else if (connector === walletlink) {
      return (
        <IconWrapper size={16}>
          <Image
            src="/coinbase.svg"
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
            src="/fortmatic.png"
            alt={"Fortmatic"}
            width="16px"
            height="16px"
          />
        </IconWrapper>
      );
    } else if (connector === portis) {
      return (
        <>
          <IconWrapper size={16}>
            <Image
              src="/portis.png"
              alt={"Portis"}
              width="16px"
              height="16px"
            />
            <Button
              onClick={() => {
                portis.portis.showPortis();
              }}
            >
              Show Portis
            </Button>
          </IconWrapper>
        </>
      );
    } else if (connector === torus) {
      return (
        <IconWrapper size={16}>
          <Image
            src="/torus.png"
            alt={"Coinbase Wallet"}
            width="16px"
            height="16px"
          />
        </IconWrapper>
      );
    }
    return null;
  }

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }));
  }, [dispatch, chainId]);

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <ModalHeader title="Account" onClose={toggleWalletModal}></ModalHeader>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            {formatConnectorName()}
            <div className="space-x-3">
              {connector !== injected && connector !== walletlink && (
                <Button
                  variant="filled"
                  color="pink"
                  size="small"
                  onClick={() => {
                    (connector as any).close();
                  }}
                >
                  Disconnect
                </Button>
              )}
              <Button
                variant="filled"
                color="blue"
                size="small"
                onClick={() => {
                  openOptions();
                }}
              >
                Change
              </Button>
            </div>
          </div>
          <div
            id="web3-account-identifier-row"
            className="flex items-center space-x-3"
          >
            {ENSName ? (
              <>
                {getStatusIcon()}
                <p className="text-primary"> {ENSName}</p>
              </>
            ) : (
              <>
                {getStatusIcon()}
                <p> {account && shortenAddress(account)}</p>
              </>
            )}
          </div>
          <div>
            {ENSName ? (
              <>
                <div className="flex items-center space-x-3">
                  {account && (
                    <Copy toCopy={account}>
                      <span style={{ marginLeft: "4px" }}>Copy Address</span>
                    </Copy>
                  )}
                  {chainId && account && (
                    <AddressLink
                      hasENS={!!ENSName}
                      isENS={true}
                      href={
                        chainId && getExplorerLink(chainId, ENSName, "address")
                      }
                    >
                      <LinkIcon size={16} />
                      <span style={{ marginLeft: "4px" }}>
                        View on explorer
                      </span>
                    </AddressLink>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3">
                  {account && (
                    <Copy toCopy={account}>
                      <span className="ml-1">Copy Address</span>
                    </Copy>
                  )}
                  {chainId && account && (
                    <AddressLink
                      hasENS={!!ENSName}
                      isENS={false}
                      href={getExplorerLink(chainId, account, "address")}
                    >
                      <LinkIcon size={16} />
                      <span className="ml-1">View on explorer</span>
                    </AddressLink>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {!!pendingTransactions.length || !!confirmedTransactions.length ? (
        <div>
          <div className="grid grid-flow-row">
            <div>Recent Transactions</div>
            <Button onClick={clearAllTransactionsCallback}>(clear all)</Button>
          </div>
          {renderTransactions(pendingTransactions)}
          {renderTransactions(confirmedTransactions)}
        </div>
      ) : (
        <div>Your transactions will appear here...</div>
      )}
    </div>
  );
}
