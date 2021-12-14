import { Dappeteer, launch, setupMetamask } from '@chainsafe/dappeteer'
import puppeteer, { Browser, Page } from 'puppeteer'

export class TestHelper {
  public static async initDappeteer(): Promise<[Dappeteer, Browser, Page]> {
    let seed: string = process.env.TEST_SEED || 'seed seed seed'
    let pass: string = process.env.TEST_PASS || 'password'

    const browser = await this.getBrowser()
    const metamask = await this.getMetamask(browser, seed, pass)

    const page = await browser.newPage()
    await page.setDefaultTimeout(60000)

    return [metamask, browser, page]
  }

  private static async getMetamask(browser: Browser, seed: string, pass: string): Promise<Dappeteer> {
    let metamask: Dappeteer

    try {
      metamask = await setupMetamask(browser, { seed: seed, password: pass })
      await metamask.switchNetwork('kovan')
      await metamask.page.setDefaultTimeout(60000)
    } catch (error) {
      console.log('Error occurred setting up metamask')
      throw error
    }

    return metamask
  }

  private static async getBrowser(): Promise<Browser> {
    let browser: Browser

    try {
      browser = await launch(puppeteer, {
        metamaskVersion: 'v10.1.1',
        headless: false,
        defaultViewport: null,
        slowMo: 5,
        args: ['--no-sandbox'],
        executablePath: process.env.PUPPETEER_EXEC_PATH,
      })
    } catch (error) {
      console.log('Error occurred launching Puppeteer')
      throw error
    }

    return browser
  }
}
