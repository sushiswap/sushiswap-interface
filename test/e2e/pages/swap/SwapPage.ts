import { ElementHandle } from 'puppeteer'

import { AppPage } from '../AppPage'

export class SwapPage extends AppPage {
  // Main swap panel selectors
  protected TokenInputSelector: string = '.swap-panel-input input'
  protected PayFromWalletSelector: string = '.chk-pay-from-wallet'
  protected ReceiveToWalletSelector: string = '.chk-receive-to-wallet'
  protected SwapButtonSelector: string = '#swap-button'

  // Swap review modal selectors
  protected ConfirmSwapButtonSelector: string = '#review-swap-button'
  protected SwapSuccessIconSelector: string = '#swap-success-icon'

  // Token selector & currency select dialog selectors
  protected InTokenButtonSelector: string = '#asset-select-trigger-0'
  protected OutTokenButtonSelector: string = '#asset-select-trigger-1'
  protected SelectTokenInputSelector: string = '#txt-select-token'
  protected AllCurrenciesListSelector: string = '#all-currencies-list'
  protected SelectTokenResultsSelector: string = '#all-currencies-'

  public async swapTokens(
    inTokenSymbol: string,
    outTokenSymbol: string,
    inTokenAmount: string,
    payFromWallet: boolean,
    receiveToWallet: boolean
  ): Promise<void> {
    const inputTokenButton = await this.Page.waitForSelector(this.InTokenButtonSelector)
    await inputTokenButton.click()
    await this.selectToken(inTokenSymbol)

    await this.Page.waitForTimeout(500)
    const outputTokenButton = await this.Page.waitForSelector(this.OutTokenButtonSelector)
    await outputTokenButton.click()
    await this.selectToken(outTokenSymbol)

    await this.Page.waitForTimeout(500)
    const tokenAmountInput = await this.Page.waitForSelector(this.TokenInputSelector)
    await tokenAmountInput.type(inTokenAmount)

    const isPayFromWalletChecked = await this.isSwitchChecked(this.PayFromWalletSelector)
    const payFromWalletSwitch = await this.getSwitchElement(this.PayFromWalletSelector)
    if (payFromWallet && !isPayFromWalletChecked) {
      await payFromWalletSwitch.click()
    } else if (!payFromWallet && isPayFromWalletChecked) {
      await payFromWalletSwitch.click()
    }

    const isReceiveToWalletChecked = await this.isSwitchChecked(this.ReceiveToWalletSelector)
    const receiveToWalletSwitch = await this.getSwitchElement(this.ReceiveToWalletSelector)
    if (receiveToWallet && !isReceiveToWalletChecked) {
      await receiveToWalletSwitch.click()
    } else if (!receiveToWallet && isReceiveToWalletChecked) {
      await receiveToWalletSwitch.click()
    }

    await this.blockingWait(1)
    const swapButon = await this.Page.waitForSelector(this.SwapButtonSelector)
    await swapButon.click()

    await this.blockingWait(1)
    const confirmSwapButton = await this.Page.waitForSelector(this.ConfirmSwapButtonSelector)
    await confirmSwapButton.click()

    await this.confirmMetamaskTransaction()

    await this.Page.waitForSelector(this.SwapSuccessIconSelector)
  }

  private async selectToken(tokenSymbol: string): Promise<void> {
    await this.Page.waitForSelector(this.AllCurrenciesListSelector)
    await this.blockingWait(2)

    const nativeTokenButton = await this.Page.$(this.SelectTokenResultsSelector + tokenSymbol)
    if (nativeTokenButton) {
      await this.blockingWait(2)
      await nativeTokenButton.click()
    } else {
      const selectTokenInput = await this.Page.waitForSelector(this.SelectTokenInputSelector)
      selectTokenInput.type(tokenSymbol)
      await this.blockingWait(2)

      const tokenButton = await this.Page.$(this.SelectTokenResultsSelector + tokenSymbol)
      await tokenButton.click()
    }
  }

  private async getSwitchElement(switchId: string): Promise<ElementHandle<Element>> {
    await this.Page.waitForSelector(switchId)
    const switchElement = await this.Page.$(switchId)

    const buttonElement = (await switchElement.$x('..'))[0]
    if (!buttonElement) {
      throw new Error(`Switch with id ${switchId} not found on the swap page. Check selector is valid.`)
    }

    return buttonElement
  }

  private async isSwitchChecked(switchId: string): Promise<boolean> {
    let checked: boolean

    const checkedValue = await this.Page.$eval(switchId, (button) => button.getAttribute('aria-checked'))
    checked = checkedValue === 'true'

    return checked
  }
}
