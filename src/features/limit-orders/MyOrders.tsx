import React, { FC } from "react";
import Badge from "../../components/Badge";
import useLimitOrders from "../../hooks/useLimitOrders";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/macro";
import NavLink from "../../components/NavLink";

const MyOrders: FC = () => {
  const { i18n } = useLingui();
  const { pending } = useLimitOrders();

  return (
    <NavLink href="/open-orders">
      <a className="md:flex hidden gap-3 items-center text-secondary hover:text-high-emphesis">
        <div>{i18n._(t`My Orders`)}</div>
        <Badge color="blue">{pending.length}</Badge>
      </a>
    </NavLink>
  );
};

export default MyOrders;
