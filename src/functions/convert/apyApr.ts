// From https://gist.github.com/sterlu/4b44f59ea665819974ae684d7f564d9b

const SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60
const BLOCKS_IN_A_YEAR = SECONDS_PER_YEAR / 14

/**
 * Formula source: http://www.linked8.com/blog/158-apy-to-apr-and-apr-to-apy-calculation-methodologies
 *
 * @param apy {Number} APY as percentage (ie. 6)
 * @param frequency {Number} Compounding frequency (times a year)
 * @returns {Number} APR as percentage (ie. 5.82 for APY of 6%)
 */
export const apyToApr = (apy, frequency = BLOCKS_IN_A_YEAR) =>
  ((1 + apy / 100) ** (1 / frequency) - 1) * frequency * 100

/**
 * Formula source: http://www.linked8.com/blog/158-apy-to-apr-and-apr-to-apy-calculation-methodologies
 *
 * @param apr {Number} APR as percentage (ie. 5.82)
 * @param frequency {Number} Compounding frequency (times a year)
 * @returns {Number} APY as percentage (ie. 6 for APR of 5.82%)
 */
export const aprToApy = (apr, frequency = BLOCKS_IN_A_YEAR) => ((1 + apr / 100 / frequency) ** frequency - 1) * 100
