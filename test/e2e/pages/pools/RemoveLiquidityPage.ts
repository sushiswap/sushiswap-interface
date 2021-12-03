import { ElementHandle } from 'puppeteer'

import { AppPage } from '../AppPage'

export class RemoveLiquidityPage extends AppPage {
  protected BackToPoolsButtonSelector: string = '#btn-withdraw-success-back'
  protected ModalConfirmWithdrawButtonSelector: string = '#btn-modal-confirm-withdrawal'
  protected ReviewAndConfirmButtonSelector: string = '#btn-confirm-remove-liquidity'

  protected ApproveButtonSelector: string = '#btn-approve'
  protected FixedRatioCheckboxSelector: string = '#chk-fixed-ratio-withdraw'
  protected RemovePercentSelector: string = '#radio-option-'

  protected WithdrawToSelector: string = '#txt-withdraw-to'
  protected CheckOutputToWalletSelector: string = '#chk-output-to-wallet'

  public async removeLiquidity(percent: number, outputToWallet: boolean, fixedRatio: boolean = false): Promise<void> {
    const percentSelectionButton = await this.Page.waitForSelector(this.RemovePercentSelector + percent.toString())
    await percentSelectionButton.click()

    const fixedRatioCheckbox = await this.getFixedRatioCheckbox()

    if (fixedRatio && !(await this.isFixedRatioChecked())) {
      await fixedRatioCheckbox.click()
    } else if (!fixedRatio && (await this.isFixedRatioChecked())) {
      await fixedRatioCheckbox.click()
    }

    const withdrawToElement = await this.Page.waitForSelector(this.WithdrawToSelector)
    const withdrawTo = await this.Page.evaluate((el) => el.textContent, withdrawToElement)

    const outputSelector = await this.Page.waitForSelector(this.CheckOutputToWalletSelector)
    const outputSelectorButton = (await outputSelector.$x('..'))[0]

    if (outputToWallet && withdrawTo.toLowerCase() !== 'wallet') {
      await outputSelectorButton.click()
    } else if (!outputToWallet && withdrawTo.toLowerCase() !== 'bentobox') {
      await outputSelectorButton.click()
    }

    const approveButton = await this.Page.$(this.ApproveButtonSelector)
    if (approveButton) {
      await approveButton.click()
      await this.Metamask.sign()
      await this.Metamask.page.waitForTimeout(1000)
      await this.bringToFront()
    }

    const reviewConfirmButton = await this.Page.waitForSelector(this.ReviewAndConfirmButtonSelector)
    await reviewConfirmButton.click()
    await this.Page.waitForTimeout(500)

    const modalConfirmWithdrawButton = await this.Page.waitForSelector(this.ModalConfirmWithdrawButtonSelector)
    await modalConfirmWithdrawButton.click()
    await this.Metamask.page.waitForTimeout(500)

    await this.Metamask.confirmTransaction()
    await this.Metamask.page.waitForTimeout(1000)

    //Check if we're still at confirm transaction page. When gas estimation takes longer initial confirm does not work
    const mmFooterButtons = await this.Metamask.page.$$('footer > button')
    if (mmFooterButtons && mmFooterButtons[1]) {
      const confirmButton = mmFooterButtons[1]
      await confirmButton.click()
    }

    await this.Metamask.page.waitForTimeout(1000)
    await this.bringToFront()

    const backToPoolsButton = await this.Page.waitForSelector(this.BackToPoolsButtonSelector)
    await backToPoolsButton.click()

    await this.Metamask.page.waitForTimeout(40000)
  }

  private async getFixedRatioCheckbox(): Promise<ElementHandle<Element>> {
    await this.Page.waitForSelector(this.FixedRatioCheckboxSelector)
    const fixedRateCheckbox = await this.Page.$(this.FixedRatioCheckboxSelector)

    return fixedRateCheckbox
  }

  private async isFixedRatioChecked(): Promise<boolean> {
    let fixedRatioChecked: boolean

    const fixedRatioCheckbox = await this.getFixedRatioCheckbox()
    fixedRatioChecked = (await (await fixedRatioCheckbox.getProperty('checked')).jsonValue()) as boolean

    return fixedRatioChecked
  }
}
