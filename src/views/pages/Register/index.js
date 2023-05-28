import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { useNavigate } from 'react-router-dom'
import {
    signInWithPopup,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
} from 'firebase/auth'

import { postMongoUser, fetchThisMongoUser } from '../../../redux/user'
import * as Constants from '../Login/constants'
import {auth, getFirebaseErrorMessage} from '../../../networking'
import { setThemeColor, setTintColor } from '../../../redux/theme'
import { addMessage } from '../../../redux/communication'
import { BodyContainer } from '../../components/common/BodyContainer'
import { PageContainer } from '../../components/common/PageContainer'
import { LandingHeader } from '../../components/headers/LandingHeader'
import { LoginCard } from '../../components/landing/LoginCard'
import { ActionLink } from '../../components/common/ActionLink'
import { Button } from '../../components/common/Button'

export const RegisterComponent = props => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        props.setThemeColor(0)
        props.setTintColor(0)
    }, [])

    const onClickSubmit = async e => {
        e.preventDefault()
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            if (userCredential) {
                const {user} = userCredential
                props.postMongoUser(
                    user,
                    () => props.fetchThisMongoUser(user, undefined, undefined, true)
                )
            }
        } catch (error) {
            const errorMessage = getFirebaseErrorMessage(error)
            props.addMessage(errorMessage, true)
        }
    }

    const onClickContinueWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, new GoogleAuthProvider())
            if (result) {
                const {user} = result
                console.log(JSON.stringify(
                    {user}
                , null, 4))
                props.postMongoUser(
                    user,
                    () => props.fetchThisMongoUser(user, undefined, undefined, true)
                )
            }
        } catch (error) {
            const errorMessage = getFirebaseErrorMessage(error)
            props.addMessage(errorMessage, true)
        }
    }

    const onClickHaveAnAccount = () => {
        navigate('/login')
    }

    const onChangeEmail = e => setEmail(e.target.value)

    const onChangeName = e => setName(e.target.value)
    
    const onChangePassword = e => setPassword(e.target.value)

    return (
        <PageContainer>
            <LandingHeader showButtons={false} />
            <BodyContainer className='ai-center bgc-tt'>
                <LoginCard className='d-flex fd-column ai-stretch'>
                    <h3>Create your account</h3>
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
                        <br />
                        <label>
                            Full name
                        </label>
                        <input
                            value={name}
                            onChange={onChangeName}
                            type="text"
                            required
                        />
                        <br />
                        <label>
                            Password
                        </label>
                        <input
                            value={password}
                            onChange={onChangePassword}
                            type="password"
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
                    <br />
                    <h4 className='as-center'>or</h4>
                    <br />
                    <Button
                        type='clear'
                        priority={2}
                        onClick={onClickContinueWithGoogle}
                        imageURL={Constants.GOOGLE_ICON_URL}
                        imageSize={18}
                        title='Continue with Google'
                    />
                </LoginCard>
                <div className='d-flex ai-center' style={{marginTop: 10}}>
                    <p style={{marginRight: 10}}>
                        Already have an account?
                    </p>
                    <ActionLink
                        title='Sign In'
                        onClick={onClickHaveAnAccount}
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
    setThemeColor,
    postMongoUser,
    fetchThisMongoUser
}, dispatch)

export const Register = connect(null, mapDispatchToProps)(RegisterComponent)