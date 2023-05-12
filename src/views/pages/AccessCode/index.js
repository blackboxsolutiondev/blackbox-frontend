import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import moment from 'moment'

import { getIsMobile } from '../../../redux/theme'
import {
    getAccessCode,
    getLoadingAccessCode,
    getAccessCodeNotFound,

    fetchAccessCode,
} from '../../../redux/project'
import { PageContainer } from '../../components/common/PageContainer'
import { BodyContainer } from '../../components/common/BodyContainer'
import { MainHeader } from '../../components/headers/MainHeader'
import { Subheader } from '../../components/headers/Subheader'
import { Loading } from '../../components/common/Loading'
import { PillLabel } from '../../components/common/PillLabel'
import { ErrorElement } from '../ErrorElement'

export const AccessCodeComponent = props => {
    const {
        
    } = props
    const {accessCodeID} = useParams()

    useEffect(() => {
        props.fetchAccessCode(accessCodeID)
    }, [])

    return (props.accessCodeNotFound ?
        <ErrorElement />
        : <PageContainer>
            <MainHeader />
            <Subheader title='Access Code' />
            <BodyContainer>
                {!props.loadingAccessCode && props.accessCode ?
                    <Container className={`float-container ${props.isMobile && 'mobile'}`}>
                        <div className='header-container'>
                            <h3 className='line-clamp-1'>{props.accessCode.title}</h3>
                        </div>
                        <div className='item-row' >
                            <label>Status: </label>
                            {props.accessCode.claimed ?
                                <PillLabel title='Claimed' color='green' size='s' />
                                : <PillLabel title='Unclaimed' color='red' size='s' />
                            }
                        </div>
                        <div className='item-row' style={{marginBottom: 40}} >
                            <label>Created: </label>
                            <p>{moment(props.accessCode.createdAt).format('LLL')}</p>
                        </div>
                        <div className='item-row' style={{marginBottom: 0}}>
                            <label>Code: </label>
                            <p>{props.accessCode.code}</p>
                        </div>
                    </Container>
                    : <Loading />
                }
            </BodyContainer>
        </PageContainer>
        
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 30px;

    &.mobile {
        padding: 20px;
    }

    & .header-container {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 40px;
    }

    & .item-row {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }
    & .item-row label {
        margin-right: 10px;
    }
`
const mapStateToProps = state => ({
    accessCode: getAccessCode(state),
    loadingAccessCode: getLoadingAccessCode(state),
    accessCodeNotFound: getAccessCodeNotFound(state),
    isMobile: getIsMobile(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchAccessCode
}, dispatch)

export const AccessCode = connect(mapStateToProps, mapDispatchToProps)(AccessCodeComponent)