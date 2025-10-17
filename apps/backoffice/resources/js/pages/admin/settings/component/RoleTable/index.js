import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { fetchRoleList, addRole, updateInitialPermissionSet } from '../../../../../redux';
import DataTable from 'react-data-table-component';
import { SidebarContext } from '../../../../../components/Sidebar/contexts/SidebarContext';

function RoleTable({ role, fetchRoleList, addRole, updateInitialPermissionSet }) {
    const { toggleSidebar } = useContext(SidebarContext);

    useEffect(() => {
        if(role?.list?.total <= 0) {
            fetchRoleList(1, 25);
        }  
    }, [role, fetchRoleList]);

    const handlePageChange = (current_page) => {
        //Update current_page in state here
        fetchRoleList(current_page, role?.list?.per_page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        //Update per_page in state here

        fetchRoleList(role?.list?.current_page, newPerPage);
    };

    const handleSelectedRowsChange = ({ selectedRows }) => {
        const ids = selectedRows.map(row => row.id);
        // setSelectedIds(ids);
        console.log(ids)
    };

    const openRoleForm = async (roleId) => {
        const userIndex = role?.list?.data.findIndex(item => item.id === roleId);
        if (userIndex !== -1) {
            addRole(role?.list?.data[userIndex])
            updateInitialPermissionSet(role?.list?.data[userIndex].permissions)
            toggleSidebar('role', roleId)
        }
    }

    const columns = [
        {
            name: 'Name',
            cell: (row) => (
                <div className="d-block fw-semibold ff-primary text-primary cursor-pointer" onClick={() => openRoleForm(row?.id)}>
                    {row?.name}
                </div>
            ),
            sortable: true,
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
                data={role?.list?.data}
                progressPending={role?.list?.loading}
                pagination
                paginationServer
                paginationTotalRows={role?.list?.total}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
                selectableRows
                onSelectedRowsChange={handleSelectedRowsChange}
                paginationPerPage={role?.list?.per_page}
            />
        </div>
        
    );
}

const mapStateToProps = (state) => ({
    role: state.role
});

const mapDispatchToProps = {
    fetchRoleList,
    addRole,
    updateInitialPermissionSet
};

export default connect(mapStateToProps, mapDispatchToProps)(RoleTable);