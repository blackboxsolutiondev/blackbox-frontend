import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import { Button } from '../Button'

import { Checkbox } from '../Checkbox'
import { IconButton } from '../IconButton'

export const Table = props => {
    const {
        headers,
        rows, // [{id, cells}]
        selectActions=[], // [{title, action: (selectedRowIDs, onSuccess) => void, isDanger}]
        clearSelectedRows,
        clampCells=true,

        onClickRow, // rowID => void

        ...rest
    } = props
    const [headerSelected, setHeaderSelected] = useState(false)
    const [selectedRowIDs, setSelectedRowIDs] = useState([])

    const selectable = selectActions.length

    useEffect(() => {
        clearSelection()
    }, [clearSelectedRows])

    // Utils

    const clearSelection = () => {
        setHeaderSelected(false)
        setSelectedRowIDs([])
    }

    // Direct

    const onClickHeaderCheckbox = () => {
        if (headerSelected) {
            setHeaderSelected(false)
            setSelectedRowIDs([])
        } else {
            setHeaderSelected(true)
            setSelectedRowIDs(rows.map( row => row.id ))
        }
    }

    const onClickRowCheckbox = (e, rowID) => {
        e.stopPropagation()
        if (selectedRowIDs.includes(rowID)) {
            setSelectedRowIDs(curr => curr.filter(id => id !== rowID))
            setHeaderSelected(false)
        } else {
            setSelectedRowIDs(curr => [...curr, rowID])
        }
    }

    const onClickCancelSelect = clearSelection

    return (
        <Root {...rest} className={`${props.className}`}>
            {selectedRowIDs.length ?
                <div className='selected-feedback-container'>
                    <IconButton
                        size='m'
                        icon='bi-x'
                        onClick={onClickCancelSelect}
                        style={{marginRight: 10}}
                    />
                    <h4 className='selected-title'>{selectedRowIDs.length} Selected</h4>
                    <div className='select-action-buttons-container'>
                        {selectActions.map( ({title, action, isDanger}) => (
                            <Button
                                title={title}
                                type={isDanger ? 'danger' : 'clear'}
                                priority={3}
                                onClick={() => action(selectedRowIDs)}
                                className='select-action-button'
                                key={title}
                            />
                        ))}
                    </div>
                </div> : null
            }
            <div className='table-container'>
                {selectable && rows.length ?
                    <div className='checkboxes-container'>
                        <div className='header-checkbox-container'>
                            <Checkbox
                                selected={headerSelected}
                                onClick={onClickHeaderCheckbox}
                            />
                        </div>
                        {rows.map( ({id}) => (
                            <div className='checkbox-container' key={`checkbox-container-${id}`}>
                                <Checkbox
                                    selected={selectedRowIDs.includes(id)}
                                    onClick={e => onClickRowCheckbox(e, id)}
                                />
                            </div>
                        ))}
                    </div>
                    : null
                }
                <table>
                    <thead>
                        <tr className='header-row'>
                            {headers.map( header => (
                                <th key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    {rows.length ?
                        <tbody>
                            {rows.map( ({id, cells}, i) => (
                                <tr className='table-row' onClick={() => onClickRow(id)} key={`table-row-${id}`}>
                                    {cells.map( cell => (
                                        <td key={cell} className={clampCells && 'line-clamp-1'}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                        : 
                        <div className='no-results-container'>
                            <h4>No results</h4>
                        </div>
                    }
                </table>
            </div>
        </Root>
    )
}

const Root = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border-collapse: collapse;
    text-align: left;

    & .selected-feedback-container {
        display: flex;
        align-items: center;
        padding: 15px 15px;
        border-bottom: 1px solid ${p => p.theme.bc};
    }

    & .selected-title {
        color: ${p => p.theme.tint};
        padding-right: 15px;
        border-right: 2px solid ${p => p.theme.textSecondary};
        margin-right: 15px;
        white-space: nowrap;
    }

    & .select-action-buttons-container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        overflow: scroll;
    }
    & .select-action-buttons-container::-webkit-scrollbar {
        display: none !important;
    }
    & .select-action-buttons-container {
        -ms-overflow-style: none !important;
        scrollbar-width: none !important;
    }
    & .select-action-buttons-container {
        scroll-behavior: smooth;
    }

    & .select-action-button {
        margin-right: 10px;
    }
    & .select-action-button:last-child {
        margin-right: 0px;
    }

    & .table-container {
        display: flex;
        width: 100%;
        align-items: flex-start;
    }

    & .checkboxes-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    & table {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: stretch;
    }

    & .no-results-container {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 20px 10px;
    }
    & .no-results-container h4 {
        color: ${p => p.theme.textSecondary};
    }

    & .header-checkbox-container {
        height: 38px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 9px 20px;
        border-bottom: 1px solid ${p => p.theme.bc};
        box-sizing: border-box;
    }

    & .header-row {
        height: 38px;
        padding: 10px 20px;
        border-bottom: 1px solid ${p => p.theme.bc};
        box-sizing: border-box;
    }

    & thead {
        width: 100%;
    }

    & tbody {
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }

    & .checkbox-container {
        height: 43px;
        padding: 12px 20px;
        box-sizing: border-box;
    }
    & .checkbox-container:nth-child(odd) {
        background-color: ${p => p.theme.bgcSemilight};
    }

    & .table-row {
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    & .table-row:nth-child(even) {
        background-color: ${p => p.theme.bgcSemilight};
    }
    & .table-row:hover {
        background-color: ${p => p.theme.bgcHover};
    }

    & tr {
        display: flex;
        align-items: center;
        flex: 1;
        padding: 12px 20px;
        padding-left: 20px;
    }

    & th,
    & td {
        flex: 1;
    }

    & th {
        font-size: 13px;
        font-weight: 500;
        color: ${p => p.theme.textTertiary};
        text-transform: uppercase;
    }

    & td {
        font-size: 14px;
        font-weight: 400;
        color: ${p => p.theme.textMain};
    }
`