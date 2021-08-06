import NavLink from '../../components/NavLink'
import React from 'react'

const Menu = () => {
  return (
    <div className="space-y-4">
      <NavLink
        href="/analytics/dashboard"
        activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
      >
        <a className="flex items-center px-1 py-3 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
          {/* <svg width="29" height="31" viewBox="0 0 29 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.70833 10.875C2.89058 10.875 2.10632 10.5501 1.52809 9.97189C0.94985 9.39365 0.625 8.6094 0.625 7.79165V3.16665C0.625 2.3489 0.94985 1.56464 1.52809 0.9864C2.10632 0.408163 2.89058 0.083313 3.70833 0.083313H9.875C10.6928 0.083313 11.477 0.408163 12.0552 0.9864C12.6335 1.56464 12.9583 2.3489 12.9583 3.16665V7.79165C12.9583 8.6094 12.6335 9.39365 12.0552 9.97189C11.477 10.5501 10.6928 10.875 9.875 10.875H3.70833ZM3.70833 30.9166C2.89058 30.9166 2.10632 30.5918 1.52809 30.0136C0.94985 29.4353 0.625 28.6511 0.625 27.8333V15.5C0.625 14.6822 0.94985 13.898 1.52809 13.3197C2.10632 12.7415 2.89058 12.4166 3.70833 12.4166H9.875C10.6928 12.4166 11.477 12.7415 12.0552 13.3197C12.6335 13.898 12.9583 14.6822 12.9583 15.5V27.8333C12.9583 28.6511 12.6335 29.4353 12.0552 30.0136C11.477 30.5918 10.6928 30.9166 9.875 30.9166H3.70833ZM19.125 30.9166C18.3072 30.9166 17.523 30.5918 16.9448 30.0136C16.3665 29.4353 16.0417 28.6511 16.0417 27.8333V24.75C16.0417 23.9322 16.3665 23.148 16.9448 22.5697C17.523 21.9915 18.3072 21.6666 19.125 21.6666H25.2917C26.1094 21.6666 26.8937 21.9915 27.4719 22.5697C28.0501 23.148 28.375 23.9322 28.375 24.75V27.8333C28.375 28.6511 28.0501 29.4353 27.4719 30.0136C26.8937 30.5918 26.1094 30.9166 25.2917 30.9166H19.125ZM19.125 18.5833C18.3072 18.5833 17.523 18.2585 16.9448 17.6802C16.3665 17.102 16.0417 16.3177 16.0417 15.5V3.16665C16.0417 2.3489 16.3665 1.56464 16.9448 0.9864C17.523 0.408163 18.3072 0.083313 19.125 0.083313H25.2917C26.1094 0.083313 26.8937 0.408163 27.4719 0.9864C28.0501 1.56464 28.375 2.3489 28.375 3.16665V15.5C28.375 16.3177 28.0501 17.102 27.4719 17.6802C26.8937 18.2585 26.1094 18.5833 25.2917 18.5833H19.125Z" fill="#BFBFBF"/>
          </svg> */}
          <div className="ml-5">Dashboard</div>
        </a>
      </NavLink>

      {/* <NavLink
        href="/analytics/portfolio"
        activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
      >
        <a className="flex items-center px-1 py-3 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
          <svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.4844 21.2969H2.64062V0.578125C2.64062 0.432031 2.52109 0.3125 2.375 0.3125H0.515625C0.369531 0.3125 0.25 0.432031 0.25 0.578125V23.4219C0.25 23.568 0.369531 23.6875 0.515625 23.6875H25.4844C25.6305 23.6875 25.75 23.568 25.75 23.4219V21.5625C25.75 21.4164 25.6305 21.2969 25.4844 21.2969ZM5.03125 19.1719H22.8281C22.9742 19.1719 23.0938 19.0523 23.0938 18.9062V4.42969C23.0938 4.19062 22.8049 4.07441 22.6389 4.24043L15.6562 11.223L11.4926 7.10586C11.4427 7.05643 11.3752 7.0287 11.305 7.0287C11.2347 7.0287 11.1673 7.05643 11.1174 7.10586L4.84199 13.4012C4.81762 13.4256 4.79832 13.4546 4.78521 13.4865C4.77211 13.5184 4.76545 13.5526 4.76562 13.5871V18.9062C4.76562 19.0523 4.88516 19.1719 5.03125 19.1719Z" fill="#BFBFBF"/>
          </svg>
          <div className="ml-5">Portfolio</div>
        </a>
      </NavLink> */}

      <NavLink
        href="/analytics/bar"
        activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
      >
        <a className="flex items-center px-1 py-3 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
          {/* <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M29.6875 13.0625H17.8125C17.4976 13.0625 17.1955 13.1876 16.9728 13.4103C16.7501 13.633 16.625 13.9351 16.625 14.25V19C16.6279 20.6822 17.2254 22.3093 18.3119 23.5935C19.3984 24.8778 20.904 25.7366 22.5625 26.0181V33.25H19V35.625H28.5V33.25H24.9375V26.0181C26.596 25.7366 28.1016 24.8778 29.1881 23.5935C30.2746 22.3093 30.8721 20.6822 30.875 19V14.25C30.875 13.9351 30.7499 13.633 30.5272 13.4103C30.3045 13.1876 30.0024 13.0625 29.6875 13.0625ZM28.5 19C28.5 20.2598 27.9996 21.468 27.1088 22.3588C26.218 23.2496 25.0098 23.75 23.75 23.75C22.4902 23.75 21.282 23.2496 20.3912 22.3588C19.5004 21.468 19 20.2598 19 19V15.4375H28.5V19Z" fill="#BFBFBF"/>
            <path d="M17.8125 1.1875H11.875C11.56 1.1875 11.258 1.31261 11.0353 1.53531C10.8126 1.75801 10.6875 2.06006 10.6875 2.375V11.1269C9.53354 11.8029 8.58967 12.7856 7.96076 13.9659C7.33185 15.1462 7.04253 16.4777 7.12496 17.8125V34.4375C7.12496 34.7524 7.25007 35.0545 7.47277 35.2772C7.69547 35.4999 7.99751 35.625 8.31246 35.625H14.25V33.25H9.49996V17.8125C9.49996 14.0267 12.1493 13.0388 12.2502 13.0019L13.0625 12.73V3.5625H16.625V9.5H19V2.375C19 2.06006 18.8748 1.75801 18.6521 1.53531C18.4294 1.31261 18.1274 1.1875 17.8125 1.1875Z" fill="#BFBFBF"/>
          </svg> */}
          <div className="ml-5">Bar</div>
        </a>
      </NavLink>

      <NavLink
        href="/analytics/pools"
        activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
      >
        <a className="flex items-center px-1 py-3 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
          <div className="ml-5">Pools</div>
        </a>
      </NavLink>

      <NavLink
        href="/analytics/pairs"
        activeClassName="bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
      >
        <a className="flex items-center px-1 py-3 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
          {/* <svg width="35" height="25" viewBox="0 0 35 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.375 0.541626C14.1516 0.541626 15.8941 0.951626 17.5 1.70329C19.1058 0.951626 20.8483 0.541626 22.625 0.541626C25.7965 0.541626 28.8382 1.80152 31.0808 4.04414C33.3234 6.28676 34.5833 9.32841 34.5833 12.5C34.5833 15.6715 33.3234 18.7132 31.0808 20.9558C28.8382 23.1984 25.7965 24.4583 22.625 24.4583C20.8483 24.4583 19.1058 24.0483 17.5 23.2966C15.8941 24.0483 14.1516 24.4583 12.375 24.4583C9.20341 24.4583 6.16176 23.1984 3.91914 20.9558C1.67652 18.7132 0.416626 15.6715 0.416626 12.5C0.416626 9.32841 1.67652 6.28676 3.91914 4.04414C6.16176 1.80152 9.20341 0.541626 12.375 0.541626ZM12.375 12.5C12.375 16.2925 14.442 19.6066 17.5 21.3833C20.5579 19.6066 22.625 16.2925 22.625 12.5C22.625 8.70746 20.5579 5.39329 17.5 3.61663C14.442 5.39329 12.375 8.70746 12.375 12.5Z" fill="#BFBFBF"/>
          </svg> */}
          <div className="ml-5">Pairs</div>
        </a>
      </NavLink>

      <NavLink
        href="/analytics/tokens"
        activeClassName="bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
      >
        <a className="flex items-center px-1 py-3 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
          {/* <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.75 6C7.015 6 0.75 12.265 0.75 20C0.75 27.735 7.015 34 14.75 34C22.485 34 28.75 27.735 28.75 20C28.75 12.265 22.485 6 14.75 6ZM20 17.375H16.5V26.125H13V17.375H9.5V14.75H20V17.375ZM34.4375 5.5625L39.25 7.75L34.4375 9.9375L32.25 14.75L30.0625 9.9375L25.25 7.75L30.0625 5.5625L32.25 0.75L34.4375 5.5625ZM34.4375 30.0625L39.25 32.25L34.4375 34.4375L32.25 39.25L30.0625 34.4375L25.25 32.25L30.0625 30.0625L32.25 25.25L34.4375 30.0625Z" fill="#BFBFBF"/>
          </svg> */}
          <div className="ml-5">Tokens</div>
        </a>
      </NavLink>
    </div>
  )
}

export default Menu
