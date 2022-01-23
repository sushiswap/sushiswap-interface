import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Feature } from 'app/enums'
import { featureEnabled } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useMemo } from 'react'

export interface MenuItemLeaf {
  key: string
  title: string
  link: string
}

export interface MenuItemNode {
  key: string
  title: string
  items: MenuItemLeaf[]
}

export type MenuItem = MenuItemLeaf | MenuItemNode
export type Menu = MenuItem[]

type UseMenu = () => Menu
const useMenu: UseMenu = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!chainId) return []

    // By default show just a swap button
    let tradeMenu: MenuItem = {
      key: 'swap',
      title: i18n._(t`Swap`),
      link: '/swap',
    }

    // If limit orders is enabled, replace swap button with a submenu under trade
    if (featureEnabled(Feature.LIMIT_ORDERS, chainId)) {
      tradeMenu = {
        key: 'trade',
        title: i18n._(t`Trade`),
        items: [
          {
            key: 'swap',
            title: i18n._(t`Swap`),
            link: '/swap',
          },
          {
            key: 'limit',
            title: i18n._(t`Limit order`),
            link: '/limit',
          },
        ],
      }
    }

    const poolMenu = [
      {
        key: 'browse',
        title: i18n._(t`Browse`),
        link: '/pool',
      },
      {
        key: 'farm',
        title: i18n._(t`Farm`),
        link: '/farm',
      },
    ]

    if (featureEnabled(Feature.MIGRATE, chainId)) {
      poolMenu.push({
        key: 'migrate',
        title: i18n._(t`Migrate`),
        link: '/migrate',
      })
    }

    const exploreMenu: MenuItemLeaf[] = []
    if (featureEnabled(Feature.VESTING, chainId)) {
      exploreMenu.push({
        key: 'stake',
        title: i18n._(t`xSUSHI`),
        link: '/stake',
      })
    }

    if (featureEnabled(Feature.MEOWSHI, chainId)) {
      exploreMenu.push({
        key: 'meowshi',
        title: i18n._(t`Meowshi`),
        link: '/tools/meowshi',
      })
    }

    if (featureEnabled(Feature.MEOWSHI, chainId)) {
      exploreMenu.push({
        key: 'yield',
        title: i18n._(t`Yield Strategies`),
        link: '/tools/inari',
      })
    }

    const mainItems: Menu = [
      tradeMenu,
      {
        key: 'balances',
        title: i18n._(t`Portfolio`),
        link: '/balances',
      },
    ]

    if (poolMenu.length > 0)
      mainItems.push({
        key: 'pool',
        title: i18n._(t`Pool`),
        items: poolMenu,
      })

    if (exploreMenu.length > 0)
      mainItems.push({
        key: 'explore',
        title: i18n._(t`Explore`),
        items: exploreMenu,
      })

    if (featureEnabled(Feature.KASHI, chainId)) {
      mainItems.push({
        key: 'lending',
        title: i18n._(t`Lending`),
        items: [
          {
            key: 'lend',
            title: i18n._(t`Lend`),
            link: '/lend',
          },
          {
            key: 'borrow',
            title: i18n._(t`Borrow`),
            link: '/borrow',
          },
          {
            key: 'kashi',
            title: i18n._(t`Kashi Farms`),
            link: '/farm?filter=kashi',
          },
        ],
      })
    }

    if (featureEnabled(Feature.MISO, chainId)) {
      mainItems.push({
        key: 'launchpad',
        title: i18n._(t`Launchpad`),
        items: [
          {
            key: 'marketplace',
            title: i18n._(t`Marketplace`),
            link: '/miso',
          },
          {
            key: 'factory',
            title: i18n._(t`Factory`),
            link: '/miso/auction',
          },
        ],
      })
    }

    return mainItems.filter((el) => Object.keys(el).length > 0)
  }, [chainId, i18n])
}

export default useMenu
