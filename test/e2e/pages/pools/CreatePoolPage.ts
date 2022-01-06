import { Dappeteer } from '@chainsafe/dappeteer'
import { Page } from 'puppeteer'

import { AppPage } from '../AppPage'
import { CurrencySelectComponent } from '../shared/CurrencySelectComponent'

export class CreatePoolPage extends AppPage {
  // Page components
  private CurrencySelectModal: CurrencySelectComponent

  // Page selectors
  private ClassicContinueButtonSelector: string = '#btn-classic-continue'
  private ClassicWithdrawFromSelector: string = '#switch-classic-withdraw-from-'
  private PoolTypeButtonSelector: string = '#pool-select-'
  private TokenSelectTriggerSelector: string = '.token-select-trigger'
  private TokenAmountInputSelector: string = '.swap-panel-input input'
  private FeeTierSelector: string = '#fee-tier-'
  private ApproveButtonSelector: string = '#btn-approve'

  constructor(page: Page, metamask: Dappeteer, baseUrl: string) {
    super(page, metamask, baseUrl)

    this.CurrencySelectModal = new CurrencySelectComponent(page)
  }

  public async setAssetAAmountIn(amountIn: string): Promise<void> {
    await this.setAssetAmountIn(amountIn, 0)
  }

  public async setAssetBAmountIn(amountIn: string): Promise<void> {
    await this.setAssetAmountIn(amountIn, 1)
  }

  public async setPoolFee(fee: number): Promise<void> {
    const feeTierButton = await this.Page.waitForSelector(this.FeeTierSelector + fee)
    await feeTierButton.click()
  }

  public async confirmCreate(): Promise<void> {
    // Check if there is a approve button and approve if exists
    let approveButton = await this.Page.$(this.ApproveButtonSelector)
    while (approveButton) {
      await approveButton.click()
      await this.Metamask.confirmTransaction()
      await this.Metamask.page.waitForTimeout(1000)
      await this.bringToFront()
      approveButton = await this.Page.$(this.ApproveButtonSelector)
    }
  }

  private async setAssetAmountIn(amountIn: string, assetIndex: number): Promise<void> {
    await this.Page.waitForSelector(this.TokenAmountInputSelector)
    const tokenAmountInputs = await this.Page.$$(this.TokenAmountInputSelector)
    await tokenAmountInputs[assetIndex].type(amountIn)
  }
}
