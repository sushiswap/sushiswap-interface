import { ChainId } from '@sushiswap/sdk';
import { useEffect, useState } from 'react';
import { ARCHER_GAS_URI } from '../constants';
import useActiveWeb3React from './useActiveWeb3React';

type T = Record<string, string>;

export default function useArcherMinerTips(): { status: string, data: T } {
  const { chainId } = useActiveWeb3React()
  const [status, setStatus] = useState<string>('idle');
  const [data, setData] = useState<T>({
    "immediate": "2000000000000",
    "rapid": "800000000000",
    "fast": "300000000000",
    "standard": "140000000000",
    "slow": "100000000000",
    "slower": "70000000000",
    "slowest": "60000000000"
  });

  useEffect(() => {
      const fetchData = async () => {
          setStatus('fetching');
          const response = await fetch(ARCHER_GAS_URI[ChainId.MAINNET], {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Referrer-Policy': 'no-referrer'
            }
          });
          const json = await response.json();
          setData(json.data as T);
          setStatus('fetched');
      };
      if (chainId == ChainId.MAINNET)
        fetchData();
  }, []);

  return { status, data };
};
