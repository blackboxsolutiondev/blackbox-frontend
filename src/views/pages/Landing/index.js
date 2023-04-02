import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

import { getIsMobile, getIsSemiMobile } from '../../../redux/theme'
import { setThemeColor, setTintColor } from '../../../redux/theme'
import { PageContainer } from '../../components/common/PageContainer'
import { LandingHeader } from '../../components/headers/LandingHeader'
import { Button } from '../../components/common/Button'

const Config = {
    heroTitle: 'Webapps done right',
    heroMessage: "We'll convert your product idea into a professional webapp. Just fill out our form and tell us about your product to get started.",
    heroImageURL: 'https://firebasestorage.googleapis.com/v0/b/template-project-7b481.appspot.com/o/landing%2Fadmin_console_bug_reports.png?alt=media&token=f0a1c444-2c6d-4b89-b1ec-67525c7dbe46',
    whyChooseUs: [
        {
            id: 0,
            imageURL: 'https://firebasestorage.googleapis.com/v0/b/template-project-7b481.appspot.com/o/landing%2Fadmin_console_general.png?alt=media&token=406942e7-7c3c-4c4f-b69e-9cf0cab27fed',
            title: 'Pre-built admin console',
            message: "With our pre-built admin console, you'll be able to send announcements to users, track user-submitted bug reports, and view site analytics.",
            icon: 'bi-person-circle'
        },
        {
            id: 1,
            imageURL: 'https://firebasestorage.googleapis.com/v0/b/template-project-7b481.appspot.com/o/landing%2Fnotifications.png?alt=media&token=378ef367-26ec-4968-bd6f-d549e2895076',
            title: 'Pre-built notification system',
            message: "With our pre-built notification system, you'll be able to reach out to users with important updates about your site.",
            icon: 'bi-mailbox'
        },
        {
            id: 2,
            imageURL: '',
            title: 'Stripe integration',
            message: "If your site uses a subscription model we've got you covered. Our webapps come with Stripe pre-integrated.",
            icon: 'bi-credit-card'
        }
    ],
    pricing: [
        {
            title: 'Small Webapp',
            price: '200',
            features: [
                {title: '2 Custom Pages', included: true},
                {title: 'Source Code', included: true},
                {title: 'Login Pages', included: true},
                {title: 'Landing Page', included: true},
                {title: 'Settings Page', included: true},
                {title: 'Support Page', included: true},
                {title: 'Admin Console', included: true},
                {title: 'Bug Reports', included: true},
                {title: 'Notifications Page', included: true},
            ],
            id: 's'
        },
        {
            title: 'Medium Webapp',
            price: '400',
            features: [
                {title: '4 Custom Pages', included: true},
                {title: 'Source Code', included: true},
                {title: 'Login Pages', included: true},
                {title: 'Landing Page', included: true},
                {title: 'Settings Page', included: true},
                {title: 'Support Page', included: true},
                {title: 'Admin Console', included: true},
                {title: 'Bug Reports', included: true},
                {title: 'Notifications Page', included: true},
            ],
            id: 'm'
        },
        {
            title: 'Large Webapp',
            price: '1000',
            features: [
                {title: '10 Custom Pages', included: true},
                {title: 'Source Code', included: true},
                {title: 'Login Pages', included: true},
                {title: 'Landing Page', included: true},
                {title: 'Settings Page', included: true},
                {title: 'Support Page', included: true},
                {title: 'Admin Console', included: true},
                {title: 'Bug Reports', included: true},
                {title: 'Notifications Page', included: true},
            ],
            id: 'l'
        }
    ]
}

export const LandingComponent = props => {
    const navigate = useNavigate()
    const [selectedWhyChooseUsOptionID, setSelectedWhyChooseUsOptionID] = useState(Config.whyChooseUs[0].id)

    useEffect(() => {
        props.setThemeColor(0)
        props.setTintColor(0)
    }, [])

    const onClickGetStarted = () => {
        navigate('/create')
    }

    const onClickViewPricing = () => {
        const pricingElement = document.getElementById('pricing-container')
        pricingElement.scrollIntoView()
    }

    const onClickWhyChooseUsOption = optionID => {
        setSelectedWhyChooseUsOptionID(optionID)
    }

    const onClickPricingOption = optionID => {
        navigate(`/create/${optionID}`)
    }

    return (
        <PageContainer>
            <LandingHeader showButtons={true} />
            <Container className={`${props.isMobile && 'mobile'} ${props.isSemiMobile && 'semi-mobile'}`}>
                <div className='hero-container'>
                    <div className='hero-message-container'>
                        <div className='d-flex fd-column ai-flex-start'>
                            <h1 className='hero-title'>{Config.heroTitle}</h1>
                            <h3 className='hero-message'>{Config.heroMessage}</h3>
                            <div className='d-flex jc-flex-start ai-center'>
                                <Button
                                    title='Get started'
                                    type='solid'
                                    priority={1}
                                    onClick={onClickGetStarted}
                                    style={{marginRight: 15}}
                                />
                                <Button
                                    title='View pricing'
                                    type='clear'
                                    priority={1}
                                    onClick={onClickViewPricing}
                                />
                            </div>
                        </div>
                    </div>
                    <img className='hero-image' src={Config.heroImageURL} />
                </div>
                <div className='why-choose-us-container'>
                    <h1>Why Choose Us</h1>
                    <div className='why-choose-us-options-container'>
                        <div className='why-choose-us-grid-container'>
                            <div className='why-choose-us-image-container'>
                                <img
                                    className='why-choose-us-image'
                                    src={Config.whyChooseUs[selectedWhyChooseUsOptionID].imageURL}
                                />
                            </div>
                            <div className='d-flex fd-column jc-space-between ai-stretch'>
                                {Config.whyChooseUs.map( ({title, message, icon, id}) => (
                                    <div
                                        onClick={() => onClickWhyChooseUsOption(id)}
                                        className={`why-choose-us-option-container ${id == selectedWhyChooseUsOptionID && 'selected'}`}
                                        key={title}
                                    >
                                        <i className={icon} />
                                        <div className='d-flex fd-column ai-flex-start'>
                                            <h2 className='title'>{title}</h2>
                                            <h3 className='message'>{message}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='pricing-container' id='pricing-container'>
                    <h1 className='title'>Pricing</h1>
                    <div className='pricing-options-container'>
                        {Config.pricing.map(({title, price, icon, iconColor, features, id}) => (
                            <div className='pricing-option-container float-container' key={title}>
                                <div className='header'>
                                    <h3>{title}</h3>
                                    <h3 className='price'>${price}</h3>
                                </div>
                                {features.map( ({title, included}, i) => (
                                    <div className={`feature-list-item ${!i && 'bold'}`} key={title}>
                                        <i className={`bi-check-circle-fill ${!included && 'not-included'}`} />
                                        <h3>{title}</h3>
                                    </div>
                                ))}
                                <Button
                                    title='Get started'
                                    type='clear'
                                    priority={1}
                                    onClick={() => onClickPricingOption(id)}
                                    style={{marginTop: 15}}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className='copyright-container'>
                    © {moment().year()} {process.env.REACT_APP_SITE_NAME}. All rights reserved.
                </div>
            </Container>
        </PageContainer>
    )
}

const mapStateToProps = state => ({
    isMobile: getIsMobile(state),
    isSemiMobile: getIsSemiMobile(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({
    setThemeColor,
    setTintColor
}, dispatch)

export const Landing = connect(mapStateToProps, mapDispatchToProps)(LandingComponent)

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;

    & .hero-container {
        height: calc(100vh - var(--h-mainheader));
        display: grid;
        grid-template-columns: 1fr 2fr;
        padding: 50px;
        box-sizing: border-box;
        border-bottom: 1px solid black;
        background-color: ${p => p.theme.bgcSettings};
    }
    &.semi-mobile .hero-container {
        padding: 30px;
    }
    &.mobile .hero-container {
        padding: 15px;
    }

    & h1, h2 {
        font-weight: 700;
    }

    & .hero-message-container {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        margin-right: 50px;
    }
    & .hero-title {
        margin-bottom: 20px;
    }
    & .hero-message {
        margin-bottom: 30px;
        line-height: 160%;
        color: ${p => p.theme.textMain};
        font-size: 20px !important;
        font-weight: 400 !important;
    }

    & .hero-image {
        width: 100%;
        border: 5px solid ${p => p.theme.bc};
        border-radius: 20px;
        margin: auto 0px;
        box-sizing: border-box;
    }

    & .why-choose-us-container {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: 50px;
        background-color: ${p => p.theme.tint};
        border-bottom: 1px solid black;
    }
    &.semi-mobile .why-choose-us-container {
        padding: 30px;
    }
    &.mobile .why-choose-us-container {
        padding: 15px;
    }

    & .why-choose-us-container h1 {
        margin-bottom: 30px;
    }

    & .why-choose-us-grid-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    & .why-choose-us-image-container {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    & .why-choose-us-image {
        height: 550px;
        border: 5px solid ${p => p.theme.bc};
        border-radius: 20px;
    }

    & .why-choose-us-option-container {
        display: flex;
        align-items: center;
        padding: 20px 20px;
        border-radius: var(--br-container);
        cursor: pointer;
    }
    & .why-choose-us-option-container i {
        font-size: 50px;
        color: black;
        margin-right: 30px;
    }
    & .why-choose-us-option-container .title {
        margin-bottom: 15px;
    }
    & .why-choose-us-option-container * {
        color: white !important;
    }
    & .why-choose-us-option-container.selected *  {
       color: black !important;
    }

    & .pricing-container {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: 50px;
        border-bottom: 1px solid black;
        background-color: ${p => p.theme.bgcSettings};
        background-color: ${p => p.theme.bgc};
    }
    &.semi-mobile .pricing-container {
        padding: 30px;
    }
    &.mobile .pricing-container {
        padding: 15px;
    }
    & .pricing-container .title {
        margin-bottom: 30px;
    }

    & .pricing-options-container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }
    &.semi-mobile .pricing-options-container {
        grid-template-columns: 1fr;
    }
    & .pricing-option-container {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        border-radius: var(--br-container);
        padding: 30px;
        flex: 1;
        box-sizing: border-box;
        margin: 0px 15px;
    }
    &.semi-mobile .pricing-option-container {
        margin: 0px;
        margin-bottom: 30px;
    }

    & .pricing-option-container .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    & .pricing-option-container .price {
        color: ${p => p.theme.tint};
        font-weight: 600;
    }
    & .pricing-option-container .header h3 {
        font-weight: 700;
    }

    & .feature-list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    & .feature-list-item i {
        font-size: 20px;
        color: ${p => p.theme.tint};
    }
    & .feature-list-item i.not-included {
        color: ${p => p.theme.textSecondary};
    }
    & .feature-list-item h3 {
        font-weight: 500;
    }
    & .feature-list-item.bold h3 {
        font-weight: 600;
    }

    & .copyright-container {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 50px 0px;
    }
`