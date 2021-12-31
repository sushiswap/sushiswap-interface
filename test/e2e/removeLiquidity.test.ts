import { Dappeteer } from '@chainsafe/dappeteer'
import { Browser, Page } from 'puppeteer'

import { TestHelper } from './helpers/TestHelper'
import { LiquidityPoolsPage } from './pages/pools/LiquidityPoolsPage'
import { PoolPage } from './pages/pools/PoolPage'
import { RemoveLiquidityPage } from './pages/pools/RemoveLiquidityPage'

require('dotenv').config()

let seed: string = process.env.TEST_SEED || 'seed seed seed'
let pass: string = process.env.TEST_PASS || 'password'
let baseUrl: string = process.env.TEST_BASE_URL || 'http://localhost:3000'

let browser: Browser
let page: Page
let metamask: Dappeteer

let liquidityPoolsPage: LiquidityPoolsPage
let removeLiquidityPage: RemoveLiquidityPage
let poolPage: PoolPage

async function initPages() {
  liquidityPoolsPage = new LiquidityPoolsPage(page, metamask, `${baseUrl}/trident/pools`)
  poolPage = new PoolPage(page, metamask)
  removeLiquidityPage = new RemoveLiquidityPage(page, metamask)
}

jest.retryTimes(1)

describe('Remove Liquidity:', () => {
  beforeAll(async () => {
    ;[metamask, browser, page] = await TestHelper.initDappeteer()
    await initPages()
  })

  afterAll(async () => {
    browser.close()
  })

  test.only('Remove 25% in equal amounts and withdraw to BentoBox', async () => {
    const targetPoolName = 'USDC-WETH'

    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.connectMetamaskWallet()
    await liquidityPoolsPage.goToPool(targetPoolName)

    const positionBeforeWithdraw = await poolPage.getPoolPosition()
    expect(positionBeforeWithdraw.assetA).toEqual('USDC')
    expect(positionBeforeWithdraw.assetB).toEqual('WETH')

    // TODO: Go to add liquidity page and get bento balances before withdraw

    const poolLink = page.url()
    await poolPage.clickRemoveLiquidityButton()

    // TODO: Break down to individual steps
    await removeLiquidityPage.removeLiquidity(25, false, true)

    // TODO: Before withdraw, check that estimated output

    // TODO: After withfraw check balance has increased by close to estimated output

    await page.goto(poolLink)
    await page.waitForSelector(`#pool-title-${targetPoolName}`)

    const positionAfterDeposit = await poolPage.getPoolPosition()
    expect(positionAfterDeposit.assetA).toEqual('USDC')
    expect(positionAfterDeposit.assetB).toEqual('WETH')

    expect(positionAfterDeposit.amountA).toBeLessThanOrEqual(positionBeforeWithdraw.amountA)
    expect(positionAfterDeposit.amountB).toBeLessThanOrEqual(positionBeforeWithdraw.amountB)
  })
})
