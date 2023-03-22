import React from 'react'
import styled from 'styled-components'

export const Pill = props => {
    const {
        title,
        id,
        active,

        onClick,

        ...rest
    } = props

    return (
        <Root
            {...rest}
            onClick={onClick}
            className={`${active && 'active'} ${props.className} no-select`}
        >
            <p>{title}</p>
        </Root>
    )
}

const Root = styled.div`
    padding: 5px 15px;
    background-color: ${p => p.theme.bgcLight};
    border-radius: 16px;
    border: 1px solid ${p => p.theme.bc};
    cursor: pointer;

    &.active {
        background-color: ${p => p.theme.tint};
    }

    & p {
        color: ${p => p.theme.textSecondary};
        font-weight: 500;
        white-space: nowrap;
    }

    &.active p {
        color:  #fdf1f0;
        color: ${p => p.theme.bgcLight};
    }

    // 

    &.active {
        background-color: ${p => p.theme.tintTranslucent};
        border-color: ${p => p.theme.tint};
    }

    &.active p {
        color: ${p => p.theme.tint};
    }
`