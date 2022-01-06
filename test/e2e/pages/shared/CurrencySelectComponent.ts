import { AppPageComponent } from '../AppPageComponent'

export class CurrencySelectComponent extends AppPageComponent {
  // Selectors
  private SelectTokenInputSelector: string = '#txt-select-token'
  private AllCurrenciesListSelector: string = '#all-currencies-list'
  private SelectTokenResultsSelector: string = '#all-currencies-'

  public async selectToken(tokenSymbol: string): Promise<void> {
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
}
