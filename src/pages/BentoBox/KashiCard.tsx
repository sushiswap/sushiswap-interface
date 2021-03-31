import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Text } from 'rebass'
import { RowBetween } from '../../components/Row'
import { ButtonSecondary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { DarkCard } from '../../components/Card'
import { useActiveWeb3React } from 'hooks'
import Web3Status from 'components/Web3Status'
import useKashi from 'kashi/hooks/useKashi'
import KashiNeonSign from '../../assets/kashi/kashi-neon.png'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

const KashiCard = () => {
  const { account } = useActiveWeb3React()
  const { kashiApproved, approve } = useKashi()

  // handle approval
  const [requestedApproval, setRequestedApproval] = useState(false)
  const handleApprove = useCallback(async () => {
    //console.log("SEEKING APPROVAL");
    try {
      setRequestedApproval(true)
      const txHash = await approve()
      console.log(txHash)
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.log(e)
    }
  }, [approve])

  console.log('kashiApproved:', kashiApproved)

  return (
    <>
      <DarkCard padding="1rem">
        <AutoColumn gap="sm" justify="center">
          <div className="relative w-full">
            <img src={KashiNeonSign} style={{ marginTop: '-4rem' }} className="block m-auto w-2/3 sm:w-full" />
          </div>
          {/* <Text fontWeight={600} fontSize={16}>
        Margin Trading
      </Text> */}
          <div className="w-full">
            {account ? (
              kashiApproved && kashiApproved === true ? (
                <Link to={'/bento/kashi/borrow'}>
                  <ButtonSecondary padding="10px 8px" margin="0px" borderRadius="6px">
                    <Text fontWeight={500} fontSize={16}>
                      Enter
                    </Text>
                  </ButtonSecondary>
                </Link>
              ) : (
                <>
                  <ButtonSecondary padding="10px 8px" margin="0px" borderRadius="6px" onClick={handleApprove}>
                    <Text fontWeight={500} fontSize={16}>
                      Enable Kashi
                    </Text>
                  </ButtonSecondary>
                  {/* <Link to={'/bento/kashi/supply'}>
                    <ButtonEmpty padding="4px 2px" margin="0px" borderRadius="6px">
                      <Text fontWeight={500} fontSize={16}>
                        Preview
                      </Text>
                    </ButtonEmpty>
                  </Link> */}
                </>
              )
            ) : (
              <Web3Status />
            )}
          </div>
        </AutoColumn>
      </DarkCard>
    </>
  )
}

export default KashiCard
