import styled from 'styled-components'

const ButtonText = styled.button`
    outline: none;
    border: none;
    font-size: inherit;
    padding: 0;
    margin: 0;
    background: none;
    cursor: pointer;

    :hover {
        opacity: 0.7;
    }

    :focus {
        text-decoration: underline;
    }
`

export default ButtonText
