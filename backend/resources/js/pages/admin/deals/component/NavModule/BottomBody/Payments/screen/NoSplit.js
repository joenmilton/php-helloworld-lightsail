import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
    fetchDealPaymentList
} from '../../../../../../../../redux';
import { formatDate } from '../../../../../../../../utils';

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

const NoSplit = ({ 
    initialized, deal, payments,
    fetchDealPaymentList
}) => {
    const { dealId } = useParams();

    useEffect(() => {
        const initialize = async () => {
            await fetchDealPaymentList({
                current_page: 1,
                per_page: 10000,
                dealId: dealId
            }, 'no_split');
        };

        initialize();
    }, [dealId, fetchDealPaymentList]);

    return (
        <>
        {
            (!initialized) ? <div className="d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary m-1" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div> : 
            <>
                <div className="card">
                    <div className="card-body">

                        <div className="d-block">
                            <div className="row">
                                <div className="col-xl-4 mb-4">
                                    <div className="card bg-light mb-0">
                                        <div className="card-body">
                                            <div className="py-2">
                                                <h5>Total Amount:</h5>
                                                <h2 className="pt-1 mb-1">
                                                    <i className="fas fa-rupee-sign me-1"></i>
                                                    {deal?.amount}
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
                                                    {deal?.paid_amount}
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
                                                    {(deal?.amount*1 - deal?.paid_amount *1).toFixed(2)}
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
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Attachment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    (payments && payments.length > 0) ? payments.map((payment, index) => {
                                        return (
                                            <tr key={index}>
                                                <th scope="row">{String(index + 1).padStart(2, '#')}</th>
                                                <td>
                                                    <div>
                                                        <h5 className="text-truncate font-size-14 mb-1">{formatDate(payment?.paid_at, 'datetime')}</h5>
                                                    </div>
                                                </td>
                                                <td><i className="fas fa-rupee-sign me-1"></i>{payment?.paid_amount}</td>
                                                <td>
                                                    {
                                                        (payment?.is_loading) ? <div className="spinner-border spinner-18  text-secondary" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div> : (payment?.status === 1) ? 
                                                            <div className="badge bg-success font-size-12 cursor-pointer">Verified</div> : 
                                                            <div className="badge bg-danger font-size-12 cursor-pointer">Not Verified</div>
                                                    }
                                                </td>
                                                <td></td>
                                            </tr>
                                        )
                                    }) : <tr>
                                        <td colSpan={5}>
                                            <div className="d-flex align-items-center justify-content-center">
                                                No Payments
                                            </div>
                                        </td>
                                    </tr>
                                }
                                </tbody>
                            </table>
                        </div>
                        
                    </div>
                </div>
            </>
        }
        </>
    )
}
const mapStateToProps = (state) => ({
    initialized: state.payment?.initialized,
    deal: state.deal.detail,
    payments: state.payment?.list?.data
});

const mapDispatchToProps = {
    fetchDealPaymentList
};

export default connect(mapStateToProps, mapDispatchToProps)(NoSplit);