import { ElementHandle } from 'puppeteer'

import { SwapType } from '../../enums/SwapType'
import { AppPage } from '../AppPage'

export class SwapPage extends AppPage {
  // Main swap panel selectors
  protected TokenInputSelector: string = '.swap-panel-input input'
  protected PayFromWalletSelector: string = '.chk-pay-from-wallet'
  protected ReceiveToWalletSelector: string = '.chk-receive-to-wallet'
  protected SwapButtonSelector: string = '#swap-button'
  protected WrapButtonSelector: string = '#wrap-button'
  protected UseMaxButtonSelector: string = '.btn-max'
  protected BalanceLabelSelector: string = '.text-balance'
  protected SwitchCurrenciesButtonSelector: string = '#btn-switch-currencies'

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
    const swapType: SwapType = this.getSwapType(inTokenSymbol, outTokenSymbol)

    await this.selectInputToken(inTokenSymbol)
    await this.selectOutputToken(inTokenSymbol)

    await this.Page.waitForTimeout(500)
    const tokenAmountInput = await this.Page.waitForSelector(this.TokenInputSelector)
    await tokenAmountInput.type(inTokenAmount)

    await this.setPayFromWallet(payFromWallet)

    const isReceiveToWalletChecked = await this.isSwitchChecked(this.ReceiveToWalletSelector)
    const receiveToWalletSwitch = await this.getSwitchElement(this.ReceiveToWalletSelector)
    if (receiveToWallet && !isReceiveToWalletChecked) {
      await receiveToWalletSwitch.click()
    } else if (!receiveToWallet && isReceiveToWalletChecked) {
      await receiveToWalletSwitch.click()
    }

    await this.blockingWait(1)

    switch (swapType) {
      case SwapType.Wrap:
      case SwapType.Unwrap:
        const wrapButon = await this.Page.waitForSelector(this.WrapButtonSelector)
        await wrapButon.click()

        await this.blockingWait(1)
        break

      case SwapType.Normal:
      default:
        const swapButon = await this.Page.waitForSelector(this.SwapButtonSelector)
        await swapButon.click()

        await this.blockingWait(1)
        const confirmSwapButton = await this.Page.waitForSelector(this.ConfirmSwapButtonSelector)
        await confirmSwapButton.click()
        break
    }

    await this.confirmMetamaskTransaction()

    if (swapType === SwapType.Normal) {
      await this.Page.waitForSelector(this.SwapSuccessIconSelector)
    }
  }

  public async getSelectedInputToken(): Promise<string> {
    return await this.getSelectedToken(this.InTokenButtonSelector)
  }

  public async getSelectedOutputToken(): Promise<string> {
    return await this.getSelectedToken(this.OutTokenButtonSelector)
  }

  private async getSelectedToken(selector: string): Promise<string> {
    await this.blockingWait(1, true)
    await this.Page.waitForSelector(selector)
    const tokenButton = await this.Page.$(selector)
    const selectedToken = (await (await tokenButton.getProperty('textContent')).jsonValue()) as string
    return selectedToken
  }

  public async setPayFromWallet(payFromWallet: boolean): Promise<void> {
    await this.blockingWait(3, true)
    const isPayFromWalletChecked = await this.isSwitchChecked(this.PayFromWalletSelector)
    const payFromWalletSwitch = await this.getSwitchElement(this.PayFromWalletSelector)
    if (payFromWallet && !isPayFromWalletChecked) {
      await payFromWalletSwitch.click()
    } else if (!payFromWallet && isPayFromWalletChecked) {
      await payFromWalletSwitch.click()
    }
  }

  public async clickSwitchCurrenciesButton(): Promise<void> {
    await this.blockingWait(1, true)
    const switchCurrenciesButton = await this.Page.waitForSelector(this.SwitchCurrenciesButtonSelector)
    await switchCurrenciesButton.click()
    await this.blockingWait(1, true)
  }

  public async clickMaxButton(): Promise<void> {
    await this.blockingWait(3, true)
    await this.Page.waitForSelector(this.UseMaxButtonSelector)
    const useMaxButton = await this.Page.$$(this.UseMaxButtonSelector)
    await useMaxButton[1].click()
    await this.blockingWait(1, true)
  }

  public async getInputTokenBalance(): Promise<string> {
    await this.blockingWait(1, true)
    const balanceLabels = await this.Page.$$(this.BalanceLabelSelector)
    const inputTokenBalanceLabel = balanceLabels[1]

    const inTokenAmount = (await (await inputTokenBalanceLabel.getProperty('textContent')).jsonValue()) as string
    return inTokenAmount
  }

  public async getInputTokenAmount(): Promise<string> {
    await this.blockingWait(1, true)
    await this.Page.waitForSelector(this.TokenInputSelector)
    const tokenInput = await this.Page.$(this.TokenInputSelector)

    const inTokenAmount = (await (await tokenInput.getProperty('value')).jsonValue()) as string
    return inTokenAmount
  }

  public async selectInputToken(tokenSymbol: string): Promise<void> {
    await this.blockingWait(1, true)
    const inputTokenButton = await this.Page.waitForSelector(this.InTokenButtonSelector)
    await inputTokenButton.click()
    await this.selectToken(tokenSymbol)
  }

  public async selectOutputToken(tokenSymbol: string): Promise<void> {
    await this.blockingWait(1, true)
    const outputTokenButton = await this.Page.waitForSelector(this.OutTokenButtonSelector)
    await outputTokenButton.click()
    await this.selectToken(tokenSymbol)
  }

  private async selectToken(tokenSymbol: string): Promise<void> {
    await this.Page.waitForSelector(this.AllCurrenciesListSelector)
    await this.blockingWait(3)

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

  private getSwapType(inTokenSymbol: string, outTokenSymbol: string): SwapType {
    if (inTokenSymbol === 'ETH' && outTokenSymbol === 'WETH') {
      return SwapType.Wrap
    } else if (inTokenSymbol === 'WETH' && outTokenSymbol === 'ETH') {
      return SwapType.Unwrap
    } else {
      return SwapType.Normal
    }
  }
}
