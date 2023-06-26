import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import styled from 'styled-components'
import { useParams, useNavigate } from 'react-router-dom'

import {
    getBugReport,
    getLoadingBugReport,
    getBugReportNotFound,
    fetchBugReport,
    deleteBugReports,
    patchBugReports,
    setLoadingBugReport
} from '../../../redux/admin'
import { addModal } from '../../../redux/modal'
import { ModalTypes } from '../../../containers/ModalProvider'
import { addMessage } from '../../../redux/communication'
import { getIsMobile } from '../../../redux/theme'
import { MainHeader } from '../../components/headers/MainHeader'
import { Subheader } from '../../components/headers/Subheader'
import { PageContainer } from '../../components/common/PageContainer'
import { BodyContainer } from '../../components/common/BodyContainer'
import { Loading } from '../../components/common/Loading'
import { OptionsMenu } from '../../components/menus/OptionsMenu'
import { Button } from '../../components/common/Button'
import { PillLabel } from '../../components/common/PillLabel'
import { ErrorElement } from '../ErrorElement'

export const BugReportComponent = props => {
    const {
        
    } = props
    const {bugReportID} = useParams()
    const navigate = useNavigate()
    const [optionsMenuHidden, setOptionsMenuHidden] = useState(true)
    const [editingOptionsMenuHidden, setEditingOptionsMenuHidden] = useState(true)
    const [editing, setEditing] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [notes, setNotes] = useState('')
    const notesRef = useRef()

    const titleModified = props.bugReport ? title !== props.bugReport.title : false
    const descriptionModified = props.bugReport ? description !== props.bugReport.description : false
    const notesModified = props.bugReport ? notes !== props.bugReport.notes : false

    useEffect(() => {
       fetchCurrentBugReport()
    }, [bugReportID])

    useEffect(() => {
        if (editing && props.bugReport) {
            setTitle(props.bugReport.title)
            setDescription(props.bugReport.description)
            setNotes(props.bugReport.notes)
        }
    }, [editing])

    // Utils

    const fetchCurrentBugReport = () => {
        props.fetchBugReport(bugReportID)
    }

    const fetchCurrentBugReportAndCloseMenu = () => {
        fetchCurrentBugReport()
        setOptionsMenuHidden(true)
        setEditing(false)
    }

    // Direct

    const onClickEdit = () => {
        setEditing(true)
        setOptionsMenuHidden(true)
        setEditingOptionsMenuHidden(true)
    }

    const onClickEditResolved = () => {
        props.patchBugReports([bugReportID], {
            resolved: !props.bugReport.resolved
        }, fetchCurrentBugReportAndCloseMenu, undefined, false)
    }

    const onClickEditHighPriority = () => {
        props.patchBugReports([bugReportID], {
            highPriority: !props.bugReport.highPriority
        }, fetchCurrentBugReportAndCloseMenu, undefined, false)
    }

    const onClickEditArchived = () => {
        props.patchBugReports([bugReportID], {
            archived: !props.bugReport.archived
        }, fetchCurrentBugReportAndCloseMenu, undefined, false)
    }

    const onClickDelete = () => {
        props.addModal(ModalTypes.CONFIRM, {
            title: 'Delete Bug Report',
            message: 'Are you sure you want to delete this bug report?',
            confirmButtonTitle: 'Delete',
            isDanger: true,
            onConfirm: (onSuccess, onFailure) => props.deleteBugReports(
                [bugReportID],
                () => {
                    navigate('/admin/bugreports')
                    onSuccess()
                },
                onFailure
            )
        })
    }

    const onClickAddNotes = async () => {
        await setEditing(true)
        notesRef.current.focus()
    }

    const onChangeTitle = e => {
        setTitle(e.target.value)
    }

    const onChangeDescription = e => {
        setDescription(e.target.value)
    }

    const onChangeNotes = e => {
        setNotes(e.target.value)
    }

    const onClickCancelEditing = () => {
        setEditing(false)
    }

    const onClickSubmitEdits = () => {
        if (titleModified || descriptionModified || notesModified) {
            if (!title) {
                props.addMessage('Title cannot be blank.', true)
                return
            } else if (!description) {
                props.addMessage('Description cannot be blank', true)
                return
            }
            props.patchBugReports(
                [bugReportID],
                {
                    ...(titleModified ? {title} : {}),
                    ...(descriptionModified ? {description} : {}),
                    ...(notesModified ? {notes} : {})
                },
                () => {
                    setEditing(false)
                    fetchCurrentBugReport()
                },
                () => {},
                false
            )
        }
        setEditing(false)
    }

    // Fucntion Dependent Variables

    const menuOptions = !props.loadingBugReport && props.bugReport ? [
        {title: 'Edit', icon: 'bi-pencil', onClick: onClickEdit},
        {
            title: props.bugReport.resolved ? 'Unresolve' : 'Resolve',
            icon: props.bugReport.resolved ? 'bi-door-open' : 'bi-door-closed',
            onClick: onClickEditResolved
        },
        {
            title: props.bugReport.highPriority ? 'Make Regular Priority' : 'Make High Priority',
            icon: 'bi-patch-exclamation',
            onClick: onClickEditHighPriority
        },
        {
            title: props.bugReport.archived ? 'De-archive' : 'Archive',
            icon: 'bi-archive',
            onClick: onClickEditArchived
        },
        {title: 'Delete', icon: 'bi-trash', onClick: onClickDelete, isDanger: true}
    ] : []

    return ( props.bugReportNotFound ?
        <ErrorElement />
        : <PageContainer>
            <MainHeader />
            <Subheader title='Bug Report' />
            <BodyContainer>
                <Container className={`${props.isMobile && 'mobile'}`}>
                    {!props.loadingBugReport && props.bugReport ?
                        <div className='bug-report-container float-container'>
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
                                    <label>Description</label>
                                    {descriptionModified ?
                                        <PillLabel
                                            title='Modified'
                                            color='yellow'
                                            size='s'
                                            className='pill-label'
                                        />
                                        : null
                                    }
                                </div>
                                <textarea value={description} onChange={onChangeDescription} />
                                <div className='edit-label-container'>
                                    <label>Notes</label>
                                    {notesModified ?
                                        <PillLabel
                                            title='Modified'
                                            color='yellow'
                                            size='s'
                                            className='pill-label'
                                        />
                                        : null
                                    }
                                </div>
                                <textarea value={notes} onChange={onChangeNotes} ref={notesRef}/>
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
                                    <div className='title-container'>
                                        <h3 className='line-clamp-1'>{props.bugReport.title}</h3>
                                        {props.bugReport.resolved ?
                                            <PillLabel title='Resolved' color='green' size='m' className='pill-label'/>
                                            : <PillLabel title='Unresolved' color='red' size='m' className='pill-label'/>
                                        }
                                        {props.bugReport.highPriority ?
                                            <PillLabel title='High Priority' color='orange' size='m' className='pill-label'/>
                                            : null
                                        }
                                        {props.bugReport.archived ?
                                            <PillLabel title='Archived' color='blue' size='m' className='pill-label'/>
                                            : null
                                        }
                                    </div>
                                    <OptionsMenu
                                        menuHidden={optionsMenuHidden}
                                        setMenuHidden={setOptionsMenuHidden}
                                        options={menuOptions}
                                    />
                                </div>
                                <label>Description</label>
                                <p>{props.bugReport.description}</p>
                                <label>Notes</label>
                                {props.bugReport.notes ?
                                    <p>{props.bugReport.notes}</p>
                                    : <Button
                                        title='Add Notes'
                                        type='clear'
                                        priority={3}
                                        onClick={onClickAddNotes}
                                        icon='bi-plus'
                                        className='as-flex-start'
                                    />
                                }
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

    & .bug-report-container {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: 30px;
        width: 100%;
        box-sizing: border-box;
    }
    &.mobile .bug-report-container {
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

    & .title-container {
        display: flex;
        align-items: center;
    }
    & .title-container .pill-label {
        margin-left: 15px;
    }
    &.mobile .title-container {
        flex-direction: column;
        align-items: flex-start;
    }
    &.mobile .title-container .pill-label {
        margin-left: 0px;
        margin-bottom: 10px;
    }
    &.mobile .title-container h3 {
        margin-bottom: 15px;
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
`
const mapStateToProps = state => ({
    bugReport: getBugReport(state),
    loadingBugReport: getLoadingBugReport(state),
    bugReportNotFound: getBugReportNotFound(state),
    isMobile: getIsMobile(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchBugReport,
    patchBugReports,
    deleteBugReports,
    setLoadingBugReport,
    addModal,
    addMessage
}, dispatch)

export const BugReport = connect(mapStateToProps, mapDispatchToProps)(BugReportComponent)