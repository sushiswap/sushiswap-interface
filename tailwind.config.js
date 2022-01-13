const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

module.exports = {
  // important: '#__next',
  // darkMode: true,
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  // darkMode: false,
  theme: {
    extend: {
      gridTemplateColumns: {
        'token-section': 'auto minmax(auto, 1fr) auto',
      },
      // TODO: #129 Refactor to use with next-image @chillichelli
      backgroundImage: (theme) => ({
        'bars-pattern': "url('/images/trident/bars-pattern.png')",
        'binary-pattern': "url('/images/trident/binary-pattern.png')",
        'bubble-pattern': "url('/images/trident/bubble-pattern.png')",
        'dots-pattern': "url('/images/trident/dots-pattern.png')",
        'x-times-y-is-k': "url('/images/trident/x-times-y-is-k.png')",
        'wavy-pattern': "url('/images/trident/wavy-pattern.png')",
        'chevron-pattern': "url('/images/trident/chevron-pattern.png')",
        'miso-bowl': "url('/images/miso/banner.jpg')",
        'gradient-radial': 'radial-gradient(100% 100% at 50% 25%, var(--tw-gradient-stops))',
      }),
      linearBorderGradients: {
        directions: {
          t: 'to top',
          tr: 'to top right',
          r: 'to right',
        },
        colors: {
          'blue-pink': ['#0993ec', '#f338c3'],
          'pink-red-light-brown': ['#FE5A75', '#FEC464'],
        },
        background: {
          'dark-1000': '#0D0415',
          'dark-900': '#161522',
          'dark-800': '#202231',
          'dark-pink-red': '#4e3034',
        },
        border: {
          1: '1px',
          2: '2px',
          3: '3px',
          4: '4px',
        },
      },
      colors: {
        purple: '#a755dd',
        blue: '#0993ec',
        pink: '#f338c3',
        green: '#7cff6b',
        red: '#ff3838',
        yellow: '#ffd166',

        'opaque-blue': '#0993ec80',
        'transparent-blue': '#0993EC2A',
        'transparent-pink': '#FE5A752A',
        'opaque-pink': '#f338c380',
        'pink-red': '#FE5A75',
        'light-brown': '#FEC464',
        'light-yellow': '#FFD166',
        'cyan-blue': '#0993EC',
        'dark-pink': '#221825',
        'dark-blue': '#0F182A',
        'dark-1000': '#0D0415',
        'dark-900': '#161522',
        'dark-850': '#1d1e2c',
        'dark-800': '#202231',
        'dark-700': '#2E3348',
        'dark-600': '#1C2D49',
        'dark-500': '#223D5E',
        'dark-400': '#545f7b',
        'low-emphesis': '#575757',
        primary: '#BFBFBF',
        secondary: '#7F7F7F',
        'high-emphesis': '#E3E3E3',
      },
      lineHeight: {
        '48px': '48px',
      },
      fontFamily: {
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        hero: [
          '48px',
          {
            letterSpacing: '-0.02em;',
            lineHeight: '96px',
            fontWeight: 700,
          },
        ],
      },
      borderRadius: {
        none: '0',
        px: '1px',
        DEFAULT: '0.625rem',
      },
      boxShadow: {
        swap: '0px 50px 250px -47px rgba(39, 176, 230, 0.29)',
        liquidity: '0px 50px 250px -47px rgba(123, 97, 255, 0.23)',
        'pink-glow': '0px 57px 90px -47px rgba(250, 82, 160, 0.15)',
        'blue-glow': '0px 57px 90px -47px rgba(39, 176, 230, 0.17)',
        'pink-glow-hovered': '0px 57px 90px -47px rgba(250, 82, 160, 0.30)',
        'blue-glow-hovered': '0px 57px 90px -47px rgba(39, 176, 230, 0.34)',
      },
      ringWidth: {
        DEFAULT: '1px',
      },
      padding: {
        px: '1px',
        '3px': '3px',
      },
      minHeight: {
        empty: '128px',
        cardContent: '230px',
        fitContent: 'fit-content',
      },
      minHeight: {
        5: '1.25rem',
      },
      minWidth: {
        5: '1.25rem',
      },
      dropShadow: {
        currencyLogo: '0px 3px 6px rgba(15, 15, 15, 0.25)',
      },
      screens: {
        '3xl': '1600px',
      },
      animation: {
        ellipsis: 'ellipsis 1.25s infinite',
        'spin-slow': 'spin 2s linear infinite',
        fade: 'opacity 150ms linear',
      },
      keyframes: {
        ellipsis: {
          '0%': { content: '"."' },
          '33%': { content: '".."' },
          '66%': { content: '"..."' },
        },
        opacity: {
          '0%': { opacity: 0 },
          '100%': { opacity: 100 },
        },
      },
    },
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
      ringColor: ['disabled'],
    },
  },
  plugins: [
    require('tailwindcss-border-gradient-radius'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.header-border-b': {
          background:
            'linear-gradient(to right, rgba(39, 176, 230, 0.2) 0%, rgba(250, 82, 160, 0.2) 100%) left bottom no-repeat',
          backgroundSize: '100% 1px',
        },
      })
    }),
  ],
}
