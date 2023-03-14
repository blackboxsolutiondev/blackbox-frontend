import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import styled from 'styled-components'
import moment from 'moment'
import { sendPasswordResetEmail } from 'firebase/auth'

import { auth, getFirebaseErrorMessage } from '../../../../networking'
import { PageContainer } from '../../../components/common/PageContainer'
import { BodyContainer } from '../../../components/common/BodyContainer'
import { MainHeader } from '../../../components/headers/MainHeader'
import { SettingsHeader } from '../../../components/settings/SettingsHeader'
import {
    getUser,
    patchUserDisplayName,
    patchUserEmail,
    patchUserPhoto,
    patchUserThemeColor,
    patchUserTintColor
} from '../../../../redux/ducks/user'
import { addModal, ModalTypes } from '../../../../redux/ducks/modal'
import {
    getTintColor,
    getThemeColor,
    Tints,
    Themes,
} from '../../../../redux/ducks/theme'
import { addMessage } from '../../../../redux/ducks/communication'
import { SettingsRow } from '../../../components/settings/SettingsRow'
import { Button } from '../../../components/common/Button'
import { UserIcon } from '../../../components/common/UserIcon'

export const GeneralSettingsComponent = props => {
    const {
        
    } = props

    const formInitialValues = {
        membership: {
            memberSince: moment(props.user.createdAt).format('LL'),
        },
        account: {
            email: props.user.email
        },
        profile: {
            displayName: props.user.displayName,
            photoURL: props.user.photoURL
        },
        appearance: {
            themeColor: {
                value: props.themeColor,
                name: Themes[props.themeColor].name,
                icon: Themes[props.themeColor].icon,
                selectValues: Object.values(Themes)
            },
            tintColor: {
                value: props.tintColor,
                name: Tints[props.tintColor].name,
                color: Tints[props.tintColor].tint,
                selectValues: Object.values(Tints)
            }
        }
    }

    const onClickResetPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, props.user.email)
            props.addMessage('Check your email for a link to reset your password.')
        } catch (error) {
            const errorMessage = getFirebaseErrorMessage(error)
            props.addMessage(errorMessage, true)
        }
    }

    const onClickDeleteAccount = async () => {
        props.addModal(ModalTypes.CONFIRM, {
            message: 'Are you sure you want to delete your account?',
            onConfirm: () => console.log('account deleted'),
            isDanger: true
        })
    }

    const submitDisplayName = (val, onSuccess) => {
        if (val === props.user.displayName) return
        props.patchUserDisplayName(val, onSuccess)
    }

    const submitEmail = (val, onSuccess) => {
        if (val === props.user.email) return
        props.patchUserEmail(val, onSuccess)
    }

    const submitThemeColor = (val, onSuccess) => {
        if (val == props.themeColor) return
        props.patchUserThemeColor(val, onSuccess)
    }

    const submitTintColor = (val, onSuccess) => {
        if (val == props.tintColor) return
        props.patchUserTintColor(val, onSuccess)
    }

    const submitProfilePhoto = (file, onSuccess) => {
        props.patchUserPhoto(file, onSuccess)
    }


    return (
        <PageContainer className='bgc-bgc-nav'>
            <MainHeader />
            <SettingsHeader activeLinkID='general' />
            <BodyContainer style={{maxWidth: 1000}} className='as-center'>
                <Container>
                    <h3 className='settings-title'>
                        Membership
                    </h3>
                    <SettingsRow
                        title='Member Since'
                        isEditable={false}
                        isLastRow={true}
                        rightChild={
                            <p>{formInitialValues.membership.memberSince}</p>
                        }
                    />

                    <h3 className='settings-title'>
                        Account
                    </h3>
                    <SettingsRow
                        title='Email'
                        inputType='text'
                        initialValue={formInitialValues.account.email}
                        isEditable={true}
                        rightChild={
                            <p>{formInitialValues.account.email}</p>
                        }
                        onSubmit={submitEmail}
                    />
                    <SettingsRow
                        title='Password'
                        isEditable={false}
                        rightChild={
                            <Button
                                title='Reset Password'
                                priority={2}
                                type='tint'
                                onClick={onClickResetPassword}
                            />
                        }
                    />
                    <SettingsRow
                        title=''
                        isEditable={false}
                        isLastRow={true}
                        rightChild={
                            <Button
                                title='Delete your account'
                                priority={2}
                                type='error'
                                onClick={onClickDeleteAccount}
                            />
                        }
                    />

                    <h3 className='settings-title'>
                        Profile
                    </h3>
                    <SettingsRow
                        title='Display Name'
                        isEditable={true}
                        inputType='text'
                        initialValue={formInitialValues.profile.displayName}
                        rightChild={
                            <p>{formInitialValues.profile.displayName}</p>
                        }
                        onSubmit={submitDisplayName}
                    />
                    <SettingsRow
                        title='Profile Photo'
                        isEditable={true}
                        inputType='image'
                        rightChild={
                            <UserIcon size='m' />
                        }
                        onSubmit={submitProfilePhoto}
                        isLastRow={true}
                    />

                    <h3 className='settings-title'>
                        Appearance
                    </h3>
                    <SettingsRow
                        title='Theme'
                        isEditable={true}
                        inputType='select'
                        autoSave={true}
                        initialValue={formInitialValues.appearance.themeColor.value}
                        selectValues={formInitialValues.appearance.themeColor.selectValues}
                        rightChild={
                            <div className='d-flex jc-flex-end ai-center'>
                                <p>{formInitialValues.appearance.themeColor.name}</p>
                            </div>
                        }
                        onSubmit={submitThemeColor}
                    />
                    <SettingsRow
                        title='Tint Color'
                        isEditable={true}
                        inputType='select'
                        autoSave={true}
                        initialValue={formInitialValues.appearance.tintColor.value}
                        selectValues={formInitialValues.appearance.tintColor.selectValues}
                        rightChild={
                            <div className='d-flex jc-flex-end ai-center'>
                                <p style={{color: formInitialValues.appearance.tintColor.color}}>
                                    {formInitialValues.appearance.tintColor.name}
                                </p>
                            </div>
                        }
                        onSubmit={submitTintColor}
                        isLastRow={true}
                    />
                </Container>

            </BodyContainer>
        </PageContainer>
    )
}

const Container = styled.div`
    .settings-title {
        margin-bottom: 15px;
    }
`

const mapStateToProps = state => ({
    user: getUser(state),
    tintColor: getTintColor(state),
    themeColor: getThemeColor(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({
    patchUserDisplayName,
    patchUserEmail,
    patchUserThemeColor,
    patchUserTintColor,
    patchUserPhoto,
    addMessage,
    addModal,
}, dispatch)

export const GeneralSettings = connect(mapStateToProps, mapDispatchToProps)(GeneralSettingsComponent)