import React, {useEffect, useState, useRef} from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { getIsMobile } from '../../../../redux/theme'

export const DropdownMenuComponent = props => {
    const {
        menuHidden,
        triggerElement,
        menuElement,
        triggerHeight,
        positionRelative=false,

        setMenuHidden,

        ...rest
    } = props
    const menuRef = useRef()
    const triggerRef = useRef()

    useEffect(() => {
        const handleClick = e => {
            if (menuRef.current && menuRef.current.contains(e.target)) return
            if (triggerRef.current && triggerRef.current.contains(e.target)) return
            else setMenuHidden(true)
        }
        
        document.body.addEventListener('click', handleClick)
        return () => {
            document.body.removeEventListener('click', handleClick)
        }
    })

    const onClickTriggerContainer = () => {
        setMenuHidden(curr => !curr)
    }

    return (
        <Root {...rest} style={positionRelative ? {position: 'relative', ...props.style} : props.style}>
            <div
                className='trigger-container d-flex jc-space-around ai-center'
                onClick={onClickTriggerContainer}
                ref={triggerRef}
                style={{height: triggerHeight}}

            >
                {triggerElement}
            </div>
            {menuHidden ? null :
                <div
                    style={{marginTop: triggerHeight + 15}}
                    className={`
                        menu-container animation-pop-in no-select
                        d-flex fd-column jc-flex-start ai-stretch
                        ${positionRelative ? 'relative' : 'absolute'}
                    `}
                    ref={menuRef}
                >
                    {menuElement}
                </div>
            }
        </Root>
    )
}

const Root = styled.div`
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
    & .trigger-container {
        cursor: pointer;
    }

    & .menu-container {
        position: absolute;
        border: 1px solid ${p => p.theme.bc};
        border-radius: var(--br-container);
        background-color: ${p => p.theme.bgcLight};
        width: 320px;
        min-width: 320px;
        box-shadow: ${p => p.theme.boxShadowDark};
        overflow: visible;
        z-index: 10;
    }

    @media only screen and (max-width: 601px) {
        & .menu-container.absolute {
            min-width: calc(100% - var(--ps-body)*2);
            box-sizing: border-box;
            right: 0px;
            left: 0px;
            margin: 0px var(--ps-body);
        }
        & .menu-container.relative {
            width: auto;
            min-width: 0px;
        }
    }
`

const mapStateToProps = state => ({
    isMobile: getIsMobile(state)
})

export const DropdownMenu = connect(mapStateToProps)(DropdownMenuComponent)