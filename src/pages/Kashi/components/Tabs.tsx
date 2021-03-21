import 'react-tabs/style/react-tabs.css'
import React from 'react'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import styled from 'styled-components'

export const PrimaryTabs = styled(Tabs)`
  padding: 32px;
  .react-tabs__tab-list {
    display: flex;
    border-radius: 20px;
    background: ${({ theme }) => theme.mediumDarkPurple};
    font-size: 20px;
    font-weight: 700;
    padding: 4px;
    border: 0;
  }
  .react-tabs__tab {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    bottom: 0;
    color: ${({ theme }) => theme.mediumEmphesisText};
    padding: 16px 12px;
  }
  .react-tabs__tab--selected {
    background: ${({ theme }) => theme.baseCard};
    color: ${({ theme }) => theme.white};
    margin: 0;
    border: 0;
    bottom: 0;
  }
  .react-tabs__tab:focus:after {
    background: none;
  }
`

export const SecondaryTabs = styled(Tabs)`
  .react-tabs__tab-list {
    display: flex;
    font-size: 16px;
    font-weight: 700;
    border: 0;
    background: none;
  }
  .react-tabs__tab {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    background: ${({ theme }) => theme.extraDarkPurple};
    border-radius: 10px;
    bottom: 0;
    color: ${({ theme }) => theme.lowEmphesisText};
    padding: 8px 12px;
  }
  .react-tabs__tab:not(:first-child) {
    margin-left: 8px;
  }
  .react-tabs__tab--selected {
    background: ${({ theme }) => theme.mediumDarkPurple};
    color: ${({ theme }) => theme.white};
    margin: 0;
    border: 0;
    bottom: 0;
  }
  .react-tabs__tab:focus:after {
    background: none;
  }
`
