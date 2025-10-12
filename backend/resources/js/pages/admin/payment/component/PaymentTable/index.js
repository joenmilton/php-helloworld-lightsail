import React, { useEffect, useRef, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { 
    fetchPaymentList, 
    addPayment,
    updatePaymentSortOrder, 
    savePaymentAttachment, 
    setActivePaymentMedia,
    changePaymentStatus,
    setBulkPaymentIds
} from '../../../../../redux';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { formatDate } from '../../../../../utils/index';
import { SidebarContext } from '../../../../../components/Sidebar/contexts/SidebarContext';


function PaymentTable({ 
    settingsLoading, saveLoading, activeCondition, payment, popupMedia, bulkIds,
    fetchPaymentList, addPayment, updatePaymentSortOrder, savePaymentAttachment, setActivePaymentMedia, changePaymentStatus, setBulkPaymentIds
}) {
    const { toggleSidebar } = useContext(SidebarContext);

    const fileInputRef                      = useRef(null);
    const [errors, setError]                = useState({});

    useEffect(() => {
        if(!settingsLoading) {
            const queryFilter = {
                q: payment?.searchQuery,
                sortOrder: payment?.sortOrder,
                page: 1,
                per_page: payment?.list?.per_page,
            }

            fetchPaymentList(queryFilter, activeCondition);
        }
    }, [settingsLoading, fetchPaymentList]);

    const onPaymentAttachmentClick = (paymentId) => {
        setActivePaymentMedia(paymentId, 'no_split')
    }

    const handleFileChange = async (e, pay, condition) => {
        setError({})

        const response = await savePaymentAttachment(pay, e.target.files[0], 'no_split', false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        if(response.httpCode == 422) {
            setError(response.errors)
        }

        if(response.httpCode === 200) {
            
            const queryFilter = {
                q: payment?.searchQuery,
                sortOrder: payment?.sortOrder,
                page: payment?.list?.current_page,
                per_page: payment?.list?.per_page,
            }
            await fetchPaymentList(queryFilter, condition);

            setActivePaymentMedia(pay.id, 'no_split')
        }
    }

    const handleStatusChange = async(paymentId, status, condition) => {
        const tableAction = {
            action: 'status',
            payment_id: paymentId,
            status: status
        }

        const result = await changePaymentStatus(paymentId, status);
        if(result) {
            const queryFilter = {
                q: payment?.searchQuery,
                sortOrder: payment?.sortOrder,
                page: payment?.list?.current_page,
                per_page: payment?.list?.per_page,
            }
            await fetchPaymentList(queryFilter, condition);
        }
    }


    const handleSort = async(column, sortDirection, condition) => {
        const sortOrder = column?.id+','+sortDirection
        updatePaymentSortOrder(sortOrder)

        const queryFilter = {
            q: payment?.searchQuery,
            sortOrder: sortOrder,
            page: payment?.list?.current_page,
            per_page: payment?.list?.per_page,
        }
        await fetchPaymentList(queryFilter, condition);
    };

    const handlePerRowsChange = async (newPerPage, page, condition) => {
        const queryFilter = {
            q: payment?.searchQuery,
            sortOrder: payment?.sortOrder,
            page: payment?.list?.current_page,
            per_page: newPerPage,
        }
        fetchPaymentList(queryFilter, condition);
    };
    
    const handlePageChange = (current_page, condition) => {
        const queryFilter = {
            q: payment?.searchQuery,
            sortOrder: payment?.sortOrder,
            page: current_page,
            per_page: payment?.list?.per_page,
        }
        fetchPaymentList(queryFilter, condition);
    };

    const handleSelectedRowsChange = async({ selectedRows }) => {
        const ids = selectedRows.map(row => row.id);
        await setBulkPaymentIds(ids)
    };

    const openPaymentForm = async (paymentId) => {
        const paymentIndex = payment?.list?.data.findIndex(item => item.id === paymentId);
        if (paymentIndex !== -1) {
            addPayment(payment?.list?.data[paymentIndex])
            toggleSidebar('payments', paymentId)
        }
    }


    const columns = [
        {
            name: 'Deal Name',
            minWidth: '200px',
            maxWidth: '200px',
            cell: (row) => (
                <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100%' }} className="scrollable-column">
                    <Link to={`/admin/deals/${row?.deal_id}/edit`} className="d-block fw-semibold ff-primary">
                        {row?.name}
                    </Link>
                </div>
            ),
            sortable: false,
        },
        {
            name: 'Service',
            minWidth: '250px',
            maxWidth: '250px',
            cell: (row) => (
                <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100%' }} className="scrollable-column">
                    {row?.product_name}
                </div>
            ),
            sortable: false,
        },
        {
            name: 'Amount',
            maxWidth: '100px',
            minWidth: '100px',
            cell: (row) => (
                <div className="d-block fw-semibold ff-primary text-primary cursor-pointer" onClick={() => openPaymentForm(row?.id)}>{row.paid_amount}</div>
            ),
            sortable: false,
        },
        {
            name: 'Bank',
            maxWidth: '250px',
            minWidth: '250px',
            cell: (row) => (
                <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100%' }} className="scrollable-column">
                    {row?.transaction_type === 'cash' ? 'Cash' : (row?.bank?.name || '-')}
                </div>
            ),
            sortable: false,
        },
        {
            name: 'Transaction Id',
            maxWidth: '250px',
            minWidth: '250px',
            cell: (row) => (
                <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100%' }} className="scrollable-column">
                    {row?.transaction_type === 'cash' ? 'Cash' : row?.transaction_id ? (row?.transaction_id+(row?.transaction_split > 1 ? ' - '+row?.transaction_split : '' ) || '-') : '-'}
                </div>
            ),
            sortable: false,
        },
        {
            id: 'payments.paid_at',
            name: 'Payment Date',
            maxWidth: '220px',
            minWidth: '220px',
            cell: (row) => (
                <div>{formatDate(row?.paid_at, 'datetime')}</div>
            ),
            sortable: true,
        },
        {
            id: 'payments.status',
            name: 'Status',
            maxWidth: '140px',
            minWidth: '60px',
            cell: (row) => (
                (row?.is_loading) ? <div className="spinner-border spinner-18  text-secondary" role="status">
                    <span className="sr-only">Loading...</span>
                </div> : (row?.status === 1) ? 
                    <div onClick={async() => await handleStatusChange(row?.id, 0, activeCondition)} className="badge bg-success font-size-12 cursor-pointer">{row.status_label}</div> : 
                    <div onClick={async() => await handleStatusChange(row?.id, 1, activeCondition)} className="badge bg-danger font-size-12 cursor-pointer">{row.status_label}</div>
            ),
            sortable: true,
        },
        {
            name: 'Staff Name',
            minWidth: '200px',
            maxWidth: '200px',
            cell: (row) => (
                <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100%' }} className="scrollable-column">
                    {row?.owner_name}
                </div>
            ),
            sortable: false,
        },
        {
            name: 'Attachment',
            minWidth: '200px',
            maxWidth: '200px',
            cell: (row) => (
                <div className="p-1" data-bs-toggle="modal" data-bs-target=".bs-payment-modal-lg" onClick={() => onPaymentAttachmentClick(row.id)}>
                    <p className={`mb-0 cursor-pointer ${(row?.media && row?.media.length > 0) ? 'text-primary' : 'text-secondary'}`}>{(row?.media && row?.media.length > 0) ? <><i className="uil-image-check me-2"></i>View Attachment</> : <><i className="uil-upload me-2"></i>Add Attachment</>}</p>
                </div>
            ),
            sortable: false,
        },
        {
            name: 'Client Name',
            minWidth: '250px',
            maxWidth: '250px',
            cell: (row) => (
                <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100%' }} className="scrollable-column">
                    {row?.client_name || '-'}
                </div>
            ),
            sortable: false,
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

            }
        }
    };

    return (
        <div className="table-container mb-4">
            <div className="modal fade bs-payment-modal-lg" tabIndex="-1" aria-labelledby="mySmallModalLabel" aria-hidden="true" style={{ display: 'none' }}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content bg-white">
                        <div className="modal-header border-0">
                            <h5 className="modal-title">
                                Payment Receipts
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-6">
                                    <div className="row">
                                        {
                                            (saveLoading) ? <div className="d-flex align-items-center justify-content-center">
                                                <div className="spinner-border text-primary m-1" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div> : 
                                            (popupMedia?.media.length > 0) ? popupMedia?.media.map((media, index) => {
                                                return (
                                                    <div key={index} className="col-4">
                                                        <div className="border border-1 mb-2">
                                                            <a href={media?.file_url} target="_blank" rel="noopener noreferrer">
                                                                <img src={media?.file_url} className="img-fluid" alt={`media-${index}`} />
                                                            </a>
                                                        </div>
                                                    </div>
                                                )
                                            }) : <div className="col-12">
                                                <div className="text-center">No payment receipt attached!</div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="text-center">
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="attachment">Add Attachment</label>
                                            <input 
                                                type="file"
                                                id="attachment"
                                                name="attachment"
                                                ref={fileInputRef}
                                                onChange={(event) => handleFileChange(event, popupMedia, activeCondition)}
                                                className="form-control"
                                            />
                                            {errors['attachment'] && (
                                                <div className="d-block invalid-feedback">
                                                    {errors['attachment'].join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DataTable
                customStyles={customStyles}
                title=""
                columns={columns}
                data={payment?.list?.data}
                progressPending={payment?.listLoading}
                pagination
                paginationServer
                paginationTotalRows={payment?.list?.total}
                onChangeRowsPerPage={(perPage, page) => handlePerRowsChange(perPage, page, activeCondition)}
                onChangePage={(page) => handlePageChange(page, activeCondition)}
                selectableRowsVisibleOnly={true}
                selectableRows
                selectableRowsHighlight
                onSelectedRowsChange={async(selectedRows) => await handleSelectedRowsChange(selectedRows)}
                clearSelectedRows={bulkIds.length === 0}
                onSort={async(column, sortDirection) => await handleSort(column, sortDirection, activeCondition)}
                paginationPerPage={payment?.list?.per_page}

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
    settingsLoading: state.payment.settingsLoading,
    saveLoading: state.payment?.saveLoading,
    activeCondition: state.payment.activeCondition,
    payment: state.payment,
    popupMedia: state.payment?.popupMedia,
    bulkIds: state.payment?.bulkIds,
});

const mapDispatchToProps = {
    fetchPaymentList,
    updatePaymentSortOrder,
    savePaymentAttachment,
    setActivePaymentMedia,
    changePaymentStatus,
    setBulkPaymentIds,
    addPayment
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PaymentTable);