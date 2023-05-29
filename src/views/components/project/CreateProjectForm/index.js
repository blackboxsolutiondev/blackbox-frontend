import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import styled from 'styled-components'


import { capitalizeWords } from '../../../../utils/misc'
import { getIsLoggedIn, getUser } from '../../../../redux/user'
import { getProject } from '../../../../redux/project'
import { fetchIsValidAccessCode, getIsValidAccessCode } from '../../../../redux/project'
import {getFormData, getFormDataModified} from './utils'
import { TermsSections } from '../../../pages/Terms'
import { setThemeColor, setTintColor } from '../../../../redux/theme'
import { Tints } from '../../../../redux/theme'
import { addMessage } from '../../../../redux/communication'
import { Button } from '../../common/Button'
import { ProgressSteps } from '../../common/ProgressSteps'
import { IconButton } from '../../common/IconButton'
import { InputWithMessage } from '../../common/InputWithMessage'
import { ImagesInput } from '../../common/ImagesInput'
import { ValidLabel } from '../../common/ValidLabel'
import { PendingMessage } from '../../common/PendingMessage'

const ProjectTypes = [
    {title: 'Small Webapp - 2 Custom Pages', price: 250, id: 's', pagesCount: 2},
    {title: 'Medium Webapp - 4 Custom Pages', price: 500, id: 'm', pagesCount: 4},
    {title: 'Large Webapp - 10 Custom Pages', price: 1500, id: 'l', pagesCount: 10}
]

const BorderRadii = [
    {
        id: 'borderRadiusSquare',
        radius: 0,
        value: 'square',
    },
    {
        id: 'borderRadiusRounded',
        radius: 10,
        value: 'rounded',
    },
    {
        id: 'borderRadiusPill',
        radius: 20,
        value: 'pill',
    }
]

const ButtonBorderRadii = [
    {
        id: 'buttonBorderRadiusSquare',
        radius: 0,
        value: 'square',
    },
    {
        id: 'buttonBorderRadiusRounded',
        radius: 10,
        value: 'rounded',
    },
    {
        id: 'buttonBorderRadiusPill',
        radius: 20,
        value: 'pill',
    }
]

export const CreateProjectFormComponent = props => {
    const {
        isEditMode=true,
        projectType=null,
        initFormData=null,

        onChangeFormData = () => {}, // formData => void
        onCreateProject = () => {}, // (onSuccess, onFailure) => void
        onSubmitEdits = () => {}, // (onSuccess, onFailure) => void
        onCancelEdits = () => {}, // (onSuccess, onFailure) => void

        ...rest
    } = props
    // Selected Step
    const [selectedStepID, setSelectedStepID] = useState(isEditMode ? 'review' : 'general')
    const [generalCompleted, setGeneralCompleted] = useState(isEditMode)
    const [landingCompleted, setLandingCompleted] = useState(isEditMode)
    const [themeCompleted, setThemeCompleted] = useState(isEditMode)
    const [featuresCompleted, setFeaturesCompleted] = useState(isEditMode)
    const [subscriptionsCompleted, setSubscriptionsCompleted] = useState(isEditMode)
    const [socialsCompleted, setSocialsCompleted] = useState(isEditMode)
    const [reviewCompleted, setReviewCompleted] = useState(isEditMode)
    const [termsCompleted, setTermsCompleted] = useState(isEditMode)
    const [paymentCompleted, setPaymentCompleted] = useState(isEditMode)
    // Form Data
    const [formData, setFormData] = useState(initFormData ?
        getFormData(initFormData)
        : {
            // general
            creatorName: props.isLoggedIn ? props.user.displayName : '',
            projectName: '',
            projectType: projectType || 's',
            logoImages: [],
            logoImageURLs: [],
            creatorPhoneNumber: '',
            email: props.isLoggedIn ? props.user.email : '',
            domainProviderURL: '',
            domainProviderUsername: '',
            domainProviderPassword: '',

            // landing
            heroTitle: '',
            heroMessage: '',

            // theme
            lightThemeSelected: true,
            darkThemeSelected: false,
            blueThemeSelected: false,
            lightThemeDefault: true,
            darkThemeDefault: false,
            blueThemeDefault: false,
            blueTintSelected: true,
            purpleTintSelected: false,
            mintTintSelected: false,
            greenTintSelected: false,
            blueTintDefault: true,
            purpleTintDefault: false,
            mintTintDefault: false,
            greenTintDefault: false,
            customTintColor: null,
            useCustomTintColor: false,
            borderRadius: 'rounded',
            buttonBorderRadius: 'pill',

            // features
            pagesText: [],
            pagesImages: [],
            pagesImageURLs: [],

            // subscriptions
            hasSubscriptions: false,
            subscriptionTiers: [],

            // socials
            linkedInURL: '',
            facebookURL: '',
            instagramURL: '',
            twitterURL: '',

            // terms
            acceptedTermsAndConditions: false,
            signature: '',

            // payment
            hasAccessCode: false,
            accessCode: '',
        }
    )
    const [errors, setErrors] = useState({
        // general
        creatorName: false,
        projectName: false,
        logoImages: false,
        creatorPhoneNumber: false,
        email: false,
        domainProviderURL: false,
        domainProviderUsername: false,
        domainProviderPassword: false,

        // landing
        heroTitle: false,
        heroMessage: false,

        // theme
        themes: false,
        tintColors: false,
        customTintColor: false,

        // features
        pagesText: [],

        // subscriptions
        subscriptionTiers: [],

        // terms
        acceptedTermsAndConditions: false,
        signature: false,

        // payment
        accessCode: '',
    })
    const [modified, setModified] = useState(getFormDataModified(formData, initFormData))
    const [generalModified, setGeneralModified] = useState(false)
    const [landingModified, setLandingModified] = useState(false)
    const [themeModified, setThemeModified] = useState(false)
    const [featuresModified, setFeaturesModified] = useState(false)
    const [subscriptionsModified, setSubscriptionsModified] = useState(false)
    const [socialsModified, setSocialsModified] = useState(false)
    const [formDataModified, setFormDataModified] = useState(false)
    // Misc
    const [loadingCreateProject, setLoadingCreateProject] = useState(false)
    const [loadingSaveEdits, setLoadingSaveEdits] = useState(false)
    const [subscriptionTiersCount, setSubscriptionTiersCount] = useState(initFormData ? initFormData.subscriptionTiers.length : 0)

    const progressSteps = [
        {title: 'General', isComplete: generalCompleted, id: 'general'},
        {title: 'Landing', isComplete: landingCompleted, id: 'landing'},
        {title: 'Theme', isComplete: themeCompleted, id: 'theme'},
        {title: 'Features', isComplete: featuresCompleted, id: 'features'},
        {title: 'Subscriptions', isComplete: subscriptionsCompleted, id: 'subscriptions'},
        {title: 'Socials', isComplete: socialsCompleted, id: 'socials'},
        {title: isEditMode ? 'Overview' : 'Review', isComplete: reviewCompleted, id: 'review'},
        ...(isEditMode ?
            []
            : [
                {title: 'Terms', isComplete: termsCompleted, id: 'terms'},
                {title: 'Payment', isComplete: paymentCompleted, id: 'payment'}
            ]
        )
    ]

    // test
    useEffect(() => {
        !isEditMode && setFormData({
            // general
            creatorName: props.isLoggedIn ? props.user.displayName : 'test',
            projectName: 'Test',
            projectType: 's',
            logoImages: [],
            logoImageURLs: [],
            creatorPhoneNumber: '908-334-2404',
            email: props.isLoggedIn ? props.user.email : 'liammccluskey2@gmail.com',
            domainProviderURL: 'test',
            domainProviderUsername: 'test',
            domainProviderPassword: 'test',
    
            // landing
            heroTitle: 'test',
            heroMessage: 'test',
    
            // theme
            lightThemeSelected: true,
            darkThemeSelected: false,
            blueThemeSelected: false,
            lightThemeDefault: true,
            darkThemeDefault: false,
            blueThemeDefault: false,
            blueTintSelected: true,
            purpleTintSelected: false,
            mintTintSelected: false,
            greenTintSelected: false,
            blueTintDefault: true,
            purpleTintDefault: false,
            mintTintDefault: false,
            greenTintDefault: false,
            customTintColor: null,
            useCustomTintColor: false,
            borderRadius: 'rounded',
            buttonBorderRadius: 'pill',
    
            // features
            pagesText: ['test', 'test'],
            pagesImages: [],
            pagesImageURLs: null,

            // subscriptions
            hasSubscriptions: false,
            subscriptionTiers: [],

            // socials
            linkedInURL: '',
            facebookURL: '',
            instagramURL: '',
            twitterURL: '',
    
            // terms
            acceptedTermsAndConditions: true,
            signature: 'test',
    
            // payment
            hasAccessCode: false,
            accessCode: '',
        })
    }, [])

    const selectedStep = progressSteps.find(({id}) => id === selectedStepID)
    const selectedProjectType = ProjectTypes.find(({id}) => id === formData.projectType)

    useEffect(() => {
        onChangeFormData(formData)
        setModified(getFormDataModified(formData, initFormData))
    }, [formData])

    useEffect(() => {
        initFormData && setFormData(getFormData(initFormData))
    }, [initFormData])

    useEffect(() => {
        const {pagesCount} = selectedProjectType
        setFormData(curr => ({
            ...curr,
            pagesText: Array(pagesCount).fill(''),
            pagesImages: Array(pagesCount).fill(new Array(0)),
            pagesImageURLs: Array(pagesCount).fill(new Array(0)),
        }))
        setErrors(curr => ({
            ...curr,
            pagesTextErrors: Array(pagesCount).fill(false)
        }))
    }, [selectedProjectType])

    useEffect(() => {
        for (let i = 0; i < subscriptionTiersCount; i++) {
            setErrors(curr => ({
                ...curr,
                subscriptionTiers: [
                    ...curr.subscriptionTiers,
                    {
                        name: false,
                        pricePerMonth: false,
                        features: false,
                    }
                ]
            }))
        }
    }, [subscriptionTiersCount])

    useEffect(() => {
        props.fetchIsValidAccessCode(formData.accessCode)
    }, [formData.accessCode])

    useEffect(() => {
        if (!Object.keys(modified).length) return
        setGeneralModified(modified.creatorName || modified.logoImageURLs || isEditMode && formData.logoImages.length || modified.creatorPhoneNumber || modified.domainProviderURL || modified.domainProviderUsername || modified.domainProviderPassword)
        setLandingModified(modified.heroTitle || modified.heroMessage)
        setThemeModified(modified.themes || modified.defaultTheme || modified.selectedTintColors || modified.defaultTintColor || modified.customTintColor || modified.useCustomTintColor || modified.borderRadius || modified.buttonBorderRadius) 

        let pagesTextModified = false
        let pagesImageURLsModified = false
        let pagesImagesModified = false
        modified.pagesText.forEach( modified => {
            if (modified) pagesTextModified = true
        })
        modified.pagesImageURLs.forEach( modified => {
            if (modified) pagesImageURLsModified = true
        })
        formData.pagesImages.map( pageImages => {
            if (pageImages.length && isEditMode) pagesImagesModified = true
        })
        setFeaturesModified(pagesTextModified || pagesImageURLsModified || pagesImagesModified)

        let subscriptionTiersModified = false
        modified.subscriptionTiers.forEach( ({name, pricePerMonth, features}) => {
            if (name || pricePerMonth || features) subscriptionTiersModified = true
        })
        setSubscriptionsModified(modified.hasSubscriptions || subscriptionTiersModified)
        setSocialsModified(modified.linkedInURL || modified.facebookURL || modified.instagramURL || modified.twitterURL)
    }, [modified])

    useEffect(() => {
        setFormDataModified(generalModified || landingModified || themeModified || featuresModified || subscriptionsModified || socialsModified)
    }, [generalModified, landingModified, themeModified, featuresModified, subscriptionsModified, socialsModified])

    // Utils

    const showMissingRequiredFieldsError = () => {
        props.addMessage('You are missing one or more required fields.', true)
    }

    const navigateToStep = (stepID, completedSteps) => {
        switch (stepID) {
            case 'general':
                setSelectedStepID('general')
                break
            case 'landing':
                if (isEditMode || generalCompleted || completedSteps.general) {
                    setSelectedStepID('landing')
                }
                break
            case 'theme':
                if (isEditMode || generalCompleted && landingCompleted || completedSteps.landing) {
                    setSelectedStepID('theme')
                }
                break
            case 'features':
                if (isEditMode || generalCompleted && landingCompleted && themeCompleted || completedSteps.theme) {
                    setSelectedStepID('features')
                }
                break
            case 'subscriptions':
                if (isEditMode || generalCompleted && landingCompleted && themeCompleted && featuresCompleted || completedSteps.features) {
                    setSelectedStepID('subscriptions')
                }
                break
            case 'socials':
                if (isEditMode || generalCompleted && landingCompleted && themeCompleted && featuresCompleted && subscriptionsCompleted || completedSteps.subscriptions) {
                    setSelectedStepID('socials')
                }
                break
            case 'review':
                if (isEditMode || generalCompleted && landingCompleted && themeCompleted && featuresCompleted && subscriptionsCompleted && socialsCompleted || completedSteps.socials) {
                    setSelectedStepID('review')
                }
                break
            case 'terms':
                if (isEditMode || generalCompleted && landingCompleted && themeCompleted && featuresCompleted && subscriptionsCompleted && socialsCompleted && reviewCompleted || completedSteps.review) {
                    setSelectedStepID('terms')
                }
                break
            case 'payment':
                if (isEditMode || generalCompleted && landingCompleted && themeCompleted && featuresCompleted && subscriptionsCompleted && socialsCompleted && reviewCompleted && termsCompleted || completedSteps.terms) {
                    setSelectedStepID('payment')
                }
                break
        }
    }

    const onNavigateAwayFromStep = navigateToStepID => {
        if (formDataModified) {
            props.addMessage('You have unsaved data. Save or cancel changes before navigating away from this page.', true)
            return
        }
        switch (selectedStepID) {
            case 'general':
                const nameCompleted = !!formData.creatorName
                const projectNameCompleted = !!formData.projectName
                const logoImagesCompleted = formData.logoImages.length > 0 || formData.logoImageURLs.length > 0
                const phoneNumberCompleted = !!formData.creatorPhoneNumber
                const emailCompleted = !!formData.email
                const domainProviderURLCompleted = !!formData.domainProviderURL
                const domainProviderUsernameCompleted = !!formData.domainProviderUsername
                const domainProviderPasswordCompleted = !!formData.domainProviderPassword
                setErrors(curr => ({
                    ...curr,
                    creatorName: !nameCompleted,
                    projectName: !projectNameCompleted,
                    logoImages: !logoImagesCompleted,
                    creatorPhoneNumber: !phoneNumberCompleted,
                    email: !emailCompleted,
                    domainProviderURL: !domainProviderURLCompleted,
                    domainProviderUsername: !domainProviderUsernameCompleted,
                    domainProviderPassword: !domainProviderPasswordCompleted
                }))
                if (nameCompleted && projectNameCompleted && logoImagesCompleted && phoneNumberCompleted && emailCompleted && domainProviderURLCompleted && domainProviderUsernameCompleted && domainProviderPasswordCompleted) {
                    setGeneralCompleted(true)
                    navigateToStep(navigateToStepID, {general: true})
                } else {
                    showMissingRequiredFieldsError()
                }
                break
            case 'landing':
                const heroTitleCompleted = !!formData.heroTitle
                const heroMessageCompleted = !!formData.heroMessage
                setErrors(curr => ({
                    ...curr,
                    heroTitle: !heroTitleCompleted,
                    heroMessage: !heroMessageCompleted
                }))
                if (heroTitleCompleted && heroMessageCompleted) {
                    setLandingCompleted(true)
                    navigateToStep(navigateToStepID, {landing: true})
                } else {
                    showMissingRequiredFieldsError()
                }
                break
            case 'theme':
                const themesCompleted = formData.lightThemeSelected || formData.darkThemeSelected || formData.blueThemeSelected
                const tintColorsCompleted = formData.blueTintSelected || formData.purpleTintSelected || formData.mintTintSelected || formData.greenTintSelected
                const customTintColorCompleted = formData.useCustomTintColor ? !!formData.customTintColor : true
                setErrors(curr => ({
                    ...curr,
                    themes: !themesCompleted,
                    tintColors: !tintColorsCompleted,
                    customTintColor: !customTintColorCompleted
                }))
                if (themesCompleted && tintColorsCompleted && customTintColorCompleted) {
                    setThemeCompleted(true)
                    navigateToStep(navigateToStepID, {theme: true})
                } else {
                    showMissingRequiredFieldsError()
                }
                break
            case 'features':
                let pagesTextCompleted = true
                formData.pagesText.forEach( text => {
                    if (!text) pagesTextCompleted = false
                })
                setErrors(curr => ({
                    ...curr,
                    pagesText: formData.pagesText.map(text => !text)
                }))
                if (pagesTextCompleted) {
                    setFeaturesCompleted(true)
                    navigateToStep(navigateToStepID, {features: true})
                } else {
                    showMissingRequiredFieldsError()
                }
                break
            case 'review':
                setReviewCompleted(true)
                navigateToStep(navigateToStepID, {review: true})
                break
            case 'subscriptions':
                let subscriptionTiersCompleted = true
                formData.subscriptionTiers.forEach( ({name, pricePerMonth, features}) => {
                    if (!name || !pricePerMonth || !features) subscriptionTiersCompleted = false
                })
                setErrors(curr => ({
                    ...curr,
                    subscriptionTiers: formData.subscriptionTiers.map( ({name, pricePerMonth, features}) => ({
                        name: !name,
                        pricePerMonth: !pricePerMonth,
                        features: !features
                    }))
                }))
                if (subscriptionTiersCompleted) {
                    setSubscriptionsCompleted(true)
                    navigateToStep(navigateToStepID, {subscriptions: true})
                } else {
                    showMissingRequiredFieldsError()
                }
                break
            case 'socials':
                setSocialsCompleted(true)
                navigateToStep(navigateToStepID, {socials: true})
                break
            case 'terms':
                const signatureCompleted = !!formData.signature && formData.signature === formData.creatorName
                setErrors(curr => ({
                    ...curr,
                    acceptedTermsAndConditions: !formData.acceptedTermsAndConditions,
                    signature: !signatureCompleted
                }))
                if (formData.acceptedTermsAndConditions && signatureCompleted) {
                    setTermsCompleted(true)
                    navigateToStep(navigateToStepID, {terms: true})
                }
                if (!formData.acceptedTermsAndConditions) {
                    showMissingRequiredFieldsError()
                }
                if (!signatureCompleted) {
                    props.addMessage('Your signature should match the name you provided in the general section.', true)
                }
                break
            case 'payment':
                const accessCodeCompleted = formData.hasAccessCode ? props.isValidAccessCode : true
                setErrors(curr => ({
                    ...curr,
                    accessCode: !accessCodeCompleted
                }))
                if (accessCodeCompleted) {
                    setPaymentCompleted(true)
                    navigateToStep(navigateToStepID)
                } else if (!props.isValidAccessCode) {
                    props.addMessage('The access code you provided is invalid.', true)
                }
        }
    }

    // Direct

    const onClickProgressStep = stepID => {
        if (stepID === selectedStepID) return
        switch (stepID) {
            case 'general':
                onNavigateAwayFromStep('general')
                break
            case 'landing':
                onNavigateAwayFromStep('landing')
                break
            case 'theme':
                onNavigateAwayFromStep('theme')
                break
            case 'features':
                onNavigateAwayFromStep('features')
                break
            case 'subscriptions':
                onNavigateAwayFromStep('subscriptions')
                break
            case 'socials':
                onNavigateAwayFromStep('socials')
                break
            case 'review':
                onNavigateAwayFromStep('review')
                break
            case 'terms':
                onNavigateAwayFromStep('terms')
                break
            case 'payment':
                onNavigateAwayFromStep('payment')
                break
        }
    }

    const onChangeFormValue = e => {
        const {name, value} = e.target

        setFormData(curr => ({
            ...curr,
            [name]: value
        }))
    }

    const onClickCheckbox = checkboxOptionID => {
        switch (checkboxOptionID) {
            case 'lightThemeSelected':
                setFormData(curr => ({
                    ...curr,
                    lightThemeSelected: !curr.lightThemeSelected
                }))
                break
            case 'darkThemeSelected':
                setFormData(curr => ({
                    ...curr,
                    darkThemeSelected: !curr.darkThemeSelected
                }))
                break
            case 'blueThemeSelected':
                setFormData(curr => ({
                    ...curr,
                    blueThemeSelected: !curr.blueThemeSelected
                }))
                break
            case 'lightThemeDefault':
                props.setThemeColor(0)
                setFormData(curr => ({
                    ...curr,
                    lightThemeDefault: true,
                    darkThemeDefault: false,
                    blueThemeDefault: false,
                    lightThemeSelected: true,
                }))
                break
            case 'darkThemeDefault':
                props.setThemeColor(1)
                setFormData(curr => ({
                    ...curr,
                    lightThemeDefault: false,
                    darkThemeDefault: true,
                    blueThemeDefault: false,
                    darkThemeSelected: true,
                }))
                break
            case 'blueThemeDefault':
                props.setThemeColor(2)
                setFormData(curr => ({
                    ...curr,
                    lightThemeDefault: false,
                    darkThemeDefault: false,
                    blueThemeDefault: true,
                    blueThemeSelected: true
                }))
                break
            case 'blueTintSelected':
                setFormData(curr => ({
                    ...curr,
                    blueTintSelected: !curr.blueTintSelected
                }))
                break
            case 'purpleTintSelected':
                setFormData(curr => ({
                    ...curr,
                    purpleTintSelected: !curr.purpleTintSelected
                }))
                break
            case 'mintTintSelected':
                setFormData(curr => ({
                    ...curr,
                    mintTintSelected: !curr.mintTintSelected
                }))
                break
            case 'greenTintSelected':
                setFormData(curr => ({
                    ...curr,
                    greenTintSelected: !curr.greenTintSelected
                }))
                break
            case 'blueTintDefault':
                props.setTintColor(0)
                setFormData(curr => ({
                    ...curr,
                    blueTintDefault: true,
                    purpleTintDefault: false,
                    mintTintDefault: false,
                    greenTintDefault: false,
                    blueTintSelected: true,
                }))
                break
            case 'purpleTintDefault':
                props.setTintColor(1)
                setFormData(curr => ({
                    ...curr,
                    blueTintDefault: false,
                    purpleTintDefault: true,
                    mintTintDefault: false,
                    greenTintDefault: false,
                    purpleTintSelected: true,
                }))
                break
            case 'mintTintDefault':
                props.setTintColor(2)
                setFormData(curr => ({
                    ...curr,
                    blueTintDefault: false,
                    purpleTintDefault: false,
                    mintTintDefault: true,
                    greenTintDefault: false,
                    mintTintSelected: true,
                }))
                break
            case 'greenTintDefault':
                props.setTintColor(3)
                setFormData(curr => ({
                    ...curr,
                    blueTintDefault: false,
                    purpleTintDefault: false,
                    mintTintDefault: false,
                    greenTintDefault: true,
                    greenTintSelected: true,
                }))
                break
            case 'borderRadiusSquare':
                setFormData(curr => ({
                    ...curr,
                    borderRadius: 'square'
                }))
                break
            case 'borderRadiusRounded':
                setFormData(curr => ({
                    ...curr,
                    borderRadius: 'rounded'
                }))
                break
            case 'borderRadiusPill':
                setFormData(curr => ({
                    ...curr,
                    borderRadius: 'pill'
                }))
                break
            case 'buttonBorderRadiusSquare':
                setFormData(curr => ({
                    ...curr,
                    buttonBorderRadius: 'square'
                }))
                break
            case 'buttonBorderRadiusRounded':
                setFormData(curr => ({
                    ...curr,
                    buttonBorderRadius: 'rounded'
                }))
                break
            case 'buttonBorderRadiusPill':
                setFormData(curr => ({
                    ...curr,
                    buttonBorderRadius: 'pill'
                }))
                break
            case 'hasSubscriptions':
                if (formData.hasSubscriptions) {
                    setSubscriptionTiersCount(0)
                    setFormData(curr => ({
                        ...curr,
                        hasSubscriptions: !curr.hasSubscriptions,
                        subscriptionTiers: [],
                    }))
                    setErrors(curr => ({
                        ...curr,
                        subscriptionTiers: []
                    }))
                } else {
                    setSubscriptionTiersCount(1)
                    setFormData(curr => ({
                        ...curr,
                        hasSubscriptions: !curr.hasSubscriptions,
                        subscriptionTiers: [{
                            name: '',
                            pricePerMonth: '',
                            features: '',
                        }]
                    }))
                    setErrors(curr => ({
                        ...curr,
                        subscriptionTiers: [{
                            name: false,
                            pricePerMonth: false,
                            features: false
                        }]
                    }))
                }
                break
            case 'acceptedTermsAndConditions':
                setFormData(curr => ({
                    ...curr,
                    acceptedTermsAndConditions: !curr.acceptedTermsAndConditions
                }))
                break
            case 'hasAccessCode':
                setFormData(curr => ({
                    ...curr,
                    hasAccessCode: !curr.hasAccessCode
                }))
        }
    }

    const onClickSwitch = switchID => {
        switch (switchID) {
            case 'useCustomTintColor':
                const switchEnabled = formData.useCustomTintColor
                setFormData(curr => ({
                    ...curr,
                    useCustomTintColor: !switchEnabled,
                    blueTintSelected: switchEnabled,
                    purpleTintSelected: false,
                    mintTintSelected: false,
                    greenTintSelected: false,
                    blueTintDefault: switchEnabled,
                    purpleTintDefault: false,
                    mintTintDefault: false,
                    greenTintDefault: false,
                    customTintColor: ''
                }))
                switchEnabled && props.setTintColor(0)
                setErrors(curr => ({
                    ...curr,
                    customTintColor: false,
                    tintColors: false
                }))
        }
    }

    const onChangePageText = (pageIndex, e) => {
        setFormData(curr => ({
            ...curr,
            pagesText: curr.pagesText.map( (text, i) => (
                i == pageIndex ?
                    e.target.value
                    : text
            ))
        }))
    }

    const onChangeLogoImages = e => {
        if (!e.target.files[0]) return
        setFormData(curr => ({
            ...curr,
            logoImages: [
                ...curr.logoImages,
                e.target.files[0]
            ]
        }))
    }

    const onChangePageImages = (pageIndex, e) => {
        if (!e.target.files[0]) return
        setFormData(curr => ({
            ...curr,
            pagesImages: curr.pagesImages.map( (images, i) => (
                i == pageIndex ?
                    [
                        ...curr.pagesImages[pageIndex],
                        e.target.files[0]
                    ]
                    : images
            ))
        }))
    }

    const onClickRemoveLogoImage = imageIndex => {
        setFormData(curr => ({
            ...curr,
            logoImages: curr.logoImages.filter( (_, i) => i != imageIndex)
        }))
    }

    const onClickRemoveLogoImageURL = imageIndex => {
        setFormData(curr => ({
            ...curr,
            logoImageURLs: curr.logoImageURLs.filter( (_, i) => i != imageIndex)
        }))
    }

    const onClickRemovePageImage = (pageIndex, imageIndex) => {
        setFormData(curr => ({
            ...curr,
            pagesImages: curr.pagesImages.map( (images, i) => (
                i == pageIndex ?
                    images.filter( (_, j) => j != imageIndex)
                    : images
            ))
        }))
    }

    const onClickRemovePageImageURL = (pageIndex, imageIndex) => {
        setFormData(curr => ({
            ...curr,
            pagesImageURLs: curr.pagesImageURLs.map( (imageURLs, i) => (
                i == pageIndex ?
                    imageURLs.filter( (_, j) => j != imageIndex)
                    : imageURLs
            ))
        }))
    }

    const onChangeSubscriptionTier = (tierIndex, itemFieldname, e) => {
        setFormData(curr => ({
            ...curr,
            subscriptionTiers: curr.subscriptionTiers.map( (subscriptionTier, i) => (
                i == tierIndex ?
                    {
                        ...subscriptionTier,
                        [itemFieldname]: e.target.value
                    }
                    : subscriptionTier
            ))
        }))
    }

    const onClickAddSubscriptionTier = () => {
        setFormData(curr => ({
            ...curr,
            subscriptionTiers: [
                ...curr.subscriptionTiers,
                {
                    name: '',
                    pricePerMonth: '',
                    features: '',
                }
            ]
        }))
        setSubscriptionTiersCount(curr => curr + 1)
    }

    const onClickDeleteSubscriptionTier = tierIndex => {
        setFormData(curr => ({
            ...curr,
            hasSubscriptions: subscriptionTiersCount == 1 ? false : true,
            subscriptionTiers: curr.subscriptionTiers.filter( (_, i) => i != tierIndex)
        }))
        setSubscriptionTiersCount(curr => curr - 1)
    }

    const onClickEditField = fieldName => {
        switch (fieldName) {
            case 'name':
            case 'domainProviderURL':
            case 'domainProviderUsername':
            case 'domainProviderPassword':
            case 'projectName':
            case 'projectType':
            case 'logoImages':
            case 'email':
            case 'creatorPhoneNumber':
                setSelectedStepID('general')
                break
            case 'heroTitle':
            case 'heroMessage':
                setSelectedStepID('landing')
                break
            case 'themes':
            case 'defaultTheme':
            case 'useCustomTintColor':
            case 'tintColors':
            case 'defaultTintColor':
            case 'customTintColor':
            case 'borderRadius':
            case 'buttonBorderRadius':
                setSelectedStepID('theme')
                break
            case 'pagesText':
            case 'pagesImages':
                setSelectedStepID('features')
                break
            case 'subscriptions':
                setSelectedStepID('subscriptions')
                break
            case 'linkedInURL':
            case 'facebookURL':
            case 'instagramURL':
            case 'twitterURL':
                setSelectedStepID('socials')
                break
        }
    }

    const onClickBack = () => {
        switch (selectedStepID) {
            case 'landing':
                onNavigateAwayFromStep('general')
                break
            case 'theme':
                onNavigateAwayFromStep('landing')
                break
            case 'features':
                onNavigateAwayFromStep('theme')
                break
            case 'subscriptions':
                onNavigateAwayFromStep('features')
                break
            case 'socials':
                onNavigateAwayFromStep('subscriptions')
                break
            case 'review':
                onNavigateAwayFromStep('socials')
                break
            case 'terms':
                onNavigateAwayFromStep('review')
                break
            case 'payment':
                onNavigateAwayFromStep('terms')
                break
        }
    }

    const onClickNext = () => {
        switch (selectedStepID) {
            case 'general':
                onNavigateAwayFromStep('landing')
                break
            case 'landing':
                onNavigateAwayFromStep('theme')
                break
            case 'theme':
                onNavigateAwayFromStep('features')
                break
            case 'features':
                onNavigateAwayFromStep('subscriptions')
                break
            case 'subscriptions':
                onNavigateAwayFromStep('socials')
                break
            case 'socials':
                onNavigateAwayFromStep('review')
                break
            case 'review':
                onNavigateAwayFromStep('terms')
                break
            case 'terms':
                onNavigateAwayFromStep('payment')
                break
        }
    }

    const onClickCreateProject = () => {
        if (formData.hasAccessCode && !props.isValidAccessCode) {
            props.addMessage('The access code you entered is invalid.', true)
            return
        }
        const cancelLoadingProject = () => setLoadingCreateProject(false)
        setLoadingCreateProject(true)
        onCreateProject(cancelLoadingProject, cancelLoadingProject)
    }

    const onClickSubmitEdits = () => {
        const cancelSaveEdits = () => setLoadingSaveEdits(false)
        setLoadingSaveEdits(true)
        onSubmitEdits(cancelSaveEdits, cancelSaveEdits)
    }

    const onClickCancelEdits = () => {
        const cancelSaveEdits = () => setLoadingSaveEdits(false)
        setLoadingSaveEdits(true)
        onCancelEdits(cancelSaveEdits, cancelSaveEdits)
    }

    return (
        <Container>
            <ProgressSteps
                steps={progressSteps}
                selectedStepID={selectedStepID}
                onClickStep={onClickProgressStep}
                className='progress-steps'
            />
            <div className='form-container float-container'>
                <h3 className='title'>{selectedStep.title}</h3>
                {selectedStepID === 'general' ?
                    <div className='inner-form-container'>
                        <InputWithMessage
                            label='Your Name'
                            inputType='text'
                            text={formData.creatorName}
                            onChangeText={onChangeFormValue}
                            fieldName='creatorName'
                            message=' '
                            hasError={errors.creatorName}
                            modified={isEditMode && modified.creatorName}
                            locked={isEditMode || props.isLoggedIn}
                        />
                        <InputWithMessage
                            label='Project Name'
                            inputType='text'
                            text={formData.projectName}
                            onChangeText={onChangeFormValue}
                            fieldName='projectName'
                            message='This is the name that will appear in the top left corner of your site.'
                            hasError={errors.projectName}
                            modified={isEditMode && modified.projectName}
                            locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                        />
                        <InputWithMessage
                            label='Project Type'
                            inputType='select'
                            fieldName='projectType'
                            selectValue={formData.projectType}
                            selectValues={ProjectTypes}
                            onChangeSelectValue={onChangeFormValue}
                            tintMessage={`$${selectedProjectType.price}`}
                            locked={isEditMode}
                        />
                        <ImagesInput
                            label='Logo Images'
                            imageFiles={formData.logoImages}
                            imageURLs={formData.logoImageURLs}
                            onChangeImageFiles={onChangeLogoImages}
                            onClickRemoveImageFile={onClickRemoveLogoImage}
                            onClickRemoveImageURL={onClickRemoveLogoImageURL}
                            modified={isEditMode && (formData.logoImages.length || modified.logoImageURLs)}
                            hasError={errors.logoImages}
                            locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                        />
                        <InputWithMessage
                            label='Your Personal Phone Number'
                            inputType='text'
                            text={formData.creatorPhoneNumber}
                            onChangeText={onChangeFormValue}
                            fieldName='creatorPhoneNumber'
                            message='This is the phone number that will be used to create your development accounts. It will not appear on the public website.'
                            hasError={errors.creatorPhoneNumber}
                            modified={isEditMode && modified.creatorPhoneNumber}
                        />
                        <InputWithMessage
                            label='Your Email'
                            inputType='text'
                            text={formData.email}
                            onChangeText={onChangeFormValue}
                            fieldName='email'
                            message='This is the email that will be used to create your Blackbox Solution account.'
                            hasError={errors.email}
                            modified={isEditMode && modified.email}
                            locked={isEditMode || props.isLoggedIn}
                        />
                        <InputWithMessage
                            label='Domain Provider URL'
                            inputType='text'
                            text={formData.domainProviderURL}
                            onChangeText={onChangeFormValue}
                            fieldName='domainProviderURL'
                            placeholder='https://'
                            message='This is the domain service you used to purchase your domain. If you do not have one we recommend Google Domains.'
                            hasError={errors.domainProviderURL}
                            modified={isEditMode && modified.domainProviderURL}
                            locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                        />
                        <InputWithMessage
                            label='Domain Provider Username'
                            inputType='text'
                            text={formData.domainProviderUsername}
                            onChangeText={onChangeFormValue}
                            fieldName='domainProviderUsername'
                            hasError={errors.domainProviderUsername}
                            message=' '
                            modified={isEditMode && modified.domainProviderUsername}
                            locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                        />
                        <InputWithMessage
                            label='Domain Provider Password'
                            inputType='text'
                            text={formData.domainProviderPassword}
                            onChangeText={onChangeFormValue}
                            fieldName='domainProviderPassword'
                            hasError={errors.domainProviderPassword}
                            message=' '
                            modified={isEditMode && modified.domainProviderPassword}
                            locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                        />
                    </div>
                : selectedStepID === 'landing' ?
                    <div className='inner-form-container'>
                        <InputWithMessage
                            label='Hero Title'
                            inputType='text'
                            text={formData.heroTitle}
                            onChangeText={onChangeFormValue}
                            fieldName='heroTitle'
                            message='This is the title that will be shown on the hero section of the landing page. We recommend a short statement about what your product does.'
                            hasError={errors.heroTitle}
                            modified={isEditMode && modified.heroTitle}
                            locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                        />
                        <InputWithMessage
                            label='Hero Message'
                            inputType='textarea'
                            text={formData.heroMessage}
                            onChangeText={onChangeFormValue}
                            fieldName='heroMessage'
                            message='This is the message that will be shown beneath the hero title on the landing page. We recommend a 1-3 sentence message about what your product does and why people should use it.'
                            hasError={errors.heroTitle}
                            modified={isEditMode && modified.heroMessage}
                            locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                        />
                    </div>
                : selectedStepID === 'theme' ?
                    <div className='inner-form-container'>
                        <InputWithMessage
                            label='Themes'
                            inputType='checklist'
                            checklistOptions={[
                                {title: 'Light Theme', selected: formData.lightThemeSelected, id: 'lightThemeSelected'},
                                {title: 'Dark Theme', selected: formData.darkThemeSelected, id: 'darkThemeSelected'},
                                {title: 'Blue Theme', selected: formData.blueThemeSelected, id: 'blueThemeSelected'},
                            ]}
                            onClickCheckbox={onClickCheckbox}
                            message='Select up to three. Selecting multiple allows users to pick which theme to use on their version of the site.'
                            hasError={errors.themes}
                            modified={isEditMode && modified.themes}
                            locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                        />
                        <InputWithMessage
                            label='Default Theme'
                            inputType='checklist'
                            checklistOptions={[
                                {title: 'Light Theme', selected: formData.lightThemeDefault, id: 'lightThemeDefault'},
                                {title: 'Dark Theme', selected: formData.darkThemeDefault, id: 'darkThemeDefault'},
                                {title: 'Blue Theme', selected: formData.blueThemeDefault, id: 'blueThemeDefault'},
                            ]}
                            onClickCheckbox={onClickCheckbox}
                            message='Select one.'
                            modified={isEditMode && modified.defaultTheme}
                            locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                        />
                        <InputWithMessage
                            label='Use Custom Tint Color'
                            inputType='switch'
                            switchEnabled={formData.useCustomTintColor}
                            onClickSwitch={() => onClickSwitch('useCustomTintColor')}
                            message='If selected we will use your custom tint color instead of the default tint colors provided.'
                            modified={isEditMode && modified.useCustomTintColor}
                            locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                        />
                        {formData.useCustomTintColor ?
                            <InputWithMessage
                                label='Custom Tint Color'
                                inputType='text'
                                text={formData.customTintColor}
                                onChangeText={onChangeFormValue}
                                fieldName='customTintColor'
                                placeholder='Enter rgb code or hex code'
                                rightChild={
                                    <div className='custom-color-option-container'>
                                        <div className='custom-color-option' style={{backgroundColor: formData.customTintColor}} />
                                    </div>
                                }
                                hasError={errors.customTintColor}
                                modified={isEditMode && modified.customTintColor}
                                locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                            />
                            : null
                        }
                        { formData.useCustomTintColor ?
                            null
                            : <InputWithMessage
                                label='Tint Colors'
                                inputType='checklist'
                                checklistOptions={[
                                    {
                                        title: 'Blue',
                                        selected: formData.blueTintSelected,
                                        id: 'blueTintSelected',
                                        leftChild: <div className='color-option' style={{backgroundColor: Tints[0].tint}} />
                                    },
                                    {
                                        title: 'Purple',
                                        selected: formData.purpleTintSelected,
                                        id: 'purpleTintSelected',
                                        leftChild: <div className='color-option' style={{backgroundColor: Tints[1].tint}} />
                                    },
                                    {
                                        title: 'Mint',
                                        selected: formData.mintTintSelected,
                                        id: 'mintTintSelected',
                                        leftChild: <div className='color-option' style={{backgroundColor: Tints[2].tint}} />
                                    },
                                    {
                                        title: 'Green',
                                        selected: formData.greenTintSelected,
                                        id: 'greenTintSelected',
                                        leftChild: <div className='color-option' style={{backgroundColor: Tints[3].tint}} />
                                    },
                                ]}
                                onClickCheckbox={onClickCheckbox}
                                message='Select up to four. Selecting multiple allows users to pick which tint color to use on their version of the site.'
                                hasError={errors.tintColors}
                                modified={isEditMode && modified.selectedTintColors}
                                locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                            />
                        }      
                        { formData.useCustomTintColor ?
                            null
                            : <InputWithMessage
                                label='Default Tint Color'
                                inputType='checklist'
                                checklistOptions={[
                                    {
                                        title: 'Blue',
                                        selected: formData.blueTintDefault,
                                        id: 'blueTintDefault',
                                        leftChild: <div className='color-option' style={{backgroundColor: Tints[0].tint}} />
                                    },
                                    {
                                        title: 'Purple',
                                        selected: formData.purpleTintDefault,
                                        id: 'purpleTintDefault',
                                        leftChild: <div className='color-option' style={{backgroundColor: Tints[1].tint}} />
                                    },
                                    {
                                        title: 'Mint',
                                        selected: formData.mintTintDefault,
                                        id: 'mintTintDefault',
                                        leftChild: <div className='color-option' style={{backgroundColor: Tints[2].tint}} />
                                    },
                                    {
                                        title: 'Green',
                                        selected: formData.greenTintDefault,
                                        id: 'greenTintDefault',
                                        leftChild: <div className='color-option' style={{backgroundColor: Tints[3].tint}} />
                                    },
                                ]}
                                onClickCheckbox={onClickCheckbox}
                                message='Select one.'
                                modified={isEditMode && modified.defaultTintColor}
                                locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                            />
                        }
                        <InputWithMessage
                            label='Elements Border Radius'
                            inputType='checklist'
                            checklistOptions={BorderRadii.map(({id, radius, value}) => ({
                                title: capitalizeWords(value),
                                selected: formData.borderRadius === value,
                                id,
                                leftChild: <div className='border-radius-option' style={{borderRadius: radius}} />
                            }))}
                            onClickCheckbox={onClickCheckbox}
                            message='Select one.'
                            modified={isEditMode && modified.borderRadius}
                            locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                        />
                        <InputWithMessage
                            label='Button Border Radius'
                            inputType='checklist'
                            checklistOptions={ButtonBorderRadii.map(({id, radius, value}) => ({
                                title: capitalizeWords(value),
                                selected: formData.buttonBorderRadius === value,
                                id,
                                leftChild: <div className='button-border-radius-option' style={{borderRadius: radius}}>
                                    Button
                                </div>
                            }))}
                            onClickCheckbox={onClickCheckbox}
                            message='Select one.'
                            modified={isEditMode && modified.buttonBorderRadius}
                            locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                        />
                    </div>
                : selectedStepID === 'features' ?
                    <div className='inner-form-container'>
                        <div className='label-with-message-container'>
                            <div className='label-container'>
                                <label>Included Pages</label>
                                <p className='review-item ml-10'>- Login Page</p>
                                <p className='review-item ml-10'>- Registration Page</p>
                                <p className='review-item ml-10'>- Landing Page</p>
                                <p className='review-item ml-10'>- Settings Page</p>
                                <p className='review-item ml-10'>- Support Page</p>
                                <p className='review-item ml-10'>- Admin Console Page</p>
                                <p className='review-item ml-10'>- Notifications Page</p>
                            </div>
                        </div>
                        {formData.pagesText.map( (text, i) => (
                            <div className='d-flex fd-column ai-stretch' key={i}>
                                <InputWithMessage
                                    label={`Page ${i + 1} Content`}
                                    inputType='textarea'
                                    text={text}
                                    onChangeText={e => onChangePageText(i, e)}
                                    placeholder={`Describe the content and features you want to see on page ${i + 1}`}
                                    hasError={errors.pagesText[i]}
                                    modified={isEditMode && modified.pagesText[i]}
                                    locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                                />
                                <ImagesInput
                                    label={`Page ${i + 1} UI Images`}
                                    imageFiles={formData.pagesImages[i]}
                                    imageURLs={formData.pagesImageURLs[i]}
                                    onChangeImageFiles={e => onChangePageImages(i, e)}
                                    onClickRemoveImageFile={imageIndex => onClickRemovePageImage(i, imageIndex)}
                                    onClickRemoveImageURL={imageIndex => onClickRemovePageImageURL(i, imageIndex)}
                                    modified={isEditMode && (formData.pagesImages[i].length || modified.pagesImageURLs[i])}
                                    locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                                />
                            </div>
                        ))}
                    </div>
                : selectedStepID === 'subscriptions' ? 
                    <div className='inner-form-container'>
                        <InputWithMessage
                            label='Subscriptions'
                            inputType='checklist'
                            checklistOptions={[
                                {
                                    title: 'My webapp uses subscriptions',
                                    selected: formData.hasSubscriptions,
                                    id: 'hasSubscriptions'
                                }
                            ]}
                            onClickCheckbox={onClickCheckbox}
                            modified={isEditMode && modified.hasSubscriptions}
                            locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                        />
                        {formData.subscriptionTiers.map( (subscriptionTier, i) => (
                            <div
                                className='d-flex fd-column ai-stretch'
                                key={i}
                                style={{marginBottom: 30}}
                            >
                                <div className='d-flex jc-space-between ai-center' style={{marginBottom: 20}}>
                                    <h4>{`Subscription Tier ${i + 1}`}</h4>
                                    <IconButton
                                        icon='bi-trash'
                                        size='m'
                                        onClick={() => onClickDeleteSubscriptionTier(i)}
                                    />
                                </div>
                                <InputWithMessage
                                    label={`Name`}
                                    inputType='text'
                                    text={subscriptionTier.name}
                                    onChangeText={e => onChangeSubscriptionTier(i, 'name', e)}
                                    placeholder={`Premium`}
                                    hasError={errors.subscriptionTiers[i] ? errors.subscriptionTiers[i].name : false} 
                                    modified={isEditMode && modified.subscriptionTiers[i] ? modified.subscriptionTiers[i].name : false}
                                    message=' '
                                    locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                                />
                                <InputWithMessage
                                    label={`Price per Month`}
                                    inputType='text'
                                    text={subscriptionTier.pricePerMonth}
                                    onChangeText={e => onChangeSubscriptionTier(i, 'pricePerMonth', e)}
                                    placeholder={`$10.00`}
                                    hasError={errors.subscriptionTiers[i] ? errors.subscriptionTiers[i].pricePerMonth : false}
                                    modified={isEditMode && modified.subscriptionTiers[i] ? modified.subscriptionTiers[i].pricePerMonth : false}
                                    message=' '
                                    locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                                />
                                <InputWithMessage
                                    label={`Features`}
                                    inputType='textarea'
                                    text={subscriptionTier.features}
                                    onChangeText={e => onChangeSubscriptionTier(i, 'features', e)}
                                    placeholder={`Describe the features that are available for this subscription tier.`}
                                    hasError={errors.subscriptionTiers[i] ? errors.subscriptionTiers[i].features : false}
                                    modified={isEditMode && modified.subscriptionTiers[i] ? modified.subscriptionTiers[i].features : false}
                                    locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                                />
                            </div>
                        ))}
                        {formData.hasSubscriptions ?
                            <Button
                                title='Add Subscription Tier'
                                priority={2}
                                type='clear'
                                onClick={onClickAddSubscriptionTier}
                                style={{marginBottom: 30}}
                            />
                            : null
                        }
                    </div>
                : selectedStepID === 'socials' ?
                    <div className='inner-form-container'>
                        <InputWithMessage
                            label='LinkedIn URL'
                            inputType='text'
                            text={formData.linkedInURL}
                            onChangeText={onChangeFormValue}
                            fieldName='linkedInURL'
                            message=' '
                            placeholder='https://'
                            modified={isEditMode && modified.linkedInURL}
                            locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                            optional={true}
                        />
                        <InputWithMessage
                            label='Facebook URL'
                            inputType='text'
                            text={formData.facebookURL}
                            onChangeText={onChangeFormValue}
                            fieldName='facebookURL'
                            message=' '
                            placeholder='https://'
                            modified={isEditMode && modified.facebookURL}
                            locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                            optional={true}
                        />
                        <InputWithMessage
                            label='Instagram URL'
                            inputType='text'
                            text={formData.instagramURL}
                            onChangeText={onChangeFormValue}
                            fieldName='instagramURL'
                            message=' '
                            placeholder='https://'
                            modified={isEditMode && modified.instagramURL}
                            locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                            optional={true}
                        />
                        <InputWithMessage
                            label='Twitter URL'
                            inputType='text'
                            text={formData.twitterURL}
                            onChangeText={onChangeFormValue}
                            fieldName='twitterURL'
                            message=' '
                            placeholder='https://'
                            modified={isEditMode && modified.twitterURL}
                            locked={isEditMode && (props.project ? props.project.editingLocked : true)}
                            optional={true}
                        />
                    </div>
                : selectedStepID === 'review' ? 
                    <div className='inner-form-container'>
                        <h3 className='review-title'>General</h3>
                        <div className='review-section'>
                            <div className='label-with-message-container'>
                                <div className='label-container'>
                                    <label>Your Name</label>
                                    <p className='review-item'>{formData.creatorName}</p>
                                </div>
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('name')}
                                />
                            </div>
                            <div className='label-with-message-container'>
                                <div className='label-container'>
                                    <label>Project Name</label>
                                    <p className='review-item'>{formData.projectName}</p>
                                </div>
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('projectName')}
                                />
                            </div>
                            <div className='label-with-message-container'>
                                <div className='label-container'>
                                    <label>Project Type</label>
                                    <p className='review-item'>{ProjectTypes.find(({id}) => formData.projectType).title}</p>
                                </div>
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('projectType')}
                                />
                            </div>
                            <div className='label-with-message-container'>
                                <ImagesInput
                                    label='Logo Images'
                                    imageFiles={formData.logoImages}
                                    imageURLs={formData.logoImageURLs}
                                    showInput={false}
                                    allowDelete={false}
                                />
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('logoImages')}
                                    className='edit-icon'
                                />
                            </div>
                            <div className='label-with-message-container'>
                                <div className='label-container'>
                                    <label>Your Personal Phone Number</label>
                                    <p className='review-item'>{formData.creatorPhoneNumber}</p>
                                </div>
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('creatorPhoneNumber')}
                                />
                            </div>
                            <div className='label-with-message-container'>
                                <div className='label-container'>
                                    <label>Your Email</label>
                                    <p className='review-item'>{formData.email}</p>
                                </div>
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('email')}
                                />
                            </div>
                            <div className='label-with-message-container'>
                                <div className='label-container'>
                                    <label>Domain Provider URL</label>
                                    <p className='review-item'>{formData.domainProviderURL}</p>
                                </div>
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('domainProviderURL')}
                                />
                            </div>
                            <div className='label-with-message-container'>
                                <div className='label-container'>
                                    <label>Domain Provider Username</label>
                                    <p className='review-item'>{formData.domainProviderUsername}</p>
                                </div>
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('domainProviderUsername')}
                                />
                            </div>
                            <div className='label-with-message-container'>
                                <div className='label-container'>
                                    <label>Domain Provider Password</label>
                                    <p className='review-item'>{formData.projectName}</p>
                                </div>
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('domainProviderPassword')}
                                />
                            </div>
                        </div>
                        <h3 className='review-title'>Landing</h3>
                        <div className='review-section'>
                            <div className='label-with-message-container'>
                                <div className='label-container'>
                                    <label>Hero Title</label>
                                    <p className='review-item'>{formData.heroTitle}</p>
                                </div>
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('heroTitle')}
                                />
                            </div>
                            <div className='label-with-message-container'>
                                <div className='label-container'>
                                    <label>Hero Message</label>
                                    <p className='review-item'>{formData.heroMessage}</p>
                                </div>
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('heroMessage')}
                                />
                            </div>
                        </div>
                        <h3 className='review-title'>Theme</h3>
                        <div className='review-section'>
                            <div className='label-with-message-container'>
                                <div className='label-container'>
                                    <label>Themes</label>
                                    <p className='review-item'>{[
                                        [formData.lightThemeSelected, 'Light Theme'],
                                        [formData.darkThemeSelected, 'Dark Theme'],
                                        [formData.blueThemeSelected, 'Blue Theme']
                                    ].filter( ([selected]) => selected)
                                    .map( ([_, title]) => title)
                                    .join(', ')
                                    }</p>
                                </div>
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('themes')}
                                />
                            </div>
                            <div className='label-with-message-container'>
                                <div className='label-container'>
                                    <label>Default Theme</label>
                                    <p className='review-item'>{
                                        formData.lightThemeDefault ? 'Light Theme'
                                        : formData.darkThemeDefault ? 'Dark Theme'
                                        : formData.blueThemeDefault ? 'Blue Theme'
                                        : null
                                    }</p>
                                </div>
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('defaultTheme')}
                                />
                            </div>
                            <div className='label-with-message-container'>
                                <div className='label-container'>
                                    <label>Use Custom Tint Color</label>
                                    <p className='review-item'>{formData.useCustomTintColor ? 'True' : 'False'}</p>
                                </div>
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('useCustomTintColor')}
                                />
                            </div>
                            { formData.useCustomTintColor ? 
                                <div className='label-with-message-container'>
                                    <div className='label-container'>
                                        <label>Custom Tint Color</label>
                                        <div className='d-flex jc-flex-start ai-center' style={{marginTop: 5}}>
                                            <p className='review-item' style={{marginTop: 0}}>{formData.customTintColor}</p>
                                            <div
                                                className='color-option'
                                                style={{backgroundColor: formData.customTintColor, marginLeft: 10}}
                                            />
                                        </div>
                                    </div>
                                    <IconButton
                                        icon='bi-pencil'
                                        size='s'
                                        onClick={() => onClickEditField('customTintColor')}
                                    />
                                </div>
                                : null
                            }
                            { formData.useCustomTintColor ? 
                                null
                                : <div className='label-with-message-container'>
                                    <div className='label-container'>
                                        <label>Tint Colors</label>
                                        <p className='review-item'>{[
                                            [formData.blueTintSelected, 'Blue'],
                                            [formData.purpleTintSelected, 'Purple'],
                                            [formData.mintTintSelected, 'Mint'],
                                            [formData.greenTintSelected, 'Green']
                                        ].filter( ([selected]) => selected)
                                        .map( ([_, title]) => title)
                                        .join(', ')
                                        }</p>
                                    </div>
                                    <IconButton
                                        icon='bi-pencil'
                                        size='s'
                                        onClick={() => onClickEditField('tintColors')}
                                    />
                                </div>
                            }
                            { formData.useCustomTintColor ? 
                                null
                                : <div className='label-with-message-container'>
                                    <div className='label-container'>
                                        <label>Default Tint Color</label>
                                        <p className='review-item'>{
                                            formData.blueTintDefault ? 'Blue'
                                            : formData.purpleTintDefault ? 'Purple'
                                            : formData.mintTintDefault ? 'Mint'
                                            : formData.greenTintDefault ? 'Green'
                                            : null
                                        }</p>
                                    </div>
                                    <IconButton
                                        icon='bi-pencil'
                                        size='s'
                                        onClick={() => onClickEditField('defaultTintColor')}
                                    />
                                </div>
                            }
                            <div className='label-with-message-container'>
                                <div className='label-container'>
                                    <label>Elements Border Radius</label>
                                    <p className='review-item'>{capitalizeWords(formData.borderRadius)}</p>
                                </div>
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('borderRadius')}
                                />
                            </div>
                            <div className='label-with-message-container'>
                                <div className='label-container'>
                                    <label>Button Border Radius</label>
                                    <p className='review-item'>{capitalizeWords(formData.buttonBorderRadius)}</p>
                                </div>
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('buttonBorderRadius')}
                                />
                            </div>
                        </div>
                        <h3 className='review-title'>Features</h3>
                        <div className='review-section'>
                            {formData.pagesText.map( (text, i) => (
                                <div className='d-flex fd-column ai-stretch' key={i}>
                                    <div className='label-with-message-container'>
                                        <div className='label-container'>
                                            <label>{`Page ${i + 1} Content`}</label>
                                            <div className='d-flex jc-flex-start ai-center' style={{marginTop: 5}}>
                                                <p className='review-item' style={{marginTop: 0}}>{text}</p>
                                            </div>
                                        </div>
                                        <IconButton
                                            icon='bi-pencil'
                                            size='s'
                                            onClick={() => onClickEditField('pagesText')}
                                        />
                                    </div>
                                    <div className='label-with-message-container'>
                                        <ImagesInput
                                            label={`Page ${i + 1} UI Images`}
                                            imageFiles={formData.pagesImages[i]}
                                            imageURLs={formData.pagesImageURLs[i]}
                                            showInput={false}
                                            allowDelete={false}
                                        />
                                        <IconButton
                                            icon='bi-pencil'
                                            size='s'
                                            onClick={() => onClickEditField('pagesImages')}
                                            className='edit-icon'
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <h3 className='review-title'>Subscriptions</h3>
                        <div className='review-section'>
                            <div className='label-with-message-container'>
                                <div className='label-container'>
                                    <label>Webapp Uses Subscriptions</label>
                                    <p className='review-item'>{formData.hasSubscriptions ? 'True' : 'False'}</p>
                                </div>
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('subscriptions')}
                                />
                            </div>
                            {formData.subscriptionTiers.map( (subscriptionTier, i) => (
                                <div className='d-flex fd-column ai-stretch' key={i}>
                                    <h4 style={{marginBottom: 20}}>{`Subscription Tier ${i + 1}`}</h4>
                                    <div className='label-with-message-container'>
                                        <div className='label-container'>
                                            <label>Name</label>
                                            <p className='review-item'>{subscriptionTier.name}</p>
                                        </div>
                                        <IconButton
                                            icon='bi-pencil'
                                            size='s'
                                            onClick={() => onClickEditField('subscriptions')}
                                        />
                                    </div>
                                    <div className='label-with-message-container'>
                                        <div className='label-container'>
                                            <label>Price per Month</label>
                                            <p className='review-item'>{subscriptionTier.pricePerMonth}</p>
                                        </div>
                                        <IconButton
                                            icon='bi-pencil'
                                            size='s'
                                            onClick={() => onClickEditField('subscriptions')}
                                        />
                                    </div>
                                    <div className='label-with-message-container'>
                                        <div className='label-container'>
                                            <label>Webapp Uses Subscriptions</label>
                                            <p className='review-item'>{subscriptionTier.features}</p>
                                        </div>
                                        <IconButton
                                            icon='bi-pencil'
                                            size='s'
                                            onClick={() => onClickEditField('subscriptions')}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <h3 className='review-title'>Socials</h3>
                        <div className='review-section'>
                            <div className='label-with-message-container'>
                                <div className='label-container'>
                                    <label>LinkedIn URL</label>
                                    <p className='review-item'>{formData.linkedInURL || 'None provided'}</p>
                                </div>
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('linkedInURL')}
                                />
                            </div>
                            <div className='label-with-message-container'>
                                <div className='label-container'>
                                    <label>Facebook URL</label>
                                    <p className='review-item'>{formData.facebookURL || 'None provided'}</p>
                                </div>
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('facebookURL')}
                                />
                            </div>
                            <div className='label-with-message-container'>
                                <div className='label-container'>
                                    <label>Instagram URL</label>
                                    <p className='review-item'>{formData.instagramURL || 'None provided'}</p>
                                </div>
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('instagramURL')}
                                />
                            </div>
                            <div className='label-with-message-container'>
                                <div className='label-container'>
                                    <label>Twitter URL</label>
                                    <p className='review-item'>{formData.twitterURL || 'None provided'}</p>
                                </div>
                                <IconButton
                                    icon='bi-pencil'
                                    size='s'
                                    onClick={() => onClickEditField('twitterURL')}
                                />
                            </div>
                        </div>
                    </div>
                : selectedStepID === 'terms' && !isEditMode ?
                    <div className='inner-form-container'>
                        <label>Terms and Conditions</label>
                        <div className='terms-container'>
                            {TermsSections.map( ({title, body}) => (
                                <div className='terms-section-container' key={title}>
                                    <h4 className='terms-section-title'>{title}</h4>
                                    <p className='terms-section-body'>{body}</p>
                                </div>
                            ))}
                        </div>
                        <InputWithMessage
                            label='Acceptance'
                            inputType='checklist'
                            checklistOptions={[
                                {
                                    title: 'I agree to these terms and conditions',
                                    selected: formData.acceptedTermsAndConditions,
                                    id: 'acceptedTermsAndConditions'
                                }
                            ]}
                            onClickCheckbox={onClickCheckbox}
                            hasError={errors.acceptedTermsAndConditions}
                        />
                        <InputWithMessage
                            label='Signature'
                            inputType='text'
                            text={formData.signature}
                            fieldName='signature'
                            placeholder={formData.creatorName}
                            onChangeText={onChangeFormValue}
                            message=' '
                            hasError={errors.signature}
                        />
                    </div>
                : selectedStepID === 'payment' && !isEditMode ?
                    <div className='inner-form-container'>
                        <InputWithMessage
                            label='Access Code'
                            inputType='checklist'
                            checklistOptions={[
                                {
                                    title: 'I have an access code',
                                    selected: formData.hasAccessCode,
                                    id: 'hasAccessCode'
                                }
                            ]}
                            onClickCheckbox={onClickCheckbox}
                            hasError={errors.acceptedTermsAndConditions}
                        />
                        {formData.hasAccessCode ?
                            <InputWithMessage
                                label='Access Code'
                                inputType='text'
                                text={formData.accessCode}
                                fieldName='accessCode'
                                placeholder='Enter your access code'
                                onChangeText={onChangeFormValue}
                                hasError={errors.accessCode}
                                rightChild={
                                    <ValidLabel
                                        isValid={props.isValidAccessCode}
                                        validMessage='Access code is valid'
                                        invalidMessage='Access code is invalid'
                                        style={{marginLeft: 15}}
                                    />
                                }
                            />
                            : null
                        }
                    </div>
                : null
                }
                <div className='d-flex jc-space-between ai-center'>
                    {loadingCreateProject ?
                        <PendingMessage message="Operation in progress. Don't exit this page, this might take a little while." />
                        : <div />
                    }
                    {loadingSaveEdits ?
                        <PendingMessage message="Operation in progress, don't exit this page." />
                        : <div />
                    }
                    <div className='buttons-container'>
                        {selectedStepID === 'general' || formDataModified ?
                            null
                            : <Button
                                title='Back'
                                type='tint'
                                priority={1}
                                onClick={onClickBack}
                                style={{marginRight: 10}}
                            />
                        }
                        {selectedStepID === 'payment' ?
                            <Button
                                title='Create Project'
                                type='solid'
                                priority={1}
                                onClick={onClickCreateProject}
                            />
                        : formDataModified ?
                            null
                        : <Button
                                title='Next'
                                type='solid'
                                priority={1}
                                onClick={onClickNext}
                            />
                        }
                        {formDataModified ?
                            <div className='d-flex jc-flex-end ai-center'>
                                <Button
                                    title='Cancel'
                                    type='tint'
                                    priority={1}
                                    onClick={onClickCancelEdits}
                                    style={{marginRight: 10}}
                                />
                                <Button
                                    title='Save Changes'
                                    type='solid'
                                    priority={1}
                                    onClick={onClickSubmitEdits}
                                />
                            </div>
                            : null
                        }
                    </div>
                </div>
            </div>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    align-items: flex-start;

    & .progress-steps {
        margin-right: 30px;
        position: sticky;
        top: 75px;
    }

    & .form-container {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        flex: 1;
        padding: 30px;
        margin-bottom: 50px;
    }

    & .form-container .title {
        margin-bottom: 30px;
    }

    & .inner-form-container {
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }

    & .label-with-message-container {
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        width: 100%;
    }
    & .label-with-message-container .label-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1;
        white-space: pre-line;
    }
    & .label-with-message-container .edit-icon {
        justify-self: flex-end;
    }

    & .color-option {
        height: 15px;
        width: 15px;
        border-radius: 7px;
    }

    & .custom-color-option-container {
        display: flex;
        flex: 1;
        justify-content: flex-end;
        align-items: center;
    }
    & .custom-color-option {
        height: 15px;
        width: 60px;
        border-radius: 7px;
    }

    & .border-radius-option {
        height: 100px;
        width: 100px;
        border: 1px solid ${p => p.theme.bc};
        background-color: ${p => p.theme.bgcInput};
    }

    & .button-border-radius-option {
        background-color: ${p => p.theme.bgcInput};
        padding: 5px 20px;
        font-size: 14px;
        color: ${p => p.theme.textMain};
        border: 1px solid ${p => p.theme.textMain};
    }

    & .review-section {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        width: 100%;
        padding-left: 15px;
        box-sizing: border-box;
    }

    & .review-item {
        margin-top: 5px;
    }

    & .review-title {
        margin-bottom: 20px;
        border-bottom: 1px solid ${p => p.theme.bc};
        padding-bottom: 5px; 
    }

    & .terms-container {
        height: min(60vh, 300px);
        border: 1px solid ${p => p.theme.bc};
        border-radius: 5px;
        padding: 20px;
        margin-top: 5px;
        overflow: scroll;
        margin-bottom: 20px;
    }

    & .terms-section-container {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        margin-bottom: 30px;
    }

    & .terms-section-title {
        margin-bottom: 5px;
    }

    & .terms-section-body {
        white-space: pre-line;
    }

    & .buttons-container {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    & .ml-10 {
        margin-left: 10px;
    }
`

const mapStateToProps = state => ({
    isValidAccessCode: getIsValidAccessCode(state),
    isLoggedIn: getIsLoggedIn(state),
    user: getUser(state),
    project: getProject(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchIsValidAccessCode,
    addMessage,
    setThemeColor,
    setTintColor
}, dispatch)

export const CreateProjectForm = connect(mapStateToProps, mapDispatchToProps)(CreateProjectFormComponent)