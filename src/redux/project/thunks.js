import { createUserWithEmailAndPassword } from 'firebase/auth'
import {v4 as uuid} from 'uuid'
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'

import { getHasAdminPrivileges } from '../user'
import { uploadProjectLogoImages, uploadProjectPagesImages } from './utils'
import {
    getAdminProjects,
    getThisUserProjects,
} from './selectors'
import { getAdminRequestConfig, updateFAQs } from '../admin'
import { getMongoUser, getFirebaseUser } from '../user'
import { fetchThisMongoUser } from '../user'
import { auth, storage, PageSizes } from '../../networking'
import * as ProjectActions from './actions'
import { api, getFirebaseErrorMessage, stringifyQuery } from '../../networking'
import { mapProjectFormDataToProjectData } from './utils'
import { __postMongoUser } from '../user'
import { addMessage } from '../communication'

export const fetchProject = (
    projectID,
    onSuccess = () => {},
    onFailure = () => {}
) => async (dispatch, getState) => {
    dispatch(ProjectActions.setProjectNotFound(false))
    dispatch(ProjectActions.setLoadingProject(true))

    const state = getState()
    const mongoUser = getMongoUser(state)
    const hasAdminPrivileges = getHasAdminPrivileges(state)

    try {
        const res = await api.get(`/projects/${projectID}`)

        if (res.data.creator._id !== mongoUser._id && !hasAdminPrivileges) {
            throw Error('You do no have access to this Project.')
        }

        dispatch(ProjectActions.setProject(res.data))
        onSuccess()
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message
        console.log(errorMessage)
        dispatch(addMessage(errorMessage, true))
        dispatch(ProjectActions.setProjectNotFound(true))
        onFailure()
    }

    dispatch(ProjectActions.setLoadingProject(false))
}

export const fetchAdminUserProjects = (filters, searchText, page) => async (dispatch, getState) => {
    const state = getState()
    const adminProjects = getAdminProjects(state)
    if (page != 1 && adminProjects.length > (page - 1)*PageSizes.adminProjects) return

    if (page == 1) {
        dispatch(ProjectActions.setLoadingAdminProjectsFirstPage(true))
    } else {
        dispatch(ProjectActions.setLoadingAdminProjects(true))
    }

    const mongoUser = getMongoUser(state)

    const queryString = stringifyQuery({
        ...filters,
        title: searchText,
        page
    })

    try {
        const res = await api.get(
            `/admin/projects/search${queryString}`,
            getAdminRequestConfig(mongoUser)
        )

        if (page == 1) {
            dispatch(ProjectActions.setAdminProjectsData(res.data))
        } else {
            dispatch(ProjectActions.addAdminProjectsData(res.data))
        }
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message
        console.log(errorMessage)
        dispatch(addMessage(errorMessage, true))
    }

    if (page == 1) {
        dispatch(ProjectActions.setLoadingAdminProjectsFirstPage(false))
    } else {
        dispatch(ProjectActions.setLoadingAdminProjects(false))
    }
}

export const fetchThisUserProjects = (filters, searchText, page) => async (dispatch, getState) => {
    const state = getState()
    const thisUserProjects = getThisUserProjects(state)
    if (page != 1 && thisUserProjects.length > (page - 1)*PageSizes.thisUserProjects) return

    if (page == 1) {
        dispatch(ProjectActions.setLoadingThisUserProjectsFirstPage(true))
    } else {
        dispatch(ProjectActions.setLoadingThisUserProjects(true))
    }

    const mongoUser = getMongoUser(state)

    const queryString = stringifyQuery({
        ...filters,
        title: searchText,
        page,
        creator: mongoUser._id
    })

    try {
        const res = await api.get(`/projects/search${queryString}`)

        if (page == 1) {
            dispatch(ProjectActions.setThisUserProjectsData(res.data))
        } else {
            dispatch(ProjectActions.addThisUserProjectsData(res.data))
        }
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message
        console.log(errorMessage)
        dispatch(addMessage(errorMessage, true))
    }

    if (page == 1) {
        dispatch(ProjectActions.setLoadingThisUserProjectsFirstPage(false))
    } else {
        dispatch(ProjectActions.setLoadingThisUserProjects(false))
    }
}

export const fetchAccessCodes = (filters, searchText, page) => async (dispatch, getState) => {
    const state = getState()
    const accessCodes = getAdminProjects(state)
    if (page != 1 && accessCodes.length > (page - 1)*PageSizes.accessCodes) return

    if (page == 1) {
        dispatch(ProjectActions.setLoadingAccessCodesFirstPage(true))
    } else {
        dispatch(ProjectActions.setLoadingAccessCodes(true))
    }

    const mongoUser = getMongoUser(state)

    const queryString = stringifyQuery({
        ...filters,
        title: searchText,
        page
    })

    try {
        const res = await api.get(
            `/admin/accesscodes/search${queryString}`,
            getAdminRequestConfig(mongoUser)
        )

        if (page == 1) {
            dispatch(ProjectActions.setAccessCodesData(res.data))
        } else {
            dispatch(ProjectActions.addAccessCodesData(res.data))
        }
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message
        console.log(errorMessage)
        dispatch(addMessage(errorMessage, true))
    }

    if (page == 1) {
        dispatch(ProjectActions.setLoadingAccessCodesFirstPage(false))
    } else {
        dispatch(ProjectActions.setLoadingAccessCodes(false))
    }
}

export const postAccessCode = (title, onSuccess, onFailure) => async (dispatch, getState) => {
    const state = getState()
    const mongoUser = getMongoUser(state)

    try {
        const res = await api.post(
            '/admin/accesscodes',
            {title},
            getAdminRequestConfig(mongoUser)
        )

        dispatch(addMessage(res.data.message))
        onSuccess()
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message
        console.log(errorMessage)
        dispatch(addMessage(errorMessage, true))
        onFailure()
    }
}

export const createUserAndPostProject = (
    projectFormData,
    onSuccess,
    onFailure,
    navigate
) => async (dispatch, getState) => {
    const projectData = mapProjectFormDataToProjectData(projectFormData)

    const state = getState()
    const mongoUser = getMongoUser(state)
    const firebaseUser = getFirebaseUser()

    try {
        // create user
        let fbUser = firebaseUser
        let userID = mongoUser ? mongoUser._id : null

        if (!firebaseUser && !mongoUser) {
            const password = uuid().slice(0, 8)

            // create fb user
            try {
                const {email} = projectFormData
                const {user} = await createUserWithEmailAndPassword(auth, email, password)
                fbUser = user
                console.log('created fb user')
            } catch (error) {
                const errorMessage = getFirebaseErrorMessage(error)
                console.log('create fb user error')
                console.log(errorMessage)
                dispatch(addMessage(errorMessage, true))
                onFailure()
                return
            }

            try {
                // create mongo user
                let res = await __postMongoUser({
                    uid: fbUser.uid,
                    email: fbUser.email,
                    photoURL: fbUser.photoURL,
                    displayName: projectFormData.creatorName
                })

                userID = res.data.userID
                dispatch(addMessage(res.data.message), false, true)

                console.log('created mongo user')

                // send temporary password email
                res = await api.post('/users/temporarypasswordemail', {
                    displayName: projectFormData.name,
                    email: fbUser.email,
                    password
                })

                dispatch(addMessage(res.data.message), false, true)

                console.log('sent temprorary password email')
            } catch (error) {
                console.log('create mongo user error')
                throw (error)
            }
        }

        // post project
        let projectID = null
        try {
            const res = await api.post('/projects', {
                ...projectData,
                creator: userID
            })
            projectID = res.data.projectID
            dispatch(addMessage(res.data.message), false, true)

            console.log('posted project')
        } catch (error) {
            console.log('post project error')
            throw (error)
        }

        // post logo images
        const logoImageURLs = await uploadProjectLogoImages(projectFormData.logoImages, projectID)

        // post pages images
        const pagesImageURLs = await uploadProjectPagesImages(projectFormData.pagesImages, projectID)
        
        // patch project
        try {
            await api.patch(`/projects/${projectID}`, {
                pagesImageURLs,
                logoImageURLs
            })
            console.log('patched project')
        } catch (error) {
            console.log('patch project error')
            throw(error)
        }
        
        // route to project overview
        try {
            dispatch(fetchThisMongoUser(fbUser, () => {
                navigate(`/projects/${projectID}`)
                onSuccess()
                console.log('navigated to project')
            }))
        } catch (error) {
            console.log('fetch this mongo user error')
            throw(error)
        }
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message
        console.log('general error')
        console.log(errorMessage)
        dispatch(addMessage(errorMessage, true))
        onFailure()
    }
}

export const patchProjects = (projectIDs, updatedFields, onSuccess, onFailure) => async (dispatch, getState) => {
    dispatch(ProjectActions.setLoadingProject(true))

    const state = getState()
    const mongoUser = getMongoUser(state)

    try {
        const res = await api.patch(
            `/admin/projects`, 
            {
                updatedFields,
                projectIDs
            },
            getAdminRequestConfig(mongoUser)
        )

        dispatch(addMessage(res.data.message))
        onSuccess()
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message
        console.log(errorMessage)
        dispatch(addMessage(errorMessage, true))
        onFailure()
    }

    dispatch(ProjectActions.setLoadingProject(false))
}

export const deleteProjects = (projectIDs, onSuccess, onFailure) => async (dispatch, getState) => {
    const state = getState()
    const mongoUser = getMongoUser(state)

    const queryString = stringifyQuery({
        projectIDs: projectIDs.join('-')
    })

    try {
        const res = await api.delete(
            `/admin/projects${queryString}`,
            getAdminRequestConfig(mongoUser)
        )

        dispatch(addMessage(res.data.message))
        onSuccess()
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message
        console.log(errorMessage)
        dispatch(addMessage(errorMessage, true))
        onFailure()
    }
}

export const patchProjectWithProjectForm = (projectID, updatedProjectFormData, onSuccess, onFailure) => async (dispatch) => {
    dispatch(ProjectActions.setLoadingProject(true))

    const updatedFields = mapProjectFormDataToProjectData(updatedProjectFormData)

    try {
        let logoImageURLs = []
        let pagesImageURLs = updatedProjectFormData.pagesImageURLs.map( _ => [])
        if (updatedProjectFormData.logoImages.length) {
            logoImageURLs = await uploadProjectLogoImages(updatedProjectFormData.logoImages, projectID)
        }
        let hasPagesImages = false
        updatedProjectFormData.pagesImages.forEach( pageImages => {
            if (pageImages.length) hasPagesImages = true
        })
        if (hasPagesImages) {
            pagesImageURLs = await uploadProjectPagesImages(updatedProjectFormData.pagesImages, projectID)
        }

        const res = await api.patch(`/projects/${projectID}`, {
            ...updatedFields,
            pagesImageURLs: updatedFields.pagesImageURLs.map( (pageImageURLs, i) => ([
                ...pageImageURLs,
                ...pagesImageURLs[i]
            ])),
            logoImageURLs: [
                ...updatedFields.logoImageURLs,
                ...logoImageURLs
            ]
        })

        dispatch(addMessage(res.data.message))
        onSuccess()
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message
        console.log(errorMessage)
        dispatch(addMessage(errorMessage, true))
        onFailure()
    }

    dispatch(ProjectActions.setLoadingProject(false))
}

export const patchProject = (projectID, updatedFields, onSuccess, onFailure) => async (dispatch) => {
    try {
        const res = await api.patch(`/projects/${projectID}`, updatedFields)

        dispatch(addMessage(res.data.message))
        onSuccess()
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message
        console.log(errorMessage)
        dispatch(addMessage(errorMessage, true))
        onFailure()
    }
}

export const deleteProject = (projectID, onSuccess, onFailure) => async (dispatch, getState) => {
    const state = getState()
    const mongoUser = getMongoUser(state)

    const queryString = stringifyQuery({
        userID: mongoUser._id
    })

    try {
        const res = await api.delete(`/projects/${projectID}${queryString}`)

        dispatch(addMessage(res.data.message))
        onSuccess()
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message
        console.log(errorMessage)
        dispatch(addMessage(errorMessage, true))
        onFailure()
    }
}

export const fetchIsValidAccessCode = accessCode => async dispatch => {
    const queryString = stringifyQuery({code: accessCode})
    
    try {
        const res = await api.get(`/accesscodes/isvalid${queryString}`)
        dispatch(ProjectActions.setIsValidAccessCode(res.data.isValid))
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message
        console.log(errorMessage)
        dispatch(addMessage(errorMessage, true))
    }
}

export const fetchAccessCode = accessCodeID => async (dispatch, getState) => {
    dispatch(ProjectActions.setLoadingAccessCode(true))
    dispatch(ProjectActions.setAccessCodeNotFound(false))

    const state = getState()
    const mongoUser = getMongoUser(state)

    try {
        const res = await api.get(
            `/admin/accesscodes/${accessCodeID}`,
            getAdminRequestConfig(mongoUser)
        )

        dispatch(ProjectActions.setAccessCode(res.data))
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message
        console.log(errorMessage)
        dispatch(addMessage(errorMessage, true))
        dispatch(ProjectActions.setAccessCodeNotFound(true))
    }

    dispatch(ProjectActions.setLoadingAccessCode(false))
}

export const sendProjectInvoice = (
    projectType,
    projectID,
    userEmail,
    userID,
    onSuccess,
    onFailure
) => async (dispatch, getState) => {
    const state = getState()
    const mongoUser = getMongoUser(state)

    try {
        const res = await api.patch(
            '/admin/projects/sendinvoice',
            {
                projectType,
                projectID,
                userEmail,
                userID
            },
            getAdminRequestConfig(mongoUser)
        )

        dispatch(addMessage(res.data.message))
        onSuccess()
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : error.message
        console.log(errorMessage)
        dispatch(addMessage(errorMessage, true))
        onFailure()
    }
}