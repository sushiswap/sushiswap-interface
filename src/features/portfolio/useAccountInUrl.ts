import { isAddress } from 'app/functions'
import { useRouter } from 'next/router'

export const useAccountInUrl = (redirectPath: string): string | undefined => {
  const router = useRouter()
  const account = router.query.account as string

  if (!account || !isAddress(account)) {
    void router.replace(redirectPath)
  }

  return account
}
