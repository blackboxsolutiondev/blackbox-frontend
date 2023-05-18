import React, {useState} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import styled from 'styled-components'

import { removeModal } from '../../../../redux/modal'
import { getIsMobile } from '../../../../redux/theme'
import { Button } from '../../common/Button'
import { PendingMessage } from '../../common/PendingMessage'

export const ConfirmComponent = props => {
    const {
        title='Confirm',
        message,
        confirmButtonTitle='Yes',
        confirmButtonDisabled=false,
        isDanger=false,
        children=[],
        pendingMessage='Operation in progress',

        onConfirm, // (onSuccess, onFailure) => void
        onCancel = () => {},

        modalID, // automatically provided

        ...rest
    } = props
    const [loading, setLoading] = useState(false)

    // Utils

    const removeModal = () => props.removeModal(modalID)

    // Direct

    const onClickConfirm = () => {
        setLoading(true)
        onConfirm(
            () => {
                setLoading(false)
                removeModal()
            },
            () => setLoading(false)
        )
    }

    const onClickCancel = () => {
        removeModal()
        onCancel()
    }

    return (
        <Root className={`modal-container-small animation-slide-up ${props.isMobile && 'mobile'}`}>
            <div className='header section'>
                <i className='bi-check-circle' />
                <h3 className='header-title'>{title}</h3>
            </div>
            <div className='body section'>
                <h4 className='body-message'>{message}</h4>
                {children ?
                    <div className='children-container'>
                        {children}
                    </div>
                    : null
                }
                <div className='d-flex jc-space-between ai-flex-end'>
                    {loading ?
                        <PendingMessage message={pendingMessage} style={{marginRight: 10}} />
                        : <div />
                    }
                    <div className='d-flex jc-flex-end ai-center'>
                        <Button
                            type='tint'
                            priority={2}
                            title='Cancel'
                            onClick={onClickCancel}
                            style={{marginRight: 15}}
                        />
                        <Button
                            type={isDanger ? 'danger' : 'solid'}
                            priority={2}
                            title={confirmButtonTitle}
                            onClick={onClickConfirm}
                            disabled={confirmButtonDisabled}
                        />
                    </div>
                </div>
            </div>
        </Root>
    )
}

const Root = styled.div`
    & .header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 15px 20px !important;
    }
    & .header i {
        margin-right: 10px;
        color: ${p => p.theme.tint};
        font-size: 20px;
    }
    & .header-title {
        color: ${p => p.theme.tint};
    }

    & .body {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
    }

    & .section {
        padding: 20px 20px;
        text-align: left;
        border-radius: 0px;
    }

    & .body-message {
        margin-bottom: 15px;
        white-space: pre-line;
    }

    & .children-container {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        margin-bottom: 15px;
        height: 100%;
    }
`
const mapStateToProps = state => ({
    isMobile: getIsMobile(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
    removeModal
}, dispatch)

export const Confirm = connect(mapStateToProps, mapDispatchToProps)(ConfirmComponent)