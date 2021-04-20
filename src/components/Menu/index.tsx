import { MenuFlyout, StyledMenu, StyledMenuButton } from 'components/StyledMenu'
import React, { useRef } from 'react'
import { BookOpen, Code, Info, MessageCircle, PieChart, Tool } from 'react-feather'
import styled from 'styled-components'
import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { useActiveWeb3React } from '../../hooks'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { ExternalLink, StyledInternalLink } from '../../theme'

const StyledMenuIcon = styled(MenuIcon)`
    path {
        stroke: ${({ theme }) => theme.text1};
    }
`

const MenuItem = styled(ExternalLink)`
    display: flex;
    align-items: center;
    flex: 1;
    padding: 0.5rem 0.5rem;
    color: ${({ theme }) => theme.text2};
    :hover {
        color: ${({ theme }) => theme.text1};
        cursor: pointer;
        text-decoration: none;
    }
    > svg {
        margin-right: 8px;
    }
`

const MenuItemInternal = styled(StyledInternalLink)`
    display: flex;
    align-items: center;
    padding: 0.5rem 0.5rem;
    color: ${({ theme }) => theme.text2};
    :hover {
        color: ${({ theme }) => theme.text1};
        cursor: pointer;
        text-decoration: none;
    }
    > svg {
        margin-right: 8px;
    }
`

const ExtendedStyledMenuButton = styled(StyledMenuButton)`
    margin-right: 6px;
`

const ExtendedMenuFlyout = styled(MenuFlyout)`
    ${({ theme }) => theme.mediaWidth.upToMedium`
    top: -16.5rem;
    margin-right: 6px;
  `};
`

const CODE_LINK = 'https://github.com/sushiswap/sushiswap-interface'

export default function Menu() {
    const { account } = useActiveWeb3React()

    const node = useRef<HTMLDivElement>(null)
    const open = useModalOpen(ApplicationModal.MENU)
    const toggle = useToggleModal(ApplicationModal.MENU)
    useOnClickOutside(node, open ? toggle : undefined)
    const openClaimModal = useToggleModal(ApplicationModal.ADDRESS_CLAIM)

    return (
        <StyledMenu ref={node}>
            <ExtendedStyledMenuButton onClick={toggle}>
                <StyledMenuIcon />
            </ExtendedStyledMenuButton>

            {open && (
                <ExtendedMenuFlyout>
                    <MenuItem id="link" href="#">
                        <Info size={14} />
                        About
                    </MenuItem>
                    <MenuItem id="link" href="https://docs.sushi.com">
                        <BookOpen size={14} />
                        Docs
                    </MenuItem>
                    <MenuItem id="link" href={CODE_LINK}>
                        <Code size={14} />
                        Code
                    </MenuItem>
                    <MenuItem id="link" href="https://discord.gg/NVPXN4e">
                        <MessageCircle size={14} />
                        Discord
                    </MenuItem>
                    <MenuItem id="link" href="https://analytics.sushi.com/">
                        <PieChart size={14} />
                        Analytics
                    </MenuItem>
                    <MenuItemInternal id="link" to="/tools">
                        <Tool size={14} />
                        Tools
                    </MenuItemInternal>
                    {/* {account && (
            <ButtonPrimary onClick={openClaimModal} padding="8px 16px" width="100%" borderradius="20px" mt="0.5rem">
              Claim UNI
            </ButtonPrimary>
          )} */}
                </ExtendedMenuFlyout>
            )}
        </StyledMenu>
    )
}
