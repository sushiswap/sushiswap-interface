import { AppPage } from '../AppPage'

export class LiquidityPoolsPage extends AppPage {
  public async goToPool(poolName: string): Promise<void> {
    if (!poolName) throw new Error('Pool name is required')

    const poolButton = await this.Page.waitForSelector(`#pool-${poolName}`)

    if (!poolButton) throw new Error(`Pool ${poolName} not found`)
    await poolButton.click()

    await this.Page.waitForSelector(`#pool-title-${poolName}`)

    await this.Metamask.page.waitForTimeout(1000)
  }
}
