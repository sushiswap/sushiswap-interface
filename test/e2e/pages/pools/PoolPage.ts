import { PoolPosition } from '../../interfaces/PoolPosition'
import { AppPage } from '../AppPage'
export class PoolPage extends AppPage {
  protected DepositButtonSelector: string = '#btn-deposit > a'
  protected AddLiquidityButtonSelector: string = '#btn-add-stake-liquidity > a'
  protected RemoveLiquidityButtonSelector: string = '#btn-remove-liquidity > a'

  protected Position0Selector: string = '#my-position-0'
  protected Position1Selector: string = '#my-position-1'

  public async clickAddLiquidityButton(): Promise<void> {
    const depositButton = await this.Page.$(this.DepositButtonSelector)
    const addLiquidityButton = await this.Page.$(this.AddLiquidityButtonSelector)

    if (depositButton) {
      await this.evaluateAndClick(this.DepositButtonSelector)
    } else if (addLiquidityButton) {
      await this.evaluateAndClick(this.AddLiquidityButtonSelector)
    } else {
      throw new Error('No button found')
    }
    await this.Page.waitForNavigation()
  }

  public async clickRemoveLiquidityButton(): Promise<void> {
    const removeLiquidityButton = await this.Page.waitForSelector(this.RemoveLiquidityButtonSelector)

    if (removeLiquidityButton) {
      await this.evaluateAndClick(this.RemoveLiquidityButtonSelector)
    } else {
      throw new Error('No button found')
    }

    await this.Page.waitForNavigation()
  }

  public async getPoolPosition(): Promise<PoolPosition> {
    let poolPosition: PoolPosition = {
      token0: '',
      token1: '',
      amount0: 0,
      amount1: 0,
    }

    const position0Element = await this.Page.waitForSelector(this.Position0Selector)
    const position0Text = await this.Page.evaluate((element) => element.textContent, position0Element)
    const position1Element = await this.Page.waitForSelector(this.Position1Selector)
    const position1Text = await this.Page.evaluate((element) => element.textContent, position1Element)

    poolPosition.token0 = position0Text.split(' ')[1].split('$')[0]
    poolPosition.amount0 = parseFloat(position0Text.split(' ')[0])
    poolPosition.token1 = position1Text.split(' ')[1].split('$')[0]
    poolPosition.amount1 = parseFloat(position1Text.split(' ')[0])

    return poolPosition
  }
}
