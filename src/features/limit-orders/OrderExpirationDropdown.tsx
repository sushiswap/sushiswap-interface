import { FC, useCallback, useRef } from "react";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/macro";
import QuestionHelper from "../../components/QuestionHelper";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state";
import { setOrderExpiration } from "../../state/limit-order/actions";
import { useLimitOrderState } from "../../state/limit-order/hooks";
import useToggle from "../../hooks/useToggle";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

const OrderExpirationDropdown: FC = () => {
  const { i18n } = useLingui();
  const dispatch = useDispatch<AppDispatch>();
  const { orderExpiration } = useLimitOrderState();
  const items = {
    never: i18n._(t`Never`),
    hour: i18n._(t`1 Hour`),
    day: i18n._(t`24 Hours`),
    week: i18n._(t`1 Week`),
    month: i18n._(t`30 Days`),
  };

  const [open, toggle] = useToggle(false);
  const node = useRef<HTMLDivElement>();
  useOnClickOutside(node, open ? toggle : undefined);

  const handler = useCallback(
    (e, item) => {
      e.stopPropagation();
      toggle();
      dispatch(setOrderExpiration(item));
    },
    [dispatch, toggle]
  );

  return (
    <>
      <div
        ref={node}
        className="flex items-center text-secondary gap-3 cursor-pointer"
        onClick={toggle}
      >
        <div className="flex flex-row items-center">
          <span className="">{i18n._(t`Order Expiration`)}:</span>
          <QuestionHelper text="test" />
        </div>
        <div className="relative">
          <div className="flex border border-dark-800 rounded divide-x divide-dark-800">
            <div className="text-sm text-primary flex h-10 items-center pl-3 min-w-[80px]">
              {items[orderExpiration]}
            </div>
            <div className="flex h-10 items-center justify-center w-9 font-bold">
              <ChevronDownIcon width={16} height={16} strokeWidth={2} />
            </div>
          </div>
          <div
            className={`w-full absolute overflow-hidden right-0 lg:top-12 lg:bottom-[unset] bottom-12 p-3 gap-2 ${
              open ? "flex flex-col" : "hidden"
            } z-10 bg-dark-700 rounded`}
          >
            {Object.entries(items).map(([k, v]) => (
              <div
                key={k}
                className={`${
                  `${orderExpiration}` === `${k}`
                    ? "text-high-emphesis"
                    : "text-secondary"
                } flex w-full font-bold cursor-pointer hover:text-white`}
                onClick={(e) => handler(e, k)}
              >
                {v}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderExpirationDropdown;
