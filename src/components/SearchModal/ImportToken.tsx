import { AlertTriangle, ArrowLeft } from "react-feather";
import { AutoRow, RowBetween, RowFixed } from "../../components/Row";
import { Checkbox, PaddedColumn } from "./styleds";
import { Currency, Token } from "@sushiswap/sdk";
import React, { useState } from "react";

import { AutoColumn } from "../Column";
import { ButtonPrimary } from "../ButtonLegacy";
import Card from "../Card";
import CloseIcon from "../CloseIcon";
import CurrencyLogo from "../CurrencyLogo";
import ExternalLink from "../ExternalLink";
import ListLogo from "../ListLogo";
import ModalHeader from "../ModalHeader";
import { classNames } from "../../functions";
import { getExplorerLink } from "../../functions/explorer";
import styled from "styled-components";
import { transparentize } from "polished";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useAddUserToken } from "../../state/user/hooks";
import { useCombinedInactiveList } from "../../state/lists/hooks";
import useTheme from "../../hooks/useTheme";

const Wrapper = styled.div`
  // position: relative;
  // width: 100%;
  // overflow: auto;
  overflow: hidden;
`;

const WarningWrapper = styled(Card)<{ highWarning: boolean }>`
  // background-color: ${({ theme, highWarning }) =>
    highWarning
      ? transparentize(0.8, theme.red1)
      : transparentize(0.8, theme.yellow2)};
  // width: fit-content;
`;

const AddressText = styled.div`
  font-size: 12px;
  color: blue;
  // ${({ theme }) => theme.mediaWidth.upToSmall`
    // font-size: 10px;
`}
`;

interface ImportProps {
  tokens: Token[];
  onBack?: () => void;
  onDismiss?: () => void;
  handleCurrencySelect?: (currency: Currency) => void;
}

export function ImportToken({
  tokens,
  onBack,
  onDismiss,
  handleCurrencySelect,
}: ImportProps) {
  const theme = useTheme();

  const { chainId } = useActiveWeb3React();

  const [confirmed, setConfirmed] = useState(false);

  const addToken = useAddUserToken();

  // use for showing import source on inactive tokens
  const inactiveTokenList = useCombinedInactiveList();

  // higher warning severity if either is not on a list
  const fromLists =
    (chainId && inactiveTokenList?.[chainId]?.[tokens[0]?.address]?.list) ||
    (chainId && inactiveTokenList?.[chainId]?.[tokens[1]?.address]?.list);

  return (
    <Wrapper>
      <ModalHeader
        onBack={onBack}
        onClose={onDismiss}
        title={`Import ${tokens.length > 1 ? "Tokens" : "Token"}`}
      />
      {tokens.map((token) => {
        const list =
          chainId && inactiveTokenList?.[chainId]?.[token.address]?.list;
        return (
          <Card
            key={"import" + token.address}
            className=".token-warning-container"
          >
            <AutoColumn gap="10px">
              <AutoRow align="center">
                <CurrencyLogo currency={token} size={"24px"} />
                <div className="mx-2 font-medium">{token.symbol}</div>
                <div className="font-light">{token.name}</div>
              </AutoRow>
              {chainId && (
                <ExternalLink
                  href={getExplorerLink(chainId, token.address, "address")}
                >
                  <AddressText>{token.address}</AddressText>
                </ExternalLink>
              )}
              {list !== undefined ? (
                <RowFixed>
                  {list.logoURI && (
                    <ListLogo logoURI={list.logoURI} size="12px" />
                  )}
                  <div className="ml-1">via {list.name}</div>
                </RowFixed>
              ) : (
                <WarningWrapper
                  borderRadius="4px"
                  padding="4px"
                  highWarning={true}
                >
                  <RowFixed>
                    <AlertTriangle
                      className="stroke-current text-red"
                      size="10px"
                    />
                    <div className="ml-1 text-xs font-semibold text-red">
                      Unknown Source
                    </div>
                  </RowFixed>
                </WarningWrapper>
              )}
            </AutoColumn>
          </Card>
        );
      })}

      <Card
        className={classNames(
          fromLists ? "bg-yellow" : "bg-red",
          "bg-opacity-80"
        )}
      >
        <AutoColumn
          justify="center"
          style={{ textAlign: "center", gap: "16px", marginBottom: "12px" }}
        >
          <AlertTriangle
            className={classNames(
              fromLists ? "text-yellow" : "text-red",
              "stroke-current"
            )}
            size={32}
          />
          <div
            className={classNames(
              fromLists ? "text-yellow" : "text-red",
              "font-semibold text-xl"
            )}
          >
            Trade at your own risk!
          </div>
        </AutoColumn>

        <AutoColumn
          style={{ textAlign: "center", gap: "16px", marginBottom: "12px" }}
        >
          <div className={fromLists ? "text-yellow" : "text-red"}>
            Anyone can create a token, including creating fake versions of
            existing tokens that claim to represent projects.
          </div>
          <div
            className={classNames(
              fromLists ? "text-yellow" : "text-red",
              "font-medium"
            )}
          >
            If you purchase this token, you may not be able to sell it back.
          </div>
        </AutoColumn>
        <AutoRow
          justify="center"
          style={{ cursor: "pointer" }}
          onClick={() => setConfirmed(!confirmed)}
        >
          <Checkbox
            className=".understand-checkbox"
            name="confirmed"
            type="checkbox"
            checked={confirmed}
            onChange={() => setConfirmed(!confirmed)}
          />
          <div
            className={classNames(
              fromLists ? "text-yellow" : "text-red",
              "font-medium ml-2.5"
            )}
          >
            I understand
          </div>
        </AutoRow>
      </Card>
      <ButtonPrimary
        disabled={!confirmed}
        altDisabledStyle={true}
        borderRadius="20px"
        padding="10px 1rem"
        onClick={() => {
          tokens.map((token) => addToken(token));
          handleCurrencySelect && handleCurrencySelect(tokens[0]);
        }}
        className=".token-dismiss-button"
      >
        Import
      </ButtonPrimary>
    </Wrapper>
  );
}
