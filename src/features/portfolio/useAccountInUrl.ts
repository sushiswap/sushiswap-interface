import { isAddress } from 'app/functions'
import { useRouter } from 'next/router'

export const useAccountInUrl = (redirectPath: string): string | false => {
  const router = useRouter()
  const { account } = router.query

  if (!account || typeof account !== 'string' || !isAddress(account)) {
    router.replace(redirectPath)
    return false
  } else {
    return account
  }
}
