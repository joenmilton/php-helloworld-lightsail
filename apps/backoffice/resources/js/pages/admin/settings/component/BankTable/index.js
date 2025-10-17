import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { fetchBankList, addBank, changeBankAccountStatus } from '../../../../../redux';
import DataTable from 'react-data-table-component';
import { SidebarContext } from '../../../../../components/Sidebar/contexts/SidebarContext';

function BankTable({ 
    bank, 
    fetchBankList, addBank, changeBankAccountStatus 
}) {
    const { toggleSidebar } = useContext(SidebarContext);

    useEffect(() => {
        if(bank?.list?.last_page != 1 && bank?.list?.total <= 0) {
            fetchBankList(1, 25);
        }  
    }, [bank, fetchBankList]);

    const handlePageChange = (current_page) => {
        //Update current_page in state here

        fetchBankList(current_page, bank?.list?.per_page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        //Update per_page in state here

        fetchBankList(bank?.list?.current_page, newPerPage);
    };

    const handleSelectedRowsChange = ({ selectedRows }) => {
        const ids = selectedRows.map(row => row.id);
        // setSelectedIds(ids);
        console.log(ids)
    };

    const openBankForm = async (bankId) => {
        const bankIndex = bank?.list?.data.findIndex(item => item.id === bankId);
        if (bankIndex !== -1) {
            addBank(bank?.list?.data[bankIndex])
            toggleSidebar('bank', bankId)
        }
    }

    const handleStatusChange = async (bankId, status) => {
        const result = await changeBankAccountStatus(bankId, status);
        if(result) {
            await fetchBankList(bank?.list?.current_page, bank?.list?.per_page);
        }
    }

    const columns = [
        {
            name: 'Name',
            cell: (row) => (
                <div className="d-block fw-semibold ff-primary text-primary cursor-pointer" onClick={() => openBankForm(row?.id)}>
                    {row?.name}
                </div>
            ),
            sortable: true,
        },
        {
            name: 'Status',
            maxWidth: '150px',
            minWidth: '150px',
            cell: (row) => (
                <div className="">
                {
                    (row?.is_loading) ? <div className="spinner-border spinner-18  text-secondary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div> : (row?.active === 1) ? 
                        <div onClick={async() => await handleStatusChange(row?.id, 0)} className="badge bg-success font-size-12 cursor-pointer">Verified</div> : 
                        <div onClick={async() => await handleStatusChange(row?.id, 1)} className="badge bg-danger font-size-12 cursor-pointer">Not Verified</div>
                }
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
                data={bank?.list?.data}
                progressPending={bank?.list?.loading}
                pagination
                paginationServer
                paginationTotalRows={bank?.list?.total}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
                selectableRows
                onSelectedRowsChange={handleSelectedRowsChange}
                paginationPerPage={bank?.list?.per_page}
            />
        </div>
        
    );
}

const mapStateToProps = (state) => ({
    bank: state.bank
});

const mapDispatchToProps = {
    fetchBankList,
    addBank,
    changeBankAccountStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(BankTable);