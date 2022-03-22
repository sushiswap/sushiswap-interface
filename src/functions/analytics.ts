import ReactGA from 'react-ga'

export const logPageView = () => {
  console.log(`Logging pageview for ${window.location.pathname}`)
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}

export const logEvent = (category = '', action = '', label = '', value: number | undefined = undefined) => {
  if (category && action) {
    ReactGA.event({ category, action, label, value })
  }
}

export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal })
  }
}
