import "@reach/dialog/styles.css";

import { DialogContent, DialogOverlay } from "@reach/dialog";
import { animated, useSpring, useTransition } from "react-spring";
import styled, { css } from "styled-components";

import React from "react";
import { isMobile } from "react-device-detect";
import { transparentize } from "polished";
import { useGesture } from "react-use-gesture";

const AnimatedDialogOverlay = animated(DialogOverlay);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogOverlay = styled(AnimatedDialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: 10;
    background-color: transparent;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: rgba(0, 0, 0, 0.425);
  }
`;

const AnimatedDialogContent = animated(DialogContent);
// destructure to not pass custom props to Dialog DOM element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogContent = styled(
  ({ minHeight, maxHeight, mobile, isOpen, ...rest }) => (
    <AnimatedDialogContent {...rest} />
  )
).attrs({
  "aria-label": "dialog",
})`
    overflow-y: ${({ mobile }) => (mobile ? "scroll" : "hidden")};

    &[data-reach-dialog-content] {
        margin: 0 0 2rem 0;
        background-color: #000;
        box-shadow: 0 4px 8px 0 ${() => transparentize(0.95, "#000")};
        padding: 0px;
        width: 50vw;
        overflow-y: ${({ mobile }) => (mobile ? "scroll" : "hidden")};
        overflow-x: hidden;

        align-self: ${({ mobile }) => (mobile ? "flex-end" : "center")};

        max-width: 420px;

        ${({ maxHeight }) =>
          maxHeight &&
          css`
            max-height: ${maxHeight}vh;
          `}

        ${({ minHeight }) =>
          minHeight &&
          css`
            min-height: ${minHeight}vh;
          `}
            
        display: flex;
        border-radius: 10px;

        @media (min-width: 640px) {
            width: 65vw;
            margin: 0;
        }

        @media (min-width: 768px) {
            width: 85vw;
            ${({ mobile }) =>
              mobile &&
              css`
                width: 100vw;
                border-radius: 10px;
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
              `}
    }
`;

interface ModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  minHeight?: number | false;
  maxHeight?: number;
  initialFocusRef?: React.RefObject<any>;
  children?: React.ReactNode;
  padding?: number;
}

export default function Modal({
  isOpen,
  onDismiss,
  minHeight = false,
  maxHeight = 90,
  initialFocusRef,
  children,
  padding = 5,
}: ModalProps) {
  const fadeTransition = useTransition(isOpen, null, {
    config: { duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const [{ y }, set] = useSpring(() => ({
    y: 0,
    config: { mass: 1, tension: 210, friction: 20 },
  }));
  const bind = useGesture({
    onDrag: (state) => {
      set({
        y: state.down ? state.movement[1] : 0,
      });
      if (
        state.movement[1] > 300 ||
        (state.velocity > 3 && state.direction[1] > 0)
      ) {
        onDismiss();
      }
    },
  });

  return (
    <>
      {fadeTransition.map(
        ({ item, key, props }) =>
          item && (
            <StyledDialogOverlay
              key={key}
              style={props}
              onDismiss={onDismiss}
              initialFocusRef={initialFocusRef}
            >
              <StyledDialogContent
                {...(isMobile
                  ? {
                      ...bind(),
                      style: {
                        transform: y.interpolate(
                          (y) => `translateY(${y > 0 ? y : 0}px)`
                        ),
                      },
                    }
                  : {})}
                aria-label="dialog content"
                minHeight={minHeight}
                maxHeight={maxHeight}
                mobile={isMobile}
              >
                <div className="w-full p-px rounded bg-gradient-to-r from-blue to-pink">
                  <div
                    className={`flex flex-col h-full w-full bg-dark-900 rounded p-6 overflow-y-auto`}
                  >
                    {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                    {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
                    {children}
                  </div>
                </div>
              </StyledDialogContent>
            </StyledDialogOverlay>
          )
      )}
    </>
  );
}
