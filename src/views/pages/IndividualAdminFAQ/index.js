import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import styled from 'styled-components'
import { useParams, useNavigate } from 'react-router-dom'

import {
    getFAQ,
    getLoadingFAQ,
    getFAQNotFound,
    fetchFAQ,
    patchFAQs,
    deleteFAQs
} from '../../../redux/admin'
import { addModal } from '../../../redux/modal'
import { ModalTypes } from '../../../containers/ModalProvider'
import { getIsMobile } from '../../../redux/theme'
import { FAQSections } from '../admin/FAQ'
import { PageContainer } from '../../components/common/PageContainer'
import { BodyContainer } from '../../components/common/BodyContainer'
import { MainHeader } from '../../components/headers/MainHeader'
import { Subheader } from '../../components/headers/Subheader'
import { OptionsMenu } from '../../components/menus/OptionsMenu'
import { Loading } from '../../components/common/Loading'
import { Button } from '../../components/common/Button'
import { PillLabel } from '../../components/common/PillLabel'
import { ErrorElement } from '../ErrorElement'

export const IndividualAdminFAQComponent = props => {
    const {
        
    } = props
    const {faqID} = useParams()
    const navigate = useNavigate()
    const [editing, setEditing] = useState(false)
    const [editingOptionsMenuHidden, setEditingOptionsMenuHidden] = useState(true)
    const [optionsMenuHidden, setOptionsMenuHidden] = useState(true)
    const [title, setTitle] = useState('')
    const [sectionID, setSectionID] = useState('')
    const [answer, setAnswer] = useState('')

    const titleModified = props.faq ? title !== props.faq.title : false
    const sectionModified = props.faq ? sectionID !== props.faq.section : false
    const answerModified = props.faq ? answer !== props.faq.answer : false

    useEffect(() => {
        props.fetchFAQ(faqID)
    }, [faqID])

    useEffect(() => {
        if (editing && props.faq) {
            setTitle(props.faq.title)
            setSectionID(props.faq.section)
            setAnswer(props.faq.answer)
        }
    }, [editing])

    // Direct

    const onClickEdit = () => {
        setEditing(true)
        setOptionsMenuHidden(true)
        setEditingOptionsMenuHidden(true)
    }

    const onClickDelete = () => {
        props.addModal(ModalTypes.CONFIRM, {
            title: 'Delete FAQ',
            message: 'Are you sure you want to delete this FAQ?',
            confirmButtonTitle: 'Delete',
            isDanger: true,
            onConfirm: (onSuccess, onFailure) => props.deleteFAQs(
                [faqID],
                () => {
                    navigate('/admin/faq')
                    onSuccess()
                },
                onFailure
            )
        })
    }

    const onChangeTitle = e => {
        setTitle(e.target.value)
    }

    const onChangeSectionID = e => {
        setSectionID(e.target.value)
    }

    const onChangeAnswer = e => {
        setAnswer(e.target.value)
    }

    const onClickCancelEditing = () => {
        setEditing(false)
    }

    const onClickSubmitEdits = () => {
        if (titleModified || sectionModified || answerModified) {
            props.patchFAQs([faqID], {
                ...(titleModified ? {title} : {}),
                ...(sectionModified ? {section: sectionID} : {}),
                ...(answerModified ? {answer} : {})
            }, () => props.fetchFAQ(faqID))
        }
        setEditing(false)
    }

    // Function Dependent Variables

    const menuOptions = !props.loadingFAQ && props.faq ? [
        {title: 'Edit', icon: 'bi-pencil', onClick: onClickEdit},
        {title: 'Delete', icon: 'bi-trash', onClick: onClickDelete, isDanger: true}
    ] : []

    return ( props.faqNotFound ?
        <ErrorElement />
        : <PageContainer>
            <MainHeader />
            <Subheader title='FAQ' />
            <BodyContainer>
                <Container className={`${props.isMobile && 'mobile'}`}>
                    {!props.loadingFAQ && props.faq ?
                        <div className='faq-container float-container'>
                            <div className='content-container' style={editing ? {} : {display: 'none'}}>
                                <div className='header-container'>
                                    <div className='header-edit-container'>
                                        <div className='edit-label-container'>
                                            <label>Title</label>
                                            {titleModified ?
                                                <PillLabel
                                                    title='Modified'
                                                    color='yellow'
                                                    size='s'
                                                    className='pill-label'
                                                />
                                                : null
                                            }
                                        </div>
                                        <input value={title} onChange={onChangeTitle} />
                                    </div>
                                    <OptionsMenu
                                        menuHidden={editingOptionsMenuHidden}
                                        setMenuHidden={setEditingOptionsMenuHidden}
                                        options={menuOptions}
                                        positionRelative={true}
                                    />
                                </div>
                                <div className='edit-label-container'>
                                    <label>Section</label>
                                    {sectionModified ?
                                        <PillLabel
                                            title='Modified'
                                            color='yellow'
                                            size='s'
                                            className='pill-label'
                                        />
                                        : null
                                    }
                                </div>
                                <select value={sectionID} onChange={onChangeSectionID} >
                                    {FAQSections.map( ({title, id}) => (
                                        <option value={id} key={id}>{title}</option>
                                    ))}
                                </select>
                                <div className='edit-label-container'>
                                    <label>Answer</label>
                                    {answerModified ?
                                        <PillLabel
                                            title='Modified'
                                            color='yellow'
                                            size='s'
                                            className='pill-label'
                                        />
                                        : null
                                    }
                                </div>
                                <textarea value={answer} onChange={onChangeAnswer}/>
                                <div className='edit-buttons-container'>
                                    <Button
                                        title='Cancel'
                                        type='tint'
                                        priority={2}
                                        onClick={onClickCancelEditing}
                                        style={{marginRight: 15}}
                                    />
                                    <Button
                                        title='Submit'
                                        type='solid'
                                        priority={2}
                                        onClick={onClickSubmitEdits}
                                    />
                                </div>
                            </div>
                            <div className='content-container display-container' style={editing ? {display: 'none'} : {}}>
                                <div className='header-container'>
                                    <h3 className='line-clamp-1'>{props.faq.title}</h3>
                                    <OptionsMenu
                                        menuHidden={optionsMenuHidden}
                                        setMenuHidden={setOptionsMenuHidden}
                                        options={menuOptions}
                                    />
                                </div>
                                <label>Section</label>
                                <p>{props.faq.section}</p>
                                <label>Answer</label>
                                <p className='answer'>{props.faq.answer}</p>
                            </div>
                        </div>
                        : <Loading />
                    }
                </Container>
            </BodyContainer>
        </PageContainer>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;

    & .faq-container {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: 30px;
        width: 100%;
        box-sizing: border-box;
    }
    &.mobile .faq-container {
        padding: 20px;
    }

    & .content-container {
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }

    & .header-container {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 40px;
    }

    & .display-container label {
        margin-bottom: 10px;
    }
    & .display-container p {
        margin-bottom: 30px;
    }
    & p:last-child {
        margin-bottom: 0px;
    }

    & .header-edit-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1;
    }

    & .edit-label-container {
        display: flex;
        align-items: center;
        margin-bottom: 5px
    }
    & .edit-label-container label {
        margin-bottom: 0px;
    }
    & .edit-label-container .pill-label {
        margin-left: 15px;
    }

    & input {
        width: 50%;
    }
    &.mobile input {
        width: 100%;
    }

    & select {
        width: 50%;
        box-sizing: border-box;
        margin-bottom: 30px;
    }
    &.mobile select {
        width: 100%;
    }

    & textarea {
        height: 150px;
        width: 100% !important;
        box-sizing: border-box;
        margin-bottom: 30px;
        white-space: pre-line;
    }

    & .edit-buttons-container {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    & .answer {
        white-space: pre-line;
    }
`
const mapStateToProps = state => ({
    faq: getFAQ(state),
    loadingFAQ: getLoadingFAQ(state),
    faqNotFound: getFAQNotFound(state),
    isMobile: getIsMobile(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchFAQ,
    patchFAQs,
    deleteFAQs,
    addModal
}, dispatch)

export const IndividualAdminFAQ = connect(mapStateToProps, mapDispatchToProps)(IndividualAdminFAQComponent)