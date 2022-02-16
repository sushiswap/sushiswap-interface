// @ts-ignore
import ENS from '@ensdomains/ensjs'
import { isAddress } from '@ethersproject/address'
import { namehash } from '@ethersproject/hash'
import { providers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'

import { isZero } from '../functions'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useENSRegistrarContract, useENSResolverContract } from './useContract'
import useDebounce from './useDebounce'
const NOM_REGISTRY_ADDRESS = '0x3DE51c3960400A0F752d3492652Ae4A0b2A36FB3'

/**
 * Does a reverse lookup for an address to find its ENS name.
 * Note this is not the same as looking up an ENS name to find an address.
 */
export default function useENSName(address?: string): {
  ENSName: string | null
  nom: string | null
  loading: boolean
} {
  const debouncedAddress = useDebounce(address, 200)
  const provider = new providers.JsonRpcProvider('https://forno.celo.org')
  const [nom, setNom] = useState<string | null>(null)

  const ensNodeArgument = useMemo(() => {
    if (!debouncedAddress || !isAddress(debouncedAddress)) return [undefined]
    try {
      return debouncedAddress ? [namehash(`${debouncedAddress.toLowerCase().substr(2)}.addr.reverse`)] : [undefined]
    } catch (error) {
      return [undefined]
    }
  }, [debouncedAddress])

  useEffect(() => {
    ;(async () => {
      const nom = new ENS({ provider, ensAddress: NOM_REGISTRY_ADDRESS })
      try {
        const { name } = await nom.getName(address)
        if (name) setNom(`${name}.nom`)
      } catch (e) {
        console.error('Could not fetch nom data', e)
      }
    })()
  }, [address, provider])
  const registrarContract = useENSRegistrarContract(false)
  const resolverAddress = useSingleCallResult(registrarContract, 'resolver', ensNodeArgument)
  const resolverAddressResult = resolverAddress.result?.[0]
  const resolverContract = useENSResolverContract(
    resolverAddressResult && !isZero(resolverAddressResult) ? resolverAddressResult : undefined,
    false
  )
  const name = useSingleCallResult(resolverContract, 'name', ensNodeArgument)

  const changed = debouncedAddress !== address
  return {
    ENSName: changed ? null : name.result?.[0] ?? null,
    nom,
    loading: changed || resolverAddress.loading || name.loading,
  }
}
