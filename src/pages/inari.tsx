import React from 'react';
import Head from 'next/head';
import { useLingui } from '@lingui/react';
import { t } from '@lingui/macro';
import { ChainId } from '@sushiswap/sdk';

import useActiveWeb3React from '../hooks/useActiveWeb3React';
import useInari from '../hooks/useInari';
import Layout from '../layouts/DefaultLayout';
import InariPanel from '../components/Inari/InariPanel';
import { useTokenBalance } from '../state/wallet/hooks';
import { SUSHI, XSUSHI, AXSUSHI, CRXSUSHI } from '../constants';

export default function Inari() {
  const { i18n } = useLingui();
  const { account } = useActiveWeb3React();

  const { INARI_ADDRESS, sushiAllowance, approveSushi, stakeSushiToBento,
    bentoAllowance, approveBento, unstakeSushiFromBento } = useInari();

  const sushiBalance = useTokenBalance(
    account ?? undefined,
    SUSHI[ChainId.MAINNET]
  );
  const xSushiBalance = useTokenBalance(account ?? undefined, XSUSHI);
  const crXSushiBalance = useTokenBalance(account ?? undefined, CRXSUSHI);
  const aXSushiBalance = useTokenBalance(account ?? undefined, AXSUSHI);

  return (
    <Layout>
      <Head>
        <title>{i18n._(t`Inari`)} | Sushi</title>
        <meta name="description" content="Inari" />
      </Head>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-6xl w-full">
        <div className="relative w-full max-w-lg rounded bg-dark-900">
          <InariPanel
            APPROVAL_ADDRESS={INARI_ADDRESS}
            stakeApprove={approveSushi}
            stakeAllowance={sushiAllowance}
            stake={stakeSushiToBento}
            stakeTitle="SUSHI → xSUSHI → BENTO"
            srcTokenBalance={sushiBalance}
            unstakeApprove={approveBento}
            unstakeAllowance={bentoAllowance}
            unstake={unstakeSushiFromBento}
            unstakeTitle="BENTO → xSUSHI → SUSHI"
            dstTokenSymbol="xSUSHI"
            dstTokenBalance={xSushiBalance}
          />
        </div>
        <div className="relative w-full max-w-lg rounded bg-dark-900">
          <InariPanel
            APPROVAL_ADDRESS={INARI_ADDRESS}
            stakeApprove={approveSushi}
            stakeAllowance={sushiAllowance}
            stake={stakeSushiToBento}
            stakeTitle="SUSHI → xSUSHI → AAVE"
            srcTokenBalance={sushiBalance}
            unstakeApprove={approveBento}
            unstakeAllowance={bentoAllowance}
            unstake={unstakeSushiFromBento}
            unstakeTitle="AAVE → xSUSHI → SUSHI"
            dstTokenSymbol="aXSUSHI"
            dstTokenBalance={aXSushiBalance}
          />
        </div>
        <div className="relative w-full max-w-lg rounded bg-dark-900">
          <InariPanel
            APPROVAL_ADDRESS={INARI_ADDRESS}
            stakeApprove={approveSushi}
            stakeAllowance={sushiAllowance}
            stake={stakeSushiToBento}
            stakeTitle="SUSHI → xSUSHI → CREAM → BENTO"
            srcTokenBalance={sushiBalance}
            unstakeApprove={approveBento}
            unstakeAllowance={bentoAllowance}
            unstake={unstakeSushiFromBento}
            unstakeTitle="BENTO → CREAM → xSUSHI → SUSHI"
            dstTokenSymbol="crXSUSHI"
            dstTokenBalance={crXSushiBalance}
          />
        </div>
        <div className="relative w-full max-w-lg rounded bg-dark-900">
          <InariPanel
            APPROVAL_ADDRESS={INARI_ADDRESS}
            stakeApprove={approveSushi}
            stakeAllowance={sushiAllowance}
            stake={stakeSushiToBento}
            stakeTitle="SUSHI → xSUSHI → CREAM"
            srcTokenBalance={sushiBalance}
            unstakeApprove={approveBento}
            unstakeAllowance={bentoAllowance}
            unstake={unstakeSushiFromBento}
            unstakeTitle="CREAM → xSUSHI → SUSHI"
            dstTokenSymbol="crXSUSHI"
            dstTokenBalance={crXSushiBalance}
          />
        </div>
      </div>
    </Layout>
  );
}