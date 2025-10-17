import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { fetchAdminList, addAdmin } from '../../../../../redux';
import DataTable from 'react-data-table-component';
import { SidebarContext } from '../../../../../components/Sidebar/contexts/SidebarContext';

function UsersTable({ admin, fetchAdminList, addAdmin }) {
    const { toggleSidebar } = useContext(SidebarContext);

    useEffect(() => {
        if(admin?.list?.total <= 0) {
            fetchAdminList(1, 25);
        } 
    }, [fetchAdminList]);

    const handlePageChange = (current_page) => {
        //Update current_page in state here

        fetchAdminList(current_page, admin?.list?.per_page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        //Update per_page in state here

        fetchAdminList(admin?.list?.current_page, newPerPage);
    };

    const handleSelectedRowsChange = ({ selectedRows }) => {
        const ids = selectedRows.map(row => row.id);
        // setSelectedIds(ids);
        console.log(ids)
    };

    const openAdminForm = async (adminId) => {
        const userIndex = admin?.list?.data.findIndex(item => item.id === adminId);
        if (userIndex !== -1) {
            addAdmin(admin?.list?.data[userIndex])
            toggleSidebar('admin', adminId)
        }
    }

    const columns = [
        {
            name: 'Name',
            cell: (row) => (
                <div className="d-block fw-semibold ff-primary text-primary cursor-pointer" onClick={() => openAdminForm(row?.id)}>
                    {row?.name}
                </div>
            ),
            sortable: true,
        },
        {
            name: 'Role',
            maxWidth: '140px',
            minWidth: '60px',
            className: 'align-items-center justify-content-center',
            cell: (row) => (
                <span>{row?.role_name}</span>
            ),
        },
        {
            name: 'Email Address',
            cell: (row) => (
                <div>
                    <span className="fw-medium ff-primary font-size-14 me-2">{row?.email}</span>
                </div>
            ),
            sortable: false,
        },
        {
            name: 'Super Admin',
            maxWidth: '140px',
            minWidth: '60px',
            className: 'align-items-center justify-content-center',
            cell: (row) => (
                (row.role_id === 1) ? <i className="mdi mdi-circle superadmin-status text-success mx-1"></i> : <i className="mdi mdi-circle superadmin-status text-danger mx-1"></i>
            ),
        },
        {
            maxWidth: '60px',
            minWidth: '60px',
            cell: (row) => (
                <div className="dropdown mb-0 d-flex justify-content-end">
                    <a className="btn btn-link text-muted p-1 mt-n2 dropdown-toggle-split dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true">
                        <i className="mdi mdi-dots-vertical font-size-20"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item px-3" href="#"><i className="uil-edit me-1"></i>Edit</a>
                        <a className="dropdown-item px-3" href="#"><i className="uil-trash-alt me-1"></i>Delete</a>
                    </div>
                </div>
            )
        }
    ];
    // columns[1].style = { borderRight: '1px solid #e0e0e0' };

    const customStyles = {
        responsiveWrapper: {
            style: {
                overflow: 'visible !important'
            },
        },
        tableWrapper: {
            style: {
                display: 'block'
            }
        }
    };

    return (
        <div className="table-container mb-4">
            <DataTable
                customStyles={customStyles}
                title=""
                columns={columns}
                data={admin?.list?.data}
                progressPending={admin?.list?.loading}
                pagination
                paginationServer
                paginationTotalRows={admin?.list?.total}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
                selectableRows
                onSelectedRowsChange={handleSelectedRowsChange}
                paginationPerPage={admin?.list?.per_page}
            />
        </div>
        
    );
}

const mapStateToProps = (state) => ({
    admin: state.admin
});

const mapDispatchToProps = {
    fetchAdminList,
    addAdmin
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersTable);