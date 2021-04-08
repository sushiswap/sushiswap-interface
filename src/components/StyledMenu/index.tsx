import styled from 'styled-components'

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  padding: 0.15rem 0.5rem;
  border-radius: 20px;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }

  // ${({ theme }) => theme.mediaWidth.upToMedium`
  //   margin-left: 4px;
  // `};
`

export const StyledMenu = styled.div`
    margin-left: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border: none;
    text-align: left;

    ${({ theme }) => theme.mediaWidth.upToExtra2Small`
    margin-left: 0.2rem;
  `};
`

export const MenuFlyout = styled.span`
    min-width: 8.125rem;
    background-color: ${({ theme }) => theme.bg3};
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
        0px 24px 32px rgba(0, 0, 0, 0.01);
    border-radius: ${({ theme }) => theme.borderRadius};
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    position: absolute;
    top: 3rem;
    right: 0rem;
    z-index: 100;
`
