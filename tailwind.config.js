const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

module.exports = {
    darkMode: false, // or 'media' or 'class'
    important: true,
    theme: {
        linearBorderGradients: {
            directions: {
                // defaults to these values
                t: 'to top',
                tr: 'to top right',
                r: 'to right',
                br: 'to bottom right',
                b: 'to bottom',
                bl: 'to bottom left',
                l: 'to left',
                tl: 'to top left'
            },
            colors: {
                'blue-pink': ['#27B0E6', '#FA52A0'],
                'pink-red-light-brown': ['#FE5A75', '#FEC464']
            },
            background: {
                'dark-1000': '#0D0415',
                'dark-900': '#161522',
                'dark-800': '#202231',
                'dark-pink-red': '#4e3034'
            },
            border: {
                // defaults to these values (optional)
                '1': '1px',
                '2': '2px',
                '4': '4px'
            }
        },
        colors: {
            ...defaultTheme.colors,
            red: '#FF3838',
            blue: '#27B0E6',
            pink: '#FA52A0',
            purple: '#A755DD',
            green: '#7CFF6B',

            'pink-red': '#FE5A75',
            'light-brown': '#FEC464',
            'light-yellow': '#FFD166',
            'cyan-blue': '#0993EC',
            pink: '#F338C3',

            'dark-pink': '#221825',
            'dark-blue': '#0F182A',
            'dark-1000': '#0D0415',
            'dark-950': '#0d0d1f',
            'dark-900': '#161522',
            'dark-850': '#1d1e2c',
            'dark-800': '#202231',
            'dark-700': '#2E3348',
            'dark-600': '#1C2D49',
            'dark-500': '#223D5E',

            // TODO: bad... these are causing issues with text colors
            // 'high-emphesis': '#E3E3E3',
            primary: '#BFBFBF',
            secondary: '#7F7F7F',
            'low-emphesis': '#575757'
        },
        screens: {
            sm: '480px',
            md: '768px',
            lg: '976px',
            xl: '1440px'
        },
        fontSize: {
            ...defaultTheme.fontSize,
            hero: [
                '48px',
                {
                    letterSpacing: '-0.02em;',
                    lineHeight: '96px',
                    fontWeight: 700
                }
            ],
            h1: [
                '36px',
                {
                    letterSpacing: '-0.02em;',
                    lineHeight: '36px',
                    fontWeight: 700
                }
            ],
            h2: [
                '30px',
                {
                    letterSpacing: '-0.01em;',
                    lineHeight: '36px',
                    fontWeight: 700
                }
            ],
            h3: [
                '28px',
                {
                    letterSpacing: '-0.01em;',
                    lineHeight: '30px',
                    fontWeight: 700
                }
            ],
            h4: [
                '24px',
                {
                    letterSpacing: '-0.01em;',
                    lineHeight: '28px',
                    fontWeight: 700
                }
            ],
            h5: [
                '24px',
                {
                    letterSpacing: '-0.01em;',
                    lineHeight: '28px',
                    fontWeight: 500
                }
            ],
            body: [
                '18px',
                {
                    letterSpacing: '-0.01em;',
                    lineHeight: '26px'
                }
            ],
            caption: [
                '16px',
                {
                    lineHeight: '24px'
                }
            ],
            caption2: [
                '14px',
                {
                    lineHeight: '20px'
                }
            ]
        },
        extend: {
            lineHeight: {
                ...defaultTheme.lineHeight,
                '48px': '48px'
            },
            backgroundImage: theme => ({
                ...defaultTheme.backgroundImage,
                'bentobox-hero': "url('/src/assets/kashi/bentobox-hero.jpg')",
                'bentobox-logo': "url('/src/assets/kashi/bentobox-logo.png')"
            }),
            fontFamily: {
                sans: ['DM Sans', ...defaultTheme.fontFamily.sans]
            },
            borderRadius: {
                ...defaultTheme.borderRadius,
                none: '0',
                px: '1px',
                sm: '0.313rem',
                DEFAULT: '0.625rem'
            },
            textColor: {
                ...defaultTheme.textColor,
                'low-emphesis': '#575757',
                primary: '#BFBFBF',
                secondary: '#7F7F7F',
                'high-emphesis': '#E3E3E3'
            },
            backgroundColor: {
                ...defaultTheme.backgroundColor,
                input: '#2E3348'
            },
            boxShadow: {
                ...defaultTheme.boxShadow,
                'pink-glow': '0px 57px 90px -47px rgba(250, 82, 160, 0.15)',
                'blue-glow': '0px 57px 90px -47px rgba(39, 176, 230, 0.17)',
                'pink-glow-hovered': '0px 57px 90px -47px rgba(250, 82, 160, 0.30)',
                'blue-glow-hovered': '0px 57px 90px -47px rgba(39, 176, 230, 0.34)',

                'swap-blue-glow': '0px 50px 250px -47px rgba(39, 176, 230, 0.29)',
                'liquidity-purple-glow': '0px 50px 250px -47px rgba(123, 97, 255, 0.23);'
            },
            ringWidth: {
                ...defaultTheme.ringWidth,
                DEFAULT: '1px'
            },
            padding: {
                ...defaultTheme.padding,
                px: '1px',
                '3px': '3px'
            },
            outline: {
                ...defaultTheme.outline,
                'low-emphesis': '#575757'
            },
            animation: {
                ellipsis: ' ellipsis 1.25s infinite'
            },
            keyframes: {
                ellipsis: {
                    '0%': { content: '"."' },
                    '33%': { content: '".."' },
                    '66%': { content: '"..."' }
                }
            },
            minHeight: {
                cardContent: '230px',
                fitContent: 'fit-content'
            }
        }
    },
    variants: {
        linearBorderGradients: ['responsive', 'hover', 'dark'], // defaults to ['responsive']
        extend: {
            backgroundColor: ['checked', 'disabled'],
            backgroundImage: ['hover', 'focus'],
            borderColor: ['checked', 'disabled'],
            cursor: ['disabled'],
            opacity: ['hover', 'disabled'],
            placeholderColor: ['hover', 'active'],
            ringWidth: ['disabled'],
            ringColor: ['disabled']
        }
    },
    plugins: [
        // require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/aspect-ratio'),
        require('tailwindcss-border-gradient-radius'),
        plugin(function({ addUtilities }) {
            addUtilities({
                '.gradiant-border-bottom': {
                    background:
                        'linear-gradient(to right, rgba(39, 176, 230, 0.2) 0%, rgba(250, 82, 160, 0.2) 100%) left bottom no-repeat',
                    backgroundSize: '100% 1px'
                }
            })
        }),
        plugin(function({ addUtilities }) {
            addUtilities(
                {
                    '.border-gradient': {
                        border: 'double 1px transparent',
                        borderRadius: '0.375rem',
                        backgroundImage:
                            'linear-gradient(#202231, #202231), linear-gradient(to right, #0993EC, #F338C3)',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box'
                    }
                },
                {
                    variants: ['responsive']
                }
            )
        })
    ],
    corePlugins: {
        fontFamily: true,
        preflight: true
    },
    purge: process.env.NODE_ENV !== 'development' ? ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'] : false
}
