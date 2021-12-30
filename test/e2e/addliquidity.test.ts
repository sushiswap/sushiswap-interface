import { Dappeteer } from '@chainsafe/dappeteer'
import { closeValues } from '@sushiswap/tines'
import { Browser, Page } from 'puppeteer'

import { ADDRESSES } from './constants/Addresses'
import { FUNDING_SOURCE } from './constants/FundingSource'
import { TestHelper } from './helpers/TestHelper'
import { AddLiquidityPage } from './pages/pools/AddLiquidityPage'
import { LiquidityPoolsPage } from './pages/pools/LiquidityPoolsPage'
import { PoolPage } from './pages/pools/PoolPage'
import { SwapPage } from './pages/swap/SwapPage'

require('dotenv').config()

let baseUrl: string = process.env.TEST_BASE_URL || 'http://localhost:3000'

let browser: Browser
let page: Page
let metamask: Dappeteer

let liquidityPoolsPage: LiquidityPoolsPage
let poolPage: PoolPage
let addLiquidityPage: AddLiquidityPage
let swapPage: SwapPage

const unequalDepositCases = [['ETH', FUNDING_SOURCE.BENTO]]

async function initPages() {
  liquidityPoolsPage = new LiquidityPoolsPage(page, metamask, `${baseUrl}/trident/pools`)
  poolPage = new PoolPage(page, metamask)
  addLiquidityPage = new AddLiquidityPage(page, metamask)
  swapPage = new SwapPage(page, metamask, `${baseUrl}/trident/swap`)
}

async function importTokens() {
  await liquidityPoolsPage.addTokenToMetamask(ADDRESSES.DAI)
  await liquidityPoolsPage.addTokenToMetamask(ADDRESSES.USDC)
}

jest.retryTimes(1)

describe('Add Liquidity:', () => {
  beforeAll(async () => {
    ;[metamask, browser, page] = await TestHelper.initDappeteer()
    await initPages()
    await importTokens()
  })

  afterAll(async () => {
    browser.close()
  })

  test('Should deposit USDC from wallet unequal amounts', async () => {
    const targetPoolName = 'USDC-WETH'
    const usdcWalletBalance = await liquidityPoolsPage.getMetamaskTokenBalance('USDC')
    const t0DepositAmount: number = usdcWalletBalance * 0.1

    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.connectMetamaskWallet()
    await liquidityPoolsPage.goToPool(targetPoolName)

    const positionBeforeDeposit = await poolPage.getPoolPosition()
    expect(positionBeforeDeposit.assetA).toEqual('USDC')
    expect(positionBeforeDeposit.assetB).toEqual('WETH')
    const poolLink = page.url()

    await poolPage.clickAddLiquidityButton()
    await addLiquidityPage.addLiquidity(t0DepositAmount.toFixed(5))

    await page.goto(poolLink)
    await page.waitForSelector(`#pool-title-${targetPoolName}`)

    const positionAfterDeposit = await poolPage.getPoolPosition()
    expect(positionAfterDeposit.assetA).toEqual('USDC')
    expect(positionAfterDeposit.assetB).toEqual('WETH')

    expect(positionAfterDeposit.amountA).toBeGreaterThan(positionBeforeDeposit.amountA)
    expect(positionAfterDeposit.amountB).toBeGreaterThan(positionBeforeDeposit.amountB)
  })

  test('Should deposit ETH from bento & USDC from bento in equal amounts', async () => {
    const targetPoolName = 'USDC-WETH'

    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.connectMetamaskWallet()
    await liquidityPoolsPage.goToPool(targetPoolName)

    const positionBeforeDeposit = await poolPage.getPoolPosition()
    expect(positionBeforeDeposit.assetA).toEqual('USDC')
    expect(positionBeforeDeposit.assetB).toEqual('WETH')
    const poolLink = page.url()

    await poolPage.clickAddLiquidityButton()

    const assetABentoBalanceBefore = await addLiquidityPage.getAssetABalance(false)
    const assetBBentoBalanceBefore = await addLiquidityPage.getAssetBBalance(false)

    const assetADepositAmount: number = assetABentoBalanceBefore * 0.1

    await addLiquidityPage.setFixedRatio(true)
    await addLiquidityPage.setAssetADepositAmount(assetADepositAmount)
    await addLiquidityPage.setAssetAFundFromWallet(false)
    await addLiquidityPage.setAssetBFundFromWallet(false)

    const assetBDepositAmount = await addLiquidityPage.getAssetBDepositAmount()

    await addLiquidityPage.confirmDeposit()

    await page.goto(poolLink)
    await page.waitForSelector(`#pool-title-${targetPoolName}`)

    const positionAfterDeposit = await poolPage.getPoolPosition()
    expect(positionAfterDeposit.assetA).toEqual('USDC')
    expect(positionAfterDeposit.assetB).toEqual('WETH')

    await poolPage.clickAddLiquidityButton()
    const assetABentoBalanceAfter = await addLiquidityPage.getAssetABalance(false)
    const assetBBentoBalanceAfter = await addLiquidityPage.getAssetBBalance(false)

    const assetABalanceDiff = assetABentoBalanceBefore - assetABentoBalanceAfter
    const assetBBalanceDiff = assetBBentoBalanceBefore - assetBBentoBalanceAfter
    expect(closeValues(assetABalanceDiff, assetADepositAmount, 1e-9)).toBe(true)
    expect(closeValues(assetBBalanceDiff, assetBDepositAmount, 1e-9)).toBe(true)

    expect(closeValues(positionAfterDeposit.amountA, positionBeforeDeposit.amountA + assetADepositAmount, 1e-9)).toBe(
      true
    )
    expect(closeValues(positionAfterDeposit.amountB, positionBeforeDeposit.amountB + assetBDepositAmount, 1e-9)).toBe(
      true
    )
  })

  test('Should deposit ETH from wallet in unequal amounts', async () => {
    const targetPoolName = 'USDC-WETH'

    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.connectMetamaskWallet()
    await liquidityPoolsPage.goToPool(targetPoolName)

    const positionBeforeDeposit = await poolPage.getPoolPosition()
    expect(positionBeforeDeposit.assetA).toEqual('USDC')
    expect(positionBeforeDeposit.assetB).toEqual('WETH')

    const poolLink = page.url()
    await poolPage.clickAddLiquidityButton()

    const ethWalletBalanceBefore = await addLiquidityPage.getAssetBBalance(true)
    const ethDepositAmount: number = ethWalletBalanceBefore * 0.1

    await addLiquidityPage.setFixedRatio(false)
    await addLiquidityPage.setAssetBDepositAmount(ethDepositAmount)
    await addLiquidityPage.setAssetBFundFromWallet(true)

    await addLiquidityPage.confirmDeposit()

    await page.goto(poolLink)
    await page.waitForSelector(`#pool-title-${targetPoolName}`)

    const positionAfterDeposit = await poolPage.getPoolPosition()
    expect(positionAfterDeposit.assetA).toEqual('USDC')
    expect(positionAfterDeposit.assetB).toEqual('WETH')

    await poolPage.clickAddLiquidityButton()
    const ethWalletBalanceAfter = await addLiquidityPage.getAssetBBalance(true)

    const ethBalanceDiff = ethWalletBalanceBefore - ethWalletBalanceAfter
    expect(closeValues(ethBalanceDiff, ethDepositAmount, 1e-9)).toBe(true)
    expect(closeValues(positionAfterDeposit.amountB, positionBeforeDeposit.amountB + ethDepositAmount, 1e-9)).toBe(true)
  })

  test.only('Should deposit ETH from bento in unequal amounts', async () => {
    const targetPoolName = 'USDC-WETH'

    await liquidityPoolsPage.navigateTo()
    await liquidityPoolsPage.connectMetamaskWallet()
    await liquidityPoolsPage.goToPool(targetPoolName)

    const positionBeforeDeposit = await poolPage.getPoolPosition()
    expect(positionBeforeDeposit.assetA).toEqual('USDC')
    expect(positionBeforeDeposit.assetB).toEqual('WETH')

    const poolLink = page.url()
    await poolPage.clickAddLiquidityButton()

    const ethBalanceBefore = await addLiquidityPage.getAssetBBalance(false)
    const ethDepositAmount: number = ethBalanceBefore * 0.1

    await addLiquidityPage.setFixedRatio(false)
    await addLiquidityPage.setAssetBDepositAmount(ethDepositAmount)
    await addLiquidityPage.setAssetBFundFromWallet(false)

    await addLiquidityPage.confirmDeposit()

    await page.goto(poolLink)
    await page.waitForSelector(`#pool-title-${targetPoolName}`)

    const positionAfterDeposit = await poolPage.getPoolPosition()
    expect(positionAfterDeposit.assetA).toEqual('USDC')
    expect(positionAfterDeposit.assetB).toEqual('WETH')

    await poolPage.clickAddLiquidityButton()
    const ethBalanceAfter = await addLiquidityPage.getAssetBBalance(false)

    const ethBalanceDiff = ethBalanceBefore - ethBalanceAfter
    expect(closeValues(ethBalanceDiff, ethDepositAmount, 1e-9)).toBe(true)
    expect(closeValues(positionAfterDeposit.amountB, positionBeforeDeposit.amountB + ethDepositAmount, 1e-9)).toBe(true)
  })
})
