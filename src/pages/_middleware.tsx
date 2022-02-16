import { ChainId } from '@sushiswap/core-sdk'
import { DEFAULT_CHAIN_ID, subdomainToChainIdMap } from 'app/constants/subdomainChainMap'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const parseChainIdFromSubdomain = (host: ReturnType<Headers['get']>): ChainId => {
  const subdomain = host?.split('.')[0]
  const chainIdStr = subdomain ? subdomainToChainIdMap[subdomain] : undefined
  return chainIdStr ? parseInt(chainIdStr) : DEFAULT_CHAIN_ID
}

export function middleware(req: NextRequest) {
  const cookieSetChainId: string | undefined = req.cookies['chain-id']
  const subdomainSetChainId = parseChainIdFromSubdomain(req.headers.get('host'))

  const response = NextResponse.next()

  const subdomainMatchesCookie = cookieSetChainId && parseInt(cookieSetChainId) === subdomainSetChainId
  if (subdomainMatchesCookie) {
    return response
  } else {
    response.cookie('chain-id', subdomainSetChainId.toString())
    return response
  }
}
