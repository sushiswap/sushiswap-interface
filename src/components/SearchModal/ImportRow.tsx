import { AutoRow, RowFixed } from "../Row";
import React, { CSSProperties } from "react";
import { useIsTokenActive, useIsUserAddedToken } from "../../hooks/Tokens";

import { AutoColumn } from "../Column";
import { ButtonPrimary } from "../ButtonLegacy";
import { CheckCircle } from "react-feather";
import CurrencyLogo from "../CurrencyLogo";
import ListLogo from "../ListLogo";
import { Token } from "@sushiswap/sdk";
import styled from "styled-components";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useCombinedInactiveList } from "../../state/lists/hooks";
import useTheme from "../../hooks/useTheme";

const TokenSection = styled.div<{ dim?: boolean }>`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto;
  grid-gap: 16px;
  align-items: center;

  opacity: ${({ dim }) => (dim ? "0.4" : "1")};
`;

const CheckIcon = styled(CheckCircle)`
  height: 16px;
  width: 16px;
  margin-right: 6px;
  // stroke: ${({ theme }) => theme.green1};
`;

const NameOverflow = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  font-size: 12px;
`;

export default function ImportRow({
  token,
  style,
  dim,
  showImportView,
  setImportToken,
}: {
  token: Token;
  style?: CSSProperties;
  dim?: boolean;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
}) {
  // gloabls
  const { chainId } = useActiveWeb3React();
  const theme = useTheme();

  // check if token comes from list
  const inactiveTokenList = useCombinedInactiveList();
  const list = chainId && inactiveTokenList?.[chainId]?.[token.address]?.list;

  // check if already active on list or local storage tokens
  const isAdded = useIsUserAddedToken(token);
  const isActive = useIsTokenActive(token);

  return (
    <TokenSection style={style}>
      <CurrencyLogo
        currency={token}
        size={"24px"}
        style={{ opacity: dim ? "0.6" : "1" }}
      />
      <AutoColumn gap="4px" style={{ opacity: dim ? "0.6" : "1" }}>
        <AutoRow>
          <div className="font-semibold">{token.symbol}</div>
          <div className="ml-2 font-light">
            <NameOverflow title={token.name}>{token.name}</NameOverflow>
          </div>
        </AutoRow>
        {list && list.logoURI && (
          <RowFixed>
            <div className="mr-1">via {list.name}</div>
            <ListLogo logoURI={list.logoURI} size="12px" />
          </RowFixed>
        )}
      </AutoColumn>
      {!isActive && !isAdded ? (
        <ButtonPrimary
          width="fit-content"
          padding="6px 12px"
          fontWeight={500}
          fontSize="14px"
          onClick={() => {
            setImportToken && setImportToken(token);
            showImportView();
          }}
        >
          Import
        </ButtonPrimary>
      ) : (
        <RowFixed style={{ minWidth: "fit-content" }}>
          <CheckIcon />
          <div className="text-green">Active</div>
        </RowFixed>
      )}
    </TokenSection>
  );
}
