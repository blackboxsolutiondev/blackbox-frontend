import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { useParams, useNavigate } from 'react-router-dom'

import {
    getProject,
    getLoadingProject,
    getProjectNotFound,

    fetchProject,
    patchProjectWithProjectForm
} from '../../../../redux/project'
import { PageContainer } from '../../../components/common/PageContainer'
import { BodyContainer } from '../../../components/common/BodyContainer'
import { MainHeader } from '../../../components/headers/MainHeader'
import { ProjectHeader } from '../../../components/project/ProjectHeader'
import { CreateProjectForm } from '../../../components/project/CreateProjectForm'
import { Loading } from '../../../components/common/Loading'
import { ErrorElement } from '../../ErrorElement'

export const ProjectOverviewComponent = props => {
    const {
        
    } = props
    const {projectID} = useParams()
    const navigate = useNavigate()
    const [projectFormData, setProjectFormData] = useState(null)

    useEffect(() => {
        fetchCurrentProject()
    }, [])

    // Utils

    const fetchCurrentProject = (onSuccess = () => {}, onFailure = () => {}) => {
        props.fetchProject(projectID, onSuccess, onFailure)
    }

    // Direct

    const onChangeFormData = formData => {
        setProjectFormData(formData)
    }

    const onClickCreateProject = () => {
        navigate('/create')
    }

    const onSubmitProjectEdits = (onSuccess, onFailure) => {
        props.patchProjectWithProjectForm(
            projectID,
            projectFormData,
            () => fetchCurrentProject(onSuccess, onFailure),
            onFailure
        )
    }
    
    const onCancelProjectEdits = (onSuccess, onFailure) => {
        fetchCurrentProject(onSuccess, onFailure)
    }

    return (props.projectNotFound ?
        <ErrorElement />
        : <PageContainer>
            <MainHeader />
            <ProjectHeader
                activeLinkID=''
                projectID={projectID}
            />
            <BodyContainer>
                {props.loadingProject ?
                    <Loading />
                    : <CreateProjectForm
                        isEditMode={true}
                        initFormData={props.project}
                        onChangeFormData={onChangeFormData}
                        onClickCreateProject={onClickCreateProject}
                        onSubmitEdits={onSubmitProjectEdits}
                        onCancelEdits={onCancelProjectEdits}
                    />
                }
            </BodyContainer>
        </PageContainer>
    )
}

const mapStateToProps = state => ({
    project: getProject(state),
    loadingProject: getLoadingProject(state),
    projectNotFound: getProjectNotFound(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchProject,
    patchProjectWithProjectForm
}, dispatch)

export const ProjectOverview = connect(mapStateToProps, mapDispatchToProps)(ProjectOverviewComponent)