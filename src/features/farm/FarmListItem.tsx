import {
  ApprovalState,
  useApproveCallback,
} from "../../hooks/useApproveCallback";
import { ChainId, MASTERCHEF_ADDRESS, Token, ZERO } from "@sushiswap/sdk";
import { Chef, PairType } from "./enum";
import React, { useState } from "react";
import { currencyId, formatNumber, formatPercent } from "../../functions";
import { usePendingSushi, useUserInfo } from "./hooks";

import Button from "../../components/Button";
import Dots from "../../components/Dots";
import DoubleLogo from "../../components/DoubleLogo";
import Image from "next/image";
import Link from "next/link";
import { Input as NumericalInput } from "../../components/NumericalInput";
import { getAddress } from "@ethersproject/address";
import { t } from "@lingui/macro";
import { tryParseAmount } from "../../functions/parse";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import { useCurrency } from "../../hooks/Tokens";
import { useLingui } from "@lingui/react";
import useMasterChef from "./useMasterChef";
import usePendingReward from "./usePendingReward";
import { useTokenBalance } from "../../state/wallet/hooks";
import { useTransactionAdder } from "../../state/transactions/hooks";

const FarmListItem = ({ farm }) => {
  const { i18n } = useLingui();
  const [expand, setExpand] = useState<boolean>(false);
  const { account, chainId } = useActiveWeb3React();
  const [pendingTx, setPendingTx] = useState(false);
  const [depositValue, setDepositValue] = useState("");
  const [withdrawValue, setWithdrawValue] = useState("");

  const addTransaction = useTransactionAdder();
  const token0 = useCurrency(farm.pair.token0.id);
  const token1 = useCurrency(farm.pair.token1.id);

  const liquidityToken = new Token(
    chainId,
    getAddress(farm.pair.id),
    farm.pair.decimals,
    farm.pair.symbol,
    farm.pair.name
  );

  // User liquidity token balance
  const balance = useTokenBalance(account, liquidityToken);

  // TODO: Replace these
  const amount = useUserInfo(farm, liquidityToken);
  const pendingSushi = usePendingSushi(farm);

  const reward = usePendingReward(farm);

  const APPROVAL_ADDRESSES = {
    [Chef.MASTERCHEF]: MASTERCHEF_ADDRESS[ChainId.MAINNET],
    [Chef.MASTERCHEF_V2]: "0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d",
    [Chef.MINICHEF]: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
  };

  const typedDepositValue = tryParseAmount(depositValue, liquidityToken);
  const typedWithdrawValue = tryParseAmount(withdrawValue, liquidityToken);

  const [approvalState, approve] = useApproveCallback(
    typedDepositValue,
    APPROVAL_ADDRESSES[farm.chef]
  );

  const { deposit, withdraw, harvest } = useMasterChef(farm.chef);

  return (
    <div className="rounded bg-dark-900">
      <div
        className="grid grid-cols-3 px-4 py-4 text-sm rounded cursor-pointer select-none text-primary text-body md:grid-cols-4"
        onClick={() => setExpand(!expand)}
      >
        <div className="flex items-center col-span-1 space-x-4">
          <DoubleLogo currency0={token0} currency1={token1} size={42} />
          <div>
            <div className="font-bold">
              {farm?.pair?.token0?.symbol}/{farm?.pair?.token1?.symbol}
            </div>
            {farm?.pair?.type === PairType.SWAP && (
              <div className="text-caption text-secondary">SushiSwap Farm</div>
            )}
            {farm?.pair?.type === PairType.LENDING && (
              <div className="text-caption text-secondary">Kashi Farm</div>
            )}
          </div>
        </div>
        <div className="flex items-center md:col-span-1">
          <div>
            <div className="font-bold">{formatNumber(farm.tvl, true)}</div>
            <div className="text-caption text-secondary">
              {formatNumber(farm.balance, false)} {farm.type} Market Staked
            </div>
          </div>
        </div>
        <div className="flex-row items-center justify-start hidden ml-4 space-x-2 md:col-span-1 md:flex">
          <div className="flex flex-col space-y-2 md:col-span-3">
            <div className="flex flex-row items-center mr-4 space-x-2">
              {farm?.rewards?.map((reward, i) => (
                <div key={i} className="flex items-center">
                  <Image
                    src={reward.icon}
                    width="40px"
                    height="40px"
                    className="w-10 h-10 rounded"
                    alt={reward.token}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col pl-2 space-y-1">
            {farm?.rewards?.map((reward, i) => (
              <div key={i} className="text-caption">
                {formatNumber(reward.rewardPerDay)} {reward.token} / DAY
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end md:col-span-1">
          <div>
            <div className="font-bold text-right text-body text-high-emphesis">
              {farm?.roiPerYear > 100
                ? "10000%+"
                : formatPercent(farm?.roiPerYear * 100)}
            </div>
            <div className="text-right text-caption text-secondary">
              annualized
            </div>
          </div>
        </div>
      </div>
      {expand && (
        <>
          <div className="flex flex-col py-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 px-4">
              <div className="col-span-2 text-center md:col-span-1">
                {account && (
                  <div className="pr-4 mb-2 text-sm text-right cursor-pointer text-secondary">
                    {i18n._(t`Wallet Balance`)}:{" "}
                    {formatNumber(balance?.toSignificant(6) ?? 0)} {farm.type}
                  </div>
                )}
                <div className="relative flex items-center w-full mb-4">
                  <NumericalInput
                    className="w-full p-3 pr-20 rounded bg-dark-700 bg-input focus:ring focus:ring-blue"
                    value={depositValue}
                    onUserInput={(value) => {
                      setDepositValue(value);
                    }}
                  />
                  {account && (
                    <Button
                      variant="outlined"
                      color="blue"
                      size="small"
                      onClick={() => {
                        if (!balance.equalTo(ZERO)) {
                          setDepositValue(
                            balance.toFixed(liquidityToken.decimals)
                          );
                        }
                      }}
                      className="absolute border-0 right-4 focus:ring focus:ring-blue"
                    >
                      {i18n._(t`MAX`)}
                    </Button>
                  )}
                </div>
                {approvalState === ApprovalState.NOT_APPROVED ||
                approvalState === ApprovalState.PENDING ? (
                  <Button
                    color="blue"
                    disabled={approvalState === ApprovalState.PENDING}
                    onClick={approve}
                  >
                    {approvalState === ApprovalState.PENDING ? (
                      <Dots>Approving </Dots>
                    ) : (
                      "Approve"
                    )}
                  </Button>
                ) : (
                  <Button
                    color="blue"
                    disabled={
                      pendingTx ||
                      !typedDepositValue ||
                      balance.lessThan(typedDepositValue)
                    }
                    onClick={async () => {
                      setPendingTx(true);
                      try {
                        // KMP decimals depend on asset, SLP is always 18
                        const tx = await deposit(
                          farm.id,
                          depositValue.toBigNumber(liquidityToken?.decimals)
                        );

                        addTransaction(tx, {
                          summary: `Deposit ${farm.pair.name}`,
                        });
                      } catch (error) {
                        console.error(error);
                      }
                      setPendingTx(false);
                    }}
                  >
                    {i18n._(t`Stake`)}
                  </Button>
                )}
              </div>
              <div className="col-span-2 text-center md:col-span-1">
                {account && (
                  <div className="pr-4 mb-2 text-sm text-right cursor-pointer text-secondary">
                    {i18n._(t`Your Staked`)}:{" "}
                    {formatNumber(amount?.toSignificant(6)) ?? 0} {farm.type}
                  </div>
                )}
                <div className="relative flex items-center w-full mb-4">
                  <NumericalInput
                    className="w-full p-3 pr-20 rounded bg-dark-700 bg-input focus:ring focus:ring-pink"
                    value={withdrawValue}
                    onUserInput={(value) => {
                      setWithdrawValue(value);
                    }}
                  />
                  {account && (
                    <Button
                      variant="outlined"
                      color="pink"
                      size="small"
                      onClick={() => {
                        if (!amount.equalTo(ZERO)) {
                          setWithdrawValue(
                            amount.toFixed(liquidityToken.decimals)
                          );
                        }
                      }}
                      className="absolute border-0 right-4 focus:ring focus:ring-pink"
                    >
                      {i18n._(t`MAX`)}
                    </Button>
                  )}
                </div>
                <Button
                  color="pink"
                  className="border-0"
                  disabled={
                    pendingTx ||
                    !typedWithdrawValue ||
                    amount.lessThan(typedWithdrawValue)
                  }
                  onClick={async () => {
                    setPendingTx(true);
                    try {
                      // KMP decimals depend on asset, SLP is always 18
                      const tx = await withdraw(
                        farm.id,
                        withdrawValue.toBigNumber(liquidityToken?.decimals)
                      );
                      addTransaction(tx, {
                        summary: `Withdraw ${farm.pair.name}`,
                      });
                    } catch (error) {
                      console.error(error);
                    }

                    setPendingTx(false);
                  }}
                >
                  {i18n._(t`Unstake`)}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2">
              {farm.pair.type === PairType.SWAP && (
                <>
                  <div className="text-caption2">
                    Before depositing liquidity into this reward pool you'll
                    need to{" "}
                    <Link
                      href={`/add/${currencyId(token0)}/${currencyId(token1)}`}
                    >
                      <a className="underline text-blue">add liquidity</a>
                    </Link>{" "}
                    of {token0.symbol} & {token1.symbol} to gain liquidity
                    tokens.
                  </div>

                  <div className="text-caption2">
                    After withdrawing liquidity from this reward pool you can{" "}
                    <Link
                      href={`/remove/${currencyId(token0)}/${currencyId(
                        token1
                      )}`}
                    >
                      <a className="underline text-blue">remove liquidity</a>
                    </Link>{" "}
                    to regain your underlying {token0.symbol} & {token1.symbol}.
                  </div>
                </>
              )}
              {farm.pair.type === PairType.LENDING && token1.symbol && (
                <>
                  <div className="text-caption2">
                    Before depositing into this reward pool you'll need to{" "}
                    <Link href={`/lend/${farm.pair.id}`}>
                      <a className="underline text-blue">lend</a>
                    </Link>{" "}
                    to gain liquidity tokens to deposit.
                  </div>

                  <div className="text-caption2">
                    After withdrawing liquidity tokens from this reward pool you
                    can{" "}
                    <Link href={`/lend/${farm.pair.id}`}>
                      <a className="underline text-blue">collect</a>
                    </Link>{" "}
                    to regain your underlying {token1.symbol}.
                  </div>
                </>
              )}
            </div>
            {pendingSushi && pendingSushi.greaterThan(ZERO) && (
              <div className="px-4 ">
                <Button
                  color="gradient"
                  onClick={async () => {
                    setPendingTx(true);
                    try {
                      const tx = await harvest(farm.id);
                      addTransaction(tx, {
                        summary: `Harvest ${farm.pair.name}`,
                      });
                    } catch (error) {
                      console.error(error);
                    }
                    setPendingTx(false);
                  }}
                >
                  {i18n._(t`Harvest ${formatNumber(
                    pendingSushi.toFixed(18)
                  )} SUSHI
                                        ${
                                          farm.rewards.length > 1
                                            ? `& ${formatNumber(reward)} ${
                                                farm.rewards[1].token
                                              }`
                                            : null
                                        }
                                    `)}
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FarmListItem;
