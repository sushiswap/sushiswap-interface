import {
  ChainId,
  Currency,
  CurrencyAmount,
  Token,
  currencyEquals,
} from "@sushiswap/sdk";
import React, {
  CSSProperties,
  MutableRefObject,
  useCallback,
  useMemo,
} from "react";
import { RowBetween, RowFixed } from "../Row";
import {
  WrappedTokenInfo,
  useCombinedActiveList,
} from "../../state/lists/hooks";
import { useAllInactiveTokens, useIsUserAddedToken } from "../../hooks/Tokens";

import Column from "../Column";
import CurrencyLogo from "../CurrencyLogo";
import { FixedSizeList } from "react-window";
import ImportRow from "./ImportRow";
import { LightGreyCard } from "../CardLegacy";
import Loader from "../Loader";
import { MenuItem } from "./styleds";
import { MouseoverTooltip } from "../Tooltip";
import QuestionHelper from "../QuestionHelper";
import { Text } from "rebass";
import { isTokenOnList } from "../../functions/validate";
import styled from "styled-components";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useCurrencyBalance } from "../../state/wallet/hooks";
import { wrappedCurrency } from "../../functions/currency/wrappedCurrency";

function currencyKey(currency: Currency, chainId = ChainId.MAINNET): string {
  return currency instanceof Token
    ? currency.address
    : currency === Currency.getNativeCurrency(chainId)
    ? Currency.getNativeCurrencySymbol(chainId)
    : "";
}

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`;

const Tag = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  // color: ${({ theme }) => theme.text2};
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`;

const FixedContentRow = styled.div`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-gap: 16px;
  align-items: center;
`;

function Balance({ balance }: { balance: CurrencyAmount }) {
  return (
    <StyledBalanceText title={balance.toExact()}>
      {balance.toSignificant(4)}
    </StyledBalanceText>
  );
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const TokenListLogoWrapper = styled.img`
  height: 20px;
`;

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />;
  }

  const tags = currency.tags;
  if (!tags || tags.length === 0) return <span />;

  const tag = tags[0];

  return (
    <TagContainer>
      <MouseoverTooltip text={tag.description}>
        <Tag key={tag.id}>{tag.name}</Tag>
      </MouseoverTooltip>
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join("; \n")}
        >
          <Tag>...</Tag>
        </MouseoverTooltip>
      ) : null}
    </TagContainer>
  );
}

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
}: {
  currency: Currency;
  onSelect: () => void;
  isSelected: boolean;
  otherSelected: boolean;
  style: CSSProperties;
}) {
  const { account, chainId } = useActiveWeb3React();
  const key = currencyKey(currency, chainId);
  const selectedTokenList = useCombinedActiveList();
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency, chainId);
  const customAdded = useIsUserAddedToken(currency);
  const balance = useCurrencyBalance(account ?? undefined, currency);

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      id={`token-item-${key}`}
      style={style}
      className={`hover:bg-dark-800 rounded`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <div className="flex items-center">
        <CurrencyLogo currency={currency} size={32} />
      </div>
      <Column>
        <Text title={currency.getName(chainId)} fontWeight={500}>
          {currency.getSymbol(chainId)}
        </Text>
        <div className="text-sm font-thin">
          {currency.getName(chainId)}{" "}
          {!isOnSelectedList && customAdded && "• Added by user"}
        </div>
      </Column>
      <TokenTags currency={currency} />
      <div className="flex items-start justify-end">
        {balance ? <Balance balance={balance} /> : account ? <Loader /> : null}
      </div>
    </MenuItem>
  );
}

export default function CurrencyList({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showETH,
  showImportView,
  setImportToken,
  breakIndex,
}: {
  height: number;
  currencies: Currency[];
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherCurrency?: Currency | null;
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>;
  showETH: boolean;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
  breakIndex: number | undefined;
}) {
  const { chainId } = useActiveWeb3React();
  const itemData: (Currency | undefined)[] = useMemo(() => {
    let formatted: (Currency | undefined)[] = showETH
      ? [Currency.getNativeCurrency(chainId), ...currencies]
      : currencies;
    if (breakIndex !== undefined) {
      formatted = [
        ...formatted.slice(0, breakIndex),
        undefined,
        ...formatted.slice(breakIndex, formatted.length),
      ];
    }
    return formatted;
  }, [breakIndex, currencies, showETH]);

  const inactiveTokens: {
    [address: string]: Token;
  } = useAllInactiveTokens();

  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: Currency = data[index];
      const isSelected = Boolean(
        selectedCurrency && currencyEquals(selectedCurrency, currency)
      );
      const otherSelected = Boolean(
        otherCurrency && currencyEquals(otherCurrency, currency)
      );
      const handleSelect = () => onCurrencySelect(currency);

      const token = wrappedCurrency(currency, chainId);

      const showImport =
        inactiveTokens &&
        token &&
        Object.keys(inactiveTokens).includes(token.address);

      if (index === breakIndex || !data) {
        return (
          <FixedContentRow style={style}>
            <LightGreyCard padding="8px 12px" borderRadius="8px">
              <RowBetween>
                <RowFixed>
                  <TokenListLogoWrapper src="/tokenlist.svg" />
                  <div>Expanded results from inactive Token Lists</div>
                </RowFixed>
                <QuestionHelper text="Tokens from inactive lists. Import specific tokens below or click 'Manage' to activate more lists." />
              </RowBetween>
            </LightGreyCard>
          </FixedContentRow>
        );
      }

      if (showImport && token) {
        return (
          <ImportRow
            style={style}
            token={token}
            showImportView={showImportView}
            setImportToken={setImportToken}
            dim={true}
          />
        );
      } else {
        return (
          <CurrencyRow
            style={style}
            currency={currency}
            isSelected={isSelected}
            onSelect={handleSelect}
            otherSelected={otherSelected}
          />
        );
      }
    },
    [
      chainId,
      inactiveTokens,
      onCurrencySelect,
      otherCurrency,
      selectedCurrency,
      setImportToken,
      showImportView,
      breakIndex,
    ]
  );

  const itemKey = useCallback(
    (index: number, data: any) => currencyKey(data[index]),
    []
  );

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  );
}
