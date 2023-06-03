import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import styled from 'styled-components'

import { getIsLoggedIn } from '../../../redux/user'
import { PageContainer } from '../../components/common/PageContainer'
import { BodyContainer } from '../../components/common/BodyContainer'
import { MainHeader } from '../../components/headers/MainHeader'
import { LandingHeader } from '../../components/headers/LandingHeader'
import { Subheader } from '../../components/headers/Subheader'

export const TermsSections = [
    {
        title: 'Acceptance',
        body: 'You should read these terms and conditions carefully. Any purchase or use of our services implies that you have read and accept these terms and conditions in full. In these terms and conditions Blackbox Solution Corporation will be referred to as Blackbox Solution.',
    },
    {
        title: 'Project Requests',
        body: 'Blackbox Solution retains the right to deny your project request for any reason. If we deny your project request, an email confirming the denial will be sent to you.',
    },
    {
        title: 'Payment',
        body: 'You will receive an invoice at the email provided upon our acceptance of your submitted project. Failure to pay the invoice within 7 days of receiving it will result in a deletion and termination of the project. Our work on the project will begin the moment the invoice is paid and will be completed by the date provided in the project creation confirmation email.\n\n If you have an access code, you will not receive an invoice and our work on the project will begin the moment the project is submitted and will be completed by the date provided in the project creation confirmation email.',
    },
    {
        title: 'Client Review',
        body: 'You will be provided with one opportunity to review the website we provide to you and make a revision request. Failure to submit the revision request within 10 days of receiving the completed website will result in a forfeiture of the right to make a revision request. Blackbox Solution reserves the right to deny parts or all of the revision request if it constitutues too large a body of work. What is defined as too large a body of work is up to the discretion of Blackbox Solution.',
    },
    {
        title: 'Indemnity',
        body: 'All Blackbox Solution products and services may be used for lawful purposes only. You agree to indemnify and hold Blackbox Solution harmless from any claims resulting from the use of our service or product that results in damages to you or any other party.',
    },
    {
        title: 'Liability',
        body: 'You agree that Blackbox Solution is not liable for any of the following. \n\n- Damages to any party resulting from use or misuse of the site.\n- Loss or corruption of data during the lifetime of the website.\n- Claims of damage from any party resulting from use or misuse of the site.'
    },
    {
        title: 'Copyright',
        body: 'You retain copyright to all content (data, logos, images, etc.) you provide to us. You also grant Blackbox Solution the right and permission to publish and use the content you provide to us. You are also responsible for ensuring that you have the rights to publish and use the content you provide to us. You agree to indemnify and hold Blackbox Solution harmless from any copyright infringement claims that result from the publishing and or use of your provided content.',
    },
    {
        title: 'Design Credit',
        body: "A link to Blackbox Solution's website will appear at the bottom of your website's landing page. You also agree that Blackbox Solution can use your website in its design portfolio."
    },
    {
        title: 'Refunds',
        body: 'Except in the event Blackbox Solution has to terminate your project prematurely or you purchased our services from a third-party site with a refund policy, Blackbox Solution has a no refund policy. Once a project is submitted and the invoice is paid you agree that all payments are final.',
    },
    {
        title: 'Termination',
        body: 'If for any reason Blackbox Solution must terminate your project at any point, you will receive a full refund.',
    },
    {
        title: 'General',
        body: 'Your signature below constitutes acceptance and agreement to these terms and conditions in full.'
    }
]

export const TermsComponent = props => {
    const {
        
    } = props

    return (
        <PageContainer className='bgc-bgc-settings'>
            {props.isLoggedIn ?
                <MainHeader />
                : <LandingHeader showButtons={false} hasSubheaderBelow={true} />
            }
            <Subheader title='Terms and Conditions' />
            <BodyContainer>
                <Container>
                    {TermsSections.map( ({title, body}, i) => (
                        <div className='terms-section' key={title}>
                            <h3 className='terms-section-title'>{`${i + 1}. ${title}`}</h3>
                            <p className='terms-section-body'>{body}</p>
                        </div>
                    ))}
                </Container>
            </BodyContainer>
        </PageContainer>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding-bottom: 200px;

    & .terms-section {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        margin-bottom: 30px;
    }

    & .terms-section-title {
        margin-bottom: 5px;
    }

    & .terms-section-body {
        white-space: pre-line;
    }
`
const mapStateToProps = state => ({
    isLoggedIn: getIsLoggedIn(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({
    
}, dispatch)

export const Terms = connect(mapStateToProps, mapDispatchToProps)(TermsComponent)