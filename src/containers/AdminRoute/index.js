import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

import { getIsLoggedIn, getHasAdminPrivileges } from '../../redux/user'

export const AdminRouteComponent = props => {
    const {
        element
    } = props
    const navigate = useNavigate()

    useEffect(() => {
        if (!props.isLoggedIn) {
            navigate('/')
        } else if (!props.hasAdminPrivileges) {
            navigate('/dashboard')
        }
    }, [props.isLoggedIn, props.hasAdminPrivileges])

    return props.isLoggedIn && props.hasAdminPrivileges ?
        element
        : null
}

const mapStateToProps = state => ({
    isLoggedIn: getIsLoggedIn(state),
    hasAdminPrivileges: getHasAdminPrivileges(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
    
}, dispatch)

export const AdminRoute = connect(mapStateToProps, mapDispatchToProps)(AdminRouteComponent)
