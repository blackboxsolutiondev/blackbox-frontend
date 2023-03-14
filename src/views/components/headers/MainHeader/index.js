import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {useNavigate, Link} from 'react-router-dom'
import { connect } from 'react-redux'

import { MainMenu } from '../MainMenu'
import { LinksMenu } from '../LinksMenu'
import { getIsMobile } from '../../../../redux/ducks/theme'

export const PageLinks = [
    {
        name: 'Dashboard',
        url: '/dashboard',
        id: 'dashboard',
        icon: 'bi-house'
    },
    {
        name: 'Settings',
        url: '/settings',
        id: 'settings',
        icon: 'bi-gear'
    }
]

export const MainHeaderComponent = props => {
    const navigate = useNavigate()
    const activeLinkID = window.location.pathname.split('/')[1]

    const onClickLogo = () => navigate('/')

    return (
        <Root className='d-flex jc-space-between ai-center'>
            <div
                className='d-flex jc-flex-start ai-center clickable'
                onClick={onClickLogo}
            >
                <LogoIcon
                    src='/images/logo.png'
                    height={35}
                    width={35}
                />
                <LogoText>
                    {process.env.REACT_APP_SITE_NAME}
                </LogoText>
            </div>
            <div className='d-flex jc-flex-end ai-center'>
                {props.isMobile ?
                    <LinksMenu style={{marginRight: 15}}/>
                    : PageLinks.map( ({name, url, id}) => (
                        <PageLink
                            key={id}
                            to={url}
                            className={id === activeLinkID ? 'active': ''}
                        >
                            {name}
                        </PageLink>
                    ))
                }
                <MainMenu />
            </div>
        </Root>
    )
}

const Root = styled.div`
    background-color: ${props => props.theme.bgcNav};
    min-height: var(--h-mainheader);
    padding: 0px var(--ps-mainheader);
    width: 100%;
    box-sizing: border-box;
`

const LogoIcon = styled.img`
    border-radius: 50%;
    margin-right: 10px;
`

const LogoText = styled.h3`
    text-transform: capitalize;
    font-weight: 400;
    letter-spacing: 1px;
    color: ${p => p.theme.textPrimary};
    cursor: pointer;
`

const PageLink = styled(Link)`
    color: ${p => p.theme.textPrimary};
    font-weight: 400;
    font-size: 15px;
    text-decoration: none;
    margin-right: 25px;

    &:hover,
    &.active {
        color: ${p => p.theme.tint} !important;
    }
`

const mapStateToProps = state => ({
    isMobile: getIsMobile(state)
})

export const MainHeader = connect(mapStateToProps)(MainHeaderComponent)