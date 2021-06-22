import React, { FC, useMemo } from "react";
import { ApprovalState, useActiveWeb3React } from "../../../hooks";
import Button from "../../../components/Button";
import Dots from "../../../components/Dots";
import useMeowshi from "../../../hooks/useMeowshi";
import { useTokenBalance } from "../../../state/wallet/hooks";
import { SUSHI, XSUSHI } from "../../../constants";
import { ChainId } from "@sushiswap/sdk";
import { Field, MeowshiState } from "../../../pages/tools/meowshi";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/macro";
import { BigNumber } from "@ethersproject/bignumber";
import { tryParseAmount } from "../../../functions";

const SYMBOL = "MEOWSHI";

interface MeowshiButtonProps {
  meowshiState: MeowshiState;
}

const MeowshiButton: FC<MeowshiButtonProps> = ({ meowshiState }) => {
  const { currencies, meow: doMeow, fields } = meowshiState;
  const { i18n } = useLingui();
  const { account, chainId } = useActiveWeb3React();
  const sushiBalance = useTokenBalance(account, SUSHI[ChainId.MAINNET]);
  const xSushiBalance = useTokenBalance(account, XSUSHI);
  const { approvalState, approve, meow, unmeow, meowSushi, unmeowSushi } =
    useMeowshi();
  const balance = useTokenBalance(account, currencies[Field.INPUT]);

  const handleSubmit = async () => {
    if (doMeow) {
      if (currencies[Field.INPUT]?.symbol === "SUSHI") {
        return await meowSushi({
          value: BigNumber.from(fields[Field.INPUT]),
          decimals: sushiBalance.token.decimals,
        });
      }
      if (currencies[Field.INPUT]?.symbol === "xSUSHI") {
        return await meow({
          value: BigNumber.from(fields[Field.INPUT]),
          decimals: xSushiBalance.token.decimals,
        });
      }
    } else {
      if (currencies[Field.INPUT]?.symbol === "SUSHI") {
        return await unmeowSushi({
          value: BigNumber.from(fields[Field.INPUT]),
          decimals: xSushiBalance.token.decimals,
        });
      }
      if (currencies[Field.INPUT]?.symbol === "xSUSHI") {
        return await unmeow({
          value: BigNumber.from(fields[Field.INPUT]),
          decimals: xSushiBalance.token.decimals,
        });
      }
    }
  };

  const buttonDisabledText = useMemo(() => {
    if (
      tryParseAmount(fields[Field.INPUT], currencies[Field.INPUT])?.greaterThan(
        balance
      )
    )
      return i18n._(t`Insufficient Balance`);
    return null;
  }, [balance, currencies, fields, i18n]);

  if (!account)
    return (
      <Button onClick={approve} color="gradient" disabled={true}>
        {i18n._(t`Connect to wallet`)}
      </Button>
    );

  if (chainId !== ChainId.MAINNET)
    return (
      <Button onClick={approve} color="gradient" disabled={true}>
        {i18n._(t`Network not supported yet`)}
      </Button>
    );

  if (approvalState === ApprovalState.NOT_APPROVED)
    return (
      <Button
        onClick={approve}
        color="gradient"
        disabled={!!buttonDisabledText}
      >
        {buttonDisabledText || i18n._(t`Approve ${SYMBOL}`)}
      </Button>
    );

  if (approvalState === ApprovalState.PENDING)
    return (
      <Button color="gradient" disabled={true}>
        <Dots>{i18n._(t`Approving ${SYMBOL}`)}</Dots>
      </Button>
    );

  if (approvalState === ApprovalState.APPROVED)
    return (
      <Button
        onClick={handleSubmit}
        disabled={!!buttonDisabledText}
        color="gradient"
      >
        {buttonDisabledText || i18n._(t`Convert`)}
      </Button>
    );
};

export default MeowshiButton;
