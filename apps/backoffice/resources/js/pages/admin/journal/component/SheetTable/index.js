import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { 
    fetchJournalPaperList, 
    updateSheetSortOrder,
    addProcessSheet
} from '../../../../../redux';
import { SidebarContext } from '../../../../../components/Sidebar/contexts/SidebarContext';
import { formatDate, rgbToRgba, idNameText, idColor, mergeApiDateWithIso } from '../../../../../utils';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';

function SheetTable({ 
    settingsLoading, listReloading, activeCondition, statusList, journal, settings,
    fetchJournalPaperList, updateSheetSortOrder, addProcessSheet
}) {
    const { toggleSidebar } = useContext(SidebarContext);

    useEffect(() => {
        if(!settingsLoading) {
            const queryFilter = {
                q: journal?.searchQuery,
                sortOrder: journal?.sortOrder,
                page: 1,
                per_page: journal?.list?.per_page,
            }

            fetchJournalPaperList(queryFilter, activeCondition);
        }
    }, [settingsLoading, fetchJournalPaperList]);
    

    useEffect(() => {
        if(listReloading) {
            const queryFilter = {
                q: journal?.searchQuery,
                sortOrder: journal?.sortOrder,
                page: 1,
                per_page: journal?.list?.per_page,
            }

            fetchJournalPaperList(queryFilter, activeCondition);
        }
    }, [listReloading, fetchJournalPaperList]);


    const handlePerRowsChange = async (newPerPage, page, condition) => {
        const queryFilter = {
            q: journal?.searchQuery,
            sortOrder: journal?.sortOrder,
            page: journal?.list?.current_page,
            per_page: newPerPage,
        }
        fetchJournalPaperList(queryFilter, condition);
    };

    const handlePageChange = (current_page, condition) => {
        const queryFilter = {
            q: journal?.searchQuery,
            sortOrder: journal?.sortOrder,
            page: current_page,
            per_page: journal?.list?.per_page,
        }
        fetchJournalPaperList(queryFilter, condition);
    };

    const handleSort = async(column, sortDirection, condition) => {
        const sortOrder = column?.id+','+sortDirection
        updateSheetSortOrder(sortOrder)

        const queryFilter = {
            q: journal?.searchQuery,
            sortOrder: sortOrder,
            page: journal?.list?.current_page,
            per_page: journal?.list?.per_page,
        }
        await fetchJournalPaperList(queryFilter, condition);
    };

    const onPaperRevisionEditButton = async(dealId, revision) => {
        const updatedRevision = {
            ...revision,
            publisher_status: revision?.status,
            extra_info: revision?.extra_info,
            due_date: (revision?.due_date) ? mergeApiDateWithIso(revision?.due_date) : revision?.due_date,
            submission_date: (revision?.submission_date) ? mergeApiDateWithIso(revision?.submission_date) : revision?.submission_date,
            current_revision: {
                ...revision.current_revision,
                enable_task_attach: revision?.current_revision?.enable_task_attach,
                activity_id: revision?.current_revision?.activity_id,
                revised_by: revision?.current_revision?.revised_by,
                fetch_as: 'new',
                tech_status: revision?.current_revision?.status,
                submission_date: (revision?.current_revision?.submission_date) ? mergeApiDateWithIso(revision?.current_revision?.submission_date) : revision?.current_revision?.submission_date,
                due_date: (revision?.current_revision?.due_date) ? mergeApiDateWithIso(revision?.current_revision?.due_date) : revision?.current_revision?.due_date,
                revision_type: revision?.current_revision?.revision_type,
            },
            next_revision: {
                flag: false,
                enable_task_attach: false,
                activity_id: '',
                revised_by: '',
                fetch_as: 'new',
                tech_status: '',
                submission_date: '',
                due_date: '',
                revision_type: 'revision',
            }
        }

        addProcessSheet(updatedRevision)
        toggleSidebar('process_sheet', null, {dealId: dealId})
    }

    const getExtraValue = (extraInfo, label) => {
        if(!extraInfo || extraInfo === '') {
            return '';
        }

        if (Array.isArray(extraInfo)) {
            const entry = extraInfo.find(info => info.label === label);
            return entry ? entry.value : "";
        }

        return "";
    };

    const columns = [
        {
            name: 'Deal Name',
            minWidth: '200px',
            maxWidth: '300px',
            cell: (row) => (
                <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100%', alignItems: 'center' }} className="scrollable-column mt-2">
                    <div>
                        <table className="table-process-detail table table-borderless mb-0">
                            <tbody>
                                <tr>
                                    <th scope="row" style={{width: '50%', paddingTop: '0'}}><b>Deal :</b></th>
                                    <td style={{paddingTop: '0'}}>{row?.name}</td>
                                </tr>
                                <tr>
                                    <th scope="row"><b>Paper :</b></th>
                                    <td>{row?.paper}</td>
                                </tr>
                                <tr>
                                    <th scope="row"><b>Domain :</b></th>
                                    <td>{row?.domain?.name || '-' }</td>
                                </tr>
                                <tr>
                                    <th scope="row"><b>Service :</b></th>
                                    <td>{row?.service?.name || '-' }</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ),
            sortable: false,
            conditionalCellStyles: [
                {
                    when: row => row.name,
                    classNames: ['custom-align-start'],
                }
            ],
        },
        {
            id: 'papers.confirmation_date',
            name: 'Confirmation Date',
            maxWidth: '130px',
            minWidth: '130px',
            cell: (row) => (
                <div className="mt-2">{row?.confirmation_date ? formatDate(row?.confirmation_date, 'shortdate') : '-'}</div>
            ),
            sortable: true,
            conditionalCellStyles: [
                {
                    when: row => row.name,
                    classNames: ['custom-align-start'],
                }
            ],
        },
        {
            id: 'papers.deadline',
            name: 'Deadline',
            maxWidth: '130px',
            minWidth: '130px',
            cell: (row) => (
                <div className="mt-2">{row?.deadline ? formatDate(row?.deadline, 'shortdate') : '-'}</div>
            ),
            sortable: true,
            conditionalCellStyles: [
                {
                    when: row => row.name,
                    classNames: ['custom-align-start'],
                }
            ],
        },
        {
            name: 'Records',
            minWidth: '600px',
            conditionalCellStyles: [
                {
                    when: row => row.name,
                    classNames: ['custom-align-start'],
                }
            ],
            cell: (row, rowIndex) => (
                <div className="mt-2">
                    <div className="table-responsive processing-sheet collapse show" id={`records${rowIndex}`}>
                        <table className="table table-bordered mt-2">
                            <thead className="table-light">
                                <tr>
                                    <th className="process-no text-center">No</th>
                                    <th className="process-status">Status</th>
                                    <th className="process-publisher">Publisher</th>
                                    <th className="process-journal">Journal Name</th>
                                    <th className="process-submission">Submission Date</th>
                                    <th className="process-revision">Revision Date</th>
                                    <th className="process-url">URL</th>
                                    {
                                        (settings?.extra_label) ? settings.extra_label.map((label, index) => {
                                            return (
                                                <th key={index} className="process-extra-info">{label}</th>
                                            );
                                        }) : null
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    row.processing.map((record, recordIndex) => (
                                        <tr key={recordIndex}>
                                            <td>
                                                <div className="text-center">
                                                    {recordIndex + 1}
                                                    <button type="button" className="btn btn-primary-subtle btn-sm w-md text-truncate ms-2" onClick={() => onPaperRevisionEditButton(row?.journalable_id, record)}>
                                                        <i className="uil-edit-alt me-1 align-middle"></i> Update
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <div 
                                                    style={{
                                                        backgroundColor: rgbToRgba(idColor(statusList?.process, record?.status), 0.1) , 
                                                        color: idColor(statusList?.process, record?.status), 
                                                        border: `1px solid ${idColor(statusList?.process, record?.status)}`
                                                    }} className="badge font-size-12" 
                                                    >
                                                    {idNameText(statusList?.process, record?.status)}
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    {record?.publisher?.name || '-'}
                                                    {
                                                        (record?.current_revision && record?.current_revision?.activity_id) ? <span className="text-muted cursor-pointer ms-2" onClick={() => toggleSidebar('activities', record?.current_revision?.activity_id)}><i className="mdi mdi-comment-text-outline fs-4"></i></span> : null
                                                    } 
                                                </div>
                                            </td>
                                            <td>{record?.journal?.journal_name || '-'}</td>
                                            <td>{record?.submission_date ? formatDate(record?.submission_date, 'date') : '-'}</td>
                                            <td>{record?.due_date ? formatDate(record?.due_date, 'date') : '-'}</td>
                                            <td>
                                                <div className="process-url text-truncate">
                                                    {
                                                        record?.url ? (
                                                            <a href={record.url} target="_blank" rel="noopener noreferrer">
                                                                {record.url}
                                                            </a>
                                                        ) : ('')
                                                    }
                                                </div>
                                            </td>
                                            {
                                                (settings?.extra_label) ? settings.extra_label.map((label, index) => {
                                                    return (
                                                        <td key={index}>{getExtraValue(record?.extra_info, label)}</td>
                                                    )
                                                }) : null
                                            }
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <button className="btn btn-sm btn-primary mb-2" type="button" data-bs-toggle="collapse" data-bs-target={`#records${rowIndex}`}>
                        Show / Hide Records ({row?.processing?.length || 0})
                    </button>
                </div>
            ),
            sortable: false
        }
    ]

    const customStyles = {
        tableWrapper: {
            style: {

            }
        }
    };

    return (
        <div className="table-container mb-4">
            <DataTable
                paginationRowsPerPageOptions={[25, 50, 100, 500, 1000]}
                customStyles={customStyles}
                title=""
                columns={columns}
                data={journal?.list?.data}
                progressPending={journal?.listLoading}
                pagination
                paginationServer
                paginationTotalRows={journal?.list?.total}
                onChangeRowsPerPage={(perPage, page) => handlePerRowsChange(perPage, page, activeCondition)}
                onChangePage={(page) => handlePageChange(page, activeCondition)}
                onSort={async(column, sortDirection) => await handleSort(column, sortDirection, activeCondition)}
                paginationPerPage={journal?.list?.per_page}

                className="scrollable-table-content"
                responsive
                fixedHeader
                fixedHeaderScrollHeight="70vh"
                persistTableHead
            />
        </div>
    );
}
const mapStateToProps = (state) => ({
    settingsLoading: state.journal.settingsLoading,
    listReloading: state.journal.listReloading,
    activeCondition: state.journal.activeCondition,
    statusList: state.journal.settings?.status,
    journal: state.journal,
    settings: state.journal.settings,
});
const mapDispatchToProps = {
    fetchJournalPaperList,
    updateSheetSortOrder,
    addProcessSheet
};

  
export default connect(mapStateToProps, mapDispatchToProps)(SheetTable);