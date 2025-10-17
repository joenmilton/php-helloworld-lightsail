import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { SidebarContext } from '../../../../../components/Sidebar/contexts/SidebarContext';
import { 
    fetchActivityList, 
    updateActivitySortOrder, 
    setBulkActivityIds
} from '../../../../../redux';
import DataTable from 'react-data-table-component';
import { formatDate, rgbToRgba } from '../../../../../utils';

function ActivityTable({ 
    settingsLoading, activeCondition, activity, bulkIds,
    fetchActivityList, updateActivitySortOrder,  setBulkActivityIds
}) {
    const { toggleSidebar } = useContext(SidebarContext);

    useEffect(() => {
        if(!settingsLoading) {
            const queryFilter = {
                q: activity?.searchQuery,
                sortOrder: activity?.sortOrder,
                page: 1,
                per_page: activity?.list?.per_page,
            }

            fetchActivityList(queryFilter, activeCondition);
        }
    }, [settingsLoading, fetchActivityList]);

    const handleSort = async(column, sortDirection, condition) => {
        const sortOrder = column?.id+','+sortDirection
        updateActivitySortOrder(sortOrder)

        const queryFilter = {
            q: activity?.searchQuery,
            sortOrder: sortOrder,
            page: activity?.list?.current_page,
            per_page: activity?.list?.per_page,
        }
        await fetchActivityList(queryFilter, condition);
    };

    const handlePerRowsChange = async (newPerPage, page, condition) => {
        const queryFilter = {
            q: activity?.searchQuery,
            sortOrder: activity?.sortOrder,
            page: activity?.list?.current_page,
            per_page: newPerPage,
        }
        fetchActivityList(queryFilter, condition);
    };
    
    const handlePageChange = (current_page, condition) => {
        const queryFilter = {
            q: activity?.searchQuery,
            sortOrder: activity?.sortOrder,
            page: current_page,
            per_page: activity?.list?.per_page,
        }
        fetchActivityList(queryFilter, condition);
    };

    const handleSelectedRowsChange = async({ selectedRows }) => {
        const ids = selectedRows.map(row => row.id);
        await setBulkActivityIds(ids)
    };

    const columns = [
        {
            name: 'Type',
            minWidth: '100px',
            maxWidth: '100px',
            cell: (row) => (
                <div 
                    style={{
                        backgroundColor: rgbToRgba(row?.activity_type?.color, 0.1) , 
                        color: row?.activity_type?.color, 
                        border: `1px solid ${row?.activity_type?.color}`
                    }} className="badge d-flex align-items-center font-size-12 p-1" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"
                    >
                    <i className={`${row?.activity_type?.icon} me-1`}></i>
                    {row?.activity_type?.name}
                </div>
            )
        },
        {
            name: 'Deal Name',
            minWidth: '200px',
            maxWidth: '200px',
            cell: (row) => (
                <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100%' }} className="scrollable-column">
                    <div className="d-block">
                        {row?.deal_name}
                    </div>
                </div>
            ),
            sortable: false,
        },
        {
            name: 'Title',
            minWidth: '200px',
            maxWidth: '200px',
            cell: (row) => (

                <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100%' }} className="scrollable-column">
                    <div className="d-block text-primary fw-semibold ff-primary cursor-pointer" onClick={() => toggleSidebar('activities', row?.id)}>
                        {row?.title}
                    </div>
                </div>
            ),
            sortable: false,
        },
        {
            id: 'activities.activity_percentage',
            name: 'Status',
            maxWidth: '140px',
            minWidth: '60px',
            cell: (row) => (
                (row?.completed === 1) ? 
                    <div className="badge bg-success font-size-12 cursor-pointer">Completed</div> : 
                    <div className="badge bg-danger font-size-12 cursor-pointer">In-progress {row?.activity_percentage} %</div>
            ),
            sortable: true,
        },
        {
            id: 'activities.created_at',
            name: 'Created Date',
            maxWidth: '220px',
            minWidth: '220px',
            cell: (row) => (
                <div>{formatDate(row?.created_at, 'datetime')}</div>
            ),
            sortable: true,
        },
        {
            name: 'Owner',
            minWidth: '150px',
            maxWidth: '150px',
            cell: (row) => (
                <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100%' }} className="scrollable-column">
                    {row?.owner?.name || '-'}
                </div>
            ),
            sortable: false,
        },
        {
            name: 'Assigned To',
            minWidth: '150px',
            maxWidth: '150px',
            cell: (row) => (
                <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100%' }} className="scrollable-column">
                    {(row?.users.length > 1) ? row?.users.filter(user => user.id !== row?.owner?.id).map(user => user.name).join(', ') : '-'}
                </div>
            ),
            sortable: false,
            
        },
        {
            id: 'activities.start_time',
            name: 'Start Date',
            maxWidth: '220px',
            minWidth: '220px',
            cell: (row) => (
                <div>{ row?.start_time ? formatDate(row.start_time, 'datetime') : '-' }</div>
            ),
            sortable: true,
        },
        {
            id: 'activities.end_time',
            name: 'End Date',
            maxWidth: '220px',
            minWidth: '220px',
            cell: (row) => (
                <div>{ row?.end_time ? formatDate(row.end_time, 'datetime') : '-' }</div>
            ),
            sortable: true,
        },
        {
            id: 'activities.completed_at',
            name: 'Completed Date',
            maxWidth: '220px',
            minWidth: '220px',
            cell: (row) => (
                <div>{(row?.completed_at) ? formatDate(row?.completed_at, 'datetime') : '-'}</div>
            ),
            sortable: true,
        },
        {
            name: 'Description',
            minWidth: '350px',
            maxWidth: '350px',
            cell: (row) => (
                <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100%' }} className="scrollable-column">
                    {row?.description}
                </div>
            ),
            sortable: false,
        }
    ];

    const customStyles = {
        tableWrapper: {
            style: {
                height: "400px"
            }
        }
    };

    return (
        <div className="table-wrapper">
            <div className="table-container mb-4">
                <DataTable
                    paginationRowsPerPageOptions={[25, 50, 100, 500, 1000]}
                    title=""
                    columns={columns}
                    data={activity?.list?.data}
                    progressPending={activity?.listLoading}
                    pagination
                    paginationServer
                    paginationTotalRows={activity?.list?.total}
                    onChangeRowsPerPage={(perPage, page) => handlePerRowsChange(perPage, page, activeCondition)}
                    onChangePage={(page) => handlePageChange(page, activeCondition)}
                    selectableRowsVisibleOnly={true}
                    selectableRows
                    selectableRowsHighlight
                    onSelectedRowsChange={async(selectedRows) => await handleSelectedRowsChange(selectedRows)}
                    clearSelectedRows={bulkIds.length === 0}
                    onSort={async(column, sortDirection) => await handleSort(column, sortDirection, activeCondition)}
                    paginationPerPage={activity?.list?.per_page}
                    customStyles={customStyles}

                    className="scrollable-table-content"
                    responsive
                    fixedHeader
                    fixedHeaderScrollHeight="70vh"  // Adjust height as needed
                    persistTableHead
                />
            </div>
        </div>
        
    );
}

const mapStateToProps = (state) => ({
    settingsLoading: state.activity.settingsLoading,
    activeCondition: state.activity.activeCondition,
    activity: state.activity,
    bulkIds: state.activity?.bulkIds,
});

const mapDispatchToProps = {
    fetchActivityList,
    updateActivitySortOrder,
    setBulkActivityIds
};
  
export default connect(mapStateToProps, mapDispatchToProps)(ActivityTable);