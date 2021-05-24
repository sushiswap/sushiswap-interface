import { useContext } from 'react'
import { LanguageContext } from '..'

export function useLanguageData() {
    return useContext(LanguageContext)
}
