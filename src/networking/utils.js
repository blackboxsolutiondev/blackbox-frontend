import { FirebaseErrors } from "./constants"

export const stringifyQuery = queryParams => {
    return '?' + Object
        .entries(queryParams)
        .map( ([key, value]) => `${key}=${value}`)
        .join('&')
}

export const getFirebaseErrorMessage = error => {
    const [type, code] = error.code.split('/')
    return FirebaseErrors[type] && FirebaseErrors[type][code] ?
        FirebaseErrors[type][code]
        : code
}