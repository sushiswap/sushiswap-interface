import { useLingui } from "@lingui/react";
import Alert from "../../components/Alert";
import { t } from "@lingui/macro";
import Button, { ButtonProps } from "../../components/Button";
import React, { FC, useState } from "react";
import useLimitOrderApproveCallback, {
  BentoApprovalState,
} from "../../hooks/useLimitOrderApproveCallback";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { ApprovalState, useApproveCallback } from "../../hooks";
import { BENTOBOX_ADDRESS } from "../../constants/kashi";
import { ChainId, JSBI, Token, TokenAmount, WETH } from "@sushiswap/sdk";
import Dots from "../../components/Dots";
import {
  useAddPopup,
  useWalletModalToggle,
} from "../../state/application/hooks";
import {
  useDerivedLimitOrderInfo,
  useLimitOrderState,
} from "../../state/limit-order/hooks";
import { Field } from "../../state/limit-order/actions";
import ConfirmLimitOrderModal from "./ConfirmLimitOrderModal";
import { wrappedCurrency } from "../../functions";
import { OrderExpiration } from "../../state/limit-order/reducer";
import { LimitOrder } from "limitorderv2-sdk";
import { parseUnits } from "ethers/lib/utils";
import useLimitOrders from "../../hooks/useLimitOrders";

interface LimitOrderButtonProps extends ButtonProps {
  token: Token;
}

const LimitOrderButton: FC<LimitOrderButtonProps> = ({ token, ...rest }) => {
  const { i18n } = useLingui();
  const { fromBentoBalance, orderExpiration, recipient } = useLimitOrderState();
  const { parsedAmounts, currencies, inputError } = useDerivedLimitOrderInfo();
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const { mutate } = useLimitOrders();
  const addPopup = useAddPopup();
  const { account, chainId, library } = useActiveWeb3React();
  const [approvalState, fallback, permit, onApprove, execute] =
    useLimitOrderApproveCallback();
  const toggleWalletModal = useWalletModalToggle();
  const wrongChain = ![ChainId.MAINNET, ChainId.MATIC].includes(chainId);
  const disabled = wrongChain || !!inputError;

  const [tokenApprovalState, tokenApprove] = useApproveCallback(
    parsedAmounts[Field.INPUT],
    chainId && BENTOBOX_ADDRESS[chainId]
  );

  const showLimitApprove =
    (approvalState === BentoApprovalState.NOT_APPROVED ||
      approvalState === BentoApprovalState.PENDING) &&
    !permit;

  const showTokenApprove =
    chainId &&
    token &&
    token.address !== WETH[chainId].address &&
    parsedAmounts[Field.INPUT] &&
    (tokenApprovalState === ApprovalState.NOT_APPROVED ||
      tokenApprovalState === ApprovalState.PENDING);

  const handler = async () => {
    const tokenA = wrappedCurrency(currencies[Field.INPUT], chainId);
    const tokenB = wrappedCurrency(currencies[Field.OUTPUT], chainId);

    let endTime;
    switch (orderExpiration.value) {
      case OrderExpiration.hour:
        endTime = Math.floor(new Date().getTime() / 1000) + 3600;
        break;
      case OrderExpiration.day:
        endTime = Math.floor(new Date().getTime() / 1000) + 86400;
        break;
      case OrderExpiration.week:
        endTime = Math.floor(new Date().getTime() / 1000) + 604800;
        break;
      case OrderExpiration.never:
        endTime = Number.MAX_SAFE_INTEGER;
    }

    const order = new LimitOrder(
      account,
      new TokenAmount(
        tokenA,
        JSBI.BigInt(
          parseUnits(parsedAmounts[Field.INPUT]?.toExact()).toString()
        ).toString()
      ),
      new TokenAmount(
        tokenB,
        JSBI.BigInt(
          parseUnits(parsedAmounts[Field.OUTPUT]?.toExact()).toString()
        ).toString()
      ),
      recipient ? recipient : account,
      0,
      endTime.toString()
    );

    try {
      await order.signOrderWithProvider(chainId, library);
      setOpenConfirmationModal(false);

      const resp = await order.send();

      if (resp.success) {
        addPopup({
          txn: { hash: null, summary: "Limit order created", success: true },
        });
        await mutate();
      }
    } catch (e) {
      addPopup({
        txn: {
          hash: null,
          summary: `Error creating limit order: ${e?.data}`,
          success: false,
        },
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <ConfirmLimitOrderModal
        open={openConfirmationModal}
        onConfirm={() => handler()}
        onDismiss={() => setOpenConfirmationModal(false)}
      />

      {fallback && (
        <Alert
          message={i18n._(
            t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click again and the fallback method will be used`
          )}
          className="mb-4 flex flex-row w-full"
        />
      )}

      {wrongChain ? (
        <Button disabled={disabled} onClick={toggleWalletModal} {...rest}>
          {i18n._(t`Chain not supported yet`)}
        </Button>
      ) : !account ? (
        <Button disabled={disabled} onClick={toggleWalletModal} {...rest}>
          {i18n._(t`Connect Wallet`)}
        </Button>
      ) : inputError ? (
        <Button disabled={true} {...rest} color="gray">
          {inputError}
        </Button>
      ) : showTokenApprove ? (
        <Button onClick={tokenApprove} className="mb-4" {...rest}>
          {tokenApprovalState === ApprovalState.PENDING ? (
            <Dots>{i18n._(t`Approving ${token.symbol}`)}</Dots>
          ) : (
            i18n._(t`Approve ${token.symbol}`)
          )}
        </Button>
      ) : showLimitApprove ? (
        <Button disabled={disabled} onClick={onApprove} {...rest}>
          {i18n._(t`Approve Limit Order`)}
        </Button>
      ) : (permit && !fromBentoBalance) ||
        (!permit &&
          approvalState === BentoApprovalState.APPROVED &&
          !fromBentoBalance) ? (
        <Button disabled={disabled} onClick={() => execute(token)} {...rest}>
          {i18n._(t`Deposit ${token.symbol} into BentoBox`)}
        </Button>
      ) : (
        <Button
          disabled={disabled}
          {...rest}
          onClick={() => setOpenConfirmationModal(true)}
        >
          {i18n._(t`Review Limit Order`)}
        </Button>
      )}
    </div>
  );
};

export default LimitOrderButton;
