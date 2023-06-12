import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {useNavigate, Link} from 'react-router-dom'
import { connect } from 'react-redux'

import { getIsSemiMobile } from '../../../../redux/theme'
import { Button } from '../../common/Button'
import { LinksMenu } from '../../landing/menus/LinksMenu'

const PageLinks = [
    {
        name: 'Home',
        url: '/',
        icon: 'bi-house',
        id: '',
    },
    {
        name: 'Support',
        url: '/support',
        icon: 'bi-question-circle',
        id: 'support'
    },
    {
        name: 'Terms',
        url: '/terms',
        icon: 'bi-list-task',
        id: 'terms'
    },
    {
        name: 'Contact Us',
        url: '/contact-us',
        icon: 'bi-mailbox',
        id: 'contact-us',
    }
]

export const LandingHeaderComponent = props => {
    const {
        showButtons=true,
        hasSubheaderBelow=false,
        ...rest
    } = props
    const navigate = useNavigate()
    const [linksMenuHidden, setLinksMenuHidden] = useState(true)

    const activeLinkID = window.location.pathname.split('/')[1]

    useEffect(() => {
        setLinksMenuHidden(true)
    }, [props.isSemiMobile])

    // Direct

    const onClickLogo = () => navigate('/')

    const onClickLogIn = () => navigate('/login')

    const onClickSignUp = () => navigate('/register')

    return (
        <Root {...rest} className={`${!hasSubheaderBelow && 'no-subheader'}`}>
            <div
                className='d-flex jc-flex-start ai-center'
                onClick={onClickLogo}
                style={{cursor: 'pointer'}}
            >
                <img className='logo-icon'
                    src='/images/logo.png'
                    height={35}
                    width={35}
                />
                <h3 className='logo-text'>
                    {process.env.REACT_APP_SITE_NAME}
                </h3>
            </div>
            {props.isSemiMobile ?
                <LinksMenu
                    menuHidden={linksMenuHidden}
                    setMenuHidden={setLinksMenuHidden}
                    pageLinks={PageLinks}
                    style={{marginRight: 15}}
                />
                : <div className='links-container'>
                    {PageLinks.map( ({name, url, id}) => (
                        <PageLink
                            key={id}
                            to={url}
                            className={id === activeLinkID ? 'active' : ''}
                        >
                            {name}
                        </PageLink>
                    ))}
                    {showButtons ?
                        <div className='d-flex jc-flex-end ai-center'>
                            <Button
                                type='clear'
                                priority={1}
                                onClick={onClickLogIn}
                                title='Log In'
                                style={{marginRight: 15}}
                            />
                            <Button
                                type='solid'
                                priority={1}
                                onClick={onClickSignUp}
                                title='Sign Up'
                            />
                        </div>
                        : null
                    }
                </div>
            }
            
        </Root>
    )
}

const mapStateToProps = state => ({
    isSemiMobile: getIsSemiMobile(state),
})

export const LandingHeader = connect(mapStateToProps)(LandingHeaderComponent)

const Root = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${props => props.theme.bgcNav};
    min-height: var(--h-mainheader);
    padding: 0px var(--ps-mainheader);
    box-shadow: ${p => p.theme.boxShadow};
    box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.2);
    width: 100%;
    box-sizing: border-box;
    
    &.no-subheader {
        position: sticky;
        top: 0px;
    }

    & .logo-icon {
        // border-radius: 50%;
        margin-right: 15px;
    }

    & .logo-text {
        font-weight: 600;
        cursor: pointer;
    }

    & .links-container {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
`

const PageLink = styled(Link)`
    color: ${p => p.theme.textPrimary};
    font-weight: 400;
    font-size: 15px;
    text-decoration: none;
    margin-right: 20px;

    &:hover,
    &.active {
        color: ${p => p.theme.tint};
    }
`