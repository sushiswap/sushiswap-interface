import {
  ApprovalState,
  useApproveCallback,
} from "../../hooks/useApproveCallback";
import useKashiApproveCallback, {
  BentoApprovalState,
} from "../../hooks/useKashiApproveCallback";

import Alert from "../../components/Alert";
import { BENTOBOX_ADDRESS } from "../../constants/kashi";
import Button from "../../components/Button";
import Dots from "../../components/Dots";
import React from "react";
import { WETH } from "@sushiswap/sdk";
import { t } from "@lingui/macro";
import { tryParseAmount } from "../../functions/parse";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useLingui } from "@lingui/react";

export function KashiApproveButton({ content, color }: any): any {
  const { i18n } = useLingui();
  const [
    kashiApprovalState,
    approveKashiFallback,
    kashiPermit,
    onApprove,
    onCook,
  ] = useKashiApproveCallback();
  const showApprove =
    (kashiApprovalState === BentoApprovalState.NOT_APPROVED ||
      kashiApprovalState === BentoApprovalState.PENDING) &&
    !kashiPermit;
  const showChildren =
    kashiApprovalState === BentoApprovalState.APPROVED || kashiPermit;

  return (
    <>
      {approveKashiFallback && (
        <Alert
          message={i18n._(
            t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click again and the fallback method will be used`
          )}
          className="mb-4"
        />
      )}

      {showApprove && (
        <Button color={color} onClick={onApprove} className="mb-4">
          {i18n._(t`Approve Kashi`)}
        </Button>
      )}

      {showChildren && React.cloneElement(content(onCook), { color })}
    </>
  );
}

export function TokenApproveButton({
  children,
  value,
  token,
  needed,
  color,
}: any): any {
  const { i18n } = useLingui();
  const { chainId } = useActiveWeb3React();
  const [approvalState, approve] = useApproveCallback(
    tryParseAmount(value, token),
    chainId && BENTOBOX_ADDRESS[chainId]
  );

  const showApprove =
    chainId &&
    token &&
    token.address !== WETH[chainId].address &&
    needed &&
    value &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING);

  return showApprove ? (
    <Button color={color} onClick={approve} className="mb-4">
      <Dots
        pending={approvalState === ApprovalState.PENDING}
        pendingTitle={`Approving ${token.symbol}`}
      >
        {i18n._(t`Approve`)} {token.symbol}
      </Dots>
    </Button>
  ) : (
    React.cloneElement(children, { color })
  );
}
