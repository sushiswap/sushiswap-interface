import { AlertTriangle, ArrowUpCircle } from "react-feather";
import React, { FC } from "react";

import { ButtonPrimary } from "../ButtonLegacy";
import { ChainId } from "@sushiswap/sdk";
import CloseIcon from "../CloseIcon";
import ExternalLink from "../ExternalLink";
import Modal from "../Modal";
import { getExplorerLink } from "../../functions/explorer";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import Lottie from "lottie-react";
import loadingRollingCircle from "../../animation/loading-rolling-circle.json";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/macro";

interface ConfirmationPendingContentProps {
  onDismiss: () => void;
  pendingText: string;
  pendingText2: string;
}

export const ConfirmationPendingContent: FC<ConfirmationPendingContentProps> =
  ({ onDismiss, pendingText, pendingText2 }) => {
    const { i18n } = useLingui();
    return (
      <div>
        <div className="flex justify-end">
          <CloseIcon onClick={onDismiss} />
        </div>
        <div className="m-auto w-24 pb-4">
          <Lottie animationData={loadingRollingCircle} autoplay loop />
        </div>
        <div className="flex flex-col gap-3 justify-center items-center">
          <div className="text-xl font-bold text-high-emphesis">
            {i18n._(t`Waiting for Confirmation`)}
          </div>
          <div className="font-bold">{pendingText}</div>
          <div className="font-bold">{pendingText2}</div>
          <div className="text-sm text-secondary font-bold">
            {i18n._(t`Confirm this transaction in your wallet`)}
          </div>
        </div>
      </div>
    );
  };

interface TransactionSubmittedContentProps {
  onDismiss: () => void;
  hash: string | undefined;
  chainId: ChainId;
}

export const TransactionSubmittedContent: FC<TransactionSubmittedContentProps> =
  ({ onDismiss, chainId, hash }) => {
    const { i18n } = useLingui();

    return (
      <div>
        <div className="flex justify-end">
          <CloseIcon onClick={onDismiss} />
        </div>
        <div className="m-auto w-24 pb-4">
          <ArrowUpCircle strokeWidth={0.5} size={90} className="text-blue" />
        </div>
        <div className="flex gap-1 justify-center flex-col items-center">
          <div className="text-xl font-bold">
            {i18n._(t`Transaction Submitted`)}
          </div>
          {chainId && hash && (
            <ExternalLink href={getExplorerLink(chainId, hash, "transaction")}>
              <div className="text-blue font-bold">View on explorer</div>
            </ExternalLink>
          )}
          <ButtonPrimary onClick={onDismiss} style={{ margin: "20px 0 0 0" }}>
            <div className="text-lg font-medium">Close</div>
          </ButtonPrimary>
        </div>
      </div>
    );
  };

interface ConfirmationModelContentProps {
  title: string;
  onDismiss: () => void;
  topContent: () => React.ReactNode;
  bottomContent: () => React.ReactNode;
}

export const ConfirmationModalContent: FC<ConfirmationModelContentProps> = ({
  title,
  bottomContent,
  onDismiss,
  topContent,
}) => {
  return (
    <div className="grid gap-3">
      <div>
        <div className="flex justify-between">
          <div className="text-lg font-bold text-high-emphesis">{title}</div>
          <CloseIcon onClick={onDismiss} />
        </div>
        {topContent()}
      </div>
      <div>{bottomContent()}</div>
    </div>
  );
};

interface TransactionErrorContentProps {
  message: string;
  onDismiss: () => void;
}

export const TransactionErrorContent: FC<TransactionErrorContentProps> = ({
  message,
  onDismiss,
}) => {
  const { i18n } = useLingui();

  return (
    <div className="grid gap-6">
      <div>
        <div className="flex justify-between">
          <div className="text-lg font-medium text-high-emphesis">
            {i18n._(t`Error`)}
          </div>
          <CloseIcon onClick={onDismiss} />
        </div>
        <div className="flex gap-3 justify-center flex-col items-center">
          <AlertTriangle
            className="text-red"
            style={{ strokeWidth: 1.5 }}
            size={64}
          />
          <div className="text-red font-bold">{message}</div>
        </div>
      </div>
      <div>
        <ButtonPrimary onClick={onDismiss}>Dismiss</ButtonPrimary>
      </div>
    </div>
  );
};

interface ConfirmationModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  hash: string | undefined;
  content: () => React.ReactNode;
  attemptingTxn: boolean;
  pendingText: string;
  pendingText2?: string;
}

const TransactionConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  pendingText2,
  content,
}) => {
  const { chainId } = useActiveWeb3React();

  if (!chainId) return null;

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      {attemptingTxn ? (
        <ConfirmationPendingContent
          onDismiss={onDismiss}
          pendingText={pendingText}
          pendingText2={pendingText2}
        />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
        />
      ) : (
        content()
      )}
    </Modal>
  );
};

export default TransactionConfirmationModal;
