import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { GradientButton, Card } from 'kashi/components'
import { useActiveWeb3React } from 'hooks'
import Web3Status from 'components/Web3Status'
import useKashi from 'kashi/hooks/useKashi'
import KashiNeonSign from '../../assets/kashi/kashi-neon.png'
import ComingSoon from '../../assets/kashi/coming-soon.svg'
import BentoBoxLogo from '../../assets/kashi/bentobox-logo.svg'
function BentoBox(): JSX.Element {
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
    <div>
      <div className="absolute bg-dark-1000 top-0 right-0 bottom-0 left-0" />
      <div
        style={{
          position: 'absolute',
          top: '-130px',
          right: 0,
          bottom: 0,
          left: 0
        }}
        className="bg-bentobox-hero bg-top bg-auto opacity-30 bg-no-repeat"
      />

      <div className="relative pt-48">
        <img alt="" src={BentoBoxLogo} className="w-80 h-auto -mt-52 mx-auto" />
        <div className="container mx-auto max-w-3xl">
          <div className="flex flex-col justify-center">
            <div className="font-bold text-6xl text-high-emphesis text-center">BentoBox Apps</div>
          </div>
          <div className="font-medium text-center text-high-emphesis mt-4 mb-8 p-4">
            BentoBox is a revolutionary new way from SUSHI to interact with dapps on L1 in a highly gas efficient
            manner. In order to use any one of the decentralized apps below you&apos;ll need to first enable them and
            deposit any ERC20 asset to your BentoBox balance.
          </div>
          {/* List of Apps */}
        </div>
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid gap-12 grid-flow-auto grid-cols-4">
            <Card className="col-span-4 sm:col-span-2 md:col-span-1 w-full bg-dark-800 hover:bg-dark-900 cursor-pointer rounded shadow-pink-glow hover:shadow-pink-glow-hovered">
              <div className="relative w-full">
                <img alt="" src={KashiNeonSign} className="block m-auto w-full h-auto mb-4" />
                {account ? (
                  kashiApproved && kashiApproved === true ? (
                    <Link to={'/bento/kashi/borrow'}>
                      <GradientButton className="w-full rounded text-base text-high-emphesis px-4 py-3">
                        Enter
                      </GradientButton>
                    </Link>
                  ) : (
                    <GradientButton
                      className="w-full rounded text-base text-high-emphesis px-4 py-3"
                      onClick={handleApprove}
                    >
                      Enable Kashi
                    </GradientButton>
                  )
                ) : (
                  <Web3Status />
                )}
              </div>
            </Card>
            <Card className="flex items-center justify-center col-span-4 sm:col-span-2 md:col-span-1  bg-dark-800 hover:bg-dark-900 cursor-pointer shadow-blue-glow hover:shadow-blue-glow-hovered transition-colors">
              <img src={ComingSoon} alt="Coming Soon" />
            </Card>
            <Card className="flex items-center justify-center col-span-4 sm:col-span-2 md:col-span-1 bg-dark-800 hover:bg-dark-900 cursor-pointer shadow-pink-glow hover:shadow-pink-glow-hovered transition-colors">
              <img src={ComingSoon} alt="Coming Soon" />
            </Card>
            <Card className="flex items-center justify-center col-span-4 sm:col-span-2 md:col-span-1 bg-dark-800 hover:bg-dark-900 cursor-pointer shadow-blue-glow hover:shadow-blue-glow-hovered transition-colors">
              <img src={ComingSoon} alt="Coming Soon" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BentoBox
