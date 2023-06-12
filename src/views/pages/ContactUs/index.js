import React, {useState} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import styled from 'styled-components'

import { api } from '../../../networking'
import { addMessage } from '../../../redux/communication'
import { getIsLoggedIn } from '../../../redux/user'
import { getIsMobile, getIsSemiMobile} from '../../../redux/theme'
import { MainHeader } from '../../components/headers/MainHeader'
import { Subheader } from '../../components/headers/Subheader'
import { LandingHeader } from '../../components/headers/LandingHeader'
import { PageContainer } from '../../components/common/PageContainer'
import { BodyContainer } from '../../components/common/BodyContainer'
import { InputWithMessage } from '../../components/common/InputWithMessage'
import { Button } from '../../components/common/Button'
import { PendingMessage } from '../../components/common/PendingMessage'

const ContactInfo = [
    ['Email', 'blackboxsolution.business@gmail.com'],
    ['Address', '3 Germay Drive, Unit 4, Wilmington, Delaware, 19804']
]

export const ContactUsComponent = props => {
    const {
        
    } = props
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [messageError, setMessageError] = useState(false)
    const [loadingSend, setLoadingSend] = useState(false)

    const onChangeEmail = e => {
        setEmail(e.target.value)
        setEmailError(false)
    }

    const onChangeMessage = e => {
        setMessage(e.target.value)
        setMessageError(false)
    }

    const onClickSendMessage = async () => {
        if (!email) {
            setEmailError(true)
            props.addMessage('You are missing one or more required fields.', true)
        } else if (!message) {
            setMessageError(true)
            props.addMessage('You are missing one or more required fields.', true)
        } else {
            setLoadingSend(true)
            try {
                const res = await api.post('/contact-us/send-contact-email', {
                    userEmail: email,
                    message
                })
                props.addMessage(res.data.message, false)
                setMessage('')
            } catch (error) {
                const errorMessage = error.response ? error.response.data.message : error.message
                console.log(errorMessage)
                props.addMessage(errorMessage, true)
            }
            setLoadingSend(false)
        }
    }

    return (
        <PageContainer>
            {props.isLoggedIn ? <MainHeader /> : <LandingHeader showButtons={true} hasSubheaderBelow={true}/>}
            <Subheader title='Contact Us' />
            <Banner>
                <h1 className='title'>We're here to help</h1>
            </Banner>
            <BodyContainer>
                <Container className={`${props.isMobile && 'mobile'} ${props.isSemiMobile && 'semi-mobile'}`}>
                    <div className='info-container float-container'>
                        <h2 className='title'>Our Info</h2>
                        <div className='d-flex fd-column ai-flex-start'>
                            {ContactInfo.map( ([key, value]) => (
                                <div className='d-flex ai-center' style={{marginBottom: 10}}>
                                    <h4 className='sub-title'>{key}:</h4>
                                    <p>{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='message-container float-container'>
                        <h2 className='title'>Send a message</h2>
                        <InputWithMessage
                            label='Your Email'
                            inputType='text'
                            text={email}
                            onChangeText={onChangeEmail}
                            hasError={emailError}
                        />
                        <InputWithMessage
                            label='Message'
                            inputType='textarea'
                            text={message}
                            onChangeText={onChangeMessage}
                            hasError={messageError}
                        />
                        <div className='d-flex jc-space-between ai-center'>
                            <Button
                                title='Send message'
                                priority={2}
                                type='solid'
                                onClick={onClickSendMessage}
                            />
                            {loadingSend ? 
                                <PendingMessage />
                                : null
                            }
                        </div>
                    </div>
                </Container>
            </BodyContainer>
        </PageContainer>
    )
}

const Banner = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    background-color: ${p => p.theme.tintTranslucent};
    border-top: 1px solid ${p => p.theme.tint};
    border-bottom: 1px solid ${p => p.theme.tint};
    padding: 30px 0px;

    & .title {
        font-weight: 700;
    }
`

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;

    &.semi-mobile {
        grid-template-columns: 1fr;
    }

    & .info-container, .message-container {
        padding: 20px;
    }
    &.mobile .info-container, &.mobile .message-container {
        padding: 15px;
    }
    & .info-container {
        margin-right: 30px;
    }
    & .info-container .title, & .message-container .title{
        font-weight: 700;
        margin-bottom: 20px;
    }
    &.semi-mobile .info-container {
        margin-right: 0px;
        margin-bottom: 30px;
    }

    & .sub-title {
        font-weight: 600;
        margin-right: 10px;
    }
`
const mapStateToProps = state => ({
    isMobile: getIsMobile(state),
    isSemiMobile: getIsSemiMobile(state),
    isLoggedIn: getIsLoggedIn(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({
    addMessage
}, dispatch)

export const ContactUs = connect(mapStateToProps, mapDispatchToProps)(ContactUsComponent)