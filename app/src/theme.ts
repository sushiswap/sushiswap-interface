import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    html {
        min-height: 100vh;
    }

    body {
        font-family: "DM Sans", sans-serif;
        background-color: #0D0415;
        overflow-y: auto;
        overflow-x: hidden
    }

    input, textarea {
        font-family: "DM Sans", sans-serif;
        font-display: fallback;
    }
`
