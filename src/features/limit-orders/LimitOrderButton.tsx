import { useLingui } from "@lingui/react";
import Alert from "../../components/Alert";
import { t } from "@lingui/macro";
import Button, { ButtonProps } from "../../components/Button";
import React, { FC } from "react";
import useLimitOrderApproveCallback, {
  BentoApprovalState,
} from "../../hooks/useLimitOrderApproveCallback";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { ApprovalState, useApproveCallback } from "../../hooks";
import { BENTOBOX_ADDRESS } from "../../constants/kashi";
import { ChainId, Token, WETH } from "@sushiswap/sdk";
import Dots from "../../components/Dots";
import { useWalletModalToggle } from "../../state/application/hooks";
import {
  useDerivedLimitOrderInfo,
  useLimitOrderState,
} from "../../state/limit-order/hooks";
import { Field } from "../../state/limit-order/actions";

interface LimitOrderButtonProps extends ButtonProps {
  token: Token;
}

const LimitOrderButton: FC<LimitOrderButtonProps> = ({ token, ...rest }) => {
  const { i18n } = useLingui();
  const { fromBentoBalance } = useLimitOrderState();
  const { parsedAmounts } = useDerivedLimitOrderInfo();

  const { account, chainId } = useActiveWeb3React();
  const [approvalState, fallback, permit, onApprove, execute] =
    useLimitOrderApproveCallback();
  const toggleWalletModal = useWalletModalToggle();

  const { inputError } = useDerivedLimitOrderInfo();
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

  return (
    <div className="flex flex-1 flex-col">
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
      ) : showTokenApprove ? (
        <Button onClick={tokenApprove} className="mb-4" {...rest}>
          <Dots
            pending={tokenApprovalState === ApprovalState.PENDING}
            pendingTitle={`Approving ${token.symbol}`}
          >
            {i18n._(t`Approve`)} {token.symbol}
          </Dots>
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
          {i18n._(t`Deposit`)}
        </Button>
      ) : (
        <Button disabled={disabled} size="large" color="gradient" {...rest}>
          {i18n._(t`Review Limit Order`)}
        </Button>
      )}
    </div>
  );
};

export default LimitOrderButton;
