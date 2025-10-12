import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { fetchDealList, updateDealSortOrder } from '../../../../../redux';
import DataTable from 'react-data-table-component';
import { useHasPermission } from '../../../../../utils/permissions';
import { Link } from 'react-router-dom';
import moment from 'moment';

function DealTable({ 
    settingsLoading, activeCondition, deal, permissions,
    updateDealSortOrder, fetchDealList
}) {
    useEffect(() => {
        if(!settingsLoading) {
            const queryFilter = {
                q: deal?.searchQuery,
                sortOrder: deal?.sortOrder,
                page: 1,
                per_page: deal?.list?.per_page,
            }
            fetchDealList(queryFilter, activeCondition);
        }
    }, [settingsLoading, fetchDealList]);

    const handlePerRowsChange = async (newPerPage, page, condition) => {
        const queryFilter = {
            q: deal?.searchQuery,
            sortOrder: deal?.sortOrder,
            page: deal?.list?.current_page,
            per_page: newPerPage,
        }
        fetchDealList(queryFilter, condition);
    };
    
    const handlePageChange = (current_page, condition) => {
        const queryFilter = {
            q: deal?.searchQuery,
            sortOrder: deal?.sortOrder,
            page: current_page,
            per_page: deal?.list?.per_page,
        }
        fetchDealList(queryFilter, condition);
    };

    const handleSort = async (column, sortDirection, condition) => {

        const sortOrder = column?.id+','+sortDirection
        updateDealSortOrder(sortOrder)

        const queryFilter = {
            q: deal?.searchQuery,
            sortOrder: sortOrder,
            page: deal?.list?.current_page,
            per_page: deal?.list?.per_page,
        }
        await fetchDealList(queryFilter, condition);

    };

    const handleSelectedRowsChange = ({ selectedRows }) => {
        const ids = selectedRows.map(row => row.id);
        
    };

    const columns = [
        {
            name: 'Deal Name',
            minWidth: '250px',
            maxWidth: '250px',
            cell: (row) => (
                <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100%' }} className="scrollable-column">
                    <Link to={`/admin/deals/${row?.id}/edit`} className="d-block fw-semibold ff-primary">
                        {row?.name}
                    </Link>
                    {
                        row?.parent_id && (
                            <>
                                <span className="badge badge-outline-primary mx-2">
                                    <i className="uil-data-sharing fs-6"></i>
                                </span>
                                {row?.parent_deal && (
                                    <>
                                        <span className="d-block ff-primary">
                                            {row?.parent_deal?.name}
                                        </span>
                                        <span className="text-muted ms-2">{row?.parent_deal?.pipeline?.name || ''}</span>
                                    </>
                                )}
                            </>
                        )
                    }
                </div>
            ),
            sortable: false,
        },
        {
            id: 'deals.created_at',
            name: 'Created Date',
            minWidth: '130px',
            maxWidth: '130px',
            cell: (row) => (
                <div>{moment(row?.created_at).format('MMM D, YYYY')}</div>
            ),
            sortable: true,
        },
        {
            name: 'Client',
            minWidth: '250px',
            cell: (row) => (
                <div>{row?.contact?.name || '-'}</div>
            ),
            sortable: false,
        },
        {
            name: 'Stage',
            minWidth: '200px',
            cell: (row) => (
                <div>
                    <span className="fw-medium ff-primary font-size-14 me-2">{row?.stage?.name}</span><span className="text-muted">{row?.pipeline?.name}</span>
                </div>
            ),
            sortable: false,
        },
        {
            name: 'Owner',
            minWidth: '200px',
            cell: (row) => (
                <div>{row?.owner?.name}</div>
            ),
            sortable: false,
        },
        {
            name: 'Amount',
            minWidth: '130px',
            selector: row => row?.amount,
            sortable: false,
            grow: 2,
        },
        {
            id: 'deals.expected_close_date',
            name: 'Expected Close Date',
            minWidth: '130px',
            maxWidth: '130px',
            cell: (row) => (
                <div>{moment(row?.expected_close_date).format('MMM D, YYYY')}</div>
            ),
            sortable: true,
        },
        {
            name: 'Status',
            maxWidth: '100px',
            minWidth: '60px',
            cell: (row) => (
                (row?.status === '1') ? 
                    <span className="badge badge-soft-secondary font-size-14 p-2">Open</span> :
                    (row?.status === '2') ? 
                        <span className="badge badge-soft-success font-size-14 p-2">Won</span> :
                            <span className="badge badge-soft-danger font-size-14 p-2">Lost</span>
            ),
        }
    ];

    const filteredColumns = columns.filter((column) => {
        if (column.name === 'Amount' && !useHasPermission(['view deal payment'], permissions)) {
            return false;
        }
        return true;
    });


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
                columns={filteredColumns}
                data={deal?.list?.data}
                progressPending={deal?.listLoading}
                pagination
                paginationServer
                paginationTotalRows={deal?.list?.total}
                onChangeRowsPerPage={(perPage, page) => handlePerRowsChange(perPage, page, activeCondition)}
                onChangePage={(page) => handlePageChange(page, activeCondition)}
                // selectableRows
                // selectableRowsHighlight
                onSelectedRowsChange={handleSelectedRowsChange}
                onSort={async(column, sortDirection) => await handleSort(column, sortDirection, activeCondition)}
                paginationPerPage={deal?.list?.per_page}

                className="scrollable-table-content"
                responsive
                fixedHeader
                fixedHeaderScrollHeight="70vh"  // Adjust height as needed
                persistTableHead
            />
        </div>
        
    );
}

const mapStateToProps = (state) => ({
    permissions: state.common?.settings?.permissions,
    settingsLoading: state.deal.settingsLoading,
    activeCondition: state.deal.activeCondition,
    deal: state.deal
});

const mapDispatchToProps = {
    updateDealSortOrder,
    fetchDealList,
};
  
export default connect(mapStateToProps, mapDispatchToProps)(DealTable);