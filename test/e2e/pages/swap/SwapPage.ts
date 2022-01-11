import { ElementHandle } from 'puppeteer'

import { SwapType } from '../../enums/SwapType'
import { AppPage } from '../AppPage'

export class SwapPage extends AppPage {
  protected Route: string = '/trident/swap'

  // Main swap panel selectors
  private TokenInputSelector: string = '.swap-panel-input input'
  private PayFromWalletSelector: string = '.chk-pay-from-wallet'
  private ReceiveToWalletSelector: string = '.chk-receive-to-wallet'
  private SwapButtonSelector: string = '#swap-button'
  private WrapButtonSelector: string = '#wrap-button'
  private UseMaxButtonSelector: string = '.btn-max'
  private BalanceLabelSelector: string = '.text-balance'
  private SwitchCurrenciesButtonSelector: string = '#btn-switch-currencies'

  // Swap rate selectors
  private ExchangeRateButtonSelector: string = '#btn-exchange-rate'

  // Swap review modal selectors
  private ConfirmSwapButtonSelector: string = '#review-swap-button'
  private SwapSuccessIconSelector: string = '#swap-success-icon'

  // Token selector &
  private InTokenButtonSelector: string = '#asset-select-trigger-0'
  private OutTokenButtonSelector: string = '#asset-select-trigger-1'

  //Currency select dialog selectors
  private SelectTokenInputSelector: string = '#txt-select-token'
  private AllCurrenciesListSelector: string = '#all-currencies-list'
  private SelectTokenResultsSelector: string = '#all-currencies-'

  // Tx settings
  private TxSettingsButtonSelector: string = '#btn-transaction-settings'
  private SlippageInputSelector: string = '#text-slippage'
  private ExpertModeToggleSelector: string = '#toggle-expert-mode-button'

  //Confirm expert Mode Modal
  private ConfirmExpertModeSelector: string = '#confirm-expert-mode'

  // Add recipient
  private AddRecipientButtonSelector: string = '#btn-add-recipient'
  private RecipientInputSelector: string = '#recipient-input'

  private ApproveButtonSelector: string = '#btn-approve'

  private TradeTypeSelector: string = '#trade-type'

  public async swapTokens(
    inTokenSymbol: string,
    outTokenSymbol: string,
    inTokenAmount: string,
    payFromWallet: boolean,
    receiveToWallet: boolean
  ): Promise<void> {
    await this.setInputToken(inTokenSymbol)
    await this.setOutputToken(outTokenSymbol)
    await this.setAmountIn(inTokenAmount)

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

    await this.confirmSwap(inTokenSymbol, outTokenSymbol)
  }

  // Swap Rate Component
  public async getExchangeRate(): Promise<string> {
    await this.blockingWait(1, true)
    await this.Page.waitForSelector(this.ExchangeRateButtonSelector)
    const rate = await this.Page.$(this.ExchangeRateButtonSelector)
    const rateText = (await (await rate.getProperty('textContent')).jsonValue()) as string
    return rateText
  }

  // Swap Asset Panel
  public async setInputToken(tokenSymbol: string): Promise<void> {
    await this.blockingWait(1, true)
    const inputTokenButton = await this.Page.waitForSelector(this.InTokenButtonSelector)
    await inputTokenButton.click()
    await this.selectToken(tokenSymbol)
  }

  public async setOutputToken(tokenSymbol: string): Promise<void> {
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

  public async setAmountIn(inTokenAmount: string): Promise<void> {
    await this.Page.waitForTimeout(500)
    const tokenAmountInput = await this.Page.waitForSelector(this.TokenInputSelector)
    await tokenAmountInput.type(inTokenAmount)
  }

  public async getInputTokenAmount(): Promise<string> {
    await this.blockingWait(1, true)
    await this.Page.waitForSelector(this.TokenInputSelector)
    const tokenInput = await this.Page.$(this.TokenInputSelector)

    const inTokenAmount = (await (await tokenInput.getProperty('value')).jsonValue()) as string
    return inTokenAmount
  }

  public async getMinOutputAmount(): Promise<string> {
    await this.blockingWait(1, true)
    await this.Page.waitForSelector(this.TokenInputSelector)
    const tokenOutput = await this.Page.$$(this.TokenInputSelector)

    const outTokenAmount = (await (await tokenOutput[1].getProperty('value')).jsonValue()) as string
    return outTokenAmount
  }

  public async setPayFromWallet(payFromWallet: boolean): Promise<void> {
    await this.setFunding(payFromWallet, this.PayFromWalletSelector)
  }

  public async setReceiveToWallet(receiveToWallet: boolean): Promise<void> {
    await this.setFunding(receiveToWallet, this.ReceiveToWalletSelector)
  }

  private async setFunding(useFundingMethod: boolean, selector: string): Promise<void> {
    await this.blockingWait(3, true)
    const isSelectorChecked = await this.isSwitchChecked(selector)
    const switchElement = await this.getSwitchElement(selector)
    if (useFundingMethod && !isSelectorChecked) {
      await switchElement.click()
    } else if (!useFundingMethod && isSelectorChecked) {
      await switchElement.click()
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

  public async getInputTokenBalance(): Promise<string> {
    await this.Page.waitForSelector(this.InTokenButtonSelector)
    const inputTokenLabel = await this.Page.$(this.InTokenButtonSelector)
    const inToken = (await (await inputTokenLabel.getProperty('textContent')).jsonValue()) as string

    const balanceLabel = await this.Page.waitForSelector(`#text-balance-${inToken}`)
    const inTokenBalance = (await (await balanceLabel.getProperty('textContent')).jsonValue()) as string

    return inTokenBalance
  }

  public async getTokenBalance(tokenSymbol: string, fromWallet: boolean = true): Promise<number> {
    await this.blockingWait(1, true)

    await this.setInputToken(tokenSymbol)
    await this.setPayFromWallet(fromWallet)

    const balance = await this.getInputTokenBalance()

    return parseFloat(balance)
  }

  // Swap Review Component
  public async confirmSwap(inTokenSymbol: string, outTokenSymbol: string): Promise<void> {
    await this.blockingWait(1)

    const swapType: SwapType = this.getSwapType(inTokenSymbol, outTokenSymbol)

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

  // Settings Tab
  public async toggleExpertMode(): Promise<void> {
    await this.blockingWait(1, true)

    const TxSettingsButtonSelector = await this.Page.waitForSelector(this.TxSettingsButtonSelector)
    await TxSettingsButtonSelector.click()

    const expertModeToggle = await this.Page.waitForSelector(this.ExpertModeToggleSelector)
    await expertModeToggle.click()

    const confirmExpertModeButton = await this.Page.$(this.ConfirmExpertModeSelector)
    if (confirmExpertModeButton) {
      await confirmExpertModeButton.click()
    }
  }

  public async setSlippage(slippage: string): Promise<void> {
    await this.blockingWait(1, true)

    const TxSettingsButtonSelector = await this.Page.waitForSelector(this.TxSettingsButtonSelector)
    await TxSettingsButtonSelector.click()

    const slippageInput = await this.Page.waitForSelector(this.SlippageInputSelector)

    await slippageInput.click({ clickCount: 3 })
    await slippageInput.type(slippage)

    await TxSettingsButtonSelector.click()
  }

  public async getSlippage(): Promise<string> {
    await this.blockingWait(1, true)

    const TxSettingsButtonSelector = await this.Page.waitForSelector(this.TxSettingsButtonSelector)
    await TxSettingsButtonSelector.click()

    await this.Page.waitForSelector(this.SlippageInputSelector)

    const slippageInputTextBox = await this.Page.$(this.SlippageInputSelector)
    const slippage = (await (await slippageInputTextBox.getProperty('value')).jsonValue()) as string
    return slippage
  }

  // Recipient Panel
  public async setRecipient(recipient: string): Promise<void> {
    await this.blockingWait(1, true)

    const addRecipientButton = await this.Page.waitForSelector(this.AddRecipientButtonSelector)
    addRecipientButton.click()

    const recipientInput = await this.Page.waitForSelector(this.RecipientInputSelector)
    await recipientInput.type(recipient)
  }

  public async getRecipient(): Promise<string> {
    await this.blockingWait(1, true)

    let recipientInputBox: ElementHandle<Element>
    recipientInputBox = await this.Page.$(this.RecipientInputSelector)

    if (!recipientInputBox) {
      return ''
    }

    const recipient = (await (await recipientInputBox.getProperty('value')).jsonValue()) as string
    return recipient
  }

  public async clickSwitchCurrenciesButton(): Promise<void> {
    await this.blockingWait(1, true)
    const switchCurrenciesButton = await this.Page.waitForSelector(this.SwitchCurrenciesButtonSelector)
    await switchCurrenciesButton.click()
    await this.blockingWait(1, true)
  }

  public async getSwapButtonText(): Promise<string> {
    await this.blockingWait(1, true)

    await this.Page.waitForSelector(this.SwapButtonSelector)
    const swapButton = await this.Page.$(this.SwapButtonSelector)

    const swapButtonText = (await (await swapButton.getProperty('textContent')).jsonValue()) as string
    return swapButtonText
  }

  public async clickMaxButton(): Promise<void> {
    await this.blockingWait(3, true)
    await this.Page.waitForSelector(this.UseMaxButtonSelector)
    const useMaxButton = await this.Page.$$(this.UseMaxButtonSelector)
    await useMaxButton[1].click()
    await this.blockingWait(1, true)
  }

  public async clickInvertRateButton(): Promise<void> {
    await this.blockingWait(1, true)
    const invertRateButton = await this.Page.waitForSelector(this.ExchangeRateButtonSelector)
    await invertRateButton.click()
  }

  public async getBentoBalance(tokenSymbol: string): Promise<string> {
    await this.blockingWait(1, true)
    await this.Page.bringToFront()
    await this.setInputToken(tokenSymbol)

    await this.setPayFromWallet(false)

    const balance = await this.getInputTokenBalance()

    return balance
  }

  public async getWalletBalance(tokenSymbol: string): Promise<string> {
    await this.blockingWait(1, true)
    await this.Page.bringToFront()
    await this.setInputToken(tokenSymbol)

    await this.setPayFromWallet(true)

    const balance = await this.getInputTokenBalance()

    return balance
  }

  public async requiresApproval(): Promise<boolean> {
    await this.blockingWait(1, true)
    const approveButton = await this.Page.$(this.ApproveButtonSelector)
    return approveButton !== null
  }

  public async approveToken(): Promise<void> {
    await this.blockingWait(1, true)
    const approveButton = await this.Page.waitForSelector(this.ApproveButtonSelector)
    await approveButton.click()
    await this.Metamask.confirmTransaction()
    await this.Metamask.page.waitForTimeout(1000)
    await this.bringToFront()
    await this.blockingWait(5, true)
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

  public async getTradeType(): Promise<string> {
    await this.Page.waitForSelector(this.TradeTypeSelector)

    const tradeTypeInput = await this.Page.$(this.TradeTypeSelector)
    const tradeType = (await (await tradeTypeInput.getProperty('value')).jsonValue()) as string
    return tradeType
  }
}
