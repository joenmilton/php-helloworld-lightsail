
import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { changeDealStatus } from '../../../../../../redux';
import { Dropdown } from 'bootstrap';
import { useHasPermission } from '../../../../../../utils/permissions';

function Result({ 
    permissions, actionLoading, deal,
    changeDealStatus, 
}) {
    const { dealId }        = useParams();
    const  dropdownMenuRef  = useRef(null);
    const [lostReason, setLostReason] = useState('');

    const onStatusUpdate = async (status, dealId, contactId) => {
        if(status == 2 && !contactId) {
            const confirm = window.confirm('Are you sure you want to own this deal without a client record?');
            if(!confirm) {
                return;
            }
        }

        await changeDealStatus({status:status, deal_id: dealId, lost_reason:lostReason})

        if (dropdownMenuRef.current) {
            dropdownMenuRef.current.classList.remove('show');
        }
    }

    return (
        <div className="d-flex align-items-center justify-content-center">
            {
                (deal?.status === '2') ? 
                    <>
                        <div className="custom-won-ribbon me-4">WON</div>
                        {
                            (useHasPermission(['reopen deal'], permissions)) ? <div onClick={() => onStatusUpdate(1, dealId, deal?.contact_id)} className="btn btn-white align-middle py-1 me-2" style={{ lineHeight: '25px' }} >
                                Reopen
                            </div> : null
                        }
                    </> 
                    : (deal?.status === '3') ? 
                    <>
                        <span className="badge badge-outline-danger px-2 me-2 fs-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            <span className="align-middle ms-2">Lost</span>
                        </span>
                        {
                            (useHasPermission(['reopen deal'], permissions)) ? <div onClick={() => onStatusUpdate(1, dealId, deal?.contact_id)} className="btn btn-white py-1 me-2" style={{ lineHeight: '25px' }} >
                                Reopen
                            </div> : null
                        }
                    </> :
                    <>
                        <div onClick={() => onStatusUpdate(2, dealId, deal?.contact_id)} className="btn btn-success px-4 py-1 me-2" style={{ lineHeight: '25px' }} >
                            Won
                        </div>
                        <div className="dropdown">
                            <div className="btn btn-danger px-4 py-1" style={{ lineHeight: '25px' }} data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                Lost
                            </div>
                            <div className="dropdown-menu dropdown-menu-lg-end p-0" ref={dropdownMenuRef}>
                                <div className="card mb-0" style={{width: '22rem'}}>
                                    <div className="card-header justify-content-between d-flex align-items-center">
                                        <h4 className="card-title">Mark as lost</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="lost_reason">
                                                Lost Reason
                                            </label>
                                            <textarea 
                                                id="lost_reason"
                                                type="text" 
                                                className="form-control" 
                                                value={lostReason}
                                                onChange={(e) => setLostReason(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <div className="mb-0">
                                            <button data-bs-auto-close="inside" onClick={() => onStatusUpdate(3, dealId, deal?.contact_id)} className="btn btn-danger w-100">Mark as lost</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </div>
    )
}
const mapStateToProps = (state) => ({
    permissions: state.common?.settings?.permissions,
    actionLoading: state.deal.actionLoading,
    deal: state.deal.detail,
});

const mapDispatchToProps = {
    changeDealStatus
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Result);
