import { Dappeteer } from '@chainsafe/dappeteer'
import { closeValues } from '@sushiswap/tines'
import { Browser, Page } from 'puppeteer'

import { TestHelper } from './helpers/TestHelper'
import { AddLiquidityPage } from './pages/pools/AddLiquidityPage'
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
let addLiquidityPage: AddLiquidityPage
let poolPage: PoolPage

async function initPages() {
  liquidityPoolsPage = new LiquidityPoolsPage(page, metamask, `${baseUrl}/trident/pools`)
  poolPage = new PoolPage(page, metamask)
  addLiquidityPage = new AddLiquidityPage(page, metamask)
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
    // USDC: Asset A
    // WETH: Asset B

    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.connectMetamaskWallet()
    await liquidityPoolsPage.goToPool(targetPoolName)

    const poolLink = page.url()

    // Get position & balances before
    const positionBeforeWithdraw = await poolPage.getPoolPosition()
    expect(positionBeforeWithdraw.assetA).toEqual('USDC')
    expect(positionBeforeWithdraw.assetB).toEqual('WETH')

    await poolPage.clickAddLiquidityButton()

    const usdcBentoBalanceBefore = await addLiquidityPage.getAssetABalance(false)
    const ethBentoBalanceBefore = await addLiquidityPage.getAssetBBalance(false)

    // Set up page before confirm
    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.goToPool(targetPoolName)
    await poolPage.clickRemoveLiquidityButton()

    await removeLiquidityPage.setRemovePercent(25)
    await removeLiquidityPage.setFixedRatio(true)
    await removeLiquidityPage.setWithdrawToWallet(false)

    const minLiquidityOutput = await removeLiquidityPage.getMinLiquidityOutput(targetPoolName)

    await removeLiquidityPage.confirmWithdrawal()

    await page.goto(poolLink)
    await page.waitForSelector(`#pool-title-${targetPoolName}`)

    // Get position & balances after
    const positionAfterDeposit = await poolPage.getPoolPosition()
    expect(positionAfterDeposit.assetA).toEqual('USDC')
    expect(positionAfterDeposit.assetB).toEqual('WETH')

    await poolPage.clickAddLiquidityButton()

    const usdcBentoBalanceAfter = await addLiquidityPage.getAssetABalance(false)
    const ethBentoBalanceAfter = await addLiquidityPage.getAssetBBalance(false)

    const usdcBalanceDiff = usdcBentoBalanceAfter - usdcBentoBalanceBefore
    const ethBalanceDiff = ethBentoBalanceAfter - ethBentoBalanceBefore

    expect(closeValues(usdcBalanceDiff, minLiquidityOutput.amountA, 1e-9)).toBe(true)
    expect(closeValues(ethBalanceDiff, minLiquidityOutput.amountB, 1e-9)).toBe(true)
  })
})
