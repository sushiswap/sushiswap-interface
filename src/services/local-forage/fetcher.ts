import localForage from 'localforage'

export default async function fetcher(key) {
  try {
    const value = await localForage.getItem<string>(key)
    if (!value) return undefined
    console.log(value)
    return JSON.parse(value)
  } catch (error) {
    console.error(error)
  }
}
