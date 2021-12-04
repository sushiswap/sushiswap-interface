import { AppPage } from '../AppPage'

export class SwapPage extends AppPage {
  // Main swap panel selectors
  protected InTokenTextSelector: string = ''
  protected OutTokenTextSelector: string = ''
  protected PayFromWalletSelector: string = ''
  protected ReceiveToWalletSelector: string = ''
  protected SwapButtonSelector: string = ''

  // Confirm modal selectors
  protected ConfirmSwapButtonSelector: string = ''

  // Token selector & currency select dialog
  protected InTokenButtonSelector: string = ''
  protected OutTokenButtonSelector: string = ''
  protected SelectTokenInputSelector: string = '#txt-select-token'

  public async swapTokens(
    inTokenSymbol: string,
    outTokenSymbol: string,
    inTokenAmount: string,
    payFromWallet: boolean,
    receiveToWallet: boolean
  ): Promise<void> {
    // TODO: Complete action
    // Select input token
    // Select output token
    // Type input amount
    // Click swap button
    // Wait
    // Click confirm swap button
    // Confirm metamask transaction
    // Wait for swap submitted modal to contain success message
  }
}
