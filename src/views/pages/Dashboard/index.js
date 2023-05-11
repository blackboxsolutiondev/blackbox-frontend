import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

import { getPaginatedDataForCurrentPage, PageSizes } from '../../../networking'
import { ModalTypes } from '../../../containers/ModalProvider'
import { addModal } from '../../../redux/modal'
import {
    getAdminProjects,
    getLoadingAdminProjects,
    getAdminProjectsPagesCount,

    getAccessCodes,
    getLoadingAccessCodes,
    getAccessCodesPagesCount,

    getThisUserProjects,
    getLoadingThisUserProjects,
    getThisUserProjectsPagesCount,

    fetchThisUserProjects,
    fetchAdminUserProjects,
    fetchAccessCodes,

    ProjectStatuses
} from '../../../redux/project'
import { SortFilters } from '../admin/BugReports'
import { getIsSemiMobile } from '../../../redux/theme'
import { getHasAdminPrivileges } from '../../../redux/user'
import { PageContainer } from '../../components/common/PageContainer'
import { BodyContainer } from '../../components/common/BodyContainer'
import { MainHeader } from '../../components/headers/MainHeader'
import { SearchableTable } from '../../components/common/SearchableTable'
import { Button } from '../../components/common/Button'
import { Tooltip } from '../../components/common/Tooltip'
import { IconButton } from '../../components/common/IconButton'

const AdminProjectsSortFilters = SortFilters
const ThisUserProjectsSortFilters = SortFilters
const AccessCodesSortFilters = SortFilters

export const DashboardComponent = props => {
    const {
        
    } = props
    const navigate = useNavigate()
    // Admin Projects State
    const [adminProjectsPage, setAdminProjectsPage] = useState(0)
    const [adminProjectsSearchText, setAdminProjectsSearchText] = useState('')
    const [adminProjectsSortFilter, setAdminProjectsSortFilter] = useState(AdminProjectsSortFilters[0].filter)
    const [clearAdminProjectsSelectedRows, setClearAdminProjectsSelectedRows] = useState(false)
    const [adminProjectsPendingApprovalPillActive, setAdminProjectsPendingApprovalPillActive] = useState(false)
    const [adminProjectsInProgressPillActive, setAdminProjectsInProgressPillActive] = useState(false)
    const [adminProjectsCompletedPillActive, setAdminProjectsCompletedPillActive] = useState(false)
    const [adminProjectsPaidPillActive, setAdminProjectsPaidPillActive] = useState(false)
    const [adminProjectsArchivedPillActive, setAdminProjectsArchivedPillActive] = useState(false)
    // Access Codes State
    const [accessCodesPage, setAccessCodesPage] = useState(0)
    const [accessCodesSearchText, setAccessCodesSearchText] = useState('')
    const [accessCodesSortFilter, setAccessCodesSortFilter] = useState(AccessCodesSortFilters[0].filter)
    const [clearAccessCodesSelectedRows, setClearAccessCodesSelectedRows] = useState(false)
    // This User Projects State
    const [thisUserProjectsPage, setThisUserProjectsPage] = useState(0)
    const [thisUserProjectsSearchText, setThisUserProjectsSearchText] = useState('')
    const [thisUserProjectsSortFilter, setThisUserProjectsSortFilter] = useState(ThisUserProjectsSortFilters[0].filter)
    const [clearThisUserProjectsSelectedRows, setClearThisUserProjectsSelectedRows] = useState(false)
    const [thisUserProjectsPendingApprovalPillActive, setThisUserProjectsPendingApprovalPillActive] = useState(false)
    const [thisUserProjectsInProgressPillActive, setThisUserProjectsInProgressPillActive] = useState(false)
    const [thisUserProjectsCompletedPillActive, setThisUserProjectsCompletedPillActive] = useState(false)
    const [thisUserProjectsPaidPillActive, setThisUserProjectsPaidPillActive] = useState(false)
    const [thisUserProjectsArchivedPillActive, setThisUserProjectsArchivedPillActive] = useState(false)

    // Admin Projects Table Data
    const adminProjectsPills = [
        {title: 'Pending Approval', id: 'admin-projects-pending-approval', active: adminProjectsPendingApprovalPillActive},
        {title: 'In Progress', id: 'admin-projects-in-progress', active: adminProjectsInProgressPillActive},
        {title: 'Completed', id: 'admin-projects-completed', active: adminProjectsCompletedPillActive},
        {title: 'Paid', id: 'admin-projects-paid', active: adminProjectsPaidPillActive},
        {title: 'Archived', id: 'admin-projects-archived', active: adminProjectsArchivedPillActive}
    ]
    const adminProjectsForCurrentPage = getPaginatedDataForCurrentPage(
        props.adminProjects,
        adminProjectsPage,
        PageSizes.adminProjects
    )
    const adminProjectsTableHeaders = ['Name', 'Status', 'Payment Status', 'Date Created']
    const adminProjectsTableRows = adminProjectsForCurrentPage.map(({projectName, status, receivedPayment, createdAt, _id}) => ({
        id: _id,
        cells: [
            projectName,
            status,
            receivedPayment ? 'Paid' : 'Unpaid',
            moment(createdAt).format('LL')
        ]
    }))

    // Access Codes Table Data
    const accessCodesPills = [

    ]
    const accessCodesForCurrentPage = getPaginatedDataForCurrentPage(
        props.accessCodes,
        accessCodesPage,
        PageSizes.accessCodes
    )
    const accessCodesTableHeaders = ['Title', 'Status', 'Date Created']
    const accessCodesTableRows = accessCodesForCurrentPage.map(({title, claimed, createdAt, _id}) => ({
        id: _id,
        cells: [
            title,
            claimed ? 'Claimed' : 'Unclaimed',
            moment(createdAt).format('LL')
        ]
    }))

    // This User Projects Table Data
    const thisUserProjectsPills = [
        {title: 'Pending Approval', id: 'this-user-projects-pending-approval', active: thisUserProjectsPendingApprovalPillActive},
        {title: 'In Progress', id: 'this-user-projects-in-progress', active: thisUserProjectsInProgressPillActive},
        {title: 'Completed', id: 'this-user-projects-completed', active: thisUserProjectsCompletedPillActive},
        {title: 'Paid', id: 'this-user-projects-paid', active: thisUserProjectsPaidPillActive},
        {title: 'Archived', id: 'this-user-projects-archived', active: thisUserProjectsArchivedPillActive}
    ]
    const thisUserProjectsForCurrentPage = getPaginatedDataForCurrentPage(
        props.thisUserProjects,
        thisUserProjectsPage,
        PageSizes.thisUserProjects
    )
    const thisUserProjectsTableHeaders = ['Name', 'Status', 'Payment Status', 'Date Created']
    const thisUserProjectsTableRows = thisUserProjectsForCurrentPage.map(({projectName, status, receivedPayment, createdAt, _id}) => ({
        id: _id,
        cells: [
            projectName,
            status,
            receivedPayment ? 'Paid' : 'Unpaid',
            moment(createdAt).format('LL')
        ]
    }))

    useEffect(() => {
        if (props.hasAdminPrivileges) {
            fetchAdminProjectsFirstPage()
            fetchAccessCodesFirstPage()
        } else {
            fetchThisUserProjectsFirstPage()
        }
    }, [])

    useEffect(() => {
        props.hasAdminPrivileges && fetchAdminProjectsFirstPage()
    }, [
        adminProjectsPendingApprovalPillActive,
        adminProjectsInProgressPillActive,
        adminProjectsCompletedPillActive,
        adminProjectsPaidPillActive,
        adminProjectsArchivedPillActive,
        adminProjectsSortFilter
    ])

    useEffect(() => {
        props.hasAdminPrivileges && fetchAccessCodesFirstPage()
    }, [accessCodesSortFilter])

    useEffect(() => {
        fetchThisUserProjectsFirstPage()
    }, [
        thisUserProjectsPendingApprovalPillActive,
        thisUserProjectsInProgressPillActive,
        thisUserProjectsCompletedPillActive,
        thisUserProjectsPaidPillActive,
        thisUserProjectsArchivedPillActive,
        thisUserProjectsSortFilter
    ])

    // Utils

    // Admin Projects Utils
    const getAdminProjectsFilters = () => {
        return {
            ...(!!adminProjectsSearchText ? {projectName: adminProjectsSearchText} : {}),
            ...(adminProjectsPendingApprovalPillActive ? {status: ProjectStatuses.pendingApproval} : {}),
            ...(adminProjectsInProgressPillActive ? {status: ProjectStatuses.inProgress} : {}),
            ...(adminProjectsCompletedPillActive ? {status: ProjectStatuses.completed} : {}),
            ...(adminProjectsPaidPillActive ? {receivedPayment: true} : {}),
            ...(adminProjectsArchivedPillActive ? {archived: true} : {archived: false}),
            sortby: adminProjectsSortFilter
        }
    }

    const fetchAdminProjectsFirstPage = () => {
        props.fetchAdminUserProjects(getAdminProjectsFilters(), adminProjectsSearchText, 1)
        setAdminProjectsPage(1)
    }

    // Access Codes Utils
    const getAccessCodesFilters = () => {
        return {
            ...(accessCodesSearchText ? {title: accessCodesSearchText} : {}),
            sortby: accessCodesSortFilter
        }
    }

    const fetchAccessCodesFirstPage = () => {
        props.fetchAccessCodes(getAccessCodesFilters(), accessCodesSearchText, 1)
        setAccessCodesPage(1)
    }

    // This User Projects Utils
    const getThisUserProjectsFilters = () => {
        return {
            ...(!!thisUserProjectsSearchText ? {projectName: thisUserProjectsSearchText} : {}),
            ...(thisUserProjectsPendingApprovalPillActive ? {status: ProjectStatuses.pendingApproval} : {}),
            ...(thisUserProjectsInProgressPillActive ? {status: ProjectStatuses.inProgress} : {}),
            ...(thisUserProjectsCompletedPillActive ? {status: ProjectStatuses.completed} : {}),
            ...(thisUserProjectsPaidPillActive ? {receivedPayment: true} : {}),
            ...(thisUserProjectsArchivedPillActive ? {archived: true} : {archived: false}),
            sortby: thisUserProjectsSortFilter
        }
    }

    const fetchThisUserProjectsFirstPage = () => {
        props.fetchThisUserProjects(getThisUserProjectsFilters(), thisUserProjectsSearchText, 1)
        setThisUserProjectsPage(1)
    }

    // Direct

    // Admin Projects Table Functions
    const onChangeAdminProjectsSearchText = e => {
        setAdminProjectsSearchText(e.target.value)
    }

    const onSubmitAdminProjectsSearch = e => {
        e.preventDefault()
        fetchAdminProjectsFirstPage()
    }

    const onChangeAdminProjectsSortFilter = e => {
        setAdminProjectsSortFilter(e.target.value)
    }

    const onClickAdminProjectRow = rowID => {
        navigate(`/projects/${rowID}`)
    }

    const onClickDecrementAdminProjectsPage = () => {
        if (adminProjectsPage == 1) return
        else {
            setAdminProjectsPage(curr => curr - 1)
        }
    }

    const onClickIncrementAdminProjectsPage = () => {
        if (adminProjectsPage == props.adminProjectsPagesCount || props.adminProjectsPagesCount == 0) return
        else {
            props.fetchAdminUserProjects(getAdminProjectsFilters(), adminProjectsSearchText, adminProjectsPage + 1)
            setAdminProjectsPage(curr => curr + 1)
        }
    }

    // Access Codes Table Functions
    const onChangeAccessCodesSearchText = e => {
        setAccessCodesSearchText(e.target.value)
    }

    const onSubmitAccessCodesSearch = e => {
        e.preventDefault()
        fetchAccessCodesFirstPage()
    }

    const onChangeAccessCodesSortFilter = e => {
        setAccessCodesSortFilter(e.target.value)
    }

    const onClickAccessCodeRow = rowID => {
        navigate(`/accesscodes/${rowID}`)
    }

    const onClickDecrementAccessCodesPage = () => {
        if (accessCodesPage == 1) return
        else {
            setAccessCodesPage(curr => curr - 1)
        }
    }

    const onClickIncrementAccessCodesPage = () => {
        if (accessCodesPage == props.accessCodesPagesCount || props.accessCodesPagesCount == 0) return
        else {
            props.fetchAdminUserProjects(getAccessCodesFilters(), accessCodesSearchText, accessCodesPage + 1)
            setAccessCodesPage(curr => curr + 1)
        }
    }

    // This User Projects Table Functions
    const onChangeThisUserProjectsSearchText = e => {
        setThisUserProjectsSearchText(e.target.value)
    }

    const onSubmitThisUserProjectsSearch = e => {
        e.preventDefault()
        fetchThisUserProjectsFirstPage()
    }

    const onChangeThisUserProjectsSortFilter = e => {
        setThisUserProjectsSortFilter(e.target.value)
    }

    const onClickThisUserProjectRow = rowID => {
        navigate(`/projects/${rowID}`)
    }

    const onClickDecrementThisUserProjectsPage = () => {
        if (thisUserProjectsPage == 1) return
        else {
            setThisUserProjectsPage(curr => curr - 1)
        }
    }

    const onClickIncrementThisUserProjectsPage = () => {
        if (thisUserProjectsPage == props.thisUserProjectsPagesCount || props.thisUserProjectsPagesCount == 0) return
        else {
            props.fetchAdminUserProjects(getThisUserProjectsFilters(), thisUserProjectsSearchText, thisUserProjectsPage + 1)
            setThisUserProjectsPage(curr => curr + 1)
        }
    }

    // Common Functions
    const onClickPill = pillID => {
        switch(pillID) {
            // Admin Projects Pills
            case 'admin-projects-pending-approval':
                setAdminProjectsPendingApprovalPillActive(curr => !curr)
                setAdminProjectsInProgressPillActive(false)
                setAdminProjectsCompletedPillActive(false)
                break
            case 'admin-projects-in-progress':
                setAdminProjectsInProgressPillActive(curr => !curr)
                setAdminProjectsPendingApprovalPillActive(false)
                setAdminProjectsCompletedPillActive(false)
                break
            case 'admin-projects-completed':
                setAdminProjectsCompletedPillActive(curr => !curr)
                setAdminProjectsPendingApprovalPillActive(false)
                setAdminProjectsInProgressPillActive(false)
                break
            case 'admin-projects-paid':
                setAdminProjectsPaidPillActive(curr => !curr)
                break
            case 'admin-projects-archived':
                setAdminProjectsArchivedPillActive(curr => !curr)
                break
            // This User Projects Pills
            case 'this-user-projects-pending-approval':
                setThisUserProjectsPendingApprovalPillActive(curr => !curr)
                setThisUserProjectsInProgressPillActive(false)
                setThisUserProjectsCompletedPillActive(false)
                break
            case 'this-user-projects-in-progress':
                setThisUserProjectsInProgressPillActive(curr => !curr)
                setThisUserProjectsPendingApprovalPillActive(false)
                setThisUserProjectsCompletedPillActive(false)
                break
            case 'this-user-projects-completed':
                setThisUserProjectsCompletedPillActive(curr => !curr)
                setThisUserProjectsPendingApprovalPillActive(false)
                setThisUserProjectsInProgressPillActive(false)
                break
            case 'this-user-projects-paid':
                setThisUserProjectsPaidPillActive(curr => !curr)
                break
            case 'this-user-projects-archived':
                setThisUserProjectsArchivedPillActive(curr => !curr)
                break
            default:
                break
        }
    }

    const onClickCreateAccessCode = () => {
        props.addModal(ModalTypes.CREATE_ACCESS_CODE)
    }

    const onClickCreateWebapp = () => {
        navigate('/create')
    }

    return (
        <PageContainer>
            <MainHeader hasSubheaderBelow={false}/>
            <BodyContainer>
                {props.hasAdminPrivileges ?
                    <Container className={`${props.isSemiMobile && 'semi-mobile'}`}>
                        <div className='section-header'>
                            <h3>Webapp Requests</h3>
                        </div>
                        <SearchableTable
                            style={{marginBottom: 50}}
                            loading={props.loadingAdminProjects}
                            searchText={adminProjectsSearchText}
                            pills={adminProjectsPills}
                            sortFilters={AdminProjectsSortFilters}
                            sortFilter={adminProjectsSortFilter}
                            tableHeaders={adminProjectsTableHeaders}
                            tableRows={adminProjectsTableRows}
                            tableSelectActions={[
                            //    {title: 'Delete', action: onClickDelete, isDanger: true}
                            ]}
                            clearSelectedRows={clearAdminProjectsSelectedRows}
                            page={adminProjectsPage}
                            pagesCount={props.adminProjectsPagesCount}
                            onChangeSearchText={onChangeAdminProjectsSearchText}
                            onSubmitSearch={onSubmitAdminProjectsSearch}
                            onClickPill={onClickPill}
                            onChangeSortFilter={onChangeAdminProjectsSortFilter}
                            onClickTableRow={onClickThisUserProjectRow}
                            onClickDecrementPage={onClickDecrementAdminProjectsPage}
                            onClickIncrementPage={onClickIncrementAdminProjectsPage}
                        />
                        <div className='section-header'>
                            <h3>Access Codes</h3>
                            <Button
                                title='Create an Access Code'
                                icon='bi-plus'
                                priority={3}
                                type='clear'
                                onClick={onClickCreateAccessCode}
                            />
                        </div>
                        <SearchableTable
                            loading={props.loadingAccessCodes}
                            searchText={accessCodesSearchText}
                            pills={accessCodesPills}
                            sortFilters={AccessCodesSortFilters}
                            sortFilter={accessCodesSortFilter}
                            tableHeaders={accessCodesTableHeaders}
                            tableRows={accessCodesTableRows}
                            tableSelectActions={[
                            //    {title: 'Delete', action: onClickDelete, isDanger: true}
                            ]}
                            clearSelectedRows={clearAccessCodesSelectedRows}
                            page={accessCodesPage}
                            pagesCount={props.accessCodesPagesCount}
                            onChangeSearchText={onChangeAccessCodesSearchText}
                            onSubmitSearch={onSubmitAccessCodesSearch}
                            onClickPill={onClickPill}
                            onChangeSortFilter={onChangeAccessCodesSortFilter}
                            onClickTableRow={onClickAccessCodeRow}
                            onClickDecrementPage={onClickDecrementAccessCodesPage}
                            onClickIncrementPage={onClickIncrementAccessCodesPage}
                        />
                    </Container>
                    : <Container>
                        <div className='section-header'>
                            <div className='d-flex jc-flex-start ai-center'>
                                <h3>Your Webapps</h3>
                                <Tooltip title='Is your project not showing up? Try clicking the "Archived" filter.'>
                                    <IconButton
                                        icon='bi-question-circle'
                                        size='s'
                                        onClick={() => {}}
                                        style={{marginLeft: 5}}
                                    />
                                </Tooltip>
                            </div>
                            <Button
                                title='Create a Webapp'
                                icon='bi-plus'
                                priority={3}
                                type='clear'
                                onClick={onClickCreateWebapp}
                            />
                        </div>
                        <SearchableTable
                            loading={props.loadingThisUserProjects}
                            searchText={thisUserProjectsSearchText}
                            pills={thisUserProjectsPills}
                            sortFilters={ThisUserProjectsSortFilters}
                            sortFilter={thisUserProjectsSortFilter}
                            tableHeaders={thisUserProjectsTableHeaders}
                            tableRows={thisUserProjectsTableRows}
                            tableSelectActions={[
                            //    {title: 'Delete', action: onClickDelete, isDanger: true}
                            ]}
                            clearSelectedRows={clearThisUserProjectsSelectedRows}
                            page={thisUserProjectsPage}
                            pagesCount={props.thisUserProjectsPagesCount}
                            onChangeSearchText={onChangeThisUserProjectsSearchText}
                            onSubmitSearch={onSubmitThisUserProjectsSearch}
                            onClickPill={onClickPill}
                            onChangeSortFilter={onChangeThisUserProjectsSortFilter}
                            onClickTableRow={onClickAdminProjectRow}
                            onClickDecrementPage={onClickDecrementThisUserProjectsPage}
                            onClickIncrementPage={onClickIncrementThisUserProjectsPage}
                        />
                    </Container>
                }
            </BodyContainer>
        </PageContainer>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding-bottom: 200px;

    & .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        height: 30px;
        box-sizing: border-box;
    }
`

const mapStateToProps = state => ({
    hasAdminPrivileges: getHasAdminPrivileges(state),
    isSemiMobile: getIsSemiMobile(state),

    adminProjects: getAdminProjects(state),
    loadingAdminProjects: getLoadingAdminProjects(state),
    adminProjectsPagesCount: getAdminProjectsPagesCount(state),

    accessCodes: getAccessCodes(state),
    loadingAccessCodes: getLoadingAccessCodes(state),
    accessCodesPagesCount: getAccessCodesPagesCount(state),

    thisUserProjects: getThisUserProjects(state),
    loadingThisUserProjects: getLoadingThisUserProjects(state),
    thisUserProjectsPagesCount: getThisUserProjectsPagesCount(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchAdminUserProjects,
    fetchThisUserProjects,
    fetchAccessCodes,
    addModal
}, dispatch)

export const Dashboard = connect(mapStateToProps, mapDispatchToProps)(DashboardComponent)

// import React from 'react'
// import {connect} from 'react-redux'
// import {bindActionCreators} from 'redux'
// import styled from 'styled-components'
// import { useNavigate } from 'react-router-dom'

// import { PageContainer } from '../../components/common/PageContainer'
// import { BodyContainer } from '../../components/common/BodyContainer'
// import { MainHeader } from '../../components/headers/MainHeader'
// import { Button } from '../../components/common/Button'

// import {signOutUser} from '../../../redux/user'
// import { Subheader } from '../../components/headers/Subheader'
// import { Tooltip } from '../../components/common/Tooltip'

// export const DashboardComponent = props => {
//     const {
        
//     } = props
//     const navigate = useNavigate()

//     const onClickLogOut = () => {
//         props.signOutUser(() => {
//             navigate('/')
//         })
//     }

//     return (
//         <PageContainer>
//             <MainHeader hasSubheaderBelow={false}/>
//             <BodyContainer>
//             </BodyContainer>
//         </PageContainer>
//     )
// }

// const mapStateToProps = state => ({
    
// })

// const mapDispatchToProps = dispatch => bindActionCreators({
//     signOutUser
// }, dispatch)

// export const Dashboard = connect(mapStateToProps, mapDispatchToProps)(DashboardComponent)