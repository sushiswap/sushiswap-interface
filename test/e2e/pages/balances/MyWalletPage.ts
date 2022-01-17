import { Dappeteer } from '@chainsafe/dappeteer'
import { Page } from 'puppeteer'

import { AppPage } from '../AppPage'
import { AssetBalancesComponent } from './AssetBalancesComponent'

export class MyWalletPage extends AppPage {
  protected Route: string = '/trident/balances/wallet'

  private BentoBoxLinkSelector = '#balances-sidebar > div[href]'

  private AssetBalances: AssetBalancesComponent

  constructor(page: Page, metamask: Dappeteer, baseUrl: string) {
    super(page, metamask, baseUrl)

    this.AssetBalances = new AssetBalancesComponent(page)
  }

  public async getWalletBalances(): Promise<Record<string, number>> {
    return await this.AssetBalances.getAssetBalances()
  }
}
