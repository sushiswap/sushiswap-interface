import useSWR, { SWRResponse } from "swr";

import React from "react";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";

function Gas() {
  const { i18n } = useLingui();
  const { data, error }: SWRResponse<{ average: number }, Error> = useSWR(
    "https://ethgasstation.info/api/ethgasAPI.json?",
    (url) => fetch(url).then((r) => r.json())
  );

  if (error) return <div>{i18n._(t`failed to load`)}</div>;
  if (!data) return <div>{i18n._(t`loading...`)}</div>;

  return <div>{data.average / 10}</div>;
}

export default Gas;
