import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {useNavigate, Link} from 'react-router-dom'
import { connect } from 'react-redux'

import { getIsMobile, getIsSemiMobile } from '../../../../redux/theme'
import { getHasAdminPrivileges } from '../../../../redux/user'
import { MainMenu } from '../MainMenu'
import { LinksMenu } from '../LinksMenu'
import { NotificationsMenu } from '../NotificationsMenu'

export const getMainPageLinks = hasAdminPrivileges => [
    {
        name: 'Dashboard',
        url: '/dashboard',
        id: 'dashboard',
        icon: 'bi-house'
    },
    ...( hasAdminPrivileges ?
        [
            {
                name: 'Admin',
                url: '/admin',
                id: 'admin',
                icon: 'bi-person-circle'
            }
        ]
        : []
    )
]

export const getMainMenuPageLinks = () => [
    {   // blackbox
        name: 'Create a Webapp',
        url: '/create',
        id: 'create',
        icon: 'bi-plus-circle'
    },
    {
        name: 'Settings',
        url: '/settings',
        id: 'settings',
        icon: 'bi-gear'
    },
    {
        name: 'Terms',
        url: '/terms',
        id: 'terms',
        icon: 'bi-list-task',
    },
    {
        name: 'Support',
        url: '/support',
        id: 'support',
        icon: 'bi-question-circle',
        openInNewTab: true
    },
]

export const MainHeaderComponent = props => {
    const {
        hasSubheaderBelow=true,
    } = props
    const navigate = useNavigate()
    const [linksMenuHidden, setLinksMenuHidden] = useState(true)
    const [notificationsMenuHidden, setNotificationsMenuHidden] = useState(true)
    const [mainMenuHidden, setMainMenuHidden] = useState(true)
    const [mainPageLinks, setMainPageLinks] = useState([])
    const [mainMenuPageLinks, setMainMenuPageLinks] = useState([])

    const activeLinkID = window.location.pathname.split('/')[1]

    const onClickLogo = () => navigate('/')

    useEffect(() => {
        setMainPageLinks(getMainPageLinks(props.hasAdminPrivileges))
        setMainMenuPageLinks(getMainMenuPageLinks())
    }, [props.hasAdminPrivileges])

    return (
        <Root className={`d-flex jc-space-between ai-center ${!hasSubheaderBelow && 'no-subheader'}`}>
            <div
                className='d-flex jc-flex-start ai-center clickable'
                onClick={onClickLogo}
            >
                <img className='logo-icon'
                    src='/images/logo.png'
                    height={35}
                    width={35}
                />
                {props.isMobile ? null :
                    <h3 className='logo-text'>
                        {process.env.REACT_APP_SITE_NAME}
                    </h3>
                }
            </div>
            <div className='d-flex jc-flex-end ai-center'>
                {props.isSemiMobile ?
                    <LinksMenu
                        style={{marginRight: 15}}
                        menuHidden={linksMenuHidden}
                        setMenuHidden={setLinksMenuHidden}
                        pageLinks={mainPageLinks}
                    />
                    : mainPageLinks.map( ({name, url, id}) => (
                        <PageLink
                            key={id}
                            to={url}
                            className={id === activeLinkID ? 'active': ''}
                        >
                            {name}
                        </PageLink>
                    ))
                }
                <NotificationsMenu
                    style={{marginRight: 15}}
                    menuHidden={notificationsMenuHidden}
                    setMenuHidden={setNotificationsMenuHidden}
                />
                <MainMenu
                    menuHidden={mainMenuHidden}
                    setMenuHidden={setMainMenuHidden}
                    pageLinks={mainMenuPageLinks}
                />
            </div>
        </Root>
    )
}

const mapStateToProps = state => ({
    isMobile: getIsMobile(state),
    isSemiMobile: getIsSemiMobile(state),
    hasAdminPrivileges: getHasAdminPrivileges(state)
})

const Root = styled.div`
    background-color: ${props => props.theme.bgcNav};
    min-height: var(--h-mainheader);
    padding: 0px var(--ps-mainheader);
    width: 100%;
    box-sizing: border-box;
    
    &.no-subheader {
        border-bottom: ${p => p.theme.navBorder};
        position: sticky;
        top: 0px;
    }

    & .logo-icon {
        // border-radius: 50%;
        margin-right: 15px;
    }

    & .logo-text {
        font-weight: 600;
        color: ${p => p.theme.textPrimary};
    }
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

export const MainHeader = connect(mapStateToProps)(MainHeaderComponent)