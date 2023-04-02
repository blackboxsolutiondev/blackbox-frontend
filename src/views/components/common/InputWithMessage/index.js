import React from 'react'
import styled from 'styled-components'

import { Switch } from '../Switch'
import { ChecklistOptions } from '../ChecklistOptions'
import { PillLabel } from '../PillLabel'

export const InputWithMessage = props => {
    const {
        label,
        message='',
        tintMessage='',
        fieldName,
        inputType, // 'text' | 'textarea' | 'select' | 'switch' | 'checklist' 
        text='',
        placeholder='',
        selectValue=null,
        selectValues=[], // [{title, id}]
        switchEnabled=false,
        checklistOptions=[], // [{title, selected, ?leftChild, ?rightChild, id}]
        hasError,
        rightChild=null,

        onChangeText, // e => void
        onChangeSelectValue, // e => void
        onClickSwitch, // () => void
        onClickCheckbox, // optionID => void

        ...rest
    } = props

    return (
        <Root {...rest}>
            <div className='input-container'>
                <div className='label-header'>
                    <label>{label}</label>
                    {hasError ?
                        <PillLabel title='Required Field' size='s' color='red' />
                        : null
                    }
                </div>
                {inputType === 'text' ?
                    <input name={fieldName} value={text} onChange={onChangeText} placeholder={placeholder}/>
                : inputType === 'textarea' ?
                    <textarea name={fieldName} value={text} onChange={onChangeText} placeholder={placeholder}/>
                : inputType === 'select' ?
                    <select name={fieldName} value={selectValue} onChange={onChangeSelectValue}>
                        {selectValues.map( ({title, id}) => (
                            <option value={id} key={id}>{title}</option>
                        ))}
                    </select>
                : inputType === 'switch' ?
                    <Switch enabled={switchEnabled} onClick={onClickSwitch} className='switch'/>
                : inputType === 'checklist' ?
                    <ChecklistOptions options={checklistOptions} onClickCheckbox={onClickCheckbox} className='checklist'/>
                : null
                }
            </div>
            {message ? 
                <p className='message'>{message}</p>
                : null
            }
            {tintMessage ?
                <h4 className='tint-message'>{tintMessage}</h4>
                : null
            }
            {rightChild}
        </Root>
    )
}

const Root = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    
    & .input-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1;
    }
    & .message {
        color: ${p => p.theme.textSecondary};
        flex: 1;
        padding-left: 50px;
        text-align: right;
    }
    & .tint-message {
        color: ${p => p.theme.tint};
        font-weight: 600;
        flex: 1;
        text-align: right;
        padding-left: 50px;
    }
    & .input-container input,
    & .input-container select,
    & .input-container textarea {
        width: 100%;
    }
    & .input-container textarea {
        height: 100px;
        width: 100% !important;
    }
    & .input-container .checklist {
        margin-left: 15px;
    }
    & .input-container .switch {
        margin-top: 5px;
        margin-left: 5px;
    }

    & input, & select, & textarea {
        width: 50%;
        box-sizing: border-box;
    }

    & .label-header {
        display: flex;
        align-items: flex-start;
    }
    & .label-header label {
        margin-right: 10px;
    }
`