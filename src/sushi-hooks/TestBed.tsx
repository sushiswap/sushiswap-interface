import React from 'react'
import useDashboard from './useDashboard'

const TestBed = () => {
  const { find } = useDashboard()
  find()
  return <></>
}

export default TestBed
