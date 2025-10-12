import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { fetchTeamList, addTeam } from '../../../../../redux';
import DataTable from 'react-data-table-component';
import { SidebarContext } from '../../../../../components/Sidebar/contexts/SidebarContext';

function TeamTable({ team, fetchTeamList, addTeam }) {
    const { toggleSidebar } = useContext(SidebarContext);

    useEffect(() => {
        if(team?.list?.last_page != 1 && team?.list?.total <= 0) {
            fetchTeamList(1, 25);
        }  
    }, [team, fetchTeamList]);

    const handlePageChange = (current_page) => {
        //Update current_page in state here

        fetchTeamList(current_page, team?.list?.per_page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        //Update per_page in state here

        fetchTeamList(team?.list?.current_page, newPerPage);
    };

    const handleSelectedRowsChange = ({ selectedRows }) => {
        const ids = selectedRows.map(row => row.id);
        // setSelectedIds(ids);
        console.log(ids)
    };

    const openTeamForm = async (teamId) => {
        const teamIndex = team?.list?.data.findIndex(item => item.id === teamId);
        if (teamIndex !== -1) {
            addTeam(team?.list?.data[teamIndex])
            toggleSidebar('team', teamId)
        }
    }

    const columns = [
        {
            name: 'Name',
            cell: (row) => (
                <div className="d-block fw-semibold ff-primary text-primary cursor-pointer" onClick={() => openTeamForm(row?.id)}>
                    {row?.name}
                </div>
            ),
            sortable: true,
        },
        {
            name: 'Manager',
            cell: (row) => (
                <div>
                    <span className="fw-medium ff-primary font-size-14 me-2">{row?.manager[0]?.name}</span>
                </div>
            ),
            sortable: false,
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
                data={team?.list?.data}
                progressPending={team?.list?.loading}
                pagination
                paginationServer
                paginationTotalRows={team?.list?.total}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
                selectableRows
                onSelectedRowsChange={handleSelectedRowsChange}
                paginationPerPage={team?.list?.per_page}
            />
        </div>
        
    );
}

const mapStateToProps = (state) => ({
    team: state.team
});

const mapDispatchToProps = {
    fetchTeamList,
    addTeam
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamTable);