import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import config from 'app/config'
import { Feature } from 'app/enums'
import { featureEnabled } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { ReactNode, useMemo } from 'react'
// TODO / Note (amiller68): #SdkChange /#SdkPublish
import { NATIVE } from 'sdk'

// Use this struct to define menu items (lead to pages)
export interface MenuItemLeaf {
  key: string
  title: string
  link: string
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

type UseMenu = () => Menu
const useMenu: UseMenu = () => {
  const { i18n } = useLingui()
  const { chainId, account } = useActiveWeb3React()
  const nativeSymbol: string = useMemo(() => {
    let symbol = NATIVE[chainId ?? config.defaultChainId].symbol
    return symbol ?? 'undefined'
  }, [chainId])

  return useMemo(() => {
    if (!chainId) return []

    const menu: Menu = []

    /* Menu Item Definitions */

    // Swap pages
    const trade: MenuItemLeaf[] = [
      {
        key: 'swap',
        title: i18n._(t`Swap`),
        link: '/swap',
      },
      {
        key: 'limit',
        title: i18n._(t`Limit order`),
        link: '/limit-order',
        disabled: !featureEnabled(Feature.LIMIT_ORDERS, chainId),
      },
    ]

    // Liquidity pages
    const liquidity: MenuItemLeaf[] = [
      {
        key: 'pool',
        title: i18n._(t`Pool`),
        link: '/pool',
      },
      {
        key: 'add-liquidity',
        title: i18n._(t`Add`),
        link: `/add/${nativeSymbol}/undefined`,
      },
      // Note (amiller68): There are other ways to remove liquidity, but keeping this here for now for reference
      // {
      //   key: 'remove-liquidity',
      //   title: i18n._(t`Remove`),
      //   link: '/remove',
      // },
      // TODO (amiller68): Figure out how to import LPs
      // {
      //   key: 'import',
      //   title: i18n._(t`Import`),
      //   link: '/find',
      // },
    ]

    // Explore pages
    const explore: MenuItemLeaf[] = [
      // TODO: Link to support page
      {
        key: 'support',
        title: i18n._(t`Support`),
        link: '',
      },
      // TODO: Link to Feedback / Contact Us
      {
        key: 'Feedback',
        title: i18n._(t`Feedback`),
        link: '',
      },
    ]

    // Analytics pages (reliant on implementing subgraphs / analytics)
    const analytics: MenuItemLeaf[] = [
      {
        key: 'dashboard',
        title: 'Dashboard',
        link: `/analytics`,
      },
      {
        key: 'tokens',
        title: 'Tokens',
        link: `/analytics/tokens`,
      },
      {
        key: 'pools',
        title: 'Pools',
        link: `/analytics/pools`,
      },
    ]

    // Portfolio pages (only drops to Account info for now)
    const portfolio: MenuItemLeaf[] = [
      {
        key: 'account',
        title: i18n._(t`Account`),
        link: `/account?account=${account ?? ''}`,
      },
      // Won't work until Subgraph is implemented
      {
        key: 'liquidity',
        title: 'Liquidity',
        link: `/account/liquidity?account=${account ?? ''}`,
        disabled: !featureEnabled(Feature.SUBGRAPH, chainId),
      },
    ]

    /* Menu Population */

    // Trade menu Node (Swap)
    menu.push({
      key: 'trade',
      title: i18n._(t`Trade`),
      items: trade.filter((item) => !item?.disabled),
    })

    // Liquidity menu Node (Pool, Add)
    menu.push({
      key: 'liquidity',
      title: i18n._(t`Liquidity`),
      items: liquidity.filter((item) => !item?.disabled),
    })

    // TODO: Add Farming Product Menu Node here

    // Explore menu Node (Support, Feedback)
    menu.push({
      key: 'explore',
      title: i18n._(t`Explore`),
      items: explore.filter((item) => !item?.disabled),
    })

    // Analytics menu Node (Dashboard, Tokens, Pools)
    if (featureEnabled(Feature.ANALYTICS, chainId)) {
      menu.push({
        key: 'analytics',
        title: i18n._(t`Analytics`),
        items: analytics.filter((item) => !item?.disabled),
      })
    }

    if (account) {
      menu.push({
        key: 'portfolio',
        title: i18n._(t`Portfolio`),
        items: portfolio.filter((item) => !item?.disabled),
      })
    }

    return menu.filter((el) => Object.keys(el).length > 0)
  }, [account, chainId, i18n, nativeSymbol])
}

export default useMenu
