import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { addMessage } from '../../../../redux/communication'
import { getIsMobile } from '../../../../redux/theme'
import {
    getProject,
    getLoadingProject,
    getProjectNotFound,

    fetchProject,
    patchProject,
} from '../../../../redux/project'
import { PageContainer } from '../../../components/common/PageContainer'
import { BodyContainer } from '../../../components/common/BodyContainer'
import { MainHeader } from '../../../components/headers/MainHeader'
import { ProjectHeader } from '../../../components/project/ProjectHeader'
import { Loading } from '../../../components/common/Loading'
import { PillLabel } from '../../../components/common/PillLabel'
import { InputWithMessage } from '../../../components/common/InputWithMessage'
import { Button } from '../../../components/common/Button'
import { IconButton } from '../../../components/common/IconButton'
import { ErrorElement } from '../../ErrorElement'

export const ProjectRevisionsComponent = props => {
    const {
        
    } = props
    const {projectID} = useParams()
    const [editing, setEditing] = useState(false)
    const [revisionNotes, setRevisionNotes] = useState('')
    const [revisionNotesError, setRevisionNotesError] = useState(false)

    useEffect(() => {
        fetchCurrentProject()
    }, [])

    useEffect(() => {
        if (!props.project) {
            setEditing(true)
        } else if (!props.project.revisionNotes) {
            setEditing(true)
        } else {
            setEditing(false)
        }
    }, [props.project])

    // Utils

    const fetchCurrentProject = () => {
        props.fetchProject(projectID)
    }

    // Direct

    const onChangeRevisionNotes = e => {
        setRevisionNotes(e.target.value)
        setRevisionNotesError(false)
    }

    const onClickEdit = () => {
        setEditing(true)
        setRevisionNotes(props.project.revisionNotes)
    }

    const onClickCancelEdits = () => {
        if (!props.project.revisionNotes) return
        setEditing(false)
    }

    const onClickSubmitEdits = () => {
        if (!revisionNotes) {
            props.addMessage('Revision Notes cannot be blank.', true)
            setRevisionNotesError(true)
            return
        }
        props.patchProject(projectID, {
            revisionNotes
        }, fetchCurrentProject, () => {})
    }

    return (props.projectNotFound ?
        <ErrorElement />
        : <PageContainer>
            <MainHeader />
            <ProjectHeader
                activeLinkID='revisions'
                projectID={projectID}
            />
            <BodyContainer>
                {!props.loadingProject && props.project ?
                    <Container className={`float-container ${props.isMobile && 'mobile'}`}>
                        <div className='header-container'>
                            <h3 className='line-clamp-1'>{props.project.projectName}</h3>
                        </div>
                        <div className='item-row' >
                            <label>Revisions: </label>
                            {props.project.revisionsLocked ?
                                <PillLabel title='Locked' color='red' size='s' />
                                : <PillLabel title='Allowed' color='green' size='s' />
                            }
                        </div>
                        {editing ?
                            <div className='content-container'>
                                <p className='message'>Use the form below to describe which content you want revised. You can also use the Overview tab to edit the content of your webapp.</p>
                                <InputWithMessage
                                    label='Revision Notes'
                                    inputType='textarea'
                                    text={revisionNotes}
                                    onChangeText={onChangeRevisionNotes}
                                    placeholder={`Note anything you want changed about the completed webapp, and any changes you made in the project Overview tab.`}
                                    hasError={revisionNotesError}
                                    modified={props.project ? props.project.revisionNotes !== revisionNotes : false}
                                    locked={props.project ? props.project.revisionsLocked : true}
                                />
                                <div className='buttons-container'>
                                    <Button
                                        title='Cancel'
                                        priority={1}
                                        type='tint'
                                        onClick={onClickCancelEdits}
                                        style={{marginRight: 10}}
                                    />
                                    <Button
                                        title='Submit'
                                        priority={1}
                                        type='solid'
                                        onClick={onClickSubmitEdits}
                                        disabled={!revisionNotes}
                                    />
                                </div>
                            </div>
                            : <div className='content-container'>
                                <div className='subheader-container'>
                                    <label>Revision Notes</label>
                                    <IconButton icon='bi-pencil' size='s' onClick={onClickEdit} />
                                </div>
                                <p className='revision-notes'>{props.project.revisionNotes}</p>
                            </div>
                        }
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

    & .content-container {
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }

    & .subheader-container {
        display: flex;
        align-items: center;
    }
    & .subheader-container label {
        margin-right: 10px;
    }

    & .buttons-container {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    & .message {
        margin-bottom: 40px;
    }

    & .revision-notes {
        white-space: pre-line;
    }
`

const mapStateToProps = state => ({
    project: getProject(state),
    loadingProject: getLoadingProject(state),
    projectNotFound: getProjectNotFound(state),
    isMobile: getIsMobile(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchProject,
    patchProject,
    addMessage,
}, dispatch)

export const ProjectRevisions = connect(mapStateToProps, mapDispatchToProps)(ProjectRevisionsComponent)