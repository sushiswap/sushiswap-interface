import React from 'react'
import useSushiMaker from './useSushiMaker'

const TestBed = () => {
  const { serveAll } = useSushiMaker()
  serveAll()
  return <></>
}

export default TestBed
