import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

enum ChainName {
  ETHEREUM = 'ethereum',
  ROPSTEN = 'ropsten',
  RINKEBY = 'rinkeby',
  GÖRLI = 'gorli',
  KOVAN = 'kovan',
  POLYGON = 'polygon',
  FANTOM = 'fantom',
  GNOSIS = 'gnosis',
  BSC = 'bsc',
  ARBITRUM = 'arbitrum',
  AVALANCHE = 'avalanche',
  HECO = 'heco',
  HARMONY = 'harmony',
  OKEX = 'okex',
  CELO = 'celo',
  PALM = 'palm',
  MOONRIVER = 'moonriver',
  FUSE = 'fuse',
  TELOS = 'telos',
}

const SUBDOMAIN_CHAIN_ID: { [subdomain: string]: string } = {
  ethereum: '1',
  ropsten: '3',
  rinkeby: '4',
  gorli: '5',
  kovan: '42',
  polygon: '137',
  bsc: '56',
  fantom: '250',
  gnosis: '100',
  arbitrum: '42161',
  avalanche: '43114',
  heco: '128',
  harmony: '1666600000',
  okex: '66',
  celo: '42220',
  palm: '11297108109',
  moonriver: '1285',
  fuse: '122',
  telos: '40',
}

const DEFAULT_CHAIN_ID = '1'

export function middleware(req: NextRequest) {
  // const response = NextResponse.next()

  const chainId = req.cookies['chain-id']

  const subdomain = req.headers.get('host')?.split('.')[0]

  const res = NextResponse.next()

  // If chainId already set and no subdomain, just return...
  if (chainId && !subdomain) {
    return res
  }

  // set the `cookie`
  res.cookie(
    'chain-id',
    subdomain && subdomain in SUBDOMAIN_CHAIN_ID ? SUBDOMAIN_CHAIN_ID[subdomain] : DEFAULT_CHAIN_ID
  )

  // return the res
  return res
}
