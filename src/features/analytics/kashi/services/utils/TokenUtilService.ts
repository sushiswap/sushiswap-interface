class TokenUtilService {
  protected static instance: TokenUtilService
  constructor() {}

  static getInstance() {
    if (TokenUtilService.instance) {
      return TokenUtilService.instance
    }
    TokenUtilService.instance = new TokenUtilService()
    return TokenUtilService.instance
  }

  symbol(symbol: string | undefined): string | undefined {
    if (symbol && symbol.toLocaleLowerCase() === 'ftx token') {
      return 'FTT'
    }
    return symbol
  }

  pairSymbol(symbol1: string | undefined, symbol2: string | undefined): string {
    return `${this.symbol(symbol1)}/${this.symbol(symbol2)}`
  }

  name(name: string | undefined): string | undefined {
    if (name && name.toLocaleLowerCase() === 'ftt') {
      return 'FTX Token'
    }
    return name
  }
}

export default TokenUtilService
