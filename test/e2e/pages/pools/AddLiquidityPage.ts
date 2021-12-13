import { ElementHandle } from 'puppeteer'

import { AppPage } from '../AppPage'

export class AddLiquidityPage extends AppPage {
  protected ConfirmDepositButtonSelector: string = '#btn-ConfirmDeposit'
  protected ModalConfirmDepositButtonSelector: string = '#btn-modal-confirm-deposit'
  protected BackToPoolsButtonSelector: string = '#btn-backToPools'
  protected DepositStatusDivSelector: string = 'div-deposit-status'
  protected ApproveButtonSelector: string = '#btn-approve'
  protected FixedRatioCheckboxSelector: string = '#chk-fixed-ratio-deposit'

  public async addLiquidity(t0Amount: string, t1Amount: string = '', fixedRatio: boolean = false): Promise<void> {
    const inputs = await this.Page.$$('input[type=text]')
    if (inputs.length !== 2) throw new Error('Expected 2 text inputs on add liquidity page')

    const fixedRatioCheckbox = await this.getFixedRatioCheckbox()

    if (fixedRatio && !(await this.isFixedRatioChecked())) {
      await fixedRatioCheckbox.click()
    } else if (!fixedRatio && (await this.isFixedRatioChecked())) {
      await fixedRatioCheckbox.click()
    }

    if (t0Amount) await inputs[0].type(t0Amount)
    if (t1Amount) await inputs[1].type(t1Amount)

    const approveButton = await this.Page.$(this.ApproveButtonSelector)
    if (approveButton) {
      await approveButton.click()
      await this.Metamask.confirmTransaction()
      await this.Metamask.page.waitForTimeout(1000)
      await this.bringToFront()
    }

    const confirmDepositButton = await this.Page.waitForSelector(this.ConfirmDepositButtonSelector)
    await confirmDepositButton.click()

    const modalConfirmDepositButton = await this.Page.waitForSelector(this.ModalConfirmDepositButtonSelector)
    await modalConfirmDepositButton.click()

    await this.confirmMetamaskTransaction()

    const backToPoolsButton = await this.Page.waitForSelector(this.BackToPoolsButtonSelector)
    await backToPoolsButton.click()

    await this.blockingWait(1)
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
