import { transparentize } from 'polished'
import React, { useMemo } from 'react'
import styled, {
    ThemeProvider as StyledComponentsThemeProvider,
    createGlobalStyle,
    css,
    DefaultTheme,
    keyframes
} from 'styled-components'
import { useIsDarkMode } from '../state/user/hooks'
import { Text, TextProps } from 'rebass'
import { Colors } from './styled'

//import BentoBackground from '../assets/kashi/bento-background.jpg'
import BrickWallBackground from '../assets/kashi/brickwall.png'

export * from './components'

const MEDIA_WIDTHS = {
    upToExtra2Small: 320,
    upToExtraSmall: 500,
    upToSmall: 720,
    upToMedium: 960,
    upToLarge: 1280
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
    (accumulator, size) => {
        ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
            @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
                ${css(a, b, c)}
            }
        `
        return accumulator
    },
    {}
) as any

const white = '#FFFFFF'
const black = '#000000'

export function colors(darkMode: boolean): Colors {
    return {
        // base
        white,
        black,

        // text
        text1: darkMode ? '#FFFFFF' : '#000000',
        text2: darkMode ? '#C3C5CB' : '#565A69',
        text3: darkMode ? '#6C7284' : '#888D9B',
        text4: darkMode ? '#565A69' : '#C3C5CB',
        text5: darkMode ? '#2C2F36' : '#EDEEF2',

        // backgrounds / greys
        bg1: darkMode ? '#18212e' : '#FFFFFF',
        bg2: darkMode ? '#202d3f' : '#F7F8FA',
        bg3: darkMode ? '#2a3a50' : '#EDEEF2',
        bg4: darkMode ? '#3a506f' : '#CED0D9',
        bg5: darkMode ? '#6C7284' : '#888D9B',
        bg6: darkMode ? '#232636' : '#CED0D9', // bentobox base
        bg7: darkMode ? '#19212e' : '#FFFFFF', // bentobox dark card

        //specialty colors
        modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
        advancedBG: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)',

        //primary colors
        primary1: darkMode ? '#0094ec' : '#0e0e23',
        primary2: darkMode ? '#0097fb' : '#FF8CC3',
        primary3: darkMode ? '#00aff5' : '#FF99C9',
        primary4: darkMode ? '#376bad70' : '#F6DDE8',
        primary5: darkMode ? '#153d6f70' : '#ebebeb',

        // color text
        primaryText1: darkMode ? '#6da8ff' : '#0e0e23',

        // secondary colors
        secondary1: darkMode ? '#0094ec' : '#ff007a',
        secondary2: darkMode ? '#17000b26' : '#F6DDE8',
        secondary3: darkMode ? '#17000b26' : '#ebebeb',

        // other
        red1: '#FD4040',
        red2: '#F82D3A',
        red3: '#D60000',
        green1: '#27AE60',
        yellow1: '#FFE270',
        yellow2: '#F3841E',
        blue1: '#0094ec',

        borderRadius: '20px',
        darkMode: darkMode,

        // dont wanna forget these blue yet
        // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
        // blue5: darkMode ? '#153d6f70' : '#EBF4FF',

        // BentoBox/Kashi
        extraHighEmphesisText: '#e3e3e3',
        lowEmphesisText: '#575757',
        mediumEmphesisText: '#7f7f7f',
        highEmphesisText: '#bfbfbf',
        mediumDarkPurple: '#1d212f',
        extraDarkPurple: '#1a1d29',
        primaryPink: 'rgb(221, 85, 151)',
        baseCard: '#222636',
        primaryButton: '#38507a',
        alertYellow: '#bfbf31',
        primaryBlue: 'rgb(108, 168, 255)'
    }
}

export function theme(darkMode: boolean): DefaultTheme {
    return {
        ...colors(darkMode),

        grids: {
            sm: 8,
            md: 12,
            lg: 24
        },

        //shadows
        shadow1: darkMode ? '#000' : '#2F80ED',

        // media queries
        mediaWidth: mediaWidthTemplates,

        // css snippets
        flexColumnNoWrap: css`
            display: flex;
            flex-flow: column nowrap;
        `,
        flexRowNoWrap: css`
            display: flex;
            flex-flow: row nowrap;
        `
    }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    //const darkMode = useIsDarkMode()
    const darkMode = true

    const themeObject = useMemo(() => theme(darkMode), [darkMode])
    //console.log('themeObject:', themeObject)

    return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
    color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
    main(props: TextProps) {
        return <TextWrapper fontWeight={500} color={'text2'} {...props} />
    },
    link(props: TextProps) {
        return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
    },
    black(props: TextProps) {
        return <TextWrapper fontWeight={500} color={'text1'} {...props} />
    },
    white(props: TextProps) {
        return <TextWrapper fontWeight={500} color={'white'} {...props} />
    },
    body(props: TextProps) {
        return <TextWrapper fontWeight={700} fontSize={[12, 14, 16]} color={'highEmphesisText'} {...props} />
    },
    extraLargeHeader(props: TextProps) {
        return <TextWrapper fontWeight={700} fontSize={[20, 28, 36]} color={'extraHighEmphesisText'} {...props} />
    },
    largeHeader(props: TextProps) {
        return <TextWrapper fontWeight={700} fontSize={[16, 22, 28]} color={'highEmphesisText'} {...props} />
    },
    mediumLargeHeader(props: TextProps) {
        return <TextWrapper fontWeight={700} fontSize={[14, 20, 24]} color={'highEmphesisText'} {...props} />
    },
    mediumHeader(props: TextProps) {
        return <TextWrapper fontWeight={700} fontSize={[14, 16, 18]} color={'mediumEmphesisText'} {...props} />
    },
    subHeader(props: TextProps) {
        return <TextWrapper fontWeight={700} fontSize={14} {...props} />
    },
    small(props: TextProps) {
        return <TextWrapper fontWeight={700} fontSize={11} {...props} />
    },
    blue(props: TextProps) {
        return <TextWrapper fontWeight={700} color={'primaryBlue'} {...props} />
    },
    pink(props: TextProps) {
        return <TextWrapper fontWeight={700} color={'primaryPink'} {...props} />
    },
    yellow(props: TextProps) {
        return <TextWrapper fontWeight={700} color={'yellow1'} {...props} />
    },
    darkGray(props: TextProps) {
        return <TextWrapper fontWeight={700} color={'text3'} {...props} />
    },
    gray(props: TextProps) {
        return <TextWrapper fontWeight={700} color={'bg3'} {...props} />
    },
    italic(props: TextProps) {
        return <TextWrapper fontWeight={700} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
    },
    error({ error, ...props }: { error: boolean } & TextProps) {
        return <TextWrapper fontWeight={700} color={error ? 'red1' : 'text2'} {...props} />
    }
}

export const FixedGlobalStyle = createGlobalStyle`
html, input, textarea, button {
  font-family: "DM Sans", sans-serif;
  font-display: fallback;
}
input, textarea {
  font-family: 'Inter', sans-serif;
  font-display: fallback;
}
@supports (font-variation-settings: normal) {
  html, button {
    font-family: "DM Sans", sans-serif;
  }
  input, textarea {
    // font-family: 'Inter var', sans-serif;
  }
}

html,
body {
  margin: 0;
  padding: 0;
}

 a {
   color: ${colors(false).blue1}; 
 }

* {
  box-sizing: border-box;
}

button {
  user-select: none;
}

html {
  font-size: 16px;
  font-variant: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;
}
`

const breatheAnimation = keyframes`
  0% {filter: hue-rotate(0deg) brightness(1)}
  100% {filter: hue-rotate(90deg) brightness(1.5)}
  100% {filter: hue-rotate(360deg) brightness(1)}
`

export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.text1};
}

body {
  min-height: 100vh;
  background-color: #0D0415;
}

body::after {    
  content: "";
  
  min-height: 100vh;


  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM0 28l14.142 14.142-1.414 1.414L0 30.828V28zm0 5.657L11.314 44.97 9.9 46.386l-9.9-9.9v-2.828zm0 5.657L8.485 47.8 7.07 49.212 0 42.143v-2.83zm0 5.657l5.657 5.657-1.414 1.415L0 47.8v-2.83zm0 5.657l2.828 2.83-1.414 1.413L0 53.456v-2.83zM54.627 60L30 35.373 5.373 60H8.2L30 38.2 51.8 60h2.827zm-5.656 0L30 41.03 11.03 60h2.828L30 43.858 46.142 60h2.83zm-5.656 0L30 46.686 16.686 60h2.83L30 49.515 40.485 60h2.83zm-5.657 0L30 52.343 22.343 60h2.83L30 55.172 34.828 60h2.83zM32 60l-2-2-2 2h4zM59.716 0l-28 28 1.414 1.414L60 2.544V0h-.284zM60 5.373L34.544 30.828l1.414 1.415L60 8.2V5.374zm0 5.656L37.373 33.656l1.414 1.414L60 13.86v-2.83zm0 5.656l-19.8 19.8 1.415 1.413L60 19.514v-2.83zm0 5.657l-16.97 16.97 1.414 1.415L60 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.413 7.07-7.07v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.658 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413 7.07-7.07 7.07 7.07zm-2.827 2.83l1.414-1.416L30 14.97l-5.657 5.657 1.414 1.415L30 17.8l4.243 4.242zm-2.83 2.827l1.415-1.414L30 20.626l-2.828 2.83 1.414 1.414L30 23.456l1.414 1.414zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z' fill='%239C92AC' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E");

  background-repeat: repeat;

  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 1;
}
`
