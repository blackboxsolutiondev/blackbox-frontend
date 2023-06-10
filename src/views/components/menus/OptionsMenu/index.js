import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import styled from 'styled-components'

import { DropdownMenu } from '../../headers/DropdownMenu'

export const OptionsMenuComponent = props => {
    const {
        menuHidden,
        options, // [{title, icon, onClick, ?isDanger}]
        positionRelative=false,

        setMenuHidden,

        ...rest
    } = props

    return (
        <DropdownMenu
            menuHidden={menuHidden}
            setMenuHidden={setMenuHidden}
            triggerElement={
                <MenuIcon
                    {...rest}
                    className={`bi-three-dots ${!menuHidden && 'active'} ${props.className}`}
                />
            }
            triggerHeight={15}
            menuElement={
                <MenuContainer>
                    {options.map( ({title, icon, onClick, isDanger}) => (
                        <div
                            className={`menu-option-container ${isDanger && 'danger'}`}
                            onClick={onClick}
                            key={title}
                        >
                            <i className={icon} />
                            <p className='option-title'>{title}</p>
                        </div>
                    ))}
                </MenuContainer>
            }
            positionRelative={positionRelative}
            {...rest}
        />
    )
}

const MenuIcon = styled.i`
    font-size: 30px;
    color: ${p => p.theme.textSecondary};
    cursor: pointer;

    &.active,
    &:hover {
        color: ${p => p.theme.tint};
    }
`

const MenuContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;

    & .menu-option-container {
        display: flex;
        align-items: center;
        padding: 10px 15px;
        cursor: pointer;
    }
    & .menu-option-container:hover {
        background-color: ${p => p.theme.bgcHover};
    }

    & .menu-option-container i {
        font-size: 17px;
        margin-right: 15px;
        color: ${p => p.theme.textMain};
    }
    & .menu-option-container p {
        margin-bottom: 0px !important;
    }

    & .menu-option-container.danger p,
    & .menu-option-container.danger i {
        color: ${p => p.theme.brightRed};
    }

    & .option-title {
        white-space: nowrap;
    }
`

const mapStateToProps = state => ({
    
})

const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch)

export const OptionsMenu = connect(mapStateToProps, mapDispatchToProps)(OptionsMenuComponent)