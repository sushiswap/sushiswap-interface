import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const SUBDOMAIN_CHAIN_ID: { [subdomain: string]: string } = {
  ethereum: '1',
  ropsten: '3',
  rinkeby: '4',
  gorli: '5',
  kovan: '42',
  bsc: '56',
  fantom: '250',
  polygon: '167',
  harmony: '1666600000',
  avalanche: '43114',
  okex: '66',
  gnosis: '100',
  moonriver: '1285',
  celo: '42220',
  arbitrum: '42161',
  fuse: '122',
}

const DEFAULT_CHAIN_ID = '1'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const chainId = request.cookies['chain-id']

  const subdomain = request.headers.get('host')?.split('.')[0]

  // If chainId already set and no subdomain, just return...
  if (chainId && !subdomain) {
    return response
  }

  // set the `cookie`
  response.cookie(
    'chain-id',
    !(chainId && subdomain) || !(subdomain in SUBDOMAIN_CHAIN_ID) ? DEFAULT_CHAIN_ID : SUBDOMAIN_CHAIN_ID[subdomain]
  )

  return response
}
