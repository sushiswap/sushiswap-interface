import PointlistCreationFormSetup from 'app/features/miso/PointlistCreationForm/PointListCreationFormSetup'
import React, { FC, useState } from 'react'

const PointlistCreationForm: FC = () => {
  const [listAddress, setListAddress] = useState<string>()

  if (listAddress) {
    alert(listAddress)
  }

  return (
    <>
      <PointlistCreationFormSetup onAddress={setListAddress} />
    </>
  )
}

export default PointlistCreationForm
