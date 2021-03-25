import React from 'react'
import useKashi from '../../sushi-hooks/useKashi'
//import useBentoBalances from '../../sushi-hooks/queries/useBentoBalances'
//import { BigNumber } from '@ethersproject/bignumber'
//import { useKashiPair } from 'context/kashi'

import { useActiveWeb3React } from 'hooks'

import {
  BENTOBOX_ADDRESS,
  BORING_HELPER_ADDRESS,
  KASHI_ADDRESS,
  KASHI_HELPER_ADDRESS,
  SUSHISWAP_SWAPPER_ADDRESS
} from 'kashi'

import { CLONE_ADDRESSES } from 'kashi/constants'

const TestBed = () => {
  const { chainId } = useActiveWeb3React()
  const { getPairsAddresses } = useKashi()

  getPairsAddresses()

  const sanity = {
    chainId: chainId || 1,
    BentoBox: BENTOBOX_ADDRESS,
    KashiPair: KASHI_ADDRESS,
    Swapper: SUSHISWAP_SWAPPER_ADDRESS,
    KashiHelper: KASHI_HELPER_ADDRESS[chainId || 1],
    BoringHelper: BORING_HELPER_ADDRESS,
    PairsAddress: CLONE_ADDRESSES[chainId || 1]
  }

  return (
    <>
      <div className="mx-auto w-2/5">
        <div
          style={{
            background: '#19212e',
            borderRadius: '12px',
            marginTop: '10px',
            padding: '16px',
            width: '100%',
            overflowX: 'scroll',
            fontSize: '14px'
          }}
        >
          <pre>
            <code>{JSON.stringify(sanity, null, 2)}</code>
          </pre>
        </div>
      </div>
      {/* <button
        onClick={() =>
          approveAddAsset('0x5a0625c24ddd563e758958f189fc9e52abaa9023', '0xc2118d4d90b274016cB7a54c03EF52E6c537D957', {
            value: BigNumber.from(1).mul(BigNumber.from(10).pow(18)),
            decimals: 18
          })
        }
      >
        Test
      </button> */}
    </>
  )
}

export default TestBed
