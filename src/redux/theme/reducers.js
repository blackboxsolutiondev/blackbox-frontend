import {ThemeActionTypes as Types} from './types'
import { Themes, Tints } from './constants'
import { calculateIsMobile, calculateIsSemiMobile } from './actions'

const ThemeState = {
    tintColor: 0,
    themeColor: 0,
    isMobile: false,
    isSemiMobile: false,

    // calculated
    theme: null
}

export const themeReducer = (state = ThemeState, action) => {
    switch (action.type) {
        case Types.SET_THEME_COLOR:
            const root = document.documentElement
            root.style.setProperty('--bgc', Themes[action.value].bgc)
            document.querySelector('meta[name="theme-color"]').setAttribute("content", Themes[action.value].bgcNav);
            return {
                ...state,
                themeColor: action.value
            }
        case Types.SET_TINT_COLOR:
            return {
                ...state,
                tintColor: action.value
            }
        case Types.SET_IS_MOBILE:
            return {
                ...state,
                isMobile: action.value
            }
        case Types.SET_IS_SEMI_MOBILE:
            return {
                ...state,
                isSemiMobile: action.value
            }
        default:
            return state
    }
}
