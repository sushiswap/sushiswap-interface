import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { ChevronLeft } from 'react-feather'

const BackButton = ({ defaultRoute }: any) => {
  const history = useHistory()
  return (
    <>
      <button
        onClick={() => {
          if (history.length < 3) {
            history.push(defaultRoute)
          } else {
            history.goBack()
          }
        }}
        className={`p-2 mr-4 rounded-full bg-kashi-card-inner`}
      >
        <ChevronLeft strokeWidth={2} size={24} />
      </button>
    </>
  )
}

export default BackButton
