import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
    fetchDealPaymentList,
    setActivePaymentMedia
} from '../../../../../../../../redux';
import { formatDate } from '../../../../../../../../utils';
import { useHasPermission } from '../../../../../../../../utils/permissions';

const defaultFilter = {
    id: '',
    name: '',
    identifier: '',
    user_id: '',
    is_shared: false,
    is_readonly: false,
    rules: {
        condition: "and",
        children: []
    } 
}

const ServiceSplit = ({ 
    permissions, initialized, payments,
    fetchDealPaymentList, setActivePaymentMedia
}) => {
    const { dealId } = useParams();

    useEffect(() => {
        const initialize = async () => {
            await fetchDealPaymentList({
                current_page: 1,
                per_page: 10000,
                dealId: dealId
            }, 'service_split');
        };

        initialize();
    }, [dealId, fetchDealPaymentList]);

    const onPaymentAttachmentClickA = async (productId, paymentId) => {
        setActivePaymentMedia(paymentId, 'service_split', productId)
    }

    const onPaymentAttachmentClickB = async (paymentId) => {
        setActivePaymentMedia(paymentId, 'service_split')
    }

    return (
        <>
        {
            (!initialized) ? <div className="d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary m-1" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div> : 
            <>
                <div className="accordion accordion-flush" id="accordionPaymentFlush">
                {
                    (payments?.included.length > 0) ? payments?.included.map((inc, index) => {
                        return (
                            <div key={index} className="accordion-item">
                                <h2 className="accordion-header" id={`flush-heading${index}`}>
                                    <button className="accordion-button font-size-15 text-truncate logo-txt sub-text collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapse${index}`} aria-expanded="false" aria-controls={`flush-collapse${index}`}>
                                        <div className="card-header d-flex justify-content-between align-items-center border-bottom-0 w-100">
                                            <div>{String(index + 1).padStart(2, '#')} - {inc?.name}</div>
                                            <div className="me-2">{inc?.amount}</div>
                                        </div>
                                    </button>
                                </h2>
                                <div id={`flush-collapse${index}`} className="accordion-collapse collapse" aria-labelledby={`flush-heading${index}`} data-bs-parent="#accordionPaymentFlush">
                                    <div className="accordion-body">
                                        
                                        <div className="d-block">
                                            <div className="row">
                                                <div className="col-xl-4 mb-4">
                                                    <div className="card bg-light mb-0">
                                                        <div className="card-body">
                                                            <div className="py-2">
                                                                <h5>Total Amount:</h5>
                                                                <h2 className="pt-1 mb-1">
                                                                    <i className="fas fa-rupee-sign me-1"></i>
                                                                    {(inc?.amount*1).toFixed(2)}
                                                                </h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-4 mb-4">
                                                    <div className="card bg-light mb-0">
                                                        <div className="card-body">
                                                            <div className="py-2">
                                                                <h5>Total Paid:</h5>
                                                                <h2 className="pt-1 mb-1">
                                                                    <i className="fas fa-rupee-sign me-1"></i>
                                                                    {(inc?.total_paid*1).toFixed(2)}
                                                                </h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-4 mb-4">
                                                    <div className="card bg-light mb-0">
                                                        <div className="card-body">
                                                            <div className="py-2">
                                                                <h5>Balance:</h5>
                                                                <h2 className="pt-1 mb-1">
                                                                    <i className="fas fa-rupee-sign me-1"></i>
                                                                    {(inc?.balance_to_pay*1).toFixed(2)}
                                                                </h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="table-responsive">
                                            <table className="table align-middle table-nowrap table-centered mb-0">
                                                <thead>
                                                    <tr>
                                                        <th style={{width:'70px'}}>No.</th>
                                                        <th>Date</th>
                                                        <th>Description</th>
                                                        <th>Amount</th>
                                                        <th>Status</th>
                                                        <th>Attachment</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    (inc?.payments && inc?.payments.length > 0) ? inc?.payments.map((pay, pIndex) => {
                                                        return (
                                                            <tr key={pIndex}>
                                                                <th scope="row">{String(pIndex + 1).padStart(2, '#')}</th>
                                                                <td>
                                                                    <div>
                                                                        <h5 className="text-truncate font-size-14 mb-1">{formatDate(pay?.paid_at, 'datetime')}</h5>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div>{pay?.description}</div>
                                                                </td>
                                                                <td><i className="fas fa-rupee-sign me-1"></i>{pay?.paid_amount}</td>
                                                                <td>
                                                                    {
                                                                        (pay?.is_loading) ? <div className="spinner-border spinner-18  text-secondary" role="status">
                                                                            <span className="sr-only">Loading...</span>
                                                                        </div> : (pay?.status === 1) ? 
                                                                            <div className="badge bg-success font-size-12 cursor-pointer">Verified</div> : 
                                                                            <div className="badge bg-danger font-size-12 cursor-pointer">Not Verified</div>
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <div className="p-1" data-bs-toggle="modal" data-bs-target=".bs-payment-modal-lg" onClick={() => onPaymentAttachmentClickA(inc?.product_id, pay.id)}>
                                                                        <p className="mb-0 cursor-pointer text-primary">{(pay?.media && pay?.media.length > 0) ? <><i className="uil-image-check me-2"></i>View Attachment</> : <><i className="uil-upload me-2"></i>Add Attachment</>}</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }) : <tr>
                                                        <td colSpan={5}>
                                                            <div className="d-flex align-items-center justify-content-center">
                                                                No payments received!
                                                            </div>
                                                        </td>
                                                    </tr>
                                                }
                                                </tbody>
                                            </table>
                                        </div>



                                    </div>
                                </div>
                            </div>
                        )
                    }) : null
                }
                </div>
                {
                    (payments?.excluded.length > 0) ? <div className="mt-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="font-size-15 text-truncate logo-txt sub-text mb-4">Other Payments</div>
                                <div className="table-responsive">
                                    <table className="table align-middle table-nowrap table-centered mb-0">
                                        <thead>
                                            <tr>
                                                <th style={{width:'70px'}}>No.</th>
                                                <th>Date</th>
                                                <th>Description</th>
                                                <th>Amount</th>
                                                <th>Service</th>
                                                <th>Status</th>
                                                <th>Attachment</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                payments?.excluded.map((exc, exIndex) => {
                                                    return (
                                                        <tr key={exIndex}>
                                                            <th scope="row">{String(exIndex + 1).padStart(2, '#')}</th>
                                                            <td>
                                                                <div>
                                                                    <h5 className="text-truncate font-size-14 mb-1">{formatDate(exc?.paid_at, 'datetime')}</h5>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div>{exc?.description}</div>
                                                            </td>
                                                            <td><i className="fas fa-rupee-sign me-1"></i>{exc?.paid_amount}</td>
                                                            <td>{exc?.name}</td>
                                                            <td>
                                                                {
                                                                    (exc?.is_loading) ? <div className="spinner-border spinner-18  text-secondary" role="status">
                                                                        <span className="sr-only">Loading...</span>
                                                                    </div> : (exc?.status === 1) ? 
                                                                        <div className="badge bg-success font-size-12 cursor-pointer">Verified</div> : 
                                                                        <div className="badge bg-danger font-size-12 cursor-pointer">Not Verified</div>
                                                                }
                                                            </td>
                                                            <td>
                                                                <div className="p-1" data-bs-toggle="modal" data-bs-target=".bs-payment-modal-lg" onClick={() => onPaymentAttachmentClickB(exc.id)}>
                                                                    <p className="mb-0 cursor-pointer text-primary">
                                                                        {(exc?.media && exc?.media.length > 0) ? <><i className="uil-image-check me-2"></i>View Attachment</> : <><i className="uil-upload me-2"></i>Add Attachment</>}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div> : null
                }
            </>
        }
        </>
    )
}
const mapStateToProps = (state) => ({
    permissions: state.common?.settings?.permissions,
    initialized: state.payment?.initialized,
    payments: state.payment?.listData
});

const mapDispatchToProps = {
    fetchDealPaymentList,
    setActivePaymentMedia
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceSplit);