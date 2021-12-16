import { getAddress } from '@ethersproject/address'

const regex = new RegExp(
  '^(https:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?'
)

interface ValidatorData {
  value: string
  imageSizeThreshold?: number
  maxCharactersThreshold?: number
}

type Validator = (data: ValidatorData) => Promise<string | boolean>

export const urlValidator: Validator = async (data) => {
  if (!regex.test(data.value)) {
    return 'Invalid URL'
  }

  return true
}

export const imageSizeValidator: Validator = async (data) => {
  const img = new Image()
  img.crossOrigin = 'Anonymous'

  if (!data.imageSizeThreshold) return 'Invalid input'

  try {
    const resp = await fetch(data.value)
    const blob = await resp.blob()
    if (blob.size > data.imageSizeThreshold) {
      return `Image filesize is ${blob.size / 1000}kB, maximum allowed filesize is ${data.imageSizeThreshold / 1000}kB`
    }
  } catch (e) {
    return 'Fetching size failed, probably due to CORS policy'
  }

  return true
}

export const isAddressValidator: Validator = async (data) => {
  if (!data.value) return 'Invalid input'
  try {
    getAddress(data.value)
  } catch {
    return 'Invalid address'
  }

  return true
}

export const maxCharactersValidator: Validator = async (data) => {
  if (!data.value || !data.maxCharactersThreshold) return 'Invalid input'
  if (data.value.length > data.maxCharactersThreshold) return 'Too many characters'
  return true
}

export const pipeline = async (data: ValidatorData, validators: Validator[], resolve, reject) => {
  // Always set field on input
  resolve()

  // No validation required
  if (data.value.length === 0) {
    // Reset error
    reject()
    return resolve()
  }

  try {
    await Promise.all(
      validators.map(async (validator) => {
        const result = await validator(data)
        if (typeof result === 'string') {
          throw new Error(result)
        }

        return true
      })
    )

    // Reset error
    reject()
  } catch (e) {
    reject(e.message)
  }
}
