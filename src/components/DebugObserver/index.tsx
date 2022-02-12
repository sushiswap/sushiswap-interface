import { useEffect } from 'react'
import { useRecoilSnapshot } from 'recoil'

export function DebugObserver(): JSX.Element {
  const snapshot = useRecoilSnapshot()
  useEffect(() => {
    console.debug('The following atoms were modified:')
    for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
      console.debug(node.key, snapshot.getLoadable(node))
    }
  }, [snapshot])

  // @ts-ignore TYPE NEEDS FIXING
  return null
}
