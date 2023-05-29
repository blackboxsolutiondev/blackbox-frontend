import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import { Button } from '../../common/Button'
import { PendingMessage } from '../../common/PendingMessage'

export const SettingsRow = props => {
    const {
        title,
        isEditable,
        inputType=null, // 'text' | 'image' | 'select'
        initialValue=null,
        selectValues=[], // [{value, name}]
        autoSave=false,
        middleChild=null,
        rightChild=null,
        // isLastRow=false,

        onSubmit,   // (val, onSuccess) => void

        ...rest
    } = props
    const [isEditing, setIsEditing] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [inputText, setInputText] = useState(initialValue)
    const [selectValue, setSelectValue] = useState(initialValue)
    const [loadingUpdate, setLoadingUpdate] = useState(false)

    useEffect(() => {
        setInputText(initialValue)
        setSelectValue(initialValue)
    }, [initialValue])

    // Utils

    const closeEditForm = () => setIsEditing(false)
    
    const openEditForm = () => setIsEditing(true)
    
    const resetEditForm = () => {
        setInputText(initialValue)
        setSelectValue(initialValue)
    }

    const submitForm = val => onSubmit(
        val,
        () => {
            setTimeout(() => {
                closeEditForm()
                setLoadingUpdate(false)
            }, 1*1000)
        },
        () => setLoadingUpdate(false)
    )

    // Direct

    const onClickRowContainer = () => isEditable && openEditForm()

    const onClickClose = () => {
        closeEditForm()
        resetEditForm()
    }

    const onClickCancel = onClickClose

    const onClickSubmit = e => {
        e.preventDefault()
        switch (inputType) {
            case 'text':
                submitForm(inputText)
                break
            case 'image':
                submitForm(imageFile)
                break
            case 'select':
                submitForm(selectValue)
                break
        }
        setLoadingUpdate(true)
    }

    const onChangeInputText = e => {
        setInputText(e.target.value)
        autoSave && submitForm(e.target.value)
    }

    const onChangeImageFile = e => {
        if (!e.target.files.length) return
        setImageFile(e.target.files[0])
        autoSave && submitForm(e.target.files[0])
    }

    const onChangeSelectValue = e => {
        setSelectValue(e.target.value)
        autoSave && submitForm(e.target.value)
    }

    return !isEditing ?
        <RowContainer
            {...rest}
            className={isEditable ? 'oh-dark' : ''}
            onClick={onClickRowContainer}
        >
            <p className='row-title'>{title}</p>
            <div className='middle-child-container'>
                {middleChild}
            </div>
            <div className='right-child-container'>
                {rightChild}
            </div>
        </RowContainer>
        : <EditForm {...rest} onSubmit={onClickSubmit}>
            <div
                className='header clickable'
                onClick={onClickClose}
            >
                <p>{title}</p>
                <i className='bi-pencil' />
            </div>
            <div className='input-row'>
                <p>{title}</p>
                {inputType === 'text' ?
                    <input
                        type='text'
                        value={inputText}
                        onChange={onChangeInputText}
                        style={{width: 'min(300px, 75%)'}}
                        required
                    /> : null
                }
                {inputType === 'image' ?
                    <input
                        type='file'
                        onChange={onChangeImageFile}
                        required
                    /> : null
                }
                {inputType === 'select' ?
                    <select value={selectValue} onChange={onChangeSelectValue}>
                        {selectValues.map( ({value, name}) => (
                            <option value={value} key={value}>{name}</option>
                        ))}
                    </select> : null
                }
            </div>
            <div className='d-flex jc-flex-end ai-center'>
                {autoSave ?
                    <Button
                        title='Close'
                        type='solid'
                        priority={2}
                        onClick={onClickClose}
                    />
                    : <div className='d-flex ai-center jc-space-between'>
                        {loadingUpdate ?
                            <PendingMessage />
                            : null
                        }
                        <div className='d-flex ai-center jc-flex-end'>
                            <Button
                                title='Cancel'
                                type='tint'
                                priority={2}
                                onClick={onClickCancel}
                                style={{marginRight: 20}}
                            />
                            <Button
                                title='Save'
                                type='solid'
                                priority={2}
                                onClick={onClickSubmit}
                                isSubmitButton={true}
                            />
                        </div>
                    </div>
                }
            </div>
        </EditForm>
}

const RowContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 40px;
    border-top: 1px solid ${p => p.theme.bc};
    padding: 0px 15px;
    position: relative;

    &:last-child {
        margin-bottom: 50px;
    }

    & .row-title {
        color: ${p => p.theme.textSecondary};
        position: absolute;
    }

    & .middle-child-container {
        position: aboslute;
        margin: 0 auto;
        display: inline-flex;
        justify-content: space-around;
        align-items: center;
    }

    & .right-child-container {
        position: absolute;
        right: 15px;
        display: inline-flex;
        justify-content: space-around;
        align-items: center;
    }

`

const EditForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    border: ${p => p.theme.floatBorder};
    border-radius: var(--br-container);
    padding: 0px 14px;
    margin-bottom: 15px;
    padding-bottom: 15px;
    box-shadow: ${p => p.theme.boxShadowDark};
    background-color: ${p => p.theme.bgcLight};

    & .header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-bottom: 1px solid ${p => p.theme.bc};
        height: 50px;
        margin-bottom: 15px;
    }
    & .header i {
        margin-left: 15px;
        color: ${p => p.theme.textMain};
        font-size: 17px;
    }

    & .input-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 30px;
    }
    .
`