// TODO / Note (amiller68): #SdkChange /#SdkPublish
import { NATIVE } from '@figswap/core-sdk'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import config from 'app/config'
import { Feature } from 'app/enums'
import { featureEnabled } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { ReactNode, useMemo } from 'react'

// Use this struct to define menu items (lead to pages)
export interface MenuItemLeaf {
  key: string
  title: string
  link?: string
  action?: () => void // Only really used by the collapse button
  icon?: ReactNode // Get rendered in the Mobile sidebar if set
  disabled?: boolean
}

// Use this struct to define menu items (lead to dropdowns)
export interface MenuItemNode {
  key: string
  title: string
  items?: MenuItemLeaf[]
  icon?: ReactNode // Get rendered in the Mobile sidebar if set
  disabled?: boolean
}

export type MenuItem = MenuItemLeaf | MenuItemNode
export type Menu = MenuItem[]

type UseMenu = (collapse?: () => void) => Menu
const useMenu: UseMenu = (collapse?: () => void) => {
  const { i18n } = useLingui()
  const { chainId, account } = useActiveWeb3React()
  const nativeSymbol = useMemo(() => {
    let symbol = NATIVE[chainId ?? config.defaultChainId].symbol
    return symbol ?? 'undefined'
  }, [chainId])

  return useMemo(() => {
    if (!chainId) return []

    const menu: Menu = []

    /* Menu Population */

    // Trade menu Node (Swap)
    menu.push({
      key: 'swap',
      title: i18n._(t`Swap`),
      link: '/swap',
    })

    // Liquidity menu Node (Pool, Add)
    menu.push({
      key: 'pool',
      title: i18n._(t`Pool`),
      link: '/pool',
    })

    // TODO: Add Farming Product Menu Node here

    // Explore menu Node (Support, Feedback)
    menu.push({
      key: 'support',
      title: i18n._(t`Support`),
      // TODO (amiller68): Link to support page
      link: '',
    })

    // Analytics menu Node (Dashboard, Tokens, Pools)
    if (featureEnabled(Feature.ANALYTICS, chainId)) {
      menu.push({
        key: 'analytics',
        title: i18n._(t`Analytics`),
        link: '/analytics',
      })
    }

    if (account) {
      menu.push({
        key: 'portfolio',
        title: i18n._(t`Portfolio`),
        link: '/account',
      })
    }

    // If this is a mobile menu, add a collapse button
    if (collapse !== undefined) {
      menu.push({
        key: '•',
        title: `•••`,
        action: collapse,
      })
    }

    return menu.filter((el) => Object.keys(el).length > 0)
  }, [account, chainId, i18n, collapse])
}

export default useMenu
