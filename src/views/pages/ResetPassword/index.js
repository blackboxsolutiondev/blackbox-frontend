import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { bindActionCreators } from '@reduxjs/toolkit'
import { connect } from 'react-redux'

import {auth, getFirebaseErrorMessage} from '../../../networking'
import { addMessage } from '../../../redux/communication'
import { setThemeColor, setTintColor } from '../../../redux/theme'
import { BodyContainer } from '../../components/common/BodyContainer'
import { PageContainer } from '../../components/common/PageContainer'
import { LandingHeader } from '../../components/headers/LandingHeader'
import { LoginCard } from '../../components/landing/LoginCard'
import { ActionLink } from '../../components/common/ActionLink'
import { Button } from '../../components/common/Button'


export const ResetPasswordComponent = props => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')

    useEffect(() => {
        props.setThemeColor(0)
        props.setTintColor(0)
    }, [])

    const onClickSubmit = async e => {
        e.preventDefault()
        try {
            await sendPasswordResetEmail(auth, email)
            props.addMessage('Check your email for a link to reset your password.')
        } catch (error) {
            const errorMessage = getFirebaseErrorMessage(error)
            props.addMessage(errorMessage, true)
        }
    }

    const onClickDontHaveAnAccount = () => {
        navigate('/register')
    }

    const onChangeEmail = e => setEmail(e.target.value)

    return (
        <PageContainer>
            <LandingHeader showButtons={false} />
            <BodyContainer className='ai-center bgc-tt'>
                <LoginCard className='d-flex fd-column ai-stretch'>
                    <h3>Reset your password</h3>
                    <br /><br />
                    <p className='c-ts'>
                        Enter the email address associated with your account and we'll send you a link to reset your password.
                    </p>
                    <br /><br />
                    <form onSubmit={onClickSubmit} className='d-flex jc-flex-start ai-stretch fd-column'>
                        <label>
                            Email
                        </label>
                        <input
                            value={email}
                            onChange={onChangeEmail}
                            type="email"
                            required
                        />
                        <br /><br />
                        <Button
                            type='solid'
                            priority={2}
                            onClick={onClickSubmit}
                            title='Submit'
                            isSubmitButton={true}
                        />
                    </form>
                </LoginCard>
                <div className='d-flex ai-center' style={{marginTop: 10}}>
                    <p style={{marginRight: 10}}>
                        Don't have an account?
                    </p>
                    <ActionLink
                        title='Sign Up'
                        onClick={onClickDontHaveAnAccount}
                        style={{marginTop: 5}}
                    />
                </div>
            </BodyContainer>
        </PageContainer>
    )
}

const mapDispatchToProps = dispatch => bindActionCreators({
    addMessage,
    setTintColor,
    setThemeColor
}, dispatch)

export const ResetPassword = connect(null, mapDispatchToProps)(ResetPasswordComponent)