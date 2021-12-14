import { Dappeteer } from '@chainsafe/dappeteer'
import { Page } from 'puppeteer'

export abstract class AppPage {
  protected URL: string
  protected Page: Page
  protected Metamask: Dappeteer

  protected WalletConnectSelector: string = '#connect-wallet'
  protected WalletOptionMetamaskSelector: string = '#wallet-option-MetaMask'

  constructor(page: Page, metamask: Dappeteer, url: string = '') {
    this.Page = page
    this.URL = url
    this.Metamask = metamask
  }

  public async navigateTo(): Promise<Page> {
    await this.bringToFront()
    if (this.URL) {
      await this.Page.goto(this.URL)
    } else {
      console.warn('Page has no URL and cannot be navigated to')
    }
    return this.Page
  }

  public async bringToFront(): Promise<Page> {
    await this.Page.bringToFront()
    return this.Page
  }

  public async evaluateAndClick(btnSelector: string): Promise<void> {
    await this.Page.evaluate((selector) => {
      return document.querySelector(selector).click()
    }, btnSelector)
  }

  public async connectMetamaskWallet(): Promise<void> {
    const btnConnectWallet = await this.Page.waitForSelector(this.WalletConnectSelector)
    await btnConnectWallet.click()

    const metamaskButton = await this.Page.waitForSelector(this.WalletOptionMetamaskSelector)
    await metamaskButton.click()
    await this.Metamask.approve()
    await this.bringToFront()
  }

  public async addTokenToMetamask(tokenAddress: string): Promise<void> {
    await await this.blockingWait(2)
    await this.Metamask.page.bringToFront()

    await this.closeMetamaskWhatsNew()

    const addTokenButton = await this.Metamask.page.waitForSelector('.add-token-button > button')
    await addTokenButton.click()

    const addressInput = await this.Metamask.page.waitForSelector('#custom-address')
    addressInput.type(tokenAddress)

    await this.Metamask.page.waitForTimeout(4000)

    this.Metamask.page.waitForSelector(`button[data-testid='page-container-footer-next']:not([disabled])`)
    const nextButton = await this.Metamask.page.waitForSelector(`button[data-testid='page-container-footer-next']`)
    await nextButton.click()

    const buttons = await this.Metamask.page.$$('footer > button')
    await buttons[1].click()

    await this.Metamask.page.reload()
  }

  public async getTokenBalance(tokenSymbol: string): Promise<number> {
    await this.Metamask.page.bringToFront()
    await this.Metamask.page.waitForTimeout(1000)

    const assetMenutButton = await this.Metamask.page.waitForSelector(`li[data-testid="home__asset-tab"]`)
    await assetMenutButton.click()
    await this.blockingWait(1)

    const assetListItems = await this.Metamask.page.$$('.asset-list-item__token-button')

    for (let index = 0; index < assetListItems.length; index++) {
      const assetListItem = assetListItems[index]

      const titleAttributeValue: string = await this.Metamask.page.evaluate(
        (item) => item.getAttribute('title'),
        assetListItem
      )

      if (titleAttributeValue.split(' ')[1].toUpperCase() === tokenSymbol.toUpperCase()) {
        const balance = titleAttributeValue.split(' ')[0]
        this.Page.bringToFront()
        return parseFloat(balance)
      }
    }

    return 0
  }

  public async closeMetamaskWhatsNew(): Promise<void> {
    await this.Metamask.page.waitForTimeout(1000)
    const closeWhatsNewButton = await this.Metamask.page.$(
      '#popover-content > div > div > section > header > div > button'
    )
    if (closeWhatsNewButton) {
      await closeWhatsNewButton.click()
    }
  }

  public async confirmMetamaskTransaction(): Promise<void> {
    await this.blockingWait(4)

    await this.Metamask.confirmTransaction()

    // Try to confirm transaction again
    try {
      await this.Metamask.confirmTransaction()
      await this.Metamask.page.waitForTimeout(500)

      //Check if we're still at confirm transaction page. When gas estimation takes longer initial confirm does not work
      const mmFooterButtons = await this.Metamask.page.$$('footer > button')
      if (mmFooterButtons && mmFooterButtons[1]) {
        const confirmButton = mmFooterButtons[1]
        await confirmButton.click()
      }
    } catch (error) {}

    await this.blockingWait(1)
    await this.Page.bringToFront()
    await this.blockingWait(1)
  }

  public async blockingWait(seconds) {
    var waitTill = new Date(new Date().getTime() + seconds * 1000)
    while (waitTill > new Date()) {}
  }
}
