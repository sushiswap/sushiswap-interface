import styled from 'styled-components'

// A button that triggers some onClick result, but looks like a link.
const LinkStyledButton = styled.button<{ disabled?: boolean }>`
    border: none;
    text-decoration: none;
    background: none;

    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
    color: ${({ theme, disabled }) => (disabled ? theme.text2 : theme.primary1)};
    font-weight: 500;

    :hover {
        text-decoration: ${({ disabled }) => (disabled ? null : 'underline')};
    }

    :focus {
        outline: none;
        text-decoration: ${({ disabled }) => (disabled ? null : 'underline')};
    }

    :active {
        text-decoration: none;
    }
`

export default LinkStyledButton
