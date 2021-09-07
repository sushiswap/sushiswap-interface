import Gun from 'gun/gun'
import SEA from 'gun/sea'
import React, { createContext, useContext, useMemo, useCallback, useState, useEffect, FC } from 'react'
import { useActiveWeb3React } from '../../hooks'
import schema from './schema.json'
import Ajv from 'ajv'
import { LimitOrder } from '@sushiswap/sdk'

const validate = new Ajv({ allErrors: true }).compile(schema)

export const GunContext = createContext({
  broadcast: (_: any) => {},
  data: {},
})

const gun = Gun(['https://my-gun-db-test.herokuapp.com/gun', 'https://mvp-gun.herokuapp.com/gun'])

export const GunProvider: FC = ({ children }) => {
  const { account, chainId } = useActiveWeb3React()
  const metaTx = gun.get(`#SushiSwap${account}${chainId}`)
  const [data, setData] = useState({ [account]: {} })

  // Listener
  useEffect(() => {
    if (!metaTx) return

    metaTx.map().on((raw: string, id: string) => {
      try {
        const tx = JSON.parse(raw)
        if (tx && validate(tx)) {
          setData((prevState) => ({
            ...prevState,
            [account]: {
              ...prevState[account],
              [id]: LimitOrder.getLimitOrder(tx),
            },
          }))
        }
      } catch (e) {
        console.log(e)
      }
    })

    return () => metaTx.map().off()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId])

  const broadcast = useCallback(
    async (raw) => {
      if (!metaTx) return

      const data = JSON.stringify(raw)
      const hash = await SEA.work(data, null, null, { name: 'SHA-256' })
      metaTx.get(`${new Date().toISOString()}#${hash}`).put(data as never)
    },
    [metaTx]
  )

  return (
    <GunContext.Provider
      value={useMemo(() => ({ broadcast, data: data[account] || {} }), [account, broadcast, chainId, data])}
    >
      {children}
    </GunContext.Provider>
  )
}

export const useGun = () => useContext(GunContext)
