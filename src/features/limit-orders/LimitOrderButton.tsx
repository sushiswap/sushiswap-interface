import { useLingui } from "@lingui/react";
import { BentoApprovalState } from "../../hooks/useKashiApproveCallback";
import Alert from "../../components/Alert";
import { t } from "@lingui/macro";
import Button, { ButtonProps } from "../../components/Button";
import React, { FC } from "react";
import useLimitOrderApproveCallback from "../../hooks/useLimitOrderApproveCallback";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { ApprovalState, useApproveCallback } from "../../hooks";
import { BENTOBOX_ADDRESS } from "../../constants/kashi";
import { CurrencyAmount, Token, WETH } from "@sushiswap/sdk";
import Dots from "../../components/Dots";
import { useWalletModalToggle } from "../../state/application/hooks";

interface LimitOrderApproveButtonProps extends ButtonProps {
  children: any;
}

export const LimitOrderApproveButton = ({
  children,
  ...rest
}: LimitOrderApproveButtonProps) => {
  const { i18n } = useLingui();
  const { account } = useActiveWeb3React();
  const [approvalState, fallback, permit, onApprove, execute] =
    useLimitOrderApproveCallback();
  const toggleWalletModal = useWalletModalToggle();
  const showApprove =
    (approvalState === BentoApprovalState.NOT_APPROVED ||
      approvalState === BentoApprovalState.PENDING) &&
    !permit;
  const showChildren = approvalState === BentoApprovalState.APPROVED || permit;

  return (
    <>
      {!account && (
        <Button onClick={toggleWalletModal} {...rest}>
          {i18n._(t`Connect Wallet`)}
        </Button>
      )}

      {fallback && (
        <Alert
          message={i18n._(
            t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click again and the fallback method will be used`
          )}
          className="mb-4 flex flex-row w-full"
        />
      )}

      {showApprove && (
        <Button onClick={onApprove} {...rest}>
          {i18n._(t`Approve Limit Order`)}
        </Button>
      )}

      {showChildren &&
        (typeof children === "function" ? (
          children({ execute })
        ) : (
          <>{children}</>
        ))}
    </>
  );
};

interface TokenApproveButtonProps extends ButtonProps {
  value: CurrencyAmount;
  token: Token;
}

export const TokenApproveButton: FC<TokenApproveButtonProps> = ({
  children,
  value,
  token,
  ...rest
}) => {
  const { i18n } = useLingui();
  const { chainId } = useActiveWeb3React();
  const [approvalState, approve] = useApproveCallback(
    value,
    chainId && BENTOBOX_ADDRESS[chainId]
  );

  const showApprove =
    chainId &&
    token &&
    token.address !== WETH[chainId].address &&
    value &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING);

  return showApprove ? (
    <Button onClick={approve} className="mb-4" {...rest}>
      <Dots
        pending={approvalState === ApprovalState.PENDING}
        pendingTitle={`Approving ${token.symbol}`}
      >
        {i18n._(t`Approve`)} {token.symbol}
      </Dots>
    </Button>
  ) : (
    <>{children}</>
  );
};

export default LimitOrderApproveButton;
