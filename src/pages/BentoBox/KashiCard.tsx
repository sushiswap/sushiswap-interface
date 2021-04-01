import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card } from 'kashi/components'
import { useActiveWeb3React } from 'hooks'
import Web3Status from 'components/Web3Status'
import useKashi from 'kashi/hooks/useKashi'
import KashiNeonSign from '../../assets/kashi/kashi-neon.png'

const KashiCard = () => {
  const { account } = useActiveWeb3React()
  const { kashiApproved, approveMaster } = useKashi()

  const [requestedApproval, setRequestedApproval] = useState(false)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await approveMaster()
      console.log(txHash)
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.log(e)
    }
  }, [approveMaster])

  console.log('kashiApproved:', kashiApproved)

  return (
    <Card className="w-full bg-primary">
      <div className="relative w-full">
        <img alt="" src={KashiNeonSign} className="block m-auto w-2/3 mb-4" />
        {account ? (
          kashiApproved && kashiApproved === true ? (
            <Link to={'/bento/kashi/borrow'}>
              <Button className="w-full bg-pink transition duration-150 ease-in-out focus:outline-none rounded text-sm text-high-emphesis px-4 py-3">
                Enter
              </Button>
            </Link>
          ) : (
            <Button
              className="w-full bg-pink transition duration-150 ease-in-out focus:outline-none rounded text-sm text-high-emphesis px-4 py-3"
              onClick={handleApprove}
            >
              Enable Kashi
            </Button>
          )
        ) : (
          <Web3Status />
        )}
      </div>
    </Card>
  )
}

export default KashiCard
