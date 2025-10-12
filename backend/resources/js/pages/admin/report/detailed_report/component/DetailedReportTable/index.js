import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { useHasPermission } from '../../../../../../utils/permissions';


function DetailedReportTable({ 
    isDetailedReportLoading,
    detailedReport,
    fetchDetailedReportList,
    permissions
}) {
    const handlePageChange = (current_page) => {
        const queryFilter = {
            page: current_page,
            per_page: 25,
        }
        fetchDetailedReportList(queryFilter);
    };

    const columns = [
        {
            name: 'User',
            minWidth: '250px',
            cell: (row) => (
                <div>{row?.user_name || '-'}</div>
            ),
            sortable: false,
        },
        {
            name: 'Deals',
            minWidth: '250px',
            maxWidth: '250px',
            cell: (row) => (
                <div>{row?.deal_count || '-'}</div>
            ),
            sortable: false,
        },
        {
            name: 'Deal Value',
            minWidth: '250px',
            cell: (row) => (
                <div>₹{row?.total_amount || '-'}</div>
            ),
            sortable: false,
        },
        {
            name: 'Average Deal Value',
            minWidth: '200px',
            cell: (row) => (
                <div>₹{row?.avg_amount || '-'}</div>
            ),
            sortable: false,
        },

    ];

    const filteredColumns = columns.filter((column) => {
        if ((column.name === 'Deal Value' || column.name === 'Average Deal Value') && !useHasPermission(['view deal payment'], permissions)) {
            return false;
        }
        return true;
    });


    const customStyles = {
        tableWrapper: {
            style: {

            }
        },
        cells: {
            style: {
                color: '#000000',
                fontSize: '14px',
                fontWeight: '500'
            }
        },
        headCells: {
            style: {
                color: '#000000',
                fontSize: '14px',
                fontWeight: '600'
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
                data={detailedReport?.data || []}
                progressPending={isDetailedReportLoading}
                pagination
                paginationServer
                paginationTotalRows={detailedReport?.total || 0}
                onChangePage={handlePageChange}
                paginationPerPage={detailedReport?.per_page || 25}
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
});

const mapDispatchToProps = {

};
  
export default connect(mapStateToProps, mapDispatchToProps)(DetailedReportTable);