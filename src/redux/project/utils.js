import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

import { storage } from "../../networking"

export const mapProjectFormDataToProjectData = formData => ({
    projectName: formData.projectName,
    projectType: formData.projectType,
    logoImageURLs: formData.logoImageURLs,
    creatorPhoneNumber: formData.creatorPhoneNumber,
    domainProviderURL: formData.domainProviderURL,
    domainProviderUsername: formData.domainProviderUsername,
    domainProviderPassword: formData.domainProviderPassword,

    heroTitle: formData.heroTitle,
    heroMessage: formData.heroMessage,
    
    selectedThemes: [[formData.lightThemeSelected, 0], [formData.darkThemeSelected, 1], [formData.blueThemeSelected, 2]]
        .filter( ([selected]) => selected )
        .map( ([_, themeIndex]) => themeIndex)
    ,
    defaultTheme: formData.lightThemeDefault ? 0
        : formData.darkThemeDefault ? 1
        : 2
    ,
    selectedTintColors: [[formData.blueTintSelected, 0], [formData.purpleTintSelected, 1], [formData.mintTintSelected, 2], [formData.greenTintSelected, 3]]
        .filter( ([selected]) => selected )
        .map( ([_, tintColorIndex]) => tintColorIndex )
    ,
    defaultTintColor: formData.blueTintSelected ? 0
        : formData.purpleTintSelected ? 1
        : formData.mintTintSelected ? 2
        : 3
    ,
    customTintColor: formData.customTintColor,
    borderRadius: formData.borderRadius,
    buttonBorderRadius: formData.buttonBorderRadius,

    pagesText: formData.pagesText,
    pagesImageURLs: formData.pagesImageURLs,

    hasSubscriptions: formData.hasSubscriptions,
    subscriptionTiers: formData.subscriptionTiers,

    accessCode: formData.accessCode
})

export const uploadProjectLogoImages = async (logoImages, projectID) => {
    let logoImageURLs = []
    try {
        for (let i = 0; i < logoImages.length; i++) {
            const imageFile = logoImages[i]
            const storageRef = ref(storage, `/projects/${projectID}/logos/${imageFile.name}`)
            await uploadBytes(storageRef, imageFile)
            const downloadURL = await getDownloadURL(storageRef)
            logoImageURLs.push(downloadURL)
        }

        console.log('posted logo images')
    } catch (error) {
        console.log('post logo images error')
        throw (error)
    }

    return logoImageURLs
}

export const uploadProjectPagesImages = async (pagesImages, projectID) => {
    let pagesImageURLs = []
    try {
        for (let i = 0; i < pagesImages.length; i++) {
            const pageImages = pagesImages[i]
            pagesImageURLs.push([])
            
            for (let j = 0; j < pageImages.length; j++) {
                const imageFile = pageImages[j]
                const storageRef = ref(storage, `/projects/${projectID}/pages/page${i + 1}/${imageFile.name}`)
                await uploadBytes(storageRef, imageFile)
                const downloadURL = await getDownloadURL(storageRef)
                pagesImageURLs[i].push(downloadURL)
            }
        }

        console.log('posted pages images')
    } catch (error) {
        console.log('post pages images error')
        throw (error)
    }

    return pagesImageURLs
}