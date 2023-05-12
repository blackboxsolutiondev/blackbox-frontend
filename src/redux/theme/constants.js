export const Colors = {
    yellow: 'rgb(254, 221, 74)',
    yellowTranslucent: 'rgba(254, 221, 74, 0.3)',
    red: '#f04747',
    redTranslucent: 'rgba(240, 71, 71, 0.2)',
    brightRed: '#f04747',
    brightRedTranslucent: 'rgba(240, 71, 71, 0.2)',
    success: 'rgb(23, 169, 86)',
    successTranslucent: 'rgba(23, 169, 86, 0.3)',
    pageLink: 'rgb(70, 141, 228)',
    pageLinkTranslucent: 'rgba(70, 141, 228, 0.3)',
    orange: 'rgb(252,92,22)',
    orangeTranslucent: 'rgba(252,92,22, 0.2)',
    blue: '#5a9ff6',
    blueTranslucent: 'rgba(90, 159, 246, 0.2)',
    green: '#17a956',
    greenTranslucent: 'rgba(23, 169, 86, 0.2)',
    purple: '#7288d9',
    purpleTranslucent: 'rgba(114, 137, 218, 0.25)',
    mint: '#189e8a',
    mintTranslucent: 'rgba(24, 158, 138, 0.2)',
    gray: '#6f787d',
    facebookBlue: '#4267B2',

    error: 'rgb(211,47,48)',
    errorTranslucent: 'rgba(211,47,48,0.2)'
}

const LightTheme = {
    bgc: 'rgb(244, 246, 248)',
    //bgc: 'white',
    bgcLight: 'white',
    bgcSemilight: 'rgb(248, 250, 252)',
    bgcHover: 'rgb(245, 247, 249)',
    bgcNav: 'white',
    bgcSettings: 'white',
    bgcInput: 'rgb(235, 238, 240)',
    bc: 'rgb(218,220,224)',
    textMain: 'rgb(60,64,67)',
    textPrimary: 'rgb(10, 12, 14)',
    textSecondary: 'rgb(135, 138, 140)',
    textTertiary: 'rgb(102, 102, 102)',
    textYellow: '#85681d',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)',
    floatBorder: 'none',
    navBorder: '1px solid rgb(215, 222, 226)',
    boxShadowDark: '0 3px 20px rgb(89 105 129 / 30%), 0 1px 2px rgb(0 0 0 / 5%), 0 0 0 1px rgb(89 105 129 / 10%)',

    // bgc: 'white',
    // floatBorder: '1px solid rgb(218, 220, 224)',
    // boxShadow: 'none',
}

const DarkTheme = {
    bgc: 'black',
    bgcLight: 'rgb(21,24,28)',
    bgcSemilight: 'rgb(15,17,19)',
    bgcHover: 'rgba(249, 252, 255, 0.08)',
    bgcNav: 'rgb(14, 17, 21)',
    bgcSettings: 'black',
    bgcInput: 'rgb(38, 41, 45)',
    bc: 'rgb(48, 54, 58)',
    textMain: 'rgb(205,205,205)',
    textPrimary: 'rgb(235, 235, 235)',
    textSecondary: 'rgb(147, 151, 156)',
    textTertiary: 'rgb(121, 124, 125)',
    textYellow: Colors.yellow,
    boxShadow: 'none',
    floatBorder: '1px solid rgb(48, 54, 58)',
    floatBorder: 'none',
    navBorder: 'none',
    boxShadowDark: 'none'
}

const BlueTheme = {
    bgc: '#0e2439',
    bgcLight: '#1f364d',
    bgcSemilight: '#182e43',
    bgcHover: 'rgba(249, 252, 255, 0.08)',
    bgcNav: '#182e43',
    bgcSettings: '#0e2439',
    bgcInput: '#284059',
    bc: '#325070',
    textMain: 'rgb(225,225,225)',
    textPrimary: 'rgb(245, 245, 245)',
    textSecondary: '#9cb3c9',
    textTertiary: '#63809c',
    textYellow: Colors.yellow,
    boxShadow: 'none',
    floatBorder: 'none',
    navBorder: 'none',
    boxShadowDark: 'none',
}

export const Themes = {
    0: {
        ...LightTheme,
        value: 0,
        name: 'Light',
        icon: 'sun',
    },
    1: {
        ...DarkTheme,
        value: 1,
        name: 'Dark',
        icon: 'moon'
    },
    2: {
        ...BlueTheme,
        value: 2,
        name: 'Blue',
        icon: 'water'
    },
}

export const Tints = {
    0: {
        value: 0,
        name: 'Blue',
        tint: Colors.blue,
        tintTranslucent: Colors.blueTranslucent
    },
    1: {
        value: 1,
        name: 'Purple',
        tint: Colors.purple,
        tintTranslucent: Colors.purpleTranslucent
    },
    2: {
        value: 2,
        name: 'Mint',
        tint: Colors.mint,
        tintTranslucent: Colors.mintTranslucent
    },
    3: {
        value: 3,
        name: 'Green',
        tint: Colors.green,
        tintTranslucent: Colors.greenTranslucent
    },
}