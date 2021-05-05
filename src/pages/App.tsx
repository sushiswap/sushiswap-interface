import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import { AppBar, Polling, Popups } from '../components'
import Web3ReactManager from '../components/Web3ReactManager'
import ReactGA from 'react-ga'
import Routes from '../routes'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../state'
import { updateUserDarkMode } from '../state/user/actions'
import { parse } from 'qs'

function App(): JSX.Element {
    const bodyRef = useRef<any>(null)

    const { pathname, search } = useLocation()

    const dispatch = useDispatch<AppDispatch>()

    const [wrapperClassList, setWrapperClassList] = useState("flex flex-col flex-1 items-center justify-start w-screen h-full overflow-y-auto overflow-x-hidden z-0 pt-4 sm:pt-8 px-4 md:pt-10 pb-20")

    useEffect(() => {
        if(pathname === '/trade') {
            setWrapperClassList("flex flex-col flex-1 items-center justify-start w-screen h-full overflow-y-auto overflow-x-hidden z-0")
        } else {
            setWrapperClassList("flex flex-col flex-1 items-center justify-start w-screen h-full overflow-y-auto overflow-x-hidden z-0 pt-4 sm:pt-8 px-4 md:pt-10 pb-20")
        }
    }, [pathname])

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTo(0, 0)
        }
    }, [pathname])

    useEffect(() => {
        ReactGA.pageview(`${pathname}${search}`)
    }, [pathname, search])

    useEffect(() => {
        if (!search) return
        if (search.length < 2) return

        const parsed = parse(search, {
            parseArrays: false,
            ignoreQueryPrefix: true
        })

        const theme = parsed.theme

        if (typeof theme !== 'string') return

        if (theme.toLowerCase() === 'light') {
            dispatch(updateUserDarkMode({ userDarkMode: false }))
        } else if (theme.toLowerCase() === 'dark') {
            dispatch(updateUserDarkMode({ userDarkMode: true }))
        }
    }, [dispatch, search])

    return (
        <Suspense fallback={null}>
            <div className="flex flex-col items-start overflow-x-hidden h-screen">
                <AppBar />
                <div
                    ref={bodyRef}
                    className={wrapperClassList}
                >
                    <Popups />
                    <Polling />
                    <Web3ReactManager>
                        <Routes />
                    </Web3ReactManager>
                </div>
            </div>
        </Suspense>
    )
}

export default App
