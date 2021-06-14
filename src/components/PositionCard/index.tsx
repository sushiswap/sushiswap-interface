import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { Fraction, JSBI, Pair, Percent, TokenAmount } from "@sushiswap/sdk";
import React, { useState } from "react";
import { RowBetween, RowFixed } from "../Row";
import { currencyId, unwrappedToken } from "../../functions/currency";

import { AutoColumn } from "../Column";
import { BIG_INT_ZERO } from "../../constants";
import Button from "../Button";
import CurrencyLogo from "../CurrencyLogo";
import Dots from "../Dots";
import DoubleCurrencyLogo from "../DoubleLogo";
import { shortenString } from "../../functions/format";
import styled from "styled-components";
import { t } from "@lingui/macro";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useLingui } from "@lingui/react";
import { useRouter } from "next/router";
import { useTokenBalance } from "../../state/wallet/hooks";
import { useTotalSupply } from "../../hooks/useTotalSupply";

interface PositionCardProps {
  pair: Pair;
  showUnwrapped?: boolean;
  border?: string;
  stakedBalance?: TokenAmount; // optional balance to indicate that liquidity is deposited in mining pool
}

export function MinimalPositionCard({
  pair,
  showUnwrapped = false,
  border,
}: PositionCardProps) {
  const { i18n } = useLingui();
  const { account, chainId } = useActiveWeb3React();

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0);
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1);

  const [showMore, setShowMore] = useState(false);

  const userPoolBalance = useTokenBalance(
    account ?? undefined,
    pair.liquidityToken
  );
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined;

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(
            pair.token0,
            totalPoolTokens,
            userPoolBalance,
            false
          ),
          pair.getLiquidityValue(
            pair.token1,
            totalPoolTokens,
            userPoolBalance,
            false
          ),
        ]
      : [undefined, undefined];

  const formatBalance = () => {
    if (
      userPoolBalance
        ?.divide("10000000000")
        .lessThan(new Fraction("1", "100000"))
    )
      return "<0.00001";
    return userPoolBalance?.toSignificant(4);
  };

  return (
    <>
      {userPoolBalance &&
      JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
        <div className="p-5 rounded bg-dark-800">
          <AutoColumn gap={"md"}>
            Your Position
            <div className="flex flex-col md:flex-row md:justify-between">
              <div className="flex items-center">
                <DoubleCurrencyLogo
                  currency0={pair.token0}
                  currency1={pair.token1}
                  size={42}
                />
                <div className="ml-3 text-2xl font-semibold">
                  {shortenString(
                    `${pair.token0.getSymbol(chainId)}/${pair.token1.getSymbol(
                      chainId
                    )}`,
                    8
                  )}
                </div>
              </div>
              <div className="flex items-center mt-3 md:mt-0">
                {userPoolBalance ? formatBalance() : "-"}
                &nbsp;
                {i18n._(t`Pool Tokens`)}
              </div>
            </div>
            <div className="flex flex-col w-full p-3 mt-3 space-y-1 rounded bg-dark-900 text-high-emphesis">
              <RowBetween>
                <div className="text-sm">{i18n._(t`Your pool share`)}</div>
                <div className="text-sm font-bold">
                  {poolTokenPercentage
                    ? poolTokenPercentage.toFixed(6) + "%"
                    : "-"}
                </div>
              </RowBetween>
              <RowBetween>
                <div className="text-sm">
                  Supplied {currency0.getSymbol(chainId)}:
                </div>
                {token0Deposited ? (
                  <RowFixed>
                    <div>{token0Deposited?.toSignificant(6)}</div>
                    <div className="ml-2 text-sm font-bold text-secondary">
                      {currency0.getSymbol(chainId)}
                    </div>
                  </RowFixed>
                ) : (
                  "-"
                )}
              </RowBetween>
              <RowBetween>
                <div className="text-sm">
                  Supplied {currency1.getSymbol(chainId)}:
                </div>
                {token1Deposited ? (
                  <RowFixed>
                    <div>{token1Deposited?.toSignificant(6)}</div>
                    <div className="ml-2 text-sm font-bold text-secondary">
                      {currency1.getSymbol(chainId)}
                    </div>
                  </RowFixed>
                ) : (
                  "-"
                )}
              </RowBetween>
            </div>
          </AutoColumn>
        </div>
      ) : (
        <div className="w-full p-4 mt-4 rounded bg-purple bg-opacity-20">
          <p>
            <span role="img" aria-label="wizard-icon">
              ⭐️
            </span>{" "}
            {t`By adding liquidity you'll earn 0.25% of all trades on this pair proportional to your share
                        of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing
                        your liquidity.`}
          </p>
        </div>
      )}
    </>
  );
}

export default function FullPositionCard({
  pair,
  border,
  stakedBalance,
}: PositionCardProps) {
  const { i18n } = useLingui();
  const router = useRouter();
  const { account, chainId } = useActiveWeb3React();

  const currency0 = unwrappedToken(pair.token0);
  const currency1 = unwrappedToken(pair.token1);

  const [showMore, setShowMore] = useState(false);

  const userDefaultPoolBalance = useTokenBalance(
    account ?? undefined,
    pair.liquidityToken
  );
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  // if staked balance balance provided, add to standard liquidity amount
  const userPoolBalance = stakedBalance
    ? userDefaultPoolBalance?.add(stakedBalance)
    : userDefaultPoolBalance;

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined;

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(
            pair.token0,
            totalPoolTokens,
            userPoolBalance,
            false
          ),
          pair.getLiquidityValue(
            pair.token1,
            totalPoolTokens,
            userPoolBalance,
            false
          ),
        ]
      : [undefined, undefined];

  return (
    <div className="rounded ">
      <Button
        variant="empty"
        className="flex items-center justify-between w-full px-4 py-6 cursor-pointer bg-dark-800 hover:bg-dark-700"
        style={{ boxShadow: "none" }}
        onClick={() => setShowMore(!showMore)}
      >
        <div className="flex items-center space-x-4">
          <DoubleCurrencyLogo
            currency0={currency0}
            currency1={currency1}
            size={20}
          />
          <div className="text-xl font-semibold">
            {!currency0 || !currency1 ? (
              <Dots>{i18n._(t`Loading`)}</Dots>
            ) : (
              `${currency0.getSymbol(chainId)}/${currency1.getSymbol(chainId)}`
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {i18n._(t`Manage`)}
          {showMore ? (
            <ChevronUpIcon width="20px" height="20px" className="ml-4" />
          ) : (
            <ChevronDownIcon width="20px" height="20px" className="ml-4" />
          )}
        </div>
      </Button>

      {showMore && (
        <div className="px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="font-semibold">
              {i18n._(t`Your total pool tokens`)}:
            </div>
            <div className="font-semibold">
              {userPoolBalance ? userPoolBalance.toSignificant(4) : "-"}
            </div>
          </div>
          {stakedBalance && (
            <div className="flex items-center justify-between">
              <div className="font-semibold">
                {i18n._(t`Pool tokens in rewards pool`)}:
              </div>
              <div className="font-semibold">
                {stakedBalance.toSignificant(4)}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="font-semibold">
              {i18n._(t`Pooled ${currency0?.getSymbol(chainId)}`)}:
            </div>
            {token0Deposited ? (
              <div className="flex items-center justify-between">
                <div className="font-semibold ml-1.5">
                  {token0Deposited?.toSignificant(6)}
                </div>
                <div style={{ marginLeft: "8px" }}>
                  <CurrencyLogo size="20px" currency={currency0} />
                </div>
              </div>
            ) : (
              "-"
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="font-semibold">
              {i18n._(t`Pooled ${currency1?.getSymbol(chainId)}`)}:
            </div>
            {token1Deposited ? (
              <div className="flex items-center justify-between">
                <div className="font-semibold ml-1.5">
                  {token1Deposited?.toSignificant(6)}
                </div>
                <div style={{ marginLeft: "8px" }}>
                  <CurrencyLogo size="20px" currency={currency1} />
                </div>
              </div>
            ) : (
              "-"
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="font-semibold">{i18n._(t`Your pool share`)}:</div>
            <div className="font-semibold">
              {poolTokenPercentage
                ? (poolTokenPercentage.toFixed(2) === "0.00"
                    ? "<0.01"
                    : poolTokenPercentage.toFixed(2)) + "%"
                : "-"}
            </div>
          </div>

          {/* <ExternalLink
              style={{ width: "100%", textAlign: "center" }}
              href={`https://uniswap.info/account/${account}`}
            >
              View accrued fees and analytics
              <span style={{ fontSize: "11px" }}>↗</span>
            </ExternalLink> */}
          {userDefaultPoolBalance &&
            JSBI.greaterThan(userDefaultPoolBalance.raw, BIG_INT_ZERO) && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Button
                  color="blue"
                  size="large"
                  onClick={() => {
                    router.push(
                      `/add/${currencyId(currency0, chainId)}/${currencyId(
                        currency1,
                        chainId
                      )}`
                    );
                  }}
                >
                  {i18n._(t`Add`)}
                </Button>
                <Button
                  color="blue"
                  size="large"
                  onClick={() => {
                    router.push(
                      `/remove/${currencyId(currency0, chainId)}/${currencyId(
                        currency1,
                        chainId
                      )}`
                    );
                  }}
                >
                  {i18n._(t`Remove`)}
                </Button>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
