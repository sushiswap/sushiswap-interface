export const PEGGED_ORACLE = '0x6cbfbB38498Df0E1e7A4506593cDB02db9001564'
// export const COMPOUND_ORACLE = ''
export const CHAINLINK_ORACLE = '0xD766147Bc5A0044a6b4f4323561B162870FcBb48'
export const SIMPLE_SLPTWAP0_ORACLE = '0x66F03B0d30838A3fee971928627ea6F59B236065'
export const SIMPLE_SLPTWAP1_ORACLE = '0x0D51b575591F8f74a2763Ade75D3CDCf6789266f'
// export const COMPOSITE_ORACLE = ''

const ORACLE_NAMES = {
  [PEGGED_ORACLE.toLowerCase()]: 'Pegged',
  // [COMPOUND_ORACLE.toLowerCase()]: 'Compound',
  [CHAINLINK_ORACLE.toLowerCase()]: 'Chainlink',
  [SIMPLE_SLPTWAP0_ORACLE.toLowerCase()]: 'SLP-0',
  [SIMPLE_SLPTWAP1_ORACLE.toLowerCase()]: 'SLP-1'
  // [COMPOSITE_ORACLE.toLowerCase()]: 'Composite'
}

const getOracleName = (address: string) => {
  return ORACLE_NAMES[address.toLowerCase()]
}

export default getOracleName
