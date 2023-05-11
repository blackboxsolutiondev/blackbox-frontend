import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import {
    getSupportFAQ,
    getLoadingSupportFAQ,
    getSupportFAQNotFound,
    fetchSupportFAQ
} from '../../../redux/support'
import { getIsMobile } from '../../../redux/theme'
import { PageContainer } from '../../components/common/PageContainer'
import { BodyContainer } from '../../components/common/BodyContainer'
import { LandingHeader } from '../../components/headers/LandingHeader'
import { Subheader } from '../../components/headers/Subheader'
import { Loading } from '../../components/common/Loading'
import { ErrorElement } from '../ErrorElement'

export const IndividualFAQComponent = props => {
    const {
        
    } = props
    const {faqID} = useParams()

    useEffect(() => {
        props.fetchSupportFAQ(faqID)
    }, [faqID])

    return (props.faqNotFound ?
        <ErrorElement />
        : <PageContainer>
            <LandingHeader showButtons={false} />
            <Subheader title='FAQ' />
            <BodyContainer>
                {!props.loadingFAQ && props.faq ?
                    <Container className={`float-container ${props.isMobile && 'mobile'}`}>
                        <h3>{props.faq.title}</h3>
                        <p className='answer'>{props.faq.answer}</p>
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
    align-items: flex-start;
    padding: 30px;

    &.mobile {
        padding: 20px;
    }

    & h3 {
        margin-bottom: 30px;
    }

    & .answer {
        white-space: pre-line;
    }

`
const mapStateToProps = state => ({
    faq: getSupportFAQ(state),
    loadingFAQ: getLoadingSupportFAQ(state),
    faqNotFound: getSupportFAQNotFound(state),
    isMobile: getIsMobile(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchSupportFAQ
}, dispatch)

export const IndividualFAQ = connect(mapStateToProps, mapDispatchToProps)(IndividualFAQComponent)