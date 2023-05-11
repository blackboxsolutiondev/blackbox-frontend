export const getFormData = initialUnmappedFormData => ({
    // general
    creatorName: initialUnmappedFormData.creator.displayName,
    projectName: initialUnmappedFormData.projectName,
    projectType: initialUnmappedFormData.projectType,
    logoImages: [],
    logoImageURLs: initialUnmappedFormData.logoImageURLs,
    email: initialUnmappedFormData.creator.email,
    domainProviderURL: initialUnmappedFormData.domainProviderURL,
    domainProviderUsername: initialUnmappedFormData.domainProviderUsername,
    domainProviderPassword: initialUnmappedFormData.domainProviderPassword,

    // landing
    heroTitle: initialUnmappedFormData.heroTitle,
    heroMessage: initialUnmappedFormData.heroMessage,

    // theme
    lightThemeSelected: initialUnmappedFormData.selectedThemes.includes(0),
    darkThemeSelected: initialUnmappedFormData.selectedThemes.includes(1),
    blueThemeSelected: initialUnmappedFormData.selectedThemes.includes(2),
    lightThemeDefault: initialUnmappedFormData.defaultTheme == 0,
    darkThemeDefault: initialUnmappedFormData.defaultTheme == 1,
    blueThemeDefault: initialUnmappedFormData.defaultTheme == 2,
    blueTintSelected: initialUnmappedFormData.selectedTintColors.includes(0),
    purpleTintSelected: initialUnmappedFormData.selectedTintColors.includes(1),
    mintTintSelected: initialUnmappedFormData.selectedTintColors.includes(2),
    greenTintSelected: initialUnmappedFormData.selectedTintColors.includes(3),
    blueTintDefault: initialUnmappedFormData.defaultTintColor == 0,
    purpleTintDefault: initialUnmappedFormData.defaultTintColor == 1,
    mintTintDefault: initialUnmappedFormData.defaultTintColor == 2,
    greenTintDefault: initialUnmappedFormData.defaultTintColor == 3,
    customTintColor: initialUnmappedFormData.customTintColor,
    useCustomTintColor: !!initialUnmappedFormData.customTintColor,

    // features
    pagesText: initialUnmappedFormData.pagesText,
    pagesImages: initialUnmappedFormData.pagesText.map(_ => []),
    pagesImageURLs: initialUnmappedFormData.pagesImageURLs,

    // subscriptions
    hasSubscriptions: initialUnmappedFormData.hasSubscriptions,
    subscriptionTiers: initialUnmappedFormData.subscriptionTiers,
})

export const getFormDataModified = (currentFormData, initialUnmappedFormData) => {
    if (!initialUnmappedFormData) return {}
    const initFormData = getFormData(initialUnmappedFormData)
    const lightThemeSelectedModified = initFormData.lightThemeSelected != currentFormData.lightThemeSelected
    const darkThemeSelectedModififed = initFormData.darkThemeSelected != currentFormData.darkThemeSelected
    const blueThemeSelectedModififed = initFormData.blueThemeSelected != currentFormData.blueThemeSelected

    const lightThemeDefaultModififed = initFormData.lightThemeDefault != currentFormData.lightThemeDefault
    const darkThemeDefaultModififed = initFormData.darkThemeDefault != currentFormData.darkThemeDefault
    const blueThemeDefaultModififed = initFormData.blueThemeDefault != currentFormData.blueThemeDefault

    const blueTintSelectedModififed = initFormData.blueTintSelected != currentFormData.blueTintSelected
    const purpleTintSelectedModififed = initFormData.purpleTintSelected != currentFormData.purpleTintSelected
    const mintTintSelectedModififed = initFormData.mintTintSelected != currentFormData.mintTintSelected
    const greenTintSelectedModififed = initFormData.greenTintSelected != currentFormData.greenTintSelected

    const blueTintDefaultModififed = initFormData.blueTintDefault != currentFormData.blueTintDefault
    const purpleTintDefaultModififed = initFormData.purpleTintDefault != currentFormData.purpleTintDefault
    const mintTintDefaultModififed = initFormData.mintTintDefault != currentFormData.mintTintDefault
    const greenTintDefaultModififed = initFormData.greenTintDefault != currentFormData.greenTintDefault

    return {
        // general
        creatorName: initFormData.creatorName !== currentFormData.creatorName,
        logoImageURLs: initFormData.logoImageURLs !== currentFormData.logoImageURLs,
        domainProviderURL: initFormData.domainProviderURL !== currentFormData.domainProviderURL,
        domainProviderUsername: initFormData.domainProviderUsername !== currentFormData.domainProviderUsername,
        domainProviderPassword: initFormData.domainProviderPassword !== currentFormData.domainProviderPassword,

        // landing
        heroTitle: initFormData.heroTitle !== currentFormData.heroTitle,
        heroMessage: initFormData.heroMessage !== currentFormData.heroMessage,

        // theme
        themes: lightThemeSelectedModified || darkThemeSelectedModififed || blueThemeSelectedModififed,
        defaultTheme: lightThemeDefaultModififed || darkThemeDefaultModififed || blueThemeDefaultModififed,
        selectedTintColors: blueTintSelectedModififed || purpleTintSelectedModififed || mintTintSelectedModififed || greenTintSelectedModififed,
        defaultTintColor: blueTintDefaultModififed || purpleTintDefaultModififed || mintTintDefaultModififed || greenTintDefaultModififed,
        customTintColor: initFormData.customTintColor !== currentFormData.customTintColor,
        useCustomTintColor: !!initFormData.customTintColor != currentFormData.useCustomTintColor,

        // features
        pagesText: currentFormData.pagesText.map( (text, i) => (
            initFormData.pagesText[i] ? initFormData.pagesText[i] !== text : true
        )),
        pagesImageURLs: currentFormData.pagesImageURLs.map( (pageImagesURLs, i) => (
            initFormData.pagesImageURLs[i] ? initFormData.pagesImageURLs[i] !== pageImagesURLs : true
        )),

        // subscriptions
        hasSubscriptions: initFormData.hasSubscriptions != currentFormData.hasSubscriptions,
        subscriptionTiers: currentFormData.subscriptionTiers.map( (subscriptionTier, i) => ({
            name: initFormData.subscriptionTiers[i] ? initFormData.subscriptionTiers[i].name !== subscriptionTier.name : true,
            pricePerMonth: initFormData.subscriptionTiers[i] ? initFormData.subscriptionTiers[i].pricePerMonth !== subscriptionTier.pricePerMonth : true,
            features: initFormData.subscriptionTiers[i] ? initFormData.subscriptionTiers[i].features !== subscriptionTier.features : true
        }))
    }
}