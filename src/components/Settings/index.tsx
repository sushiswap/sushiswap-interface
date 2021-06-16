import React, { useContext, useRef, useState } from "react";
import { RowBetween, RowFixed } from "../Row";
import { StyledMenu, StyledMenuButton } from "../StyledMenu";
import styled, { ThemeContext } from "styled-components";
import {
  useExpertModeManager,
  useUserArcherUseRelay,
  useUserSingleHopOnly,
  useUserSlippageTolerance,
  useUserTransactionTTL,
} from "../../state/user/hooks";
import {
  useModalOpen,
  useToggleSettingsMenu,
} from "../../state/application/hooks";

import { ApplicationModal } from "../../state/application/actions";
import Button from "../Button";
import Modal from "../Modal";
import ModalHeader from "../ModalHeader";
import QuestionHelper from "../QuestionHelper";
import { Settings } from "react-feather";
import Toggle from "../Toggle";
import TransactionSettings from "../TransactionSettings";
import Typography from "../Typography";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

const StyledMenuIcon = styled(Settings)`
  height: 20px;
  width: 20px;

  > * {
    stroke: currentColor;
  }

  :hover {
    opacity: 0.7;
  }
`;

export default function SettingsTab() {
  const { i18n } = useLingui();

  const node = useRef<HTMLDivElement>(null);
  const open = useModalOpen(ApplicationModal.SETTINGS);
  const toggle = useToggleSettingsMenu();

  const theme = useContext(ThemeContext);
  const [userSlippageTolerance, setUserslippageTolerance] =
    useUserSlippageTolerance();

  const [ttl, setTtl] = useUserTransactionTTL();

  const [expertMode, toggleExpertMode] = useExpertModeManager();

  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly();

  // show confirmation view before turning on
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [userUseArcher, setUserUseArcher] = useUserArcherUseRelay();

  useOnClickOutside(node, open ? toggle : undefined);

  return (
    <StyledMenu ref={node}>
      <StyledMenuButton onClick={toggle} id="open-settings-dialog-button">
        {/* <StyledMenuIcon /> */}
        {/* {expertMode ? (
                    <EmojiWrapper>
                        <span role="img" aria-label="wizard-icon">
                            🧙
                        </span>
                    </EmojiWrapper>
                ) : null} */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 transform rotate-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </StyledMenuButton>
      {open && (
        <div className="absolute top-12 right-0 z-50 -mr-2.5 min-w-20 md:m-w-22 md:-mr-5 bg-dark-900 rounded">
          <div className="p-8 space-y-4">
            <Typography variant="h3" className="text-high-emphesis">
              {i18n._(t`Transaction Settings`)}
            </Typography>

            <TransactionSettings
              rawSlippage={userSlippageTolerance}
              setRawSlippage={setUserslippageTolerance}
              deadline={ttl}
              setDeadline={setTtl}
              useArcher={userUseArcher}
              setUseArcher={setUserUseArcher}
            />

            <Typography variant="body" className="text-high-emphesis">
              {i18n._(t`Interface Settings`)}
            </Typography>

            <RowBetween>
              <RowFixed>
                <Typography variant="caption2" className="text-high-emphesis">
                  {i18n._(t`Toggle Expert Mode`)}
                </Typography>
                <QuestionHelper
                  text={i18n._(
                    t`Bypasses confirmation modals and allows high slippage trades. Use at your own risk.`
                  )}
                />
              </RowFixed>
              <Toggle
                id="toggle-expert-mode-button"
                isActive={expertMode}
                toggle={
                  expertMode
                    ? () => {
                        toggleExpertMode();
                        setShowConfirmation(false);
                      }
                    : () => {
                        toggle();
                        setShowConfirmation(true);
                      }
                }
              />
            </RowBetween>
            <RowBetween>
              <RowFixed>
                <Typography variant="caption2" className="text-high-emphesis">
                  {i18n._(t`Disable Multihops`)}
                </Typography>
                <QuestionHelper
                  text={i18n._(t`Restricts swaps to direct pairs only.`)}
                />
              </RowFixed>
              <Toggle
                id="toggle-disable-multihop-button"
                isActive={singleHopOnly}
                toggle={() =>
                  singleHopOnly
                    ? setSingleHopOnly(false)
                    : setSingleHopOnly(true)
                }
              />
            </RowBetween>
          </div>
        </div>
      )}

      <Modal
        isOpen={showConfirmation}
        onDismiss={() => setShowConfirmation(false)}
      >
        <div className="space-y-4">
          <ModalHeader
            title={i18n._(t`Are you sure?`)}
            onClose={() => setShowConfirmation(false)}
          />
          <Typography variant="body">
            {i18n._(t`Expert mode turns off the confirm transaction prompt and allows high slippage trades
                                that often result in bad rates and lost funds.`)}
          </Typography>
          <Typography variant="caption" className="font-medium">
            {i18n._(t`ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.`)}
          </Typography>
          <Button
            color="red"
            size="lg"
            onClick={() => {
              if (
                window.prompt(
                  i18n._(
                    t`Please type the word "confirm" to enable expert mode.`
                  )
                ) === "confirm"
              ) {
                toggleExpertMode();
                setShowConfirmation(false);
              }
            }}
          >
            <Typography variant="body" id="confirm-expert-mode">
              {i18n._(t`Turn On Expert Mode`)}
            </Typography>
          </Button>
        </div>
      </Modal>
    </StyledMenu>
  );
}
