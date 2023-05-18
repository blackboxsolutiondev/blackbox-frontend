import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

import {
    getFAQs,
    getLoadingFAQs,
    getFAQsPagesCount,
    fetchFAQs,
    deleteFAQs
} from '../../../../redux/admin'
import { addModal } from '../../../../redux/modal'
import { ModalTypes } from '../../../../containers/ModalProvider'
import { getIsMobile } from '../../../../redux/theme'
import { capitalizeWords } from '../../../../utils/misc'
import { PageSizes, getPaginatedDataForCurrentPage } from '../../../../networking'
import { PageContainer } from '../../../components/common/PageContainer'
import { MainHeader } from '../../../components/headers/MainHeader'
import { AdminHeader } from '../../../components/admin/AdminHeader'
import { BodyContainer } from '../../../components/common/BodyContainer'
import { Button } from '../../../components/common/Button'
import { SearchableTable } from '../../../components/common/SearchableTable'

export const FAQSections = [
    {
        title: 'Account',
        id: 'Account'
    },
    {
        title: 'Project',
        id: 'Project'
    },
    {
        title: 'Admin Console',
        id: 'Admin Console'
    },
]

const FAQsSortFilters = [
    {title: 'Most Recent', filter: '-createdAt'},
    {title: 'Least Recent', filter: '+createdAt'}
]

export const FAQComponent = props => {
    const {
        
    } = props
    const navigate = useNavigate()
    const [faqsPage, setFAQsPage] = useState(1)
    const [faqsSortFilter, setFAQsSortFilter] = useState(FAQsSortFilters[0].filter)
    const [accountPillActive, setAccountPillActive] = useState(false)
    const [projectPillActive, setProjectPillActive] = useState(false)
    const [adminConsolePillActive, setAdminConsolePillActive] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [clearSelectedRows, setClearSelectedRows] = useState(false)

    const pills = [
        {title: 'Account', id: 'Account', active: accountPillActive},
        {title: 'Project', id: 'Project', active: projectPillActive},
        {title: 'Admin Console', id: 'Admin Console', active: adminConsolePillActive}
    ]

    const faqsForCurrentPage = getPaginatedDataForCurrentPage(
        props.faqs,
        faqsPage,
        PageSizes.faqs
    )
    const tableHeaders = ['Title', 'Section']
    const tableRows = props.loadingFAQs ? []
        : faqsForCurrentPage.map( ({_id, title, section}) => ({
            id: _id,
            cells: [title, capitalizeWords(section)]
        }))

    useEffect(() => {
        fetchFAQsForPage(1)
        setClearSelectedRows(curr => !curr)
    }, [accountPillActive, projectPillActive, adminConsolePillActive, faqsSortFilter])

    // Utils

    const updateClearSelectedRows = () => {
        setClearSelectedRows(curr => !curr)
    }

    const getFAQsSections = () => {
        return pills.filter( pill => pill.active ).map( pill => pill.id )
    }

    const getFAQsFilters = () => {
        return {
            sortby: faqsSortFilter
        }
    }

    const fetchFAQsForPage = page => {
        props.fetchFAQs(page, getFAQsFilters(), getFAQsSections(), searchText)
        setFAQsPage(page)
    }

    // Direct

    const onClickCreateFAQ = () => {
        props.addModal(ModalTypes.CREATE_FAQ)
    }

    const onClickPill = pillID => {
        switch (pillID) {
            case 'Account':
                if (!accountPillActive) {
                    setProjectPillActive(false)
                    setAdminConsolePillActive(false)
                }
                setAccountPillActive(curr => !curr)
                break
            case 'Project':
                if (!projectPillActive) {
                    setAccountPillActive(false)
                    setAdminConsolePillActive(false)
                }
                setProjectPillActive(curr => !curr)
                break
            case 'Admin Console':
                if (!adminConsolePillActive) {
                    setAccountPillActive(false)
                    setProjectPillActive(false)
                }
                setAdminConsolePillActive(curr => !curr)
                break
        }
    }

    const onChangeSearchText = e => {
        setSearchText(e.target.value)
    }

    const onSubmitSearch = e => {
        e.preventDefault()
        fetchFAQsForPage(1)
    }

    const onChangeFAQsSortFilter = e => {
        setFAQsSortFilter(e.target.value)
    }

    const onClickFAQRow = rowID => {
        navigate(`/admin/faq/${rowID}`)
    }

    const onClickDelete = (selectedRowIDs) => {
        props.addModal(ModalTypes.CONFIRM, {
            title: 'Delete FAQs',
            message: `Are you sure you want to delete ${selectedRowIDs.length} FAQ${selectedRowIDs.length == 1 ? '' : 's'}?`,
            confirmButtonTitle: 'Delete',
            isDanger: true,
            onConfirm: (onSuccess, onFailure) => props.deleteFAQs(
                selectedRowIDs,
                () => {
                    updateClearSelectedRows()
                    onSuccess()
                },
                onFailure
            )
        })
    }

    const onClickDecrementPage = () => {
        if (faqsPage == 1) return
        setFAQsPage(curr => curr - 1)
    }

    const onClickIncrementPage = () => {
        if (faqsPage == props.faqsPagesCount) return
        fetchFAQsForPage(faqsPage + 1)
    }

    return (
        <PageContainer>
            <MainHeader />
            <AdminHeader activeLinkID='faq' />
            <BodyContainer>
                <Container className={`${props.isMobile && 'mobile'}`}>
                    <div className='section-header'>
                        <h3>Frequently Asked Questions</h3>
                        <Button
                            title='Create an FAQ'
                            type='clear'
                            priority={3}
                            onClick={onClickCreateFAQ}
                            icon='bi-plus'
                        />
                    </div>
                    <SearchableTable
                        loading={props.loadingFAQs}
                        searchText={searchText}
                        pills={pills}
                        sortFilters={FAQsSortFilters}
                        sortFilter={faqsSortFilter}
                        tableHeaders={tableHeaders}
                        tableRows={tableRows}
                        tableSelectActions={[
                            {title: 'Delete', action: onClickDelete, isDanger: true}
                        ]}
                        clearSelectedRows={clearSelectedRows}
                        page={faqsPage}
                        pagesCount={props.faqsPagesCount}
                        onChangeSearchText={onChangeSearchText}
                        onSubmitSearch={onSubmitSearch}
                        onClickPill={onClickPill}
                        onChangeSortFilter={onChangeFAQsSortFilter}
                        onClickTableRow={onClickFAQRow}
                        onClickDecrementPage={onClickDecrementPage}
                        onClickIncrementPage={onClickIncrementPage}
                    />
                </Container>
            </BodyContainer>
        </PageContainer>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;

    & .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
`

const mapStateToProps = state => ({
    faqs: getFAQs(state),
    loadingFAQs: getLoadingFAQs(state),
    faqsPagesCount: getFAQsPagesCount(state),
    isMobile: getIsMobile(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchFAQs,
    deleteFAQs,
    addModal
}, dispatch)

export const FAQ = connect(mapStateToProps, mapDispatchToProps)(FAQComponent)