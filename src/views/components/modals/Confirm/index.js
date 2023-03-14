import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import styled from 'styled-components'

import { removeModal } from '../../../../redux/ducks/modal'
import { Button } from '../../common/Button'

export const ConfirmComponent = props => {
    const {
        modalID,
        title='Confirm',
        message,
        confirmButtonTitle='Yes',
        isDanger=false,

        onConfirm,
        onCancel = () => {},

        ...rest
    } = props

    const onClickConfirm = onConfirm

    const onClickCancel = () => {
        props.removeModal(modalID)
        props.onCancel()
    }

    return (
        <Root>
            <div className='header section'>
                <i className='bi-check-circle' />
                <h4 className='header-title'>{title}</h4>
            </div>
            <div className='body section'>
                <h4 className='body-message'>{message}</h4>
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
                    />
                </div>
            </div>
        </Root>
    )
}

const Root = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    width: min(500px, 75vw);
    background-color: ${p => p.theme.bgcLight};
    border: 1px solid ${p => p.theme.bc};
    border-left: none;
    border-radius: var(--br-container);
    overflow: hidden;

    & .header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: ${p => p.theme.tintTranslucent};
    }
    & .header i {
        margin-right: 10px;
        color: ${p => p.theme.tint};
        font-size: 20px;
    }
    & .header-title {
        color: ${p => p.theme.tint};
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    & .body {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
    }

    & .section {
        padding: 20px 30px;
        border-left: 3px solid ${p => p.theme.tint};
        text-align: left;
        border-radius: 0px;
    }

    & .body-message {
        margin-bottom: 15px;
    }
`
const mapStateToProps = state => ({
    
})

const mapDispatchToProps = dispatch => bindActionCreators({
    removeModal
}, dispatch)

export const Confirm = connect(mapStateToProps, mapDispatchToProps)(ConfirmComponent)