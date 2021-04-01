import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useHistory } from 'react-router-dom'

import { ChevronLeft } from 'react-feather'

const BackButton = ({ defaultRoute }: any) => {
  const theme = useContext(ThemeContext)
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
        className="mr-4 p-2 rounded-full"
        style={{ background: theme.baseCard }}
      >
        <ChevronLeft strokeWidth={2} size={24} />
      </button>
    </>
  )
}

export default BackButton
