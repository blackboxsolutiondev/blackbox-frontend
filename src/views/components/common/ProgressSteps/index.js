import React from 'react'
import styled from 'styled-components'

export const ProgressSteps = props => {
    const {
        steps, // [{title, isComplete, id}]
        selectedStepID,

        onClickStep, // stepID => void

        ...rest
    } = props

    return (
        <Root {...rest} className={`float-container ${props.className}`}>
            {steps.map(({title, isComplete, id}, i) => (
                <div
                    className={`step-container ${id === selectedStepID && 'selected'} ${!isComplete && 'incomplete'}`}
                    onClick={() => onClickStep(id)}
                    key={title}
                >
                    <div className='progress-bar-container'>
                        <i className='bi-check-circle-fill' />
                        {i == steps.length - 1 ?
                            null
                            : <div className='progress-bar' />
                        }
                    </div>
                    <h4 className='title'>{title}</h4>
                </div>
            ))}
        </Root>
    )
}

const Root = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;

    & .step-container {
        display: flex;
        align-items: flex-start;
    }
    & .step-container .title {
        font-weight: 600;
        cursor: pointer;
        margin-top: 2px;
    }
    & .step-container .title:hover {
        color: ${p => p.theme.tint} !important;
    }
    & .step-container.selected .title {
        color: ${p => p.theme.tint} !important;
    }
    & .step-container.incomplete .title {
        color: ${p => p.theme.textSecondary};
    }

    & .progress-bar-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 10px;
    }

    & .progress-bar-container i {
        color: ${p => p.theme.tint};
        font-size: 18px;
    }
    & .step-container.incomplete i {
        color: ${p => p.theme.textSecondary};
    }

    & .progress-bar {
        width: 3px;
        background-color: ${p => p.theme.tint};
        border-radius: 3px;
        height: 20px;
        margin-bottom: 5px;
    }
    & .step-container.incomplete .progress-bar {
        background-color: ${p => p.theme.textSecondary};
    }

`